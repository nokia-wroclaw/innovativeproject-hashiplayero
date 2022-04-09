import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="content-buttons">
      <button className="button-primary" onClick={() => navigate("/singleplay")}>Play</button>
      <button className="button-primary" onClick={() => navigate("/createroom")}>Create a room</button>
      <button className="button-primary" onClick={() => navigate("/findroom")}>Find a room</button>
  </div>
  )
};

export default Dashboard;
