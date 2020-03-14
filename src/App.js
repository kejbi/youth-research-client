import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import User from "./contexts/UserContext";
import Navbar from "./components/nav/Nav";
import PageAlert from "./components/alert/PageAlert";
import Header from "./components/header/Header";
import Register from "./components/auth/Register";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";

const App = props => {
  return (
    <Router>
      <User>
        <div class='container'>
          <Header />
          <Navbar />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/logowanie' component={Login} />
            <Route exact path='/rejestracja' component={Register} />
          </Switch>
        </div>
      </User>
    </Router>
  );
};

export default App;
