import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import RoomData from "../components/RoomData";
import PlayerList from "../components/PlayerList";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      <h1>Waiting Room</h1>
      <Grid container className="waiting-room-header">
        {/* <div className="form-elements"> */}
        <RoomData room={roomAndBoard} key="roomData" />
        <PlayerList
          players={roomAndBoard.members}
          gameData={roomAndBoard.gameData}
        />
        {/* </div> */}
      </Grid>
    </>
  );
};

export default WaitingRoom;
