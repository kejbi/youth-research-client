import React, { useState, useContext, useEffect } from "react";
import { Spinner, Progress, Button } from "reactstrap";
import "./Polls.css";
import { UserContext } from "../../contexts/UserContext";
import classnames from "classnames";
import { BASE_URL } from "../../properties/consts";
import axios from "axios";

const Poll = (props) => {
  const [poll, setPoll] = useState(props.poll);
  const [loading, setLoading] = useState(false);
  const [userState, dispatch] = useContext(UserContext);

  let config = {
    headers: {
      Authorization: "Bearer " + userState.user.token,
    },
  };

  const handleVote = (event) => {
    setLoading(true);
    axios
      .put(`${BASE_URL}/poll/`, { answerId: event.target.value }, config)
      .then((response) => {
        dispatch({
          type: "MESSAGE",
          payload: { message: "Pomyślnie oddano głos", type: "success" },
        });
        console.log(response.data);
        setPoll(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response === undefined) {
          dispatch({
            type: "MESSAGE",
            payload: { message: "Błąd serwera", type: "danger" },
          });
        } else if (error.response.data.status === 401) {
          dispatch({ type: "TIMEOUT" });
        } else {
          dispatch({
            type: "MESSAGE",
            payload: { message: "Coś poszło nie tak", type: "danger" },
          });
        }
      });
  };

  useEffect(() => {
    setPoll(props.poll);
  }, [props.poll]);

  return loading ? (
    <Spinner className='loading-spinner' color='primary' />
  ) : (
    <div className={classnames({ "disabled-poll": !poll.active })}>
      <h2>{poll.question}</h2>
      <h5>Data rozpoczęcia: {poll.startDate}</h5>
      <h5>Data zakończenia: {poll.finishDate}</h5>
      <h6>Zagłosowało: {poll.totalVotes}</h6>
      {poll.answers.map((answer) => {
        return (
          <div>
            <div className='text-center'>{answer.answer}</div>
            <Progress
              className='answer-progress'
              value={
                poll.totalVotes > 0 ? (answer.votes / poll.totalVotes) * 100 : 0
              }
            >
              {poll.totalVotes > 0 ? (answer.votes / poll.totalVotes) * 100 : 0}
              %
            </Progress>
            {userState.user.role === "member" &&
              (poll.active ? (
                <Button color='success' onClick={handleVote} value={answer.id}>
                  Wybierz
                </Button>
              ) : (
                <Button color='success' disabled value={answer.id}>
                  Wybierz
                </Button>
              ))}
          </div>
        );
      })}
    </div>
  );
};

export default Poll;
