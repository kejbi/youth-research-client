import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import "./Home.css";
import { NavContext } from "../../contexts/NavContext";

const Home = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [nav, dispatchNav] = useContext(NavContext);
  useEffect(() => {
    dispatchNav({ type: "CHANGE_TAB", tab: "1" });
    return () => {
      dispatch({ type: "MESSAGE_CLEAR" });
    };
  }, []);
  return (
    <div className='home-page'>
      <h1>Dzień dobry</h1>
    </div>
  );
};

export default Home;
