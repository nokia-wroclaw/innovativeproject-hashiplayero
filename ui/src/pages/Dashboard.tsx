import { useNavigate } from "react-router-dom";
import Contact from "../components/Contact";
import Faq from "../components/Faq";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface IButtonsInfo {
  label: string;
  navigation: string;
  isDisabled: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { inSingleGame, inMultiGame, inWaitingRoom, isAdmin } = useSelector(
    (state: RootState) => state.StateMachine
  );

  const handleButtonInteraction = (navigation: String, index: Number) => {
    navigate(`${navigation}`);
  };

  const buttons: IButtonsInfo[] = [
    {
      label: "Play",
      navigation: "/singleplay",
      isDisabled: inMultiGame,
    },
    {
      label: "Create a room",
      navigation: "/createroom",
      isDisabled: inSingleGame || inMultiGame || (inWaitingRoom && !isAdmin),
    },
    {
      label: "Find a room",
      navigation: "/findroom",
      isDisabled: inSingleGame || inMultiGame || (inWaitingRoom && isAdmin),
    },
  ];

  return (
    <>
      <div className="main-buttons paper">
        {buttons.map((button, index) => (
          <Button
            disabled={button.isDisabled}
            key={index}
            onClick={() => handleButtonInteraction(button.navigation, index)}
            color="secondary"
          >
            {button.label}
          </Button>
        ))}
      </div>
      <Faq />
      <Contact />
    </>
  );
};

export default Dashboard;
