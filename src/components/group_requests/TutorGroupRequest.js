import React, { useState, useContext, useEffect } from "react";
import { Spinner, Toast, ToastHeader, ToastBody, Button } from "reactstrap";
import { UserContext } from "../../contexts/UserContext";
import { BASE_URL } from "../../properties/consts";
import axios from "axios";
import { GroupContext } from "../../contexts/GroupContext";
import { Redirect } from "react-router-dom";

const TutorGroupRequest = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [groupId, dispatchGroup] = useContext(GroupContext);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  let config = {
    headers: {
      Authorization: "Bearer " + userState.user.token
    }
  };

  const updateRequests = () => {
    axios
      .get(`${BASE_URL}/tutorsgroup/requests?groupId=${groupId}`, config)
      .then(response => {
        console.log(response.data);
        setRequests(response.data);
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

  const acceptRequest = event => {
    setLoading(true);
    axios
      .put(`${BASE_URL}/tutorsgroup/requests/${event.target.value}`, {}, config)
      .then(response => {
        console.log(response);
        updateRequests();
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
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

  useEffect(() => {
    if (userState.user.isAuthenticated && groupId !== null) {
      setLoading(true);
      updateRequests();
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
  }, [groupId]);

  return userState.user.isAuthenticated ? (
    <div className='posts'>
      {loading ? (
        <Spinner className='loading-spinner' color='primary' />
      ) : (
        <div className='posts'>
          {groupId && requests.length !== 0 ? (
            <div>
              {requests.map(request => {
                return (
                  <div className='p-3 my-2 rounded'>
                    <Toast>
                      <ToastHeader>{request.username}</ToastHeader>
                      <ToastBody>
                        {request.name} {request.surname}
                      </ToastBody>
                    </Toast>
                    <Button
                      color='success'
                      onClick={acceptRequest}
                      value={request.requestId}
                    >
                      Zaakceptuj
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='no-posts'>
              <h2>Nie ma próśb do wyświetlenia na tej stronie</h2>
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <Redirect to='/logowanie' />
  );
};

export default TutorGroupRequest;
