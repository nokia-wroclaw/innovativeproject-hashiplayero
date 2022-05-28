import IMember from "../interfaces/IMember";
import { IconButton } from "@mui/material";
import { PersonRemove } from "@mui/icons-material";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { IGameData } from "../interfaces/IRoomAndBoard";
import { Icon } from '@iconify/react';

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
          data: {
            userToKick: player.uuid,
          },
        })
      );
    }
  };

  return (
    <div className="element">
      <div className="element-name">
        {player.uuid === user.uuid ? (
          <div style={{ width: "100%" }}>
            <span style={{ maxWidth: "80%" }}>{player.name}</span>
            <span style={{ marginLeft: "8px" }}>(You)</span>
          </div>
        ) : (
          <span style={{ maxWidth: "100%" }}>{player.name}</span>
        )}
      </div>
      {
        isAdmin &&
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
      }
      {/* <Icon icon="emojione:crown" width="128" height="128" /> */}
    </div>
  );
};

export default Player;
