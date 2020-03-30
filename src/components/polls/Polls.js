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
import Poll from "./Poll";

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
          payload: { message: "Pomyślnie usunięto ankietę", type: "success" }
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
          {userState.user.role === "tutor" && <PollForm update={updatePolls} />}
          {groupId && polls.length !== 0 ? (
            <div>
              {polls.map(poll => {
                return (
                  <div className='p-3 my-2 rounded'>
                    <Poll poll={poll} />
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
