import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { createUser } from "../store/userSlice";
import Contact from "../components/Contact";

import { Button } from '@mui/material';

const buttons = [
  {
    label: "Play",
    navigation: "/singleplay",
  },
  {
    label: "Create a room",
    navigation: "/createroom",
  },
  {
    label: "Find a room",
    navigation: "/findroom",
  },
];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleButtonInteraction = (navigation: String, index: Number) => {

    if (index == 2) dispatch(createUser());
    navigate(`${navigation}`);
  };

  return (
    <>
      <div className="main-buttons paper">
        {
          buttons.map((button, index) => (
            <Button key={index} onClick={() => handleButtonInteraction(button.navigation, index)} color="secondary">
              {button.label}
            </Button>
          ))
        }
      </div>

      <Contact />

    </>
  );
};

export default Dashboard;
