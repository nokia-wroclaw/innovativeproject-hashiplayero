import React from "react";
import { NavLink } from "react-router-dom";

const Dashboard = () => (
  <div>
    <p>Menu</p>
    <ul>
      <li>
        <NavLink to="/singleplay">Play</NavLink>
      </li>
      <li>
        <NavLink to="/createroom">Create Room</NavLink>
      </li>
      <li>
        <NavLink to="/findroom">Find a Room</NavLink>
      </li>
    </ul>
  </div>
);

export default Dashboard;
