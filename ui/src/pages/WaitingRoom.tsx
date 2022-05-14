import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import RoomData from "../components/RoomData";
import PlayerList from "../components/PlayerList";
import { Grid } from "@mui/material";

const WaitingRoom = () => {
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const { isAdmin } = useSelector((state: RootState) => state.StateMachine);

  return (
    <>
      <h1>Waiting Room</h1>
      <Grid container className="waiting-room-header">
        {/* <div className="form-elements"> */}
        <RoomData room={roomAndBoard} isAdmin={isAdmin} key="roomData" />
        <PlayerList players={roomAndBoard.members} />
        {/* </div> */}
      </Grid>
    </>
  );
};

export default WaitingRoom;
