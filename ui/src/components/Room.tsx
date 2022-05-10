import { IRoom } from "../interfaces/IRoom";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Grid, Typography } from "@mui/material";

import BoardDisplay from "./static-components/BoardSize";
import DifficultyDisplay from "./static-components/Difficulty";
import RoomStatusDisplay from "./static-components/RoomStatus";
import RoomPlatersDisplay from "./static-components/RoomPlayers";
import RoomNameDisplay from "./static-components/RoomName";
import CustomizedSnackbar from "./static-components/SnackBar";
import Modal from "./dynamic-components/Modal";
import { ISnackbar } from "../interfaces/ISnackbar";
import IModal from "../interfaces/IModal";
const Room = ({ room }: { room: IRoom }) => {
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { user } = useSelector((state: RootState) => state.defaultUser);

  const [snackbar, setSnackbar] = useState<ISnackbar>({
    open: false,
    message: "",
    severity: 'success',
  });

  const [modal, setModal] = useState<IModal>({
    show: false,
    password: "",
  });

  const handleChangeRoom = (roomName: string) => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "changeRoom",
          userUuid: user.uuid,
          data: {
            roomName: roomName,
          },
        })
      );
      console.log("WebSocket-> Change Room");
    }
  };
  // !!! type AlertColor = 'success' | 'info' | 'warning' | 'error';
  const handleJoinRoom = (roomName: string) => {
    if (room.name !== null) {
      if (room.isPrivate) {
        console.log("Room is private");
        setSnackbar({ message: "Room is private", open: true, severity: 'warning' });
        setModal({ show: true, password: "haslo" });
      } else if (room.maxPlayers === room.numPlayers) {
        setSnackbar({ message: "Room is full", open: true, severity: 'error' });
      } else {
        // !!! ODKOMENTUJ JAK CHCESZ PRZEJSC DO POKOJU !!!
        handleChangeRoom(room.name);
      }
    }
  }

  return (
    <Grid container className="header">

      <Grid item xs={12} sm={8} md={4}>
        <div className="header-element">
          <RoomNameDisplay value={room.name} />
        </div>
      </Grid>

      <Grid item xs={6} sm={4} md={1} className="header-element center">
        <RoomStatusDisplay value={room.isPrivate} />
      </Grid>

      <Grid item xs={6} sm={4} md={1} className="header-element center">
        <RoomPlatersDisplay players={room.numPlayers} maxPlayers={room.maxPlayers} />
      </Grid>

      <Grid item xs={6} sm={4} md={2} className="header-element center">
        <BoardDisplay value={room.boardSize} />
      </Grid>
      <Grid item xs={6} sm={4} md={2} className="header-element center">
        <DifficultyDisplay value={room.difficulty} />
      </Grid>

      <Grid item xs className="header-element but">
        <Button
          color="secondary"
          onClick={() => {
            handleJoinRoom(room.name);
          }}>
          Join
        </Button>
      </Grid>
      {
        snackbar.open ? <CustomizedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} /> : null
      }

      {
        modal.show ? <Modal show={modal.show} password={modal.password} setModal={setModal}/> : null
      }

    </Grid>
  )
}

export default Room;