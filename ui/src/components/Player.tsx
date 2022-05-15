import IMember from "../interfaces/IMember";
import { IconButton } from "@mui/material";
import { PersonRemove } from "@mui/icons-material";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

const Player = ({ player }: { player: IMember }) => {
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { isAdmin } = useSelector(
    (state: RootState) => state.StateMachine
  );

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
    <div className="header-element element">
      {player.uuid === user.uuid ? (
        <div style={{ margin: "0px 8px" }}>{player.name} (You)</div>
      ) : (
        <div style={{ margin: "0px 8px" }}>{player.name}</div>
      )}

      <div>
        <div
          onClick={() => {
            handleKickPlayer();
          }}
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
    </div>
  );
};

export default Player;
