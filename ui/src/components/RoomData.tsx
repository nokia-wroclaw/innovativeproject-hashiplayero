import { IRoomAndBoard } from "../interfaces/IRoomAndBoard";
import {
  Analytics,
  GridOn,
  PeopleAlt,
  LockOpen,
  Lock,
} from "@mui/icons-material";
import { HouseSvg } from "./svg/VectorGraphics";

import { IState } from "../interfaces/IState";
import {
  Slider,
  MenuItem,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Select,
  Button,
  TextField,
  Checkbox,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import createMarks from "./functions/Marks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/hooks";

function valueLabelFormat(value: number) {
  const marks = createMarks();
  return marks.findIndex((mark) => mark.value === value) + 2;
}

const RoomData = ({
  room,
  isAdmin,
}: {
  room: IRoomAndBoard;
  isAdmin: boolean;
}) => {
  const marks = createMarks();
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<IState>({
    amountOfPlayersInput: roomAndBoard.maxPlayers,
    roomNameInput: roomAndBoard.name,
    passwordInput: roomAndBoard.password,
    seedInput: "",
    difficultyInput: roomAndBoard.settings.difficulty,
    boardSizeInput: roomAndBoard.settings.size,
    timeLimitInput: new Date(),
    enableTimeLimitInput: false,
    isDisabled: true,
  });

  useEffect(() => {
    setValues({
      ...values,
      amountOfPlayersInput: roomAndBoard.maxPlayers,
      passwordInput: roomAndBoard.password,
      difficultyInput: roomAndBoard.settings.difficulty,
      boardSizeInput: roomAndBoard.settings.size,
    });
  }, [roomAndBoard]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValues({ ...values, amountOfPlayersInput: Number(newValue) });
  };

  const handleChange = (prop: keyof IState) => (event: any) => {
    if (prop === "enableTimeLimitInput") {
      setValues({ ...values, [prop]: event.target.checked });
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }
  };

  const handleEditRoom = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "editRoom",
          userUuid: user.uuid,
          data: {
            name: roomAndBoard.name,
            password: values.passwordInput,
            maxPlayers: values.amountOfPlayersInput,
            isPrivate: roomAndBoard.isPrivate,
            timeLimit: values.timeLimitInput.getMinutes(),
            difficulty: values.difficultyInput,
            boardSize: values.boardSizeInput,
          },
        })
      );
    }
  };

  return (
    <>
      <Grid container className="header">
        <Grid item xs={12} sm={8} md={4}>
          <div className="header-element">
            <HouseSvg />
            <Typography noWrap>{room.name}</Typography>
          </div>
        </Grid>
        <Grid item xs={6} sm={4} md={1} className="header-element center">
          {room.isPrivate ? <Lock color="info" /> : <LockOpen color="info" />}
        </Grid>
        <Grid item xs={6} sm={4} md={1} className="header-element center">
          <PeopleAlt />
          {room.maxPlayers}
        </Grid>
        <Grid item xs={6} sm={4} md={2} className="header-element center">
          <GridOn />
          {room.settings.size === 7 ? (
            <Typography noWrap>Small size</Typography>
          ) : room.settings.size === 15 ? (
            <Typography noWrap>Large size</Typography>
          ) : (
            <Typography noWrap>Normal size</Typography>
          )}
        </Grid>
        <Grid item xs={6} sm={4} md={2} className="header-element center">
          <Analytics />
          {room.settings.difficulty === 1
            ? "Easy"
            : room.settings.difficulty === 2
            ? "Medium"
            : "Hard"}
        </Grid>
      </Grid>

      <div className="form-container paper">
        <div className="general-info">
          <div className="form-element">
            <TextField
              disabled={!isAdmin}
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
              disabled={!isAdmin}
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
            disabled={!isAdmin}
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
                disabled={!isAdmin}
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
                disabled={!isAdmin}
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
              disabled={!isAdmin}
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
          <Button
            className="m-2"
            onClick={() => {
              handleEditRoom();
            }}
            color="secondary"
          >
            Edit Room Data
          </Button>
        </div>
      </div>
    </>
  );
};

export default RoomData;
