import { IRoomAndBoard } from "../interfaces/IRoomAndBoard";
import { IState } from "../interfaces/IState";
import {
  Button  
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/hooks";
import { setInitialRoomBoard } from "../store/RoomGameSlice";
import NameInput from "./dynamic-components/NameInput";
import PasswordInput from "./dynamic-components/PasswordInput";
import PlayersInput from "./dynamic-components/PlayersInput";
import DifficultyInput from "./dynamic-components/DifficultyInput";
import BoardInput from "./dynamic-components/BardSizeInput";
import { exitRoom } from "../store/StateMachineSlice";

const RoomData = ({
  room,
  isAdmin,
}: {
  room: IRoomAndBoard;
  isAdmin: boolean;
}) => {
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

  // mają istnieć wszystkie wartości, jeśli nie chce zmieniać to ma być wysłane to samo co było
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


  const handleStartGame = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "startGame",
          userUuid: user.uuid,
          data: {
            roomName: roomAndBoard.name,
          },
        })
      );
    }
  };

  const handleExitRoom = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "changeRoom",
          userUuid: user.uuid,
          data: {
            roomName: "lobby",
          },
        })
      );
      dispatch(setInitialRoomBoard());
      dispatch(exitRoom());
      console.log("WebSocket-> Change Room");
    }
  };

  const handleDeleteRoom = () => {
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "deleteRoom",
          userUuid: user.uuid,
          data: {
            roomName: roomAndBoard.name,
          },
        })
      );
    }
  };


  return (
    <>
      <div className="form-container paper">
        <div className="general-info">

          <div className="form-element">
            <NameInput value={values.roomNameInput} handleChange={handleChange("roomNameInput")} isAdmin={false} />
          </div>

          {
            isAdmin ?
              <div className="form-element">
                <PasswordInput value={values.passwordInput} handleChange={handleChange("passwordInput")} isAdmin={isAdmin} />
              </div> : null
          }

          <div className="form-element">
            <PlayersInput value={values.amountOfPlayersInput} handleChange={handleSliderChange} isAdmin={isAdmin} />
          </div>

          <div className="form-element">
            <DifficultyInput value={values.difficultyInput} handleChange={handleChange("difficultyInput")} isAdmin={isAdmin} />
          </div>

          <div className="form-element">
            <BoardInput value={values.boardSizeInput} handleChange={handleChange("boardSizeInput")} isAdmin={isAdmin} />
          </div>

          <Button
            className="m-2"
            onClick={() => {
              handleEditRoom();
            }}
            color="secondary"
          >
            Edit
          </Button>
          <Button
            className="m-2"
            onClick={() => {
              handleStartGame();
            }}
            color="secondary"
          >
            Start Game
          </Button>
          <Button
            className="m-2"
            onClick={() => {
              handleExitRoom();
            }}
            color="secondary"
          >
            Exit Room
          </Button>
          <Button
            className="m-2"
            onClick={() => {
              handleDeleteRoom();
            }}
            color="secondary"
          >
            Delete Room
          </Button>
        </div>
      </div>
    </>
  );
};

export default RoomData;
