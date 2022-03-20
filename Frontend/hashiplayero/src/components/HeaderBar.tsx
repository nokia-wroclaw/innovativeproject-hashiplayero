import React from "react";
import HeaderBarNav from "./HeaderBarNav";
import HeaderBarSite from "./HeaderBarSide";

const HeaderBar = () => (
  <header>
    <nav
      className="navbar has-background-dark is-dark"
      role="navigation"
      aria-label="main navigation"
    >
        <HeaderBarSite />
        <HeaderBarNav />
    </nav>
  </header>
);

export default HeaderBar;
