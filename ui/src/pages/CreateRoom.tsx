import { useEffect, useState } from "react";
import { IState } from "../interfaces/IState";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

import BoardInput from "../components/dynamic-components/BardSizeInput";
import DifficultyInput from "../components/dynamic-components/DifficultyInput";
import PlayersInput from "../components/dynamic-components/PlayersInput";
import PasswordInput from "../components/dynamic-components/PasswordInput";
import NameInput from "../components/dynamic-components/NameInput";
import { ISnackbar } from "../interfaces/ISnackbar";
import CustomizedSnackbar from "../components/static-components/SnackBar";

import VisibilityInput from "../components/dynamic-components/VisibilityInput";
import { style } from "@mui/system";


const CreateRoom = () => {
  const { roomAndBoard } = useSelector((state: RootState) => state.RoomGame);
  const { user } = useSelector((state: RootState) => state.defaultUser);
  const { webSocket } = useSelector((state: RootState) => state.webSocket);
  const navigate = useNavigate();
  const { inWaitingRoom } = useSelector(
    (state: RootState) => state.StateMachine
  );

  const [values, setValues] = useState<IState>({
    amountOfPlayersInput: 2,
    roomNameInput: "",
    passwordInput: "",
    seedInput: "",
    difficultyInput: 2,
    boardSizeInput: 10,
    timeLimitInput: new Date(0),
    enableTimeLimitInput: false,
    isDisabled: false,
    isPrivate: true
  });

  const [snackbar, setSnackbar] = useState<ISnackbar>({
    open: false,
    message: "",
    severity: "success",
  });

  // const [checked, setChecked] = useState(true);

  // const handleVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setChecked(event.target.checked);
  // };

  useEffect(() => {
    if (inWaitingRoom) {
      navigate(`/waitingroom/${roomAndBoard.name}`);
    }
  }, [inWaitingRoom, navigate, roomAndBoard]);

  const handleChange = (prop: keyof IState) => (event: any) => {
    if (prop === "enableTimeLimitInput" || prop === "isPrivate") {
      setValues({ ...values, [prop]: event.target.checked });
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValues({ ...values, amountOfPlayersInput: Number(newValue) });
  };

  const handleCreateRoom = () => {
    if (values.roomNameInput === "") {
      setSnackbar({
        message: "Room name cannot be empty!",
        open: true,
        severity: "error",
      });
    } else {
      if (values.isPrivate){
          values.passwordInput="";
          console.log("prywatne!")
      }
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
              isPrivate: values.isPrivate,
              timeLimit: values.timeLimitInput.getMinutes(),
              difficulty: values.difficultyInput,
              boardSize: values.boardSizeInput,
            },
          })
        );
      }
    }

    console.log("WebSocket-> Create Room");
  };

  return (
    <>
      <div className="form-container paper-create">
        <div className="general-info">
          
          <div className="form-element">
            <NameInput
              value={values.roomNameInput}
              handleChange={handleChange("roomNameInput")}
              isAdmin={true}
            />
          </div>
        
          <div className="form-element">
            <PlayersInput
              value={values.amountOfPlayersInput}
              handleChange={handleSliderChange}
              isAdmin={true}
            />
          </div>
          <div className="form-elements">
            <div className="form-element">
              <DifficultyInput
                value={values.difficultyInput}
                handleChange={handleChange("difficultyInput")}
                isAdmin={true}
              />
            </div>
            <div className="form-element">
              <BoardInput
                value={values.boardSizeInput}
                handleChange={handleChange("boardSizeInput")}
                isAdmin={true}
              />
            </div>
          </div>
          <div className="form-elements-visibility">
            <div className="form-element-visibility">
              <VisibilityInput value={values.isPrivate} handleChange={handleChange("isPrivate")} />
            </div>
            <div className="form-element" style={{display: values.isPrivate ? 'block' : 'none' }}>
              {
                values.isPrivate ? 
                  <div className="form-element" >
                  <PasswordInput
                    value={values.passwordInput}
                    handleChange={handleChange("passwordInput")}
                    isAdmin={true}
                  />
                </div> : null
              }
            </div>
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
        
        {snackbar.open ? (
          <CustomizedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
        ) : null}
      </div>
    </>
  );
};

export default CreateRoom;
