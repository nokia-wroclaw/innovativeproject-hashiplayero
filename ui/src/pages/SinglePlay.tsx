import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import DifficultyInput from "../components/dynamic-components/DifficultyInput";
import BoardInput from "../components/dynamic-components/BardSizeInput";
import { BackgroundSvg } from "../components/svg/VectorGraphics";

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
  const { inSingleGame, isAdmin } = useSelector(
    (state: RootState) => state.StateMachine
  );

  const [values, setValues] = useState<State>({
    difficulty: 0,
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
    let nameOfRoom = "PrivateSinglePlayerRoom:" + user.uuid;
    if (webSocket !== undefined) {
      webSocket.send(
        JSON.stringify({
          action: "createRoom",
          data: {
            name: nameOfRoom,
            password: user.uuid,
            maxPlayers: 1,
            isPrivate: true,
            difficulty: values.difficulty,
            boardSize: values.boardSize,
          },
        })
      );
    }
    console.log("WebSocket -> Create Single Game");
  };

  useEffect(() => {
    if (inSingleGame && isAdmin) {
      navigate(`${roomAndBoard.name}`);
    }
  }, [inSingleGame, isAdmin, roomAndBoard, navigate]);

  return (
    <>
      <div className="form-container paper-create">
        <div className="general-info">
          <div className="form-element">
            <DifficultyInput
              value={values.difficulty}
              handleChange={handleChange("difficulty")}
              isAdmin={true}
            />
          </div>

          <div className="form-element">
            <BoardInput
              value={values.boardSize}
              handleChange={handleChange("boardSize")}
              isAdmin={true}
            />
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
        
        {/* <div className="background">
          <BackgroundSvg />
        </div> */}
      </div>

    </>
  );
};

export default SinglePlay;
