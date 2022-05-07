import { IRoom } from "../interfaces/IRoom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/hooks";
import { useSelector } from "react-redux";
import { setInitialRoomBoard } from "../store/RoomGameSlice";
import { LockOpen, Lock }  from '@mui/icons-material';
import { HouseSvg, BoardSvg, DifficultySvg, PersonSvg } from "./svg/VectorGraphics";

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
        <div className="room">  

            <div className="room-element">
              <HouseSvg/>              
              {room.name}
            </div>

            <div className="room-element">
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
            </div>

            <div className="room-element">
              <BoardSvg/>
              {room.boardSize}
            </div>

            <div className="room-element">
              <DifficultySvg/>
              {room.difficulty}
            </div>

            <div className="room-element">
              <PersonSvg/>
              {room.numPlayers}
            </div>

            <div className="room-element">

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
            </div>
        </div>
    )
}

export default Room;