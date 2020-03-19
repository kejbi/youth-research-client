import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Spinner, Input } from "reactstrap";
import "./GroupChanger.css";
import axios from "axios";
import { GroupContext } from "../../contexts/GroupContext";

const GroupChanger = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [groupState, dispatchGroup] = useContext(GroupContext);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  const handleChange = event => {
    console.log(event.target.value);
    dispatchGroup({ type: "CHANGE_GROUP", groupId: event.target.value });
  };

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
          setGroups(response.data);
          console.log(response);

          console.log(groups);
          if (groups !== []) {
            dispatchGroup({
              type: "CHANGE_GROUP",
              groupId: response.data[0].id
            });
          }
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
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
          <div className='group-pick'>
            <div>Grupa: </div>
            <Input
              onChange={handleChange}
              className='group-input'
              type='select'
              name='select-group'
            >
              {groups.map(group => {
                return <option value={group.id}>{group.name}</option>;
              })}
            </Input>
          </div>
        )}
      </div>
    )
  );
};

export default GroupChanger;
