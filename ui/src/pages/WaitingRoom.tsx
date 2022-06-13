import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import RoomData from "../components/RoomData";
import PlayerList from "../components/PlayerList";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ISnackbar } from "../interfaces/ISnackbar";
import CustomizedSnackbar from "../components/static-components/SnackBar";

const WaitingRoom = () => {
  const { user } = useSelector((state: RootState) => state.defaultUser);

  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const { inWaitingRoom } = useSelector(
    (state: RootState) => state.StateMachine
  );
  const { isAdmin, inMultiGame } = useSelector(
    (state: RootState) => state.StateMachine
  );
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<ISnackbar>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!inWaitingRoom) {
      navigate("/");
    }
    if (inMultiGame) {
      navigate(`/multiplayer/${roomAndBoard.name}`);
    }
  }, [inWaitingRoom, navigate, roomAndBoard, inMultiGame, isAdmin]);

  useEffect(() => {
    if (user.uuid !== roomAndBoard.admin) {
      setSnackbar({
        open: true,
        message: "Waiting for the game to start",
        severity: "warning",
      });
    }
  }, []);

  return (
    <>
      <div className="wating-room-container">
        <Grid container spacing={{ xs: 2, md: 3 }} columns={24}>
          <Grid item xs={24} sm={24} md={24} lg={16} className="room-data">
            <RoomData room={roomAndBoard} key="roomData" />
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={8} className="players-data">
            <PlayerList
              players={roomAndBoard.members}
              gameData={roomAndBoard.gameData}
            />
          </Grid>
        </Grid>
      </div>
      {snackbar.open ? (
        <CustomizedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      ) : null}
    </>
  );
};

export default WaitingRoom;
