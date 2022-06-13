import IMember from "../interfaces/IMember";
import { IconButton } from "@mui/material";
import { PersonRemove } from "@mui/icons-material";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { IGameData } from "../interfaces/IRoomAndBoard";
import { Icon } from "@iconify/react";
import playerStatus from "../interfaces/PlayerStatus";
import ConfirmationModal from "./static-components/ConfirmationModal";
import { useEffect, useState } from "react";
import CustomizedSnackbar from "./static-components/SnackBar";
import { ISnackbar } from "../interfaces/ISnackbar";

const Player = ({
  player,
  userGameData,
  state,
}: {
  player: IMember;
  userGameData: IGameData | undefined;
  state: playerStatus;
}) => {
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { isAdmin } = useSelector((state: RootState) => state.StateMachine);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);

  const [open, setOpen] = useState<boolean>(false);
  const [kick, setKick] = useState<boolean>(false);

  const handleKickPlayer = () => {
    setOpen(true);
  };

  const [snackbar, setSnackbar] = useState<ISnackbar>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (kick) {
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
    }
  }, [kick]);

  useEffect(() => {
    if (userGameData?.UserGameState.correct === true) {
      setSnackbar({
        open: true,
        message: `Player ${player.name} win with ${userGameData?.UserGameState?.solvingTime} sec`,
        severity: "success",
      });
    }
  }, [userGameData?.UserGameState?.solvingTime]);

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
      {isAdmin && (
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
      )}
      {player.uuid === roomAndBoard.admin && (
        <Icon icon="emojione:crown" width="32" height="32" />
      )}
      {state === playerStatus.firstPlace && (
        <Icon icon="noto:1st-place-medal" width="32" height="32" />
      )}
      {state === playerStatus.secondPlace && (
        <Icon icon="noto:2nd-place-medal" width="32" height="32" />
      )}
      {state === playerStatus.thirdPlace && (
        <Icon icon="noto:3rd-place-medal" width="32" height="32" />
      )}
      czas: {userGameData?.UserGameState?.solvingTime} sec
      <ConfirmationModal open={open} setOpen={setOpen} setKick={setKick} />
      {snackbar.open ? (
        <CustomizedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      ) : null}
    </div>
  );
};

export default Player;
