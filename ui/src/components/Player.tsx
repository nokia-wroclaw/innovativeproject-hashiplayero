import IMember from "../interfaces/IMember";
import { IconButton } from "@mui/material";
import { PersonRemove } from "@mui/icons-material";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { IGameData } from "../interfaces/IRoomAndBoard";

const Player = ({
  player,
  userGameData,
}: {
  player: IMember;
  userGameData: IGameData | undefined;
}) => {
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { isAdmin } = useSelector((state: RootState) => state.StateMachine);

  const handleKickPlayer = () => {
    if (webSocket !== undefined && isAdmin) {
      webSocket.send(
        JSON.stringify({
          action: "kickUser",
          userUuid: user.uuid,
          data: {
            userToKick: player.name,
          },
        })
      );
    }
  };

  return (
    <div className="element">
      <div className="element-name">
        {player.uuid === user.uuid ? (
          <span style={{ width:"100%"}}>{player.name} (You)</span>
        ) : (
          <span style={{ width:"100%" }}>{player.name}</span>
        )}
      </div>

      <div
        onClick={() => {
          handleKickPlayer();
        }}
        className="element-button"
      >
        <IconButton
          color="secondary"
          aria-label="upload picture"
          component="span"
          size="small"
        >
          <PersonRemove />
        </IconButton>
      </div>
    </div>
  );
};

export default Player;
