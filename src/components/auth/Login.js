import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { UserContext } from "../../contexts/UserContext";
import "./Auth.css";
import { Redirect } from "react-router-dom";
import { NavContext } from "../../contexts/NavContext";

const Login = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [nav, dispatchNav] = useContext(NavContext);
  const [formState, setFormState] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = event => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    });
  };
  const handleSubmit = event => {
    event.preventDefault();
    axios
      .post("http://localhost:8080/auth/login", formState)
      .then(response => {
        console.log(response.data);
        dispatch({
          type: "LOGIN",
          payload: {
            username: response.data.username,
            token: response.data.token,
            role: response.data.role
          }
        });
      })
      .catch(error => {
        console.log(error.response);
        if (error.response.data.message === "Bad credentials") {
          setError("Niepoprawne login lub hasło");
        }
      });
  };

  useEffect(() => {
    dispatchNav({ type: "CHANGE_TAB", tab: "2" });

    return () => {
      console.log(userState);
      if (userState.user.isAuthenticated) {
        dispatch({
          type: "MESSAGE",
          payload: {
            message:
              "Jesteś zalogowany! Wyloguj się by zalogować nowego użytkownika",
            type: "warning"
          }
        });
        console.log(userState);
      }
    };
  }, []);

  return userState.user.isAuthenticated ? (
    <Redirect to='/' />
  ) : (
    <Form onSubmit={handleSubmit}>
      <div className='error'>{error}</div>
      <FormGroup>
        <Label for='email'>Nazwa użytkownika:</Label>
        <Input
          type='text'
          name='username'
          id='username'
          value={formState.username}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <Label for='password'>Hasło:</Label>
        <Input
          type='password'
          name='password'
          id='password'
          value={formState.password}
          onChange={handleChange}
        />
      </FormGroup>

      <Button type='submit'>Submit</Button>
    </Form>
  );
};

export default Login;
