import React from "react";
import { useSelector } from "react-redux";
import { IDefaultUser } from "../interfaces/IUser";
import { useAppDispatch } from "./hooks";
import { RootState } from "./store";
import { createUser, updateUserName } from "./userSlice";
import { setInitialRoomsList, updateRooms } from "./RoomsListSlice";
import { IRooms } from "../interfaces/IRoom";
import {
  updateAsAdmin,
  updateCreateBoard,
  updateCreateRoom,
  updateGameData,
  updateRoomGame,
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

const WebSocketComp = () => {
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const dispatch = useAppDispatch();

  // websocket
  const { webSocket } = useSelector((state: RootState) => state.webSocket);

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
            let createRoom: ICreateRoom = {
              admin: json.Payload.admin,
              isPrivate: json.Payload.isPrivate,
              maxPlayers: json.Payload.maxPlayers,
              name: json.Payload.name,
              password: json.Payload.password,
              timeLimit: json.Payload.timeLimit,
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
                },
              };
              dispatch(updateAsAdmin(updateAdminRoom));
            } else {
              consoleLogWebSocket("GRACZ - NIE ADMIN");
              let updateUserRoom: IDefaultRoomAndBoard = {
                roomAndBoard: {
                  name: json.Payload.name,
                  maxPlayers: json.Payload.maxPlayers,
                  isPrivate: json.Payload.isPrivate,
                  password: "",
                  timeLimit: -1,
                  array: [],
                  gameOn: false,
                  admin: "",
                  settings: {
                    difficulty: json.Payload.difficulty,
                    size: json.Payload.boardSize,
                  },
                  members: json.Payload.Players,
                  gameData: [],
                },
              };
              dispatch(updateRoomGame(updateUserRoom));
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
              dispatch(changeMultiGame(currentUserData.UserGameState.inGame));
            }
            dispatch(updateGameData(json.Payload));
            break;
          case "ChangeName":
            consoleLogWebSocket("ChangeName");
            dispatch(updateUserName(json.Payload.name));
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
            break;
        }
      }
    };
  }

  if (webSocket !== undefined) {
    webSocket.onclose = (e) => {
      consoleLogWebSocket("Disconnect");
    };
  }

  const handleChangeUserName = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "changeName",
          userUuid: user.uuid,
          data: {
            roomName: "YourNewName",
          },
        })
      );
    }
  };

  const consoleLogWebSocket = (mess: string) => {
    console.log("WebSocket-> " + mess);
  };

  return <></>;
};

export default WebSocketComp;
