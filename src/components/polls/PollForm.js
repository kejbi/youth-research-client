import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner
} from "reactstrap";
import axios from "axios";
import { BASE_URL } from "../../properties/consts";
import { GroupContext } from "../../contexts/GroupContext";

const PollForm = props => {
  const [userState, dispatchUser] = useContext(UserContext);
  const [groupId, dispatchGroup] = useContext(GroupContext);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    post: ""
  });

  const handleSubmit = event => {
    event.preventDefault();
    let config = {
      headers: {
        Authorization: "Bearer " + userState.user.token
      }
    };
    let body = {
      ...formState,
      groupId: groupId
    };
    setLoading(true);
    axios
      .post(`${BASE_URL}/post`, body, config)
      .then(response => {
        dispatchUser({
          type: "MESSAGE",
          payload: { message: "Pomyślnie dodano post", type: "success" }
        });
        props.update();
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        if (error.response === undefined) {
          dispatchUser({
            type: "MESSAGE",
            payload: { message: "Błąd serwera", type: "danger" }
          });
        } else if (error.response.data.status === 401) {
          dispatchUser({ type: "TIMEOUT" });
        } else {
          dispatchUser({
            type: "MESSAGE",
            payload: { message: "Coś poszło nie tak", type: "danger" }
          });
        }
      });
  };

  const handleChange = event => {
    setFormState({
      ...formState,
      [event.target.id]: event.target.value
    });
  };

  return (
    <div className='post-form'>
      {loading ? (
        <Spinner color='primary' />
      ) : (
        <Form onSubmit={handleSubmit}>
          <h3>Dodaj post</h3>
          <FormGroup row>
            <Label for='title' sm={2}>
              Tytuł
            </Label>
            <Col sm={10}>
              <Input
                value={formState.title}
                onChange={handleChange}
                type='text'
                id='title'
                placeholder='Tytuł posta'
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for='exampleText' sm={2}>
              Post
            </Label>
            <Col sm={10}>
              <Input
                value={formState.post}
                onChange={handleChange}
                type='textarea'
                name='post'
                id='post'
              />
            </Col>
          </FormGroup>
          <FormGroup check row>
            <Col sm={10}>
              <Button type='submit'>Submit</Button>
            </Col>
          </FormGroup>
        </Form>
      )}
    </div>
  );
};

export default PollForm;
