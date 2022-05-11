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
  updateRoomGame,
} from "./RoomGameSlice";
import {
  IDefaultRoomAndBoard,
  ICreateBoard,
  ICreateRoom,
} from "../interfaces/IRoomAndBoard";
import { enterAdmin, enterRoom } from "./StateMachineSlice";

const WebSocketComp = () => {
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { rooms } = useSelector((state: RootState) => state.RoomsList);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);

  // websocket
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const dispatch = useAppDispatch();

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

        if (json?.response === "CreateUser") {
          // Dodanie playera
          consoleLogWebSocket("Adding new User");
          let newUser: IDefaultUser = {
            user: {
              uuid: json.Payload.uuid,
              name: json.Payload.name,
            },
          };
          dispatch(createUser(newUser));
        } else if (json?.response === "CreateBoard") {
          // Create board
          consoleLogWebSocket("Create Board");
          // dispatch(setInitialRoomBoard());

          let createBoard: ICreateBoard = {
            array: json.Payload.array,
            settings: {
              difficulty: json.Payload.settings.difficulty,
              size: json.Payload.settings.size,
            },
          };

          dispatch(updateCreateBoard(createBoard));

          // usun liste pokoi - lobby, bo juz ich nie sprawda i nie odswieza
          dispatch(setInitialRoomsList());
        } else if (json?.response === "CreateRoom") {
          // Create room
          consoleLogWebSocket("Create Room");

          let createRoom: ICreateRoom = {
            admin: json.Payload.admin,
            isPrivate: json.Payload.isPrivate,
            maxPlayers: json.Payload.maxPlayers,
            name: json.Payload.name,
            password: json.Payload.password,
            timeLimit: json.Payload.timeLimit,
          };

          dispatch(updateCreateRoom(createRoom));

          // usun liste pokoi - lobby, bo juz ich nie sprawda i nie odswieza
          dispatch(setInitialRoomsList());
        } else if (json?.response === "RoomsList") {
          // lista pokoji w pokoju default 0
          consoleLogWebSocket("Refresh rooms");
          let newRooms: IRooms = {
            rooms: json.Payload,
          };
          dispatch(updateRooms(newRooms));
        } else if (json?.response === "UpdateRoom") {
          // wejscie do pokoju lub aktualizacja nowych danych dla wszystkich
          consoleLogWebSocket("Update Room");

          // if admin
          if (user.uuid === json.Payload.admin) {
            console.log("ADMIN");
            let updateAdminRoom: IDefaultRoomAndBoard = {
              roomAndBoard: {
                name: json.Payload.name,
                maxPlayers: json.Payload.maxPlayers,
                isPrivate: json.Payload.isPrivate,
                password: "",
                timeLimit: -1,
                array: [],
                admin: user.name,
                settings: {
                  difficulty: json.Payload.difficulty,
                  size: json.Payload.boardSize,
                },
                members: json.Payload.Players,
              },
            };
            dispatch(updateAsAdmin(updateAdminRoom));
            dispatch(enterRoom());
            dispatch(enterAdmin());
          } else {
            // Nie admin
            console.log("NIE - ADMIN");
            let updateUserRoom: IDefaultRoomAndBoard = {
              roomAndBoard: {
                name: json.Payload.name,
                maxPlayers: json.Payload.maxPlayers,
                isPrivate: json.Payload.isPrivate,
                password: "",
                timeLimit: -1,
                array: [],
                admin: "",
                settings: {
                  difficulty: json.Payload.difficulty,
                  size: json.Payload.boardSize,
                },
                members: json.Payload.Players,
              },
            };
            dispatch(updateRoomGame(updateUserRoom));
            dispatch(enterRoom());
          }
          dispatch(setInitialRoomsList());
        } else if (json?.response === "ChangeName") {
          // Zmiana nazwy pokoju
          consoleLogWebSocket("Change User Name");
          dispatch(updateUserName(json.Payload.name));
        } else {
          consoleLogWebSocket("Incorrect");
          console.log(e.data);
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

  return (
    <>
    </>
  );
};

export default WebSocketComp;
