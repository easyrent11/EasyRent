import React from 'react';
import {useNavigate } from 'react-router-dom';

export default function NoAccountPrivateRoute({ component: Component, ...rest }) {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === "true";

  // check if the user is admin then he cant access normal user pages.
  if(isAdmin){
    navigate('/adminpage')
    return null;
  }

  return <Component {...rest} />;
};
