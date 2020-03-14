import React, { useContext } from "react";
import { Alert } from "reactstrap";
import { UserContext } from "../../contexts/UserContext";
import "./PageAlert.css";

const PageAlert = props => {
  const [userState, dispatch] = useContext(UserContext);

  return (
    userState.message.displayMessage && (
      <Alert className='page-alert' color={userState.message.type}>
        {userState.message.message}
      </Alert>
    )
  );
};

export default PageAlert;
