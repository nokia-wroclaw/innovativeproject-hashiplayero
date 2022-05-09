import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import RoomData from "../components/RoomData";
import PlayerList from "../components/PlayerList";
import { Grid } from "@mui/material";
import { useAppDispatch } from "../store/hooks";

const WaitingRoom = () => {
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  let isAdmin = user.uuid === roomAndBoard.admin;

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
