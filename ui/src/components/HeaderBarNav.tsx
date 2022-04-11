import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";

const HeaderBarNav = () => {
  const navigate = useNavigate();

  const { uuid, name } = useSelector((state: RootState) => state.defaultUser);

  return (
    <>
    { uuid !== 0 ? <div>Hello, {name}</div> : null}
      
      <div className="main-navbar-menu">
        <button className="button-secondary" onClick={() => navigate("/rules")}>
          Rules
        </button>
        <button
          className="button-secondary"
          onClick={() => navigate("/contact")}
        >
          Contact
        </button>
        <button className="button-secondary" onClick={() => navigate("/faq")}>
          FAQ
        </button>
        <button className="button-primary" onClick={() => navigate("/signup")}>
          Sign In
        </button>
      </div>
    </>
  );
};
export default HeaderBarNav;
