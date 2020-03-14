import React, { useContext, useState } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { UserContext } from "../../contexts/UserContext";
import "./Auth.css";

const Login = props => {
  const [userState, dispatch] = useContext(UserContext);
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
        setError(error.response.data.message);
      });
  };

  return (
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
