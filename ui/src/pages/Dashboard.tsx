import React from "react";
import { NavLink } from "react-router-dom";

const Dashboard = () => (
  <div className="start-game">
    <ul>
      <li>
        <NavLink to="/singleplay">
          <button className="button-start-game" type="button">
            <div className="text-start-game text-center">Play</div>
          </button>
        </NavLink>
      </li>
      <li>
        <NavLink to="/createroom">
          <button className="button-start-game" type="button">
            <div className="text-start-game text-center">Create Room</div>
          </button>
        </NavLink>
      </li>
      <li>
        <NavLink to="/findroom">
          <button className="button-start-game" type="button">
            <div className="text-start-game text-center">Find a Room</div>
          </button>
        </NavLink>
      </li>
    </ul>
  </div>
);

export default Dashboard;
