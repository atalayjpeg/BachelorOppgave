// Header.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
const css = require("../stylesheets/header.css");

interface HeaderProps {
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, toggleLogin }) => {
  return (
    <div className="z-1 position-absolute d-flex flex-row-reverse">
      {!isLoggedIn ? (
        <NavLink to="/login" className="mt-1 me-4 login-btn">
          <FontAwesomeIcon className="fs-4 text-white" icon={faRightToBracket} />
          <span className="login-btn-tooltip">Logg inn</span>
        </NavLink>
      ) : (
        <div onClick={toggleLogin} className="mt-1 me-4 logout-btn">
          <FontAwesomeIcon className="fs-4 text-white" icon={faRightFromBracket} />
          <span className="logout-btn-tooltip">Logg ut</span>
        </div>
      )}
    </div>
  );
};

export default Header;
