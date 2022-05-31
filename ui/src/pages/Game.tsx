import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { Button, Switch } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import {
  changeBoardCorrect,
  setInitialState,
} from "../store/StateMachineSlice";
import Board from "./Board";
import PlayerList from "../components/PlayerList";
import { Grid, useMediaQuery } from "@mui/material";
import DialogWin from "../components/static-components/DialogWin";

const Game = () => {
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const { isBoardCorrect, inSingleGame, inWaitingRoom, isAdmin, inMultiGame } =
    useSelector((state: RootState) => state.StateMachine);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [disableHints, setDisableHints] = useState<boolean>(true);

  const matches = useMediaQuery("(min-width:900px)");

  const [openWinDialog, setOpenWinDialog] = useState<boolean>(false);
  const [openWin, setOpenWin] = useState<boolean>(true);

  const handleSetOpenWinClose = () => {
    setOpenWin(false);
  };

  const handleSetDisableHints = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDisableHints(event.target.checked);
  };

  useEffect(() => {
    if (!inWaitingRoom && !isAdmin) {
      navigate("/");
    }
    if (inWaitingRoom && !inMultiGame && !inSingleGame) {
      navigate(`/waitingroom/${roomAndBoard.name}`);
    }
    if (isBoardCorrect && openWin) {
      setOpenWinDialog(true);
      fire();
      setGameEnded(true);
    }
  }, [
    roomAndBoard,
    navigate,
    isBoardCorrect,
    inSingleGame,
    inWaitingRoom,
    isAdmin,
    inMultiGame,
    openWin,
  ]);

  const handleExitGame = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "changeRoom",
          data: {
            roomName: "lobby",
            password: "",
          },
        })
      );
      dispatch(setInitialState());
    }
  };

  const handleExitGameSingle = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "changeRoom",
          data: {
            roomName: "lobby",
            password: "",
          },
        })
      );
      dispatch(setInitialState());
    }
  };

  const handlePlayAgain = () => {
    handleExitGameSingle();
    navigate("/singleplay");
  };

  const handleFinishGame = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "finishGame",
          data: {
            name: roomAndBoard.name,
          },
        })
      );
      //   handleExitGame();
      dispatch(changeBoardCorrect(false));
    }
  };

  const refAnimationInstance = useRef<any>(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  return (
    <>
      <Grid container columns={24} spacing={1}>
        <Grid
          item
          xs={3}
          sx={{ display: !matches ? "none" : "block" }}
        >
        </Grid>
        <Grid item xs={24} md={18}>
          <Board gameEnded={gameEnded} disableHints={disableHints} />
        </Grid>
        <Grid
          item
          xs={3}
          sx={{ display: !matches ? "none" : "block" }}
        >
        </Grid>
      </Grid>
      {!inSingleGame && inMultiGame ? (
        <>
          <Button
            disabled={!isBoardCorrect}
            onClick={() => {
              handleFinishGame();
            }}
          >
            Waiting Room
          </Button>
          <Button
            onClick={() => {
              handleExitGame();
            }}
          >
            Exit Game
          </Button>
        </>
      ) : null}
      <Switch checked={disableHints} onChange={handleSetDisableHints} />
      {inSingleGame && !inMultiGame ? (
        <>
          <Button
            onClick={() => {
              handleExitGameSingle();
            }}
          >
            Exit Game
          </Button>
          <Button
            disabled={!isBoardCorrect}
            onClick={() => {
              handlePlayAgain();
            }}
          >
            Play Again
          </Button>
        </>
      ) : null}
      {!inSingleGame ? (
        <PlayerList
          players={roomAndBoard.members}
          gameData={roomAndBoard.gameData}
        />
      ) : null}
      <DialogWin
        open={openWinDialog}
        handleSetOpenWinClose={handleSetOpenWinClose}
        setOpenWinDialog={setOpenWinDialog}
      />
      <ReactCanvasConfetti
        refConfetti={getInstance}
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      />
    </>
  );
};

export default Game;
