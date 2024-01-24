import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuthentication = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === "true";
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      // User is not authenticated, redirect to login page or handle accordingly
      navigate('/');
    }
    // Set the token in the request headers for subsequent API calls
    axios.defaults.headers.common['Authorization'] = token;
  }, [navigate]);




  return {
    token,
    isAdmin
  };
};

export default useAuthentication;