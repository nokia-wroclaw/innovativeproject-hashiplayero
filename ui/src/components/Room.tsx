import { IRoom } from "../interfaces/IRoom";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/hooks";
import { useSelector } from "react-redux";
import { setInitialRoomBoard } from "../store/RoomGameSlice";
import { LockOpen, Lock }  from '@mui/icons-material';
import { HouseSvg, BoardSvg, DifficultySvg, PersonSvg } from "./svg/VectorGraphics";
import { Button, Grid, Typography } from "@mui/material";

import { Analytics, GridOn, PeopleAlt} from '@mui/icons-material';

const Room = ({ room }: { room: IRoom }) => {
  const navigate = useNavigate();
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.defaultUser);

  const handleButtonInteraction = (navigation: String) => {
    // navigate(`${navigation}`);
    console.log(navigation);
  }

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

    return (
      <Grid container className="header">
        <Grid item xs={12} sm={8} md={4}>
          <div className="header-element">
            <HouseSvg />
            <Typography noWrap>{room.name}</Typography>
          </div>
        </Grid>
        <Grid item xs={6} sm={4} md={1} className="header-element center">
            {
              room.isPrivate ? 
                  <Lock color="info"/>
                    : 
                  <LockOpen color="info"/>
            }
        </Grid>
        <Grid item xs={6} sm={4} md={1} className="header-element center">
            <PeopleAlt />
            {room.numPlayers}/{room.maxPlayers}
        </Grid>
        <Grid item xs={6} sm={4} md={2} className="header-element center">
            <GridOn/>
            {
              room.boardSize === 7 ? <Typography noWrap>Small size</Typography>: room.boardSize === 15 ? <Typography noWrap>Large size</Typography> : <Typography noWrap>Normal size</Typography>
            }
        </Grid>
        <Grid item xs={6} sm={4} md={2} className="header-element center">
            <Analytics/>
            {
              room.difficulty === 1 ? "Easy" : room.difficulty === 2 ? "Medium" : "Hard"
            }
        </Grid>
        <Grid item xs className="header-element but">
          <Button
            color="secondary"
            onClick={() => {
              handleButtonInteraction(`/room/${room.name}`);
              if (room.name !== null){
                handleChangeRoom(room.name);
              }}}>
            Join
          </Button>
        </Grid>
      </Grid>
    )
}

export default Room;