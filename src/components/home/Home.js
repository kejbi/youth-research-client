import React, { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const Home = props => {
  const [userState, dispatch] = useContext(UserContext);

  return (
    <div>
      <h1>Dzień dobry</h1>
    </div>
  );
};

export default Home;
