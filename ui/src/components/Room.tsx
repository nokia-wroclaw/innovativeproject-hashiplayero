import { IRoom } from "../interfaces/IRoom";
import { useState } from "react";
import { Grid } from "@mui/material";

import BoardDisplay from "./static-components/BoardSize";
import DifficultyDisplay from "./static-components/Difficulty";
import RoomStatusDisplay from "./static-components/RoomStatus";
import RoomPlayersDisplay from "./static-components/RoomPlayers";
import RoomNameDisplay from "./static-components/RoomName";
import CustomizedSnackbar from "./static-components/SnackBar";
import { ISnackbar } from "../interfaces/ISnackbar";
import IModal from "../interfaces/IModal";
import DialogInput from "./dynamic-components/DialogInput";
const Room = ({ room }: { room: IRoom }) => {

  const [snackbar, setSnackbar] = useState<ISnackbar>({
    open: false,
    message: "",
    severity: "success",
  });

  const [modal, setModal] = useState<IModal>({
    show: false,
    password: "",
  });

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
        <RoomPlayersDisplay
          players={room.numPlayers}
          maxPlayers={room.maxPlayers}
        />
      </Grid>

      <Grid item xs={6} sm={4} md={2} className="header-element center">
        <BoardDisplay value={room.boardSize} />
      </Grid>
      <Grid item xs={6} sm={4} md={2} className="header-element center">
        <DifficultyDisplay value={room.difficulty} />
      </Grid>

      <Grid item xs className="header-element but">
        <DialogInput isPrivate={room.isPrivate} handleClick={setModal} roomName={room.name}/>
      </Grid>
      {snackbar.open ? (
        <CustomizedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      ) : null}
    </Grid>
  );
};

export default Room;
