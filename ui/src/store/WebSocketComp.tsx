import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IDefaultUser } from "../interfaces/IUser";
import { useAppDispatch } from "./hooks";
import { RootState } from "./store";
import { createUser, updateUserName } from "./userSlice";
import { setInitialRoomsList, updateRooms } from "./RoomsListSlice";
import { IRooms } from "../interfaces/IRoom";
import { ISnackbar } from "../interfaces/ISnackbar";
import CustomizedSnackbar from "../components/static-components/SnackBar";

import {
  updateAsAdmin,
  updateCreateBoard,
  updateCreateRoom,
  updateGameData,
  updateAsPlayer,
  editRoom,
  setInitialRoomBoard,
} from "./RoomGameSlice";
import {
  IDefaultRoomAndBoard,
  ICreateBoard,
  ICreateRoom,
  IGameData,
} from "../interfaces/IRoomAndBoard";
import {
  changeWaitingRoom,
  changeAdmin,
  changeMultiGame,
  changeSingleGame,
  changeBoardCorrect,
} from "./StateMachineSlice";
import { setWebSocket } from "./WebSocketSlice";
import IWebSocket from "../interfaces/IWebSocket";
import { URL_API } from "../environments";

const WebSocketComp = () => {
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const dispatch = useAppDispatch();
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);

  // websocket
  const { webSocket } = useSelector((state: RootState) => state.webSocket);

  const [snackbar, setSnackbar] = useState<ISnackbar>({
    open: false,
    message: "",
    severity: "success",
  });

  if (webSocket !== undefined) {
    webSocket.onmessage = (e) => {
      if (e?.data !== null) {
        let json = null;
        try {
          json = JSON.parse(e.data);
        } catch {
          consoleLogWebSocket(
            "There is unidentified error has occurred - contact the administration"
          );
        }
        console.log(json);

        switch (json?.response) {
          case "CreateUser": // dodanie uzytkownika
            consoleLogWebSocket("CreateUser");
            let newUser: IDefaultUser = {
              user: {
                uuid: json.Payload.uuid,
                name: json.Payload.name,
              },
            };
            dispatch(createUser(newUser));
            break;
          case "CreateBoard":
            consoleLogWebSocket("CreateBoard");
            let createBoard: ICreateBoard = {
              array: json.Payload.array,
              boardID: parseInt(json.Payload.boardID),
              settings: {
                difficulty: json.Payload.settings.difficulty,
                size: json.Payload.settings.size,
              },
            };
            dispatch(updateCreateBoard(createBoard));
            dispatch(setInitialRoomsList());
            break;
          case "CreateRoom":
            consoleLogWebSocket("CreateRoom");
            if (json.error !== "") {
              setSnackbar({
                message: `${json.error}`,
                open: true,
                severity: "error",
              });
              break;
            }
            let createRoom: ICreateRoom = {
              admin: json.Payload.admin,
              isPrivate: json.Payload.isPrivate,
              maxPlayers: json.Payload.maxPlayers,
              name: json.Payload.name,
              password: json.Payload.password,
              timeLimit: json.Payload.timeLimit,
              boardID: json.Payload.boardID,
            };
            dispatch(updateCreateRoom(createRoom));
            dispatch(setInitialRoomsList());
            break;
          case "RoomsList":
            consoleLogWebSocket("RoomsList");
            let newRooms: IRooms = {
              rooms: json.Payload,
            };
            dispatch(updateRooms(newRooms));
            break;
          case "UpdateRoom":
            consoleLogWebSocket("UpdateRoom");
            if (user.uuid === json.Payload.admin) {
              consoleLogWebSocket("ADMIN");
              let updateAdminRoom: IDefaultRoomAndBoard = {
                roomAndBoard: {
                  name: json.Payload.name,
                  boardID: json.Payload.boardID,
                  maxPlayers: json.Payload.maxPlayers,
                  isPrivate: json.Payload.isPrivate,
                  password: "",
                  timeLimit: -1,
                  array: [],
                  gameOn: json.Payload.gameOn,
                  admin: json.Payload.admin,
                  settings: {
                    difficulty: json.Payload.difficulty,
                    size: json.Payload.boardSize,
                  },
                  members: json.Payload.Players,
                  gameData: [],
                  bridges: [],
                },
              };
              dispatch(updateAsAdmin(updateAdminRoom));
            } else {
              consoleLogWebSocket("GRACZ - NIE ADMIN");
              let updateUserRoom: IDefaultRoomAndBoard = {
                roomAndBoard: {
                  name: json.Payload.name,
                  boardID: json.Payload.boardID,
                  maxPlayers: json.Payload.maxPlayers,
                  isPrivate: json.Payload.isPrivate,
                  password: "",
                  timeLimit: -1,
                  array: [],
                  gameOn: json.Payload.gameOn,
                  admin: json.Payload.admin,
                  settings: {
                    difficulty: json.Payload.difficulty,
                    size: json.Payload.boardSize,
                  },
                  members: json.Payload.Players,
                  gameData: [],
                  bridges: [],
                },
              };
              if (roomAndBoard.maxPlayers >= 1) {
                // dispatch(changeMultiGame(json.Payload.gameOn));
              }
              dispatch(updateAsPlayer(updateUserRoom));
            }
            dispatch(setInitialRoomsList());
            break;
          case "UpdateGameData":
            consoleLogWebSocket("UpdateGameData");
            // if board is correct for current user set true
            let currentUserData: IGameData = json.Payload.find(
              (elem: IGameData) => elem.uuid === user.uuid
            );
            if (currentUserData !== null) {
              dispatch(
                changeBoardCorrect(currentUserData.UserGameState.correct)
              );
              if (roomAndBoard.maxPlayers === 1) {
                dispatch(
                  changeSingleGame(currentUserData.UserGameState.inGame)
                );
              } else {
                dispatch(changeMultiGame(currentUserData.UserGameState.inGame));
              }
            }
            dispatch(updateGameData(json.Payload));
            break;
          case "ChangeName":
            consoleLogWebSocket("ChangeName");
            dispatch(updateUserName(json.Payload.name));
            break;
          case "EditRoom":
            let updateAdminRoom: IDefaultRoomAndBoard = {
              roomAndBoard: {
                name: json.Payload.name,
                boardID: json.Payload.boardID,
                maxPlayers: json.Payload.maxPlayers,
                isPrivate: json.Payload.isPrivate,
                password: json.Payload.password,
                timeLimit: json.Payload.timeLimit,
                array: [],
                gameOn: false,
                admin: json.Payload.admin,
                settings: {
                  difficulty: json.Payload.difficulty,
                  size: json.Payload.boardSize,
                },
                members: json.Payload.Players,
                gameData: [],
                bridges: [],
              },
            };
            dispatch(editRoom(updateAdminRoom));
            consoleLogWebSocket("EditRoom");
            break;
          // STATE MACHINE
          case "InWaitingRoom":
            consoleLogWebSocket("InWaitingRoom");
            dispatch(changeWaitingRoom(true));
            break;
          case "ExitWaitingRoom":
            consoleLogWebSocket("ExitWaitingRoom");
            dispatch(changeWaitingRoom(false));
            break;
          case "IsAdmin":
            consoleLogWebSocket("IsAdmin");
            dispatch(changeAdmin(true));
            break;
          case "ExitAdmin":
            consoleLogWebSocket("ExitAdmin");
            dispatch(changeAdmin(false));
            dispatch(setInitialRoomBoard());
            break;
          case "InSingleGame":
            consoleLogWebSocket("InSingleGame");
            dispatch(changeSingleGame(true));
            break;
          case "ExitSingleGame":
            consoleLogWebSocket("ExitSingleGame");
            dispatch(changeSingleGame(false));
            break;
          case "InMultiGame":
            consoleLogWebSocket("InMultiGame");
            dispatch(changeMultiGame(true));
            break;
          case "ExitMultiGame":
            consoleLogWebSocket("ExitMultiGame");
            dispatch(changeMultiGame(false));
            break;
          default:
            consoleLogWebSocket("Incorrect");
            console.log(e.data);
            if (json?.error !== "") {
              setSnackbar({
                message: `${json.error}`,
                open: true,
                severity: "error",
              });
            }
            break;
        }
      }
    };
  }

  if (webSocket !== undefined) {
    webSocket.onclose = (e) => {
      consoleLogWebSocket("Disconnect");
      setTimeout(() => {
        let websocket: IWebSocket = {
          webSocket: new WebSocket(URL_API),
        };
        dispatch(setWebSocket(websocket));
      }, 1000);
      setSnackbar({
        message: "Connection lost",
        open: true,
        severity: "error",
      });
    };
  }

  const consoleLogWebSocket = (mess: string) => {
    console.log("WebSocket-> " + mess);
  };

  return (
    <>
      {snackbar.open ? (
        <CustomizedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      ) : null}
    </>
  );
};

export default WebSocketComp;
