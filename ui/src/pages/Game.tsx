import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const Game = () => {
  const { difficulty, board, boardResult, boardSize, seed, timeLimit } =
    useAppSelector((state) => state.singleGame);
  const dispatch = useAppDispatch();

  const handleFunc = () => {
    console.log(seed);
    console.log(board);
  };

  return (
    <div>
      Game
      {<button onClick={handleFunc}>CLICK</button>}
    </div>
  );
};

export default Game;
