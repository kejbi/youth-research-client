import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { UserContext } from "../../contexts/UserContext";
import { Redirect } from "react-router-dom";
import { NavContext } from "../../contexts/NavContext";
import { GroupContext } from "../../contexts/GroupContext";

const Posts = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [nav, dispatchNav] = useContext(NavContext);
  const [groupId, dispatchGroup] = useContext(GroupContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (nav.tab !== "1") {
      dispatchNav({ type: "CHANGE_TAB", tab: "1" });
    }
    console.log(groupId);
    console.log(groupId === null);
    console.log(groupId);
    if (userState.user.isAuthenticated && groupId !== null) {
      setLoading(true);
      let config = {
        headers: {
          Authorization: "Bearer " + userState.user.token
        }
      };

      axios
        .get(
          `http://localhost:8080/post?groupId=${groupId}&page=${currentPage}`,
          config
        )
        .then(response => {
          setTotalPages(response.data.totalPages);
          setPosts(response.data.posts);
          setLoading(false);
        })
        .catch(error => {
          if (error.response.data.status === 401) {
            dispatch({ type: "TIMEOUT" });
          }
        });
    }
    return () => {
      if (!userState.user.isAuthenticated) {
        dispatch({
          type: "MESSAGE",
          payload: {
            message: "Musisz być zalogowany by oglądać posty",
            type: "warning"
          }
        });
      }
    };
  }, [currentPage, groupId]);

  return userState.user.isAuthenticated ? (
    <div>
      {posts.map(post => {
        return <div>{post.title}</div>;
      })}
    </div>
  ) : (
    <Redirect to='/logowanie' />
  );
};

export default Posts;
