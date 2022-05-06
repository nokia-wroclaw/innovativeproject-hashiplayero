import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFormData } from "../store/gameSlice";
import initialGameData from "../interfaces/ISingleGameData";
import ky from "ky";
import { useAppDispatch } from "../store/hooks";
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";

interface State {
  difficulty: number;
  boardSize: number;
  timeLimit: Date;
  showTimeLimit: boolean;
  seedInput: string;
  showSeedInput: boolean;
}

const SinglePlay = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [seedInput, setSeedInput] = useState("");

  const handleSetSeedInput = (event: any) => {
    setSeedInput(event.target.value);
  };

  const [values, setValues] = useState<State>({
    difficulty: 2,
    boardSize: 7,
    timeLimit: new Date(0),
    seedInput: "",
    showTimeLimit: false,
    showSeedInput: false,
  });

  const handleChange = (prop: keyof State) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowTime = () => {
    setValues({
      ...values,
      showTimeLimit: !values.showTimeLimit,
    });
  };

  const gameId = 1;
  const sendFormForData = () => {
    ky.post("http://localhost:3001/api/puzzle", {
      json: { difficulty: values.difficulty, size: values.boardSize },
    })
      .json()
      .then((res: any) => {
        let initialData: initialGameData = {
          seed: seedInput,
          timeLimit: values.timeLimit.getTime(),
          boardSize: res.settings.size,
          difficulty: res.settings.difficulty,
          board: res.array,
          boardResult: [],
        };
        dispatch(addFormData(initialData));
      })
      .catch((err) => console.log(err));
    navigate(`${gameId}`);
  };

  const changeValue = (change: number, value: any, setValue: any) => {
    if (value + change >= 1 && value + change <= 3) {
      setValues({ ...values, difficulty: value + change });
    }
  };

  return (
    <>
      <div className="form-container paper">
        <div className="general-info">
          {/* <div>
              Difficulty
              <Button 
              onClick={() => changeValue(-1, values.difficulty, setValues)}
              color="secondary">
                -
              </Button>
              <span>{values.difficulty}</span>
              <Button 
              onClick={() => changeValue(1, values.difficulty, setValues)}
              color="secondary">
                +
              </Button>
            </div> */}
          <div>
            <FormControl fullWidth>
              <InputLabel id="timeLimitLabel">Seed</InputLabel>
              <Input
                id="seedInput"
                type="text"
                value={seedInput}
                onChange={handleSetSeedInput}
              />
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel id="difficultyLabel">Board difficulty</InputLabel>
              <Select
                labelId="difficultyLabelId"
                id="difficultyInput"
                value={values.difficulty}
                label="Difficulty"
                onChange={handleChange("difficulty")}
              >
                <MenuItem value={1}>Easy</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>Hard</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel id="boardSizeLabel">Board size</InputLabel>
              <Select
                labelId="boardSizeLabelId"
                id="boardSizeInput"
                value={values.boardSize}
                label="Boardsize"
                onChange={handleChange("boardSize")}
              >
                <MenuItem value={7}>Seven</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={15}>Fifteen</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileTimePicker
                views={["minutes", "seconds"]}
                ampm={false}
                inputFormat="mm:ss"
                mask="__:__"
                label="Minutes and seconds"
                value={values.timeLimit}
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setValues({ ...values, timeLimit: newValue });
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        </div>

        <Button
          color="secondary"
          onClick={() => {
            sendFormForData();
          }}
        >
          Play!
        </Button>
      </div>
    </>
  );
};

export default SinglePlay;
