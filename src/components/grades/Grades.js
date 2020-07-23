import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  Spinner,
  Table,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Label,
  Input,
  FormGroup,
} from "reactstrap";
import { UserContext } from "../../contexts/UserContext";
import { Redirect } from "react-router-dom";
import { NavContext } from "../../contexts/NavContext";
import { GroupContext } from "../../contexts/GroupContext";
import { BASE_URL } from "../../properties/consts";

const Grades = (props) => {
  const [userState, dispatch] = useContext(UserContext);
  const [nav, dispatchNav] = useContext(NavContext);
  const [groupId, dispatchGroup] = useContext(GroupContext);
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [gradesToAdd, setGradesToAdd] = useState([]);
  const [addGradeModal, setAddGradeModal] = useState(false);
  const [singleGradeForm, setSingleGradeForm] = useState({
    title: "",
    score: 0,
  });
  const [currUserId, setCurrUserId] = useState(0);

  const config = {
    headers: {
      Authorization: "Bearer " + userState.user.token,
    },
  };

  const toggleAddGradeModal = () => setAddGradeModal(!addGradeModal);

  const handleSingleGradeChange = (event) => {
    setSingleGradeForm({
      ...singleGradeForm,
      [event.target.id]: event.target.value,
    });
  };

  const addCurrUser = (event) => {
    console.log("change");
    setCurrUserId(event.target.id);
  };

  const updateGrades = () => {
    axios
      .get(`${BASE_URL}/grades/total_score?groupId=${groupId}`, config)
      .then((response) => {
        setGrades(response.data);
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
          console.log(error.response.data);
          dispatch({
            type: "MESSAGE",
            payload: { message: "Coś poszło nie tak", type: "danger" },
          });
        }
      });
  };

  const addGrade = (event) => {
    event.preventDefault();
    setLoading(true);
    const body = {
      memberId: currUserId,
      groupId: groupId,
      ...singleGradeForm,
    };
    axios
      .post(`${BASE_URL}/grades`, body, config)
      .then((response) => {
        dispatch({
          type: "MESSAGE",
          payload: { message: "Pomyślnie dodano ocenę", type: "success" },
        });
        updateGrades();
      })
      .catch((error) => {
        console.log(error.response);
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

  const handleDelete = (event) => {
    axios
      .delete(`${BASE_URL}/grades/${event.target.value}`, config)
      .then((response) => {
        dispatch({
          type: "MESSAGE",
          payload: { message: "Pomyślnie usunięto post", type: "success" },
        });
        updateGrades();
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
    if (nav.tab !== "3") {
      dispatchNav({ type: "CHANGE_TAB", tab: "3" });
    }
    if (userState.user.isAuthenticated && groupId !== null) {
      setLoading(true);
      updateGrades();
    }

    return () => {
      if (!userState.user.isAuthenticated) {
        dispatch({
          type: "MESSAGE",
          payload: {
            message: "Musisz być zalogowany by oglądać posty",
            type: "warning",
          },
        });
      }
    };
  }, [groupId]);

  return userState.user.isAuthenticated ? (
    <div className='posts'>
      {loading ? (
        <Spinner className='loading-spinner' color='primary' />
      ) : (
        <div className=''>
          <Modal isOpen={addGradeModal} toggle={toggleAddGradeModal}>
            <ModalHeader toggle={toggleAddGradeModal}>Dodaj ocenę</ModalHeader>
            <ModalBody>
              <Form onSubmit={addGrade}>
                <FormGroup>
                  <Label for='title'>Tytuł</Label>
                  <Input
                    type='text'
                    id='title'
                    onChange={handleSingleGradeChange}
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Label for='score'>Ocena</Label>
                  <Input
                    type='number'
                    id='score'
                    onChange={handleSingleGradeChange}
                  ></Input>
                </FormGroup>
                <Button type='submit' onClick={toggleAddGradeModal}>
                  Dodaj
                </Button>
              </Form>
            </ModalBody>
          </Modal>
          <Table striped>
            <thead>
              <tr>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Suma punktów</th>
                {userState.user.role === "tutor" && <th></th>}
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => {
                return (
                  <tr>
                    <td>{grade.name}</td>
                    <td>{grade.surname}</td>
                    <td>{grade.score}</td>
                    {userState.user.role === "tutor" && (
                      <td>
                        <Button
                          color='success'
                          id={grade.memberId}
                          onClick={(event) => {
                            addCurrUser(event);
                            toggleAddGradeModal();
                          }}
                        >
                          Dodaj
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  ) : (
    <Redirect to='/logowanie' />
  );
};

export default Grades;
