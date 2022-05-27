import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import RoomData from "../components/RoomData";
import PlayerList from "../components/PlayerList";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SwipeablePlayerList from "../components/SwipeablePlayerList";

const WaitingRoom = () => {
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const { inWaitingRoom } = useSelector(
    (state: RootState) => state.StateMachine
  );
  const { isAdmin, inMultiGame } = useSelector(
    (state: RootState) => state.StateMachine
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!inWaitingRoom) {
      navigate("/");
    }
    if (inMultiGame) {
      navigate(`/multiplayer/${roomAndBoard.name}`);
    }
  }, [inWaitingRoom, navigate, roomAndBoard, inMultiGame, isAdmin]);

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
            {/* <SwipeablePlayerList
              players={roomAndBoard.members}
              gameData={roomAndBoard.gameData}
            /> */}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default WaitingRoom;
