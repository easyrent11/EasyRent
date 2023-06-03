import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuthentication = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // User is not authenticated, redirect to login page or handle accordingly
      navigate('/');
    }

    // Set the token in the request headers for subsequent API calls
    axios.defaults.headers.common['Authorization'] = token;
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