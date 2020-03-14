import React, { useContext, useEffect } from "react";
import { Alert } from "reactstrap";
import { UserContext } from "../../contexts/UserContext";
import { useHistory } from "react-router-dom";

const PageAlert = props => {
  const [userState, dispatch] = useContext(UserContext);
  const history = useHistory();

  return (
    userState.message.displayMessage && (
      <Alert className={userState.message.type}>
        {userState.message.message}
      </Alert>
    )
  );
};

export default PageAlert;
