import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

interface State {
  difficulty: number;
  boardSize: number;
  timeLimit: Date;
  showTimeLimit: boolean;
  seedInput: string;
  showSeedInput: boolean;
}

const SinglePlay = () => {
  const navigate = useNavigate();
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);

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

  const handleCreateSingleGame = () => {
    let nameOfRoom = "Pokoj-" + user.uuid;
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "createRoom",
          userUuid: user.uuid,
          data: {
            name: nameOfRoom,
            password: "haslos",
            maxPlayers: 1,
            isPrivate: true,
            timeLimit: values.timeLimit.getMinutes(),
            difficulty: values.difficulty,
            boardSize: values.boardSize,
          },
        })
      );
    }
    console.log("WebSocket -> Create Single Game");
  };

  useEffect(() => {
    console.log(roomAndBoard)
    if (roomAndBoard.array.length !== 0 && roomAndBoard.settings.size !== null) {
      navigate(`${roomAndBoard.name}`);
    }

    // unmount
    // return () => {
    // }
  }, [roomAndBoard, navigate]);

  return (
    <>
      <div className="form-container paper">
        <div className="general-info">
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
            handleCreateSingleGame();
          }}
        >
          Play!
        </Button>
      </div>
    </>
  );
};

export default SinglePlay;
