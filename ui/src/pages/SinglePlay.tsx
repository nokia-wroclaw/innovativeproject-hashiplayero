import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Checkbox,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import DifficultyInput from "../components/dynamic-components/DifficultyInput";
import BoardInput from "../components/dynamic-components/BardSizeInput";

interface State {
  difficulty: number;
  boardSize: number;
  timeLimit: Date;
  showTimeLimit: boolean;
  seedInput: string;
  showSeedInput: boolean;
  enableTimeLimit: boolean;
  isPrivate: boolean;
}

const SinglePlay = () => {
  const navigate = useNavigate();
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  
  const [values, setValues] = useState<State>({
    difficulty: 2,
    boardSize: 7,
    timeLimit: new Date(0),
    seedInput: "",
    showTimeLimit: false,
    showSeedInput: false,
    enableTimeLimit: false,
    isPrivate: false,
  });

  const handleChange = (prop: keyof State) => (event: any) => {
    if (prop === "enableTimeLimit") {
      setValues({ ...values, [prop]: event.target.checked });
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }
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
    if (roomAndBoard.name !== "name" && roomAndBoard.array.length !== 0 && roomAndBoard.settings.size !== null) {
      navigate(`${roomAndBoard.name}`);
    }
  }, [roomAndBoard, navigate]);

  return (
    <>
      <div className="form-container paper">
        <div className="general-info">

          <div className="form-element">
            <DifficultyInput value={values.difficulty} handleChange={handleChange("difficulty")} isAdmin={true} />
          </div>

          <div className="form-element">
            <BoardInput value={values.boardSize} handleChange={handleChange("boardSize")} isAdmin={true} />
          </div>

          <div className="form-elements">
            <div className="form-element-checkbox">
              <span>Time</span>
              <Checkbox
                checked={values.enableTimeLimit}
                onChange={handleChange("enableTimeLimit")}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
            <div className="form-element-time">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileTimePicker
                  views={["minutes", "seconds"]}
                  ampm={false}
                  inputFormat="mm:ss"
                  mask="__:__"
                  label="Minutes and seconds"
                  value={values.timeLimit}
                  disabled={values.enableTimeLimit}
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
