import React, { useContext } from "react";
import { Alert } from "reactstrap";
import { UserContext } from "../../contexts/UserContext";

const PageAlert = props => {
  const [state, dispatch] = useContext(UserContext);
  return <Alert></Alert>;
};

export default PageAlert;
