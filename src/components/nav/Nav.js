import React, { useContext, useState } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import "./Nav.css";
import { UserContext } from "../../contexts/UserContext";
import classnames from "classnames";
import { NavContext } from "../../contexts/NavContext";

import { Link } from "react-router-dom";

const Navbar = (props) => {
  const [userState, dispatch] = useContext(UserContext);
  const [nav, dispatchNav] = useContext(NavContext);

  const toggle = (tab) => {
    if (nav.tab !== tab) {
      dispatchNav({ type: "CHANGE_TAB", tab: tab });
      dispatch({ type: "MESSAGE_CLEAR" });
    }
  };

  let links;
  if (userState.user.isAuthenticated) {
    links = {
      one: (
        <NavLink
          tag={Link}
          to='/posty'
          className={classnames({ active: nav.tab === "1" })}
          onClick={() => toggle("1")}
        >
          Posty
        </NavLink>
      ),
      two: (
        <NavLink
          tag={Link}
          to='/ankiety'
          className={classnames({ active: nav.tab === "2" })}
          onClick={() => toggle("2")}
        >
          Ankiety
        </NavLink>
      ),
      three: (
        <NavLink
          tag={Link}
          to='/oceny'
          className={classnames({ active: nav.tab === "3" })}
          onClick={() => toggle("3")}
        >
          Oceny
        </NavLink>
      ),
      four: (
        <NavLink
          tag={Link}
          to='/grupy'
          className={classnames({ active: nav.tab === "4" })}
          onClick={() => toggle("4")}
        >
          Grupy
        </NavLink>
      ),
    };
  } else {
    links = {
      one: (
        <NavLink
          tag={Link}
          to='/'
          className={classnames({ active: nav.tab === "1" })}
          onClick={() => toggle("1")}
        >
          Witaj
        </NavLink>
      ),
      two: (
        <NavLink
          tag={Link}
          to='/logowanie'
          className={classnames({ active: nav.tab === "2" })}
          onClick={() => toggle("2")}
        >
          Logowanie
        </NavLink>
      ),
      three: (
        <NavLink
          tag={Link}
          to='/rejestracja'
          className={classnames({ active: nav.tab === "3" })}
          onClick={() => toggle("3")}
        >
          Rejestracja
        </NavLink>
      ),
    };
  }

  return (
    <Nav tabs>
      <NavItem className='navbar-item'>{links.one}</NavItem>
      <NavItem className='navbar-item'>{links.two}</NavItem>
      <NavItem className='navbar-item'>{links.three}</NavItem>
      <NavItem className='navbar-item'>{links.four}</NavItem>
    </Nav>
  );
};

export default Navbar;
