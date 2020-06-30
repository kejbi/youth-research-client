import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Redirect } from "react-router-dom";
import { NavContext } from "../../contexts/NavContext";
import TutorGroupRequest from "./TutorGroupRequest";
import MemberGroupRequests from "./MemberGroupRequests";

const GroupRequests = props => {
  const [userState, dispatch] = useContext(UserContext);
  const [nav, dispatchNav] = useContext(NavContext);

  useEffect(() => {
    if (nav.tab !== "4") {
      dispatchNav({ type: "CHANGE_TAB", tab: "4" });
    }

    return () => {
      if (!userState.user.isAuthenticated) {
        dispatch({
          type: "MESSAGE",
          payload: {
            message: "Musisz być zalogowany by oglądać prośby",
            type: "warning"
          }
        });
      }
    };
  }, []);

  return userState.user.isAuthenticated ? (
    <div className='posts'>
      <div>
        {userState.user.role === "tutor" ? (
          <TutorGroupRequest />
        ) : (
          <MemberGroupRequests />
        )}
      </div>
    </div>
  ) : (
    <Redirect to='/logowanie' />
  );
};

export default GroupRequests;
