import React from "react";
import { NavLink } from "react-router-dom";

const HeaderBarNav = () => (
  <div className="navbar-menu">
    <div className="navbar-end">
      <div className="navbar-item">
          <NavLink className="button" to="/faq">
            FAQ
          </NavLink>
          <NavLink className="button" to="/contact">
            Contact
          </NavLink>
          <NavLink className="button" to="/rules">
            Rules
          </NavLink>
          <NavLink className="button" to="/signup">
            SignUp
          </NavLink>
          <NavLink className="button" to="/signin">
            Sign In
          </NavLink>
        </div>
      </div>
  </div>
);

export default HeaderBarNav;
