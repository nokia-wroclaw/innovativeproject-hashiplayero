import { useNavigate } from "react-router-dom";

const HeaderBarNav = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="main-navbar-menu">
        <button className="button-secondary" onClick={() => navigate("/rules")}>Rules</button>
        <button className="button-secondary" onClick={() => navigate("/contact")}>Contact</button>
        <button className="button-secondary" onClick={() => navigate("/faq")}>FAQ</button>
        <button className="button-primary" onClick={() => navigate("/signup")}>Sign In</button>
      </div>
    </>
  );
};
export default HeaderBarNav;
