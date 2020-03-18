import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Spinner, Input } from "reactstrap";
import "./GroupChanger.css";
import axios from "axios";

const GroupChanger = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  let content;

  useEffect(() => {
    if (userState.user.isAuthenticated) {
      setLoading(true);
      let config = {
        headers: {
          Authorization: "Bearer " + userState.user.token
        }
      };
      axios
        .get("http://localhost:8080/tutorsgroup/my", config)
        .then(response => {
          console.log(response.data);
          setGroups(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.log(error.response);
          if (error.response.data.status === 401) {
            dispatch({ type: "TIMEOUT" });
          }
        });
    }
  }, [userState.user.isAuthenticated]);

  return (
    userState.user.isAuthenticated && (
      <div className='group-changer'>
        {loading ? (
          <Spinner color='primary' />
        ) : (
          <Input
            className='group-input'
            type='select'
            name='select'
            id='exampleSelect'
          >
            {groups.map(group => {
              return <option>{group.name}</option>;
            })}
          </Input>
        )}
      </div>
    )
  );
};

export default GroupChanger;
