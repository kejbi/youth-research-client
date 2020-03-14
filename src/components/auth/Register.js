import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import "./Auth.css";
import { Redirect } from "react-router-dom";
import { NavContext } from "../../contexts/NavContext";

const Register = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [nav, dispatchNav] = useContext(NavContext);
  const [formState, setFormState] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    tutor: false,
    secret: ""
  });
  const [error, setError] = useState("");

  const checkChange = event => {
    setFormState({
      ...formState,
      [event.target.name]: !formState.tutor
    });
  };
  const handleChange = event => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    });
  };
  const handleSubmit = event => {
    event.preventDefault();
    axios
      .post("http://localhost:8080/auth/register", formState)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.response);
        setError(error.response.data.message);
      });
  };

  useEffect(() => {
    dispatchNav({ type: "CHANGE_TAB", tab: "3" });
    return () => {
      console.log(userState);
      if (userState.user.isAuthenticated) {
        dispatch({
          type: "MESSAGE",
          payload: {
            message:
              "Jesteś zalogowany! Wyloguj się by zarejestrować nowego użytkownika",
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
        <Label for='email'>Imię:</Label>
        <Input
          type='text'
          name='name'
          id='name'
          value={formState.name}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for='surname'>Nazwisko:</Label>
        <Input
          type='text'
          name='surname'
          id='surname'
          value={formState.surname}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for='email'>Email:</Label>
        <Input
          type='email'
          name='email'
          id='email'
          placeholder='Email'
          value={formState.email}
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
      <FormGroup check>
        <Label check>
          <Input
            type='checkbox'
            name='tutor'
            id='tutor'
            value={formState.tutor}
            onChange={checkChange}
          />{" "}
          Wychowawca?
        </Label>
      </FormGroup>
      <FormGroup>
        <Label for='secret'>Sekret (tylko dla wychowawców):</Label>
        <Input
          type='password'
          name='secret'
          id='secret'
          value={formState.secret}
          onChange={handleChange}
        />
      </FormGroup>
      <Button type='submit'>Submit</Button>
    </Form>
  );
};

export default Register;
