import React, { useState, useContext, useEffect } from "react";
import { Spinner, Toast, ToastHeader, ToastBody, Button } from "reactstrap";
import { UserContext } from "../../contexts/UserContext";
import { BASE_URL } from "../../properties/consts";
import axios from "axios";
import { GroupContext } from "../../contexts/GroupContext";
import { Redirect } from "react-router-dom";

const MemberGroupRequests = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [groupId, dispatchGroup] = useContext(GroupContext);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  let config = {
    headers: {
      Authorization: "Bearer " + userState.user.token
    }
  };

  const updateGroups = () => {
    axios
      .get(`${BASE_URL}/tutorsgroup/joinable`, config)
      .then(response => {
        console.log(response.data);
        setGroups(response.data);
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

  const createRequest = event => {
    setLoading(true);
    axios
      .post(
        `${BASE_URL}/tutorsgroup/request?groupId=${event.target.value}`,
        {},
        config
      )
      .then(response => {
        dispatch({
          type: "MESSAGE",
          payload: { message: "Pomyślnie złożono prośbę", type: "success" }
        });
        updateGroups();
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
    if (userState.user.isAuthenticated) {
      setLoading(true);
      updateGroups();
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
          {groups.length !== 0 ? (
            <div>
              {groups.map(group => {
                return (
                  <div className='p-3 my-2 rounded'>
                    <Toast>
                      <ToastHeader>{group.name}</ToastHeader>
                      <ToastBody>
                        {group.tutorName} {group.tutorSurname}
                      </ToastBody>
                    </Toast>
                    <Button
                      color='success'
                      onClick={createRequest}
                      value={group.id}
                    >
                      Chcę dołączyć!
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='no-posts'>
              <h2>Nie ma grup do wyświetlenia na tej stronie</h2>
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <Redirect to='/logowanie' />
  );
};

export default MemberGroupRequests;
