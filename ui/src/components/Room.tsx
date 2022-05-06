import { IRoom } from "../interfaces/IRoom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/hooks";
import { useSelector } from "react-redux";
import { setInitialRoomBoard } from "../store/RoomGameSlice";

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
        <div className="paper">  

            <div className="paper-element">
              {room.name}
            </div>

            <div className="paper-element">
              {
                room.isPrivate ? "Private" : "Public"
              }
            </div>

            <div className="paper-element">
              {room.boardSize}
            </div>

            <div className="paper-element">
              {room.difficulty}
            </div>

            <div className="paper-element">
              {room.numPlayers}
            </div>

            <div className="paper-element">

              <Button
                color="secondary"
                onClick={() => {
                  handleButtonInteraction(`/room/${room.name}`);
                  handleChangeRoom(room.name);
                }}
              >
                  Join
              </Button>
            </div>
        </div>
    )
}

export default Room;