import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DefaultUser } from "../components/User";
import { useAppDispatch } from "./hooks";
import { RootState } from "./store";
import { createUser } from "./userSlice";
import { setInitialRoomsList, updateRooms } from "./RoomsListSlice";
import { Room, Rooms } from "../components/Room";
import {
  setInitialRoomBoard,
  updateAsAdmin,
  updateCreateBoard,
  updateCreateRoom,
  updateRoomGame,
} from "./RoomGameSlice";
import {
  DefaultRoomAndBoard,
  CreateBoard,
  CreateRoom,
} from "../components/RoomAndBoard";

const Websocket = () => {
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { rooms } = useSelector((state: RootState) => state.RoomsList);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const dispatch = useAppDispatch();
  const [roomName, setRoomName] = useState("");
  const [socket, setSocketClient] = useState<WebSocket>();

  const handleSetRoomId = (event: any) => {
    setRoomName(event.target.value);
    console.log(roomName);
  };

  useEffect(() => {
    if (user.uuid === -1) {
      const socket = new WebSocket("ws://localhost:8080/ws/");
      socket.onopen = () => {
        consoleLogWebSocket("New Socket Type - Connect");
      };
      setSocketClient(socket);
      console.log(socket !== undefined);
    }
  }, []);

  if (socket !== undefined) {
    socket.onmessage = (e) => {
      if (e?.data !== null) {
        let json = null;
        try {
          json = JSON.parse(e.data);
        } catch {}
        console.log("JSON: ");
        console.log(json);
        // switch (json?.response) {
        //   case "CreateUser":
        //     consoleLogWebSocket("Adding new User");
        //     let newUser: DefaultUser = {
        //       user: {
        //         uuid: json.Payload.uuid,
        //         name: json.Payload.name,
        //       },
        //     };
        //     dispatch(createUser(newUser));
        //     break;
        //   case "s":
        //     break;
        //   case "s":
        //     break;
        //   case "s":
        //     break;
        //   default:
        //     consoleLogWebSocket("Incorrect");
        //     console.log(e.data);
        //     break;
        // }
        if (json?.response === "CreateUser") {
          // Dodanie playera
          consoleLogWebSocket("Adding new User");
          let newUser: DefaultUser = {
            user: {
              uuid: json.Payload.uuid,
              name: json.Payload.name,
            },
          };
          dispatch(createUser(newUser));
        } else if (json?.response === "CreateBoard") {
          // Create board
          consoleLogWebSocket("Create Board");
          dispatch(setInitialRoomBoard());

          let createBoard: CreateBoard = {
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

          let createRoom: CreateRoom = {
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
          let newRooms: Rooms = {
            rooms: json.Payload,
          };
          dispatch(updateRooms(newRooms));
          //dispatch(setInitialRoomBoard());
        } else if (json?.response === "UpdateRoom") {
          // wejscie do pokoju lub aktualizacja nowych danych dla wszystkich
          consoleLogWebSocket("Update Room");

          // if admin
          if (user.uuid === json.Payload.name.replace("Pokoj-", "")) {
            console.log("ADMIN");
            let updateAdminRoom: DefaultRoomAndBoard = {
              roomAndBoard: {
                name: json.Payload.name,
                maxPlayers: json.Payload.maxPlayers,
                isPrivate: json.Payload.isPrivate,
                password: "",
                timeLimit: -1,
                array: [],
                admin: user.name,
                settings: {
                  difficulty: -1,
                  size: -1,
                },
                members: json.Payload.Players,
              },
            };
            dispatch(updateAsAdmin(updateAdminRoom));
          } else {
            // Nie admin
            console.log("NIE - ADMIN");
            let updateUserRoom: DefaultRoomAndBoard = {
              roomAndBoard: {
                name: json.Payload.name,
                maxPlayers: json.Payload.maxPlayers,
                isPrivate: json.Payload.isPrivate,
                password: "",
                timeLimit: -1,
                array: [],
                admin: "",
                settings: {
                  difficulty: -1,
                  size: -1,
                },
                members: json.Payload.Players,
              },
            };
            dispatch(updateRoomGame(updateUserRoom));
          }
          dispatch(setInitialRoomsList());
        } else if (json?.response === "?") {
          // narazie puste do dopisania jak bedzie sie grało
        } else {
          consoleLogWebSocket("Incorrect");
          console.log(e.data);
        }
      }
    };
  }

  if (socket !== undefined) {
    socket.onclose = (e) => {
      consoleLogWebSocket("Disconnect");
    };
  }

  const handleCreateRoom = () => {
    let nameOfRoom = "Pokoj-" + user.uuid;
    if (socket !== undefined) {
      socket.send(
        JSON.stringify({
          action: "createRoom",
          userUuid: user.uuid,
          data: {
            name: nameOfRoom,
            password: "haslo",
            maxPlayers: 10,
            isPrivate: true,
            timeLimit: 60,
            difficulty: 1,
            boardSize: 10,
          },
        })
      );
    }
    consoleLogWebSocket("Create Room");
  };

  const handleChangeRoom = () => {
    if (socket !== undefined) {
      socket.send(
        JSON.stringify({
          action: "changeRoom",
          userUuid: user.uuid,
          data: {
            roomName: roomName,
          },
        })
      );
      consoleLogWebSocket("Change Room");
    }
  };

  const handleDisconnectRoom = () => {
    if (socket !== undefined) {
      socket.send(
        JSON.stringify({
          action: "changeRoom",
          userUuid: user.uuid,
          data: {
            roomName: "lobby",
          },
        })
      );
      dispatch(setInitialRoomBoard());
      consoleLogWebSocket("Change Room");
    }
  };

  const handleEditRoom = () => {
    if (socket !== undefined) {
      socket.send(
        JSON.stringify({
          action: "editRoom",
          userUuid: user.uuid,
          data: {
            name: "pokoj1",
            password: "haslo",
            maxPlayers: 10,
            isPrivate: true,
            timeLimit: 60,
            difficulty: 1,
            boardSize: 10,
          },
        })
      );
    }
  };

  const handleChangeNameUser = () => {
    if (socket !== undefined) {
      socket.send(
        JSON.stringify({
          action: "changeName",
          userUuid: user.uuid,
          data: {
            newName: "nowaNazwa",
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
      <div>{user.uuid}</div>
      <div>{user.name}</div>
      <br />
      {rooms != null && rooms.length > 0 ? (
        rooms.map((room: Room, index: number) => (
          <div>
            {room.name} -- {room.numPlayers}
          </div>
        ))
      ) : (
        <div>No Rooms</div>
      )}
      <br />
      <div>
        POKOJ:
        {roomAndBoard.name} - {}
        {roomAndBoard.members.length}
      </div>
      <button type="submit" onClick={handleCreateRoom}>
        Create Room
      </button>
      <br />
      <br />
      <input type="text" onChange={handleSetRoomId} />
      <button type="submit" onClick={handleChangeRoom}>
        Connect Room
      </button>
      <button type="submit" onClick={handleDisconnectRoom}>
        Disconnect Room
      </button>
      <button type="submit" onClick={handleChangeNameUser}>
        Change my Name
      </button>
    </>
  );
};

export default Websocket;
