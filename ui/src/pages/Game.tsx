import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import {
  changeAdmin,
  changeBoardCorrect,
  changeMultiGame,
  changeSingleGame,
  setInitialState,
} from "../store/StateMachineSlice";
import Board from "./Board";
import PlayerList from "../components/PlayerList";

import { Grid, useMediaQuery } from "@mui/material";
import ParseBridgesModel from "../services/ParseBridgesModel";
// import useMediaQuery from '@mui/material/useMediaQuery';

const Game = () => {
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const dispatch = useAppDispatch();
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const navigate = useNavigate();

  const matches = useMediaQuery("(min-width:900px)");

  const { isBoardCorrect, inSingleGame, inWaitingRoom, isAdmin, inMultiGame } =
    useSelector((state: RootState) => state.StateMachine);

  useEffect(() => {
    //TODO: zrobić zeby single player mogł wrocic do poczekalni do kolejnej gry (teraz zawsze zrobi nowy pokoj)
    if (!inWaitingRoom && !isAdmin) {
      navigate("/");
    }
    if (inWaitingRoom && !inMultiGame && !inSingleGame) {
      navigate(`/waitingroom/${roomAndBoard.name}`);
    }
  }, [
    roomAndBoard,
    navigate,
    isBoardCorrect,
    inSingleGame,
    inWaitingRoom,
    isAdmin,
    inMultiGame,
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

  const handleCheckBoard = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "checkBoard",
          data: {
            moves: ParseBridgesModel(roomAndBoard.bridges),
          },
        })
      );
    }
  };

  return (
    <>
      <Grid container columns={24} spacing={1}>
        <Grid
          item
          xs={3}
          sx={{ background: "blue", display: !matches ? "none" : "block" }}
        >
          <span>xs</span>
        </Grid>
        <Grid item xs={24} md={18} sx={{ background: "pink" }}>
          <Board />
        </Grid>
        <Grid
          item
          xs={3}
          sx={{ background: "blue", display: !matches ? "none" : "block" }}
        >
          <span>xs</span>
        </Grid>
      </Grid>
      <Button
        onClick={() => {
          handleCheckBoard();
        }}
      >
        Check Board
      </Button>
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
    </>
  );
};

export default Game;
