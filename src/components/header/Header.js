import React, { useContext } from "react";
import "./Header.css";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "reactstrap";

const Header = props => {
  const [userState, dispatch] = useContext(UserContext);

  return (
    <header class='header'>
      <div class='name'>Nazwa programu</div>
      {userState.isAuthenticated && (
        <div class='auth-content'>
          <div>Zalogowany użytkownik: maniek12313{userState.username}</div>
          <Button className='logout-btn' color='primary'>
            Wyloguj
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
