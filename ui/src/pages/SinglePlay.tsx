import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFormData, addBoard, addBoardResult } from "../store/gameSlice";
import { useSelector, useDispatch } from "react-redux";
import initialGameData from "../components/SingleGameData";
import axios from "axios";
import { useAppDispatch } from "../store/hooks";

const SinglePlay = () => {
  const dispatch = useAppDispatch();
  const [difficultyInput, setDifficultyInput] = useState(2);
  const [boardSizeInput, setBoardSizeInput] = useState(3);
  const [timeLimitInput, setTimeLimitInput] = useState(10);
  const [seedInput, setSeedInput] = useState("");
  const navigate = useNavigate();

  const handleSetDifficultyInput = (event: any) => {
    setDifficultyInput(event.target.value);
  };

  const handleSetBoardSizeInput = (event: any) => {
    setBoardSizeInput(event.target.value);
  };

  const handleSetTimeLimitInput = (event: any) => {
    setTimeLimitInput(event.target.value);
  };

  const handleSetSeedInput = (event: any) => {
    setSeedInput(event.target.value);
  };

  const gameId = 1;
  // https://localhost:3001/api/puzzle
  const sendFormForData = () => {
    axios
      .get("http://localhost:3001/api/puzzle")
      .then((res) => {
        if (res.request.status === 200) {
          let initialData: initialGameData = {
            seed: res.data.seed,
            timeLimit: res.data.timeLimit,
            boardSize: res.data.boardSize,
            difficulty: res.data.boardResult,
            board: res.data.puzzle,
            boardResult: res.data.boardResult,
          };
          dispatch(addFormData(initialData));
        }
      })
      .catch((err) => console.log(err));
    navigate(`${gameId}`);
  };

  return (
    <div className="form-play">
      <div>
        <div className="form-group">
          <label id="difficultyLabel">Difficulty</label>
          <input
            type="number"
            min="0"
            max="10"
            value={difficultyInput}
            className="form-control"
            id="difficultyInput"
            onChange={handleSetDifficultyInput}
          />
          <small
            id="difficultySmallNumber"
            className="form-text text-muted"
          ></small>
        </div>
        <div className="form-group">
          <label id="boardSizeLabel">Board size</label>
          <input
            type="number"
            min="0"
            max="10"
            value={boardSizeInput}
            className="form-control"
            id="boardSizeInput"
            onChange={handleSetBoardSizeInput}
          />
          <small
            id="boardSizeSmallSmall"
            className="form-text text-muted"
          ></small>
        </div>
        <div className="form-group">
          <label id="timeLimitLabel">Time limit</label>
          <input
            type="number"
            min="0"
            max="10"
            value={timeLimitInput}
            className="form-control"
            id="timeLimitInput"
            onChange={handleSetTimeLimitInput}
          />
          <small id="timeLimitSmall" className="form-text text-muted"></small>
        </div>
        <div className="form-group">
          <label id="seedLabel">Seed</label>
          <input
            type="text"
            value={seedInput}
            className="form-control"
            id="seedInput"
            onChange={handleSetSeedInput}
          />
          <small id="seedSmall" className="form-text text-muted"></small>
        </div>
        <button
          className="button-single-play m-5"
          type="button"
          //when onClick navigate to /singleplay/gameId
          onClick={() => {
            sendFormForData();
          }}
        >
          <div className="text-start-game text-center">Play!</div>
        </button>
      </div>
    </div>
  );
};

export default SinglePlay;
