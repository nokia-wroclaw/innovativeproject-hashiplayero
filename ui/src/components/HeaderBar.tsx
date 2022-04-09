import React from "react";
import HeaderBarNav from "./HeaderBarNav";
import HeaderBarSite from "./HeaderBarSide";

const HeaderBar = () => (
  <header>
    <nav
      className="main-navbar"
      role="navigation"
      aria-label="main navigation"
    >
        <HeaderBarSite />
        <HeaderBarNav />
    </nav>
  </header>
);

export default HeaderBar;
