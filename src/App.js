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
import NavContextProvider from "./contexts/NavContext";
import GroupChanger from "./components/group_changer/GroupChanger";
import GroupContextProvider from "./contexts/GroupContext";
import Posts from "./components/posts/Posts";

const App = props => {
  return (
    <Router>
      <User>
        <div class='container'>
          <Header />
          <NavContextProvider>
            <Navbar />
            <PageAlert />
            <GroupContextProvider>
              <GroupChanger />
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/logowanie' component={Login} />
                <Route exact path='/rejestracja' component={Register} />
                <Route exact path='/posty' component={Posts} />
              </Switch>
            </GroupContextProvider>
          </NavContextProvider>
        </div>
      </User>
    </Router>
  );
};

export default App;
