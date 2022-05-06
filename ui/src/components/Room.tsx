import { IRoom } from "../interfaces/IRoom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Room = ({ room }: { room: IRoom }) => {
  const navigate = useNavigate();

  const handleButtonInteraction = (navigation: String) => {
    // navigate(`${navigation}`);
    console.log(navigation);
  }

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
                }}
              >
                  Join
              </Button>
            </div>
        </div>
    )
}

export default Room;