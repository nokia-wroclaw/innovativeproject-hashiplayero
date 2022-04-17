import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFormData } from "../store/gameSlice";
import initialGameData from "../components/SingleGameData";
import ky from "ky";
import { useAppDispatch } from "../store/hooks";
import {
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

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
  const sendFormForData = () => {
    ky.get("http://localhost:3001/api/puzzle")
      .json()
      .then((res: any) => {
        let initialData: initialGameData = {
          seed: seedInput,
          timeLimit: timeLimitInput,
          boardSize: boardSizeInput,
          difficulty: difficultyInput,
          board: res.puzzle,
          boardResult: [],
        };
        dispatch(addFormData(initialData));
      })
      .catch((err) => console.log(err));
    navigate(`${gameId}`);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={4}
      >
        <Grid item minWidth={400}>
          <FormControl fullWidth>
            <InputLabel id="boardSizeLabel">Board size</InputLabel>
            <Select
              labelId="boardSizeLabelId"
              id="boardSizeInput"
              value={boardSizeInput}
              label="Boardsize"
              defaultValue={5}
              onChange={handleSetBoardSizeInput}
            >
              <MenuItem value={5}>Five</MenuItem>
              <MenuItem value={9}>Nine</MenuItem>
              <MenuItem value={15}>Fifteen</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item minWidth={400}>
          <FormControl fullWidth>
            <InputLabel id="boardSizeLabel">Difficulty</InputLabel>
            <Input
              id="difficultyInput"
              type="number"
              defaultValue="2"
              value={difficultyInput}
              onChange={handleSetDifficultyInput}
            />
          </FormControl>
        </Grid>
        <Grid item minWidth={400}>
          <FormControl fullWidth>
            <InputLabel id="timeLimitLabel">Time limit</InputLabel>
            <Input
              id="timeLimitInput"
              type="number"
              defaultValue="10"
              value={timeLimitInput}
              onChange={handleSetTimeLimitInput}
            />
          </FormControl>
        </Grid>
        <Grid item minWidth={400}>
          <FormControl fullWidth>
            <InputLabel id="timeLimitLabel">Seed</InputLabel>
            <Input
              id="seedInput"
              type="text"
              value={seedInput}
              onChange={handleSetSeedInput}
            />
          </FormControl>
        </Grid>
        <Grid item minWidth={400}>
          <div className="content-buttons">
            <button
              className="button-primary-centered"
              type="button"
              onClick={() => {
                sendFormForData();
              }}
            >
              <div className="text-start-game text-center">Play!</div>
            </button>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default SinglePlay;
