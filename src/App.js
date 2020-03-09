import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import User from "./contexts/UserContext";
import Nav from "./components/nav/Nav";
import PageAlert from "./components/alert/PageAlert";
import Header from "./components/header/Header";

const App = props => {
  return (
    <Router>
      <User>
        <Header />
        <div class='container'>
          <Nav />
          <PageAlert />
          <Switch>
            <Route />
          </Switch>
        </div>
      </User>
    </Router>
  );
};

export default App;
