import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { createUser } from "../store/userSlice";
import Contact from "../components/Contact";
import Faq from "../components/Faq";
import { Button } from '@mui/material';

interface IButtonsInfo {
  label: string;
  navigation: string;
  isDisabled: boolean;
}

const buttons: IButtonsInfo[] = [
  {
    label: "Play",
    navigation: "/singleplay",
    isDisabled: false,
  },
  {
    label: "Create a room",
    navigation: "/createroom",
    isDisabled: true,
  },
  {
    label: "Find a room",
    navigation: "/findroom",
    isDisabled: false,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleButtonInteraction = (navigation: String, index: Number) => {

    navigate(`${navigation}`);
  };

  return (
    <>
      <div className="main-buttons paper">
        {
          buttons.map((button, index) => (
            <Button 
            disabled={button.isDisabled}
            key={index}
            onClick={() => handleButtonInteraction(button.navigation, index)} 
            color="secondary">
              {button.label}
            </Button>
          ))
        }
      </div>
      <Faq />
      <Contact />

    </>
  );
};

export default Dashboard;
