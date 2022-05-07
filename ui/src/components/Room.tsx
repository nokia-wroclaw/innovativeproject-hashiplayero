import { IRoom } from "../interfaces/IRoom";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/hooks";
import { useSelector } from "react-redux";
import { setInitialRoomBoard } from "../store/RoomGameSlice";
import { LockOpen, Lock }  from '@mui/icons-material';
import { HouseSvg, BoardSvg, DifficultySvg, PersonSvg } from "./svg/VectorGraphics";
import { Button, InputBase, Grid } from "@mui/material";

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

  const handleDisconnectRoom = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "changeRoom",
          userUuid: user.uuid,
          data: {
            roomName: "lobby",
          },
        })
      );
      dispatch(setInitialRoomBoard());
      console.log("WebSocket-> Change Room");
    }
  };

    return (
        // <div className="header">  
        //     <div className="room-element">
        //       <HouseSvg/>              
        //       {room.name}
        //     </div>

        //     <div className="header-element">

        //     </div>

        //     <div className="header-element">
        //       <BoardSvg/>
        //       {room.boardSize}
        //     </div>

        //     <div className="header-element">
        //       <DifficultySvg/>
        //       {room.difficulty}
        //     </div>

        //     <div className="header-element">
        //       <PersonSvg/>
        //       {room.numPlayers}
        //     </div>

   
        // </div>

    <Grid container className="header">
      <Grid item xs={12} sm={4}>
        <div className="header-element">
          <HouseSvg />
          <h4>{room.name}</h4>
        </div>
      </Grid>
      <Grid item xs className="header-element">
          {
            room.isPrivate ? 
              <div>
                <Lock color="info"/>
                "Private" 
              </div>
                  : 
              <div>
                
                <LockOpen color="info"/>
                "Public"
              </div>   
          }
      </Grid>
      <Grid item sm={12} md={3} className="header-element">
          <PersonSvg />
          <InputBase
            id="room-people-number"
            placeholder="Numbers of players" 
          />
      </Grid>
      <Grid item xs className="header-element but"
        style={{flexBasis: 1}}>
         <Button
              color="secondary"
              onClick={() => {
                handleButtonInteraction(`/room/${room.name}`);
                if (room.name !== null){
                  handleChangeRoom(room.name);
                }
              }}
            >
                Join
          </Button>
      </Grid>
    </Grid>
    )
}

export default Room;