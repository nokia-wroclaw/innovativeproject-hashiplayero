import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { createUser } from "../store/userSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleFindRoom = () => {
    dispatch(createUser());

    navigate("/findroom");
  };

  return (
    <div className="content-buttons">
      <button
        className="button-primary"
        onClick={() => navigate("/singleplay")}
      >
        Play
      </button>
      <button
        className="button-primary"
        onClick={() => navigate("/createroom")}
      >
        Create a room
      </button>
      <button className="button-primary" onClick={() => handleFindRoom()}>
        Find a room
      </button>
    </div>
  );
};

export default Dashboard;
