import { useEffect } from 'react';
import {useNavigate } from 'react-router-dom';

const useAuthentication = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // User is not authenticated, redirect to login page or handle accordingly
      navigate('/login');
    }
  }, [navigate]);

  // Optionally, you can return the token or user data if needed in your components
  const token = localStorage.getItem('token');
  // const user = ... fetch user data based on the token

  return {
    token,
    // user
  };
};

export default useAuthentication;
