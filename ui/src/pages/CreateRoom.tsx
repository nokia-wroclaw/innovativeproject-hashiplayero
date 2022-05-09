import { useEffect, useState } from "react";
import { IState } from "../interfaces/IState";
import {
  Button,
  TextField,
  Checkbox,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

import BoardInput from "../components/dynamic-components/BardSizeInput";
import DifficultyInput from "../components/dynamic-components/DifficultyInput";
import PlayersInput from "../components/dynamic-components/PlayersInput";
import PasswordInput from "../components/dynamic-components/PasswordInput";
import NameInput from "../components/dynamic-components/NameInput";

const CreateRoom = () => {

  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const navigate = useNavigate();

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

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValues({ ...values, amountOfPlayersInput: Number(newValue) });
  };

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

  return (
    <>
      <div className="form-container paper">
        <div className="general-info">

          <div className="form-element">
            <NameInput value={values.roomNameInput} handleChange={handleChange("roomNameInput")} isAdmin={true}/>
          </div>

          <div className="form-element">
            <PasswordInput value={values.passwordInput} handleChange={handleChange("passwordInput")} isAdmin={true}/>
          </div>

          <div className="form-element">
            <PlayersInput value={values.amountOfPlayersInput} handleChange={handleSliderChange} isAdmin={true}/>
          </div>

          <div className="form-element">
            <DifficultyInput value={values.difficultyInput} handleChange={handleChange("difficultyInput")} isAdmin={true}/>
          </div>

          <div className="form-element">
            <BoardInput value={values.boardSizeInput} handleChange={handleChange("boardSizeInput")} isAdmin={true}/>
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
            {/* <TimeInput value={values.timeLimitInput} timeEnable={values.enableTimeLimitInput} handleChange={setValues} values={values}/> */}
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
