import React from "react";
import { NavLink } from "react-router-dom";

const HeaderBarSite = () => (
  <div className="navbar-brand">
    <a
      className="navbar-item"
      href="https://en.wikipedia.org/wiki/Hashiwokakero"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i>Ikona gry</i>
    </a>
    <NavLink to="/" className="navbar-item nav-home">
      <span className="">Hashi</span>
    </NavLink>
    <button
      className="link navbar-burger burger"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbarBasicExample"
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </button>
  </div>
);

export default HeaderBarSite;
