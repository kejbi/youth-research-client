import React, { useContext, useState } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import "./Nav.css";
import { UserContext } from "../../contexts/UserContext";
import classnames from "classnames";
import { useHistory, Link } from "react-router-dom";

const Navbar = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [active, setActive] = useState("1");

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  let links;
  if (userState.user.isAuthenticated) {
    links = {
      one: (
        <NavLink
          tag={Link}
          className={classnames({ active: active === "1" })}
          onClick={() => toggle("1")}
        >
          Posty
        </NavLink>
      ),
      two: (
        <NavLink
          className={classnames({ active: active === "2" })}
          onClick={() => toggle("2")}
        >
          Ankiety
        </NavLink>
      ),
      three: (
        <NavLink
          className={classnames({ active: active === "3" })}
          onClick={() => toggle("3")}
        >
          Oceny
        </NavLink>
      )
    };
  } else {
    links = {
      one: (
        <NavLink
          tag={Link}
          to='/'
          className={classnames({ active: active === "1" })}
          onClick={() => toggle("1")}
        >
          Witaj
        </NavLink>
      ),
      two: (
        <NavLink
          tag={Link}
          to='/logowanie'
          className={classnames({ active: active === "2" })}
          onClick={() => toggle("2")}
        >
          Logowanie
        </NavLink>
      ),
      three: (
        <NavLink
          tag={Link}
          to='/rejestracja'
          className={classnames({ active: active === "3" })}
          onClick={() => toggle("3")}
        >
          Rejestracja
        </NavLink>
      )
    };
  }

  return (
    <Nav tabs>
      <NavItem className='navbar-item'>{links.one}</NavItem>
      <NavItem className='navbar-item'>{links.two}</NavItem>
      <NavItem className='navbar-item'>{links.three}</NavItem>
    </Nav>
  );
};

export default Navbar;
