import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import "./Home.css";

const Home = props => {
  const [userState, dispatch] = useContext(UserContext);

  return (
    <div className='home-page'>
      <h1>Dzień dobry</h1>
    </div>
  );
};

export default Home;
