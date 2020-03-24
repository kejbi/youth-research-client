import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./Polls.css";
import { Spinner, Progress, Button } from "reactstrap";
import { UserContext } from "../../contexts/UserContext";
import { Redirect } from "react-router-dom";
import { NavContext } from "../../contexts/NavContext";
import { GroupContext } from "../../contexts/GroupContext";
import PollForm from "./PollForm";
import { BASE_URL } from "../../properties/consts";
import MyPagination from "../pagination/MyPagination";

const Polls = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [nav, dispatchNav] = useContext(NavContext);
  const [groupId, dispatchGroup] = useContext(GroupContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState([]);

  let config = {
    headers: {
      Authorization: "Bearer " + userState.user.token
    }
  };

  const updatePolls = () => {
    axios
      .get(`${BASE_URL}/poll?groupId=${groupId}&page=${currentPage}`, config)
      .then(response => {
        console.log(response.data);
        setTotalPages(response.data.totalPages);
        setPolls(response.data.polls);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        if (error.response === undefined) {
          dispatch({
            type: "MESSAGE",
            payload: { message: "Błąd serwera", type: "danger" }
          });
        } else if (error.response.data.status === 401) {
          dispatch({ type: "TIMEOUT" });
        } else {
          dispatch({
            type: "MESSAGE",
            payload: { message: "Coś poszło nie tak", type: "danger" }
          });
        }
      });
  };

  const handleDelete = event => {
    axios
      .delete(`${BASE_URL}/poll/${event.target.value}`, config)
      .then(response => {
        dispatch({
          type: "MESSAGE",
          payload: { message: "Pomyślnie usunięto post", type: "success" }
        });
        updatePolls();
      })
      .catch(error => {
        setLoading(false);
        if (error.response === undefined) {
          dispatch({
            type: "MESSAGE",
            payload: { message: "Błąd serwera", type: "danger" }
          });
        } else if (error.response.data.status === 401) {
          dispatch({ type: "TIMEOUT" });
        } else {
          dispatch({
            type: "MESSAGE",
            payload: { message: "Coś poszło nie tak", type: "danger" }
          });
        }
      });
  };

  const handleVote = event => {
    setLoading(true);
    axios
      .put(`${BASE_URL}/poll/`, { answerId: event.target.value }, config)
      .then(response => {
        dispatch({
          type: "MESSAGE",
          payload: { message: "Pomyślnie oddano głos", type: "success" }
        });
        updatePolls();
      });
  };

  const handlePageChange = pageNo => {
    setCurrentPage(pageNo);
    setLoading(true);
  };

  useEffect(() => {
    if (nav.tab !== "2") {
      dispatchNav({ type: "CHANGE_TAB", tab: "2" });
    }
    if (userState.user.isAuthenticated && groupId !== null) {
      setLoading(true);
      updatePolls();
    }

    return () => {
      if (!userState.user.isAuthenticated) {
        dispatch({
          type: "MESSAGE",
          payload: {
            message: "Musisz być zalogowany by oglądać ankiety",
            type: "warning"
          }
        });
      }
    };
  }, [currentPage, groupId]);

  return userState.user.isAuthenticated ? (
    <div className='posts'>
      {loading ? (
        <Spinner className='loading-spinner' color='primary' />
      ) : (
        <div className='posts'>
          {userState.user.role === "tutor" && <div />}
          {groupId && polls.length !== 0 ? (
            <div>
              {polls.map(poll => {
                return (
                  <div className='p-3 my-2 rounded'>
                    <div>
                      <h2>{poll.question}</h2>
                      <h5>Data rozpoczęcia: {poll.startDate}</h5>
                      <h5>Data zakończenia: {poll.finishDate}</h5>
                      <h6>Zagłosowało: {poll.totalVotes}</h6>
                      {poll.answers.map(answer => {
                        return (
                          <div>
                            <div className='text-center'>{answer.answer}</div>
                            <Progress
                              className='answer-progress'
                              value={
                                poll.totalVotes > 0
                                  ? (answer.votes / poll.totalVotes) * 100
                                  : 0
                              }
                            >
                              {poll.totalVotes > 0
                                ? (answer.votes / poll.totalVotes) * 100
                                : 0}
                              %
                            </Progress>
                            {userState.user.role === "member" && (
                              <Button
                                color='success'
                                onClick={handleVote}
                                value={answer.id}
                              >
                                Wybierz
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {userState.user.role === "tutor" && (
                      <Button
                        color='danger'
                        onClick={handleDelete}
                        value={poll.id}
                      >
                        Usuń
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='no-posts'>
              <h2>Nie ma postów do wyświetlenia na tej stronie</h2>
            </div>
          )}
          <MyPagination
            className='pages'
            current={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  ) : (
    <Redirect to='/logowanie' />
  );
};

export default Polls;
