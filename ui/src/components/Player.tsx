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
        <div>
          {userGameData !== undefined ? (
            <>
              {userGameData.UserGameState.correct ? (
                <div>TRUE</div>
              ) : (
                <div>FALSE</div>
              )}
              {userGameData.UserGameState.inGame ? (
                <div>TRUE</div>
              ) : (
                <div>FALSE</div>
              )}
              {userGameData.UserGameState.solvingTime === 0 ? (
                <div>NOT END</div>
              ) : (
                <div>{userGameData.UserGameState.solvingTime} seconds</div>
              )}
              {userGameData.UserGameState.timeStart}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Player;
