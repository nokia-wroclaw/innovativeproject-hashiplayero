import { useNavigate } from "react-router-dom";

const HeaderBarSite = () => {
  const navigate = useNavigate();

  return(
    <div className="main-navbar-logo">
      <button className="button-logo" onClick={() => navigate("/")}>
        <text className="logo-text-first">Hashi</text>
        <text className="logo-text-second">Playero</text>
      </button>
  </div>
  );
};

export default HeaderBarSite;
