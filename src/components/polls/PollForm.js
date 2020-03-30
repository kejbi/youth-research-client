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
  const [answers, setAnswers] = useState([]);
  const [formState, setFormState] = useState({
    question: "",
    startDate: "",
    finishDate: ""
  });

  const handleSubmit = event => {
    event.preventDefault();
    let config = {
      headers: {
        Authorization: "Bearer " + userState.user.token
      }
    };
    let answersDTO = answers.map(answer => {
      return { answer: answer.text };
    });
    let body = {
      ...formState,
      answers: answersDTO,
      tutorsGroupId: groupId
    };
    setLoading(true);
    axios
      .post(`${BASE_URL}/poll`, body, config)
      .then(response => {
        dispatchUser({
          type: "MESSAGE",
          payload: { message: "Pomyślnie dodano ankietę", type: "success" }
        });
        props.update();
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
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

  const handleAnswerChange = event => {
    let current_answers = [...answers];
    current_answers[event.target.id].text = event.target.value;
    setAnswers(current_answers);
  };

  const addAnswer = event => {
    let size = answers.length;
    let current_answers = [...answers];
    current_answers.push({ no: size, text: "" });
    setAnswers(current_answers);
  };

  return (
    <div className='post-form'>
      {loading ? (
        <Spinner color='primary' />
      ) : (
        <Form onSubmit={handleSubmit}>
          <h3>Dodaj ankietę</h3>
          <FormGroup row>
            <Label for='title' sm={2}>
              Pytanie
            </Label>
            <Col sm={10}>
              <Input
                value={formState.question}
                onChange={handleChange}
                type='text'
                id='question'
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Data rozpoczęcia (RRRR-MM-DD GG:MM:SS)</Label>
            <Col sm={10}>
              <Input
                value={formState.startDate}
                onChange={handleChange}
                type='text'
                name='startDate'
                id='startDate'
                placeholder='RRRR-MM-DD GG:MM:SS'
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Data zakończenia (RRRR-MM-DD GG:MM:SS)</Label>
            <Col sm={10}>
              <Input
                value={formState.finishDate}
                onChange={handleChange}
                type='text'
                name='finishDate'
                id='finishDate'
                placeholder='RRRR-MM-DD GG:MM:SS'
              />
            </Col>
          </FormGroup>
          <div>Odpowiedzi:</div>
          {answers.map(answer => {
            return (
              <FormGroup row>
                <Col sm={10}>
                  <Input
                    value={answers[answer.no].text}
                    onChange={handleAnswerChange}
                    type='text'
                    name={answer.no}
                    id={answer.no}
                    key={answer.no}
                  />
                </Col>
              </FormGroup>
            );
          })}
          <Button className='mb-2' onClick={addAnswer}>
            Dodaj odpowiedź
          </Button>
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
