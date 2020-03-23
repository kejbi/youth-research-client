import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./Posts.css";
import {
  Spinner,
  Toast,
  ToastBody,
  ToastHeader,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import { UserContext } from "../../contexts/UserContext";
import { Redirect } from "react-router-dom";
import { NavContext } from "../../contexts/NavContext";
import { GroupContext } from "../../contexts/GroupContext";
import PostForm from "./PostForm";
import { BASE_URL } from "../../properties/consts";
import MyPagination from "../pagination/MyPagination";

const Posts = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [nav, dispatchNav] = useContext(NavContext);
  const [groupId, dispatchGroup] = useContext(GroupContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  let config = {
    headers: {
      Authorization: "Bearer " + userState.user.token
    }
  };

  const updatePosts = () => {
    axios
      .get(`${BASE_URL}/post?groupId=${groupId}&page=${currentPage}`, config)
      .then(response => {
        console.log(response.data.totalPages);
        setTotalPages(response.data.totalPages);
        setPosts(response.data.posts);
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
      .delete(`${BASE_URL}/post/${event.target.value}`, config)
      .then(response => {
        dispatch({
          type: "MESSAGE",
          payload: { message: "Pomyślnie usunięto post", type: "success" }
        });
        updatePosts();
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
  };

  useEffect(() => {
    if (nav.tab !== "1") {
      dispatchNav({ type: "CHANGE_TAB", tab: "1" });
    }
    if (userState.user.isAuthenticated && groupId !== null) {
      setLoading(true);
      updatePosts();
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
    <div className='posts'>
      {loading ? (
        <Spinner className='loading-spinner' color='primary' />
      ) : (
        <div>
          {userState.user.role === "tutor" && <PostForm update={updatePosts} />}
          {groupId && posts.length !== 0 ? (
            <div>
              {posts.map(post => {
                return (
                  <div className='p-3 my-2 rounded'>
                    <Toast className='post toast'>
                      <ToastHeader className='post-header'>
                        <div>
                          {post.title} #{post.date}
                        </div>
                      </ToastHeader>
                      <ToastBody>{post.post}</ToastBody>
                    </Toast>
                    {userState.user.role === "tutor" && (
                      <Button
                        color='danger'
                        onClick={handleDelete}
                        value={post.id}
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

export default Posts;
