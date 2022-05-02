import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DefaultUser } from "../components/User";
import { useAppDispatch } from "./hooks";
import { RootState } from "./store";
import { createUser } from "./userSlice";
import { setInitialRoomsList, updateRooms } from "./RoomsListSlice";
import { Room, Rooms } from "../components/Room";
import { setInitialRoomBoard, updateAsAdmin, updateRoomGame } from "./RoomGameSlice";
import { DefaultRoomAndBoard } from "../components/RoomAndBoard";

const Websocket = () => {
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { rooms } = useSelector((state: RootState) => state.RoomsList);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const dispatch = useAppDispatch();
  const socket = new WebSocket("ws://localhost:8080/ws/");
  const [roomName, setRoomName] = useState("");

  const handleSetRoomId = (event: any) => {
    setRoomName(event.target.value);
    console.log(roomName);
  };

  socket.onopen = () => {
    consoleLogWebSocket("Connect");
  };

  useEffect(() => {
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
        if (json?.response === "CreateUser") { // Dodanie playera
          consoleLogWebSocket("Adding new User");
          let newUser: DefaultUser = {
            user: {
              uuid: json.Payload.uuid,
              name: json.Payload.name,
            },
          };
          dispatch(createUser(newUser));
        } else if (e.data.toString().indexOf("CreateBoard") > -1) { // Create room
          consoleLogWebSocket("Create Room");
          var sanitized =
            "[" +
            e.data
              .replace(/[\r\n]/gm, "")
              .toString()
              .replace(/}{/g, "},{") +
            "]";
          var rows = JSON.parse(sanitized);
          let newRoomGame: DefaultRoomAndBoard = {
            roomAndBoard: {
              name: rows[1].Payload.name,
              maxPlayers: rows[1].Payload.maxPlayers,
              isPrivate: rows[1].Payload.isPrivate,
              password: rows[1].Payload.password,
              timeLimit: rows[1].Payload.timeLimit,
              array: rows[0].Payload.array,
              isAdmin: user.uuid,
              settings: {
                difficulty: rows[0].Payload.settings.difficulty,
                size: rows[0].Payload.settings.size,
              },
              members: [],
            },
          };
          dispatch(updateRoomGame(newRoomGame));
          // usun liste pokoi - lobby, bo juz ich nie sprawda i nie odswieza
         dispatch(setInitialRoomsList());
        } else if (json?.response === "RoomsList") { // lista pokoji w pokoju default 0
          consoleLogWebSocket("Refresh rooms");
          let newRooms: Rooms = {
            rooms: json.Payload,
          };
          dispatch(updateRooms(newRooms));
          //dispatch(setInitialRoomBoard());
        } else if (json?.response === "UpdateRoom") { // wejscie do pokoju lub aktualizacja nowych danych dla wszystkich
          consoleLogWebSocket("Update Room");
          
          // if admin
          if(user.uuid === json.Payload.name.replace("Pokoj-", "")){
            console.log("ADMIN");
            let updateAdminRoom: DefaultRoomAndBoard = {
              roomAndBoard: {
                name: json.Payload.name,
                maxPlayers: json.Payload.maxPlayers,
                isPrivate: json.Payload.isPrivate,
                password: "",
                timeLimit: -1,
                array: [],
                isAdmin: user.uuid,
                settings: {
                  difficulty: -1,
                  size: -1,
                },
                members: json.Payload.Players,
              },
            };
            dispatch(updateAsAdmin(updateAdminRoom));
          }else{
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
                isAdmin: -1,
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
        } else {
          consoleLogWebSocket("Incorrect");
          console.log(e.data);
        }
      }
    };
  }, []);

  socket.onclose = (e) => {
    consoleLogWebSocket("Disconnect");
  };

  const handleCreateRoom = () => {
    let nameOfRoom = "Pokoj-" + user.uuid;
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
    consoleLogWebSocket("Create Room");
  };

  const handleChangeRoom = () => {
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
  };

  const handleDisconnectRoom = () => {
    socket.send(
      JSON.stringify({
        action: "changeRoom",
        userUuid: user.uuid,
        data: {
          roomName: "lobby",
        },
      })
    );
    consoleLogWebSocket("Change Room");
  };

  const consoleLogWebSocket = (mess: string) => {
    console.log("WebSocket-> " + mess);
  };

  return (
    <>
      <div>{user.uuid}</div>
      <div>{user.name}</div>
      <br />
      {rooms != null && rooms.length > 0 ? rooms.map((room: Room, index: number) => (
        <div>
          {room.name} -- {room.numPlayers}
        </div>
      )) : <div>Nie ma pokoji</div>}
      <br />
      <div>
        POKOJ:
        {roomAndBoard.name} - { }
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
      <button type="submit" onClick={handleDisconnectRoom}>Disconnect Room</button>
    </>
  );
};

export default Websocket;
