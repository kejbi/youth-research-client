import React, { useContext, useState } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import "./Nav.css";
import { UserContext } from "../../contexts/UserContext";
import classnames from "classnames";

const Navbar = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [active, setActive] = useState("1");

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  return (
    <Nav tabs className='navbar'>
      <NavItem className='navbar-item'>
        <NavLink
          className={classnames({ active: active === "1" })}
          onClick={() => toggle("1")}
        >
          Witaj!
        </NavLink>
      </NavItem>
      <NavItem className='navbar-item'>
        <NavLink
          className={classnames({ active: active === "2" })}
          onClick={() => toggle("2")}
        >
          Zaloguj
        </NavLink>
      </NavItem>
      <NavItem className='navbar-item'>
        <NavLink
          className={classnames({ active: active === "3" })}
          onClick={() => toggle("3")}
        >
          Zarejestruj
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default Navbar;
