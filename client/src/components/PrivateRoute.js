import React from 'react';
import {useNavigate } from 'react-router-dom';
import useAuthentication from './userAuthentication';

export default function PrivateRoute({ component: Component,openLogin,flag, ...rest }) {
  const { token } = useAuthentication();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === "true";

  if (!token) {
    navigate('/');
    openLogin();
    return null;
  }
  // check if the user is admin then he cant access normal user pages.
  if(isAdmin && !flag){
    navigate('/adminpage')
    return null;
  }

  return <Component {...rest} />;
};
