import React, { useEffect, useState } from "react";
import { IState } from "../interfaces/IState";
import {
  Slider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  TextField,
  Checkbox,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/hooks";
import createMarks from "../components/functions/Marks";

function valueLabelFormat(value: number) {
  const marks = createMarks();
  return marks.findIndex((mark) => mark.value === value) + 2;
}

const CreateRoom = () => {
  const marks = createMarks();
  const [values, setValues] = useState<IState>({
    amountOfPlayersInput: 2,
    roomNameInput: "",
    passwordInput: "",
    seedInput: "",
    difficultyInput: 2,
    boardSizeInput: 10,
    timeLimitInput: new Date(0),
    enableTimeLimitInput: false,
    isDisabled: true,
  });

  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const navigate = useNavigate();
  useEffect(() => {
    if (roomAndBoard.name !== "name" && roomAndBoard.name.length > 0) {
      navigate(`/waitingroom/${roomAndBoard.name}`);
    }
  }, [roomAndBoard, navigate]);

  const handleChange = (prop: keyof IState) => (event: any) => {
    if (prop === "enableTimeLimitInput") {
      setValues({ ...values, [prop]: event.target.checked });
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }
  };

  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const dispatch = useAppDispatch();

  const handleCreateRoom = () => {
    let nameOfRoom = values.roomNameInput + user.uuid;
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "createRoom",
          userUuid: user.uuid,
          data: {
            name: nameOfRoom,
            password: values.passwordInput,
            maxPlayers: values.amountOfPlayersInput,
            isPrivate: values.isDisabled,
            timeLimit: values.timeLimitInput.getMinutes(),
            difficulty: values.difficultyInput,
            boardSize: values.boardSizeInput,
          },
        })
      );
    }
    console.log("WebSocket-> Create Room");
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValues({ ...values, amountOfPlayersInput: Number(newValue) });
  };

  return (
    <>
      <div className="form-container paper">
        <div className="general-info">
          <div className="form-element">
            <TextField
              id="roomNameInput"
              type="text"
              value={values.roomNameInput}
              variant="outlined"
              label="Room name"
              onChange={handleChange("roomNameInput")}
            />
          </div>

          <div className="form-element">
            <TextField
              id="passwordInput"
              type="Password"
              variant="outlined"
              label="Password"
              value={values.passwordInput}
              onChange={handleChange("passwordInput")}
            />
          </div>

          {/* <Grid item minWidth={400}>
                        <FormControl fullWidth>
                            <InputLabel id="playersLabel">Number Of Players</InputLabel>
                            <Input
                                value={value}
                                size="small"
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 10,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </FormControl>
                    </Grid> */}

          <Slider
            aria-label="Custom marks"
            marks={marks}
            valueLabelDisplay="auto"
            valueLabelFormat={valueLabelFormat}
            value={values.amountOfPlayersInput}
            onChange={handleSliderChange}
            min={2}
            step={1}
            max={10}
          />

          <div className="form-element">
            <FormControl fullWidth>
              <InputLabel id="difficultyLabel">Difficulty</InputLabel>
              <Select
                labelId="difficultyLabelId"
                id="difficultyInput"
                value={values.difficultyInput}
                label="Difficulty"
                onChange={handleChange("difficultyInput")}
              >
                <MenuItem value={1}>Easy</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>Hard</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="form-element">
            <FormControl fullWidth>
              <InputLabel id="boardSizeLabel">Board size</InputLabel>
              <Select
                labelId="boardSizeLabelId"
                id="boardSizeInput"
                value={values.boardSizeInput}
                label="Boardsize"
                onChange={handleChange("boardSizeInput")}
              >
                <MenuItem value={7}>Seven</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={15}>Fifteen</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <h5>Enable Time Limit</h5>
            <Checkbox
              checked={values.enableTimeLimitInput}
              onChange={handleChange("enableTimeLimitInput")}
              inputProps={{ "aria-label": "controlled" }}
            />
          </div>

          <div className="form-element">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileTimePicker
                views={["minutes", "seconds"]}
                ampm={false}
                inputFormat="mm:ss"
                mask="__:__"
                label="Minutes and seconds"
                value={values.timeLimitInput}
                disabled={values.enableTimeLimitInput}
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setValues({ ...values, timeLimitInput: newValue });
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        </div>

        <Button
          onClick={() => {
            handleCreateRoom();
          }}
          color="secondary"
        >
          Create!
        </Button>
      </div>
    </>
  );
};

export default CreateRoom;
