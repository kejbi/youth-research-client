import React, { useContext } from "react";
import "./Header.css";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "reactstrap";

const Header = props => {
  const [userState, dispatch] = useContext(UserContext);
  console.log(userState);
  const logout = () => {
    dispatch({
      type: "LOGOUT"
    });
  };
  return (
    <header class='header'>
      <div class='name'>Nazwa programu</div>
      {userState.user.isAuthenticated && (
        <div class='auth-content'>
          <Button onClick={logout} className='logout-btn' color='primary'>
            Wyloguj
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
