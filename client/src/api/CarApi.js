import Axios from 'axios';

const BASE_URL = 'http://localhost:3001/api'; // Replace with your actual API base URL


// Cars apis.
export const searchCars = (requestData) => {return Axios.post(`${BASE_URL}/cars/searchcar`, requestData);}

// Users apis.
export const register = (registerInfo) =>  {return Axios.post(`${BASE_URL}/users/register`, registerInfo);}
export const login = (loginInfo) =>  {return Axios.post(`${BASE_URL}/users/login`, loginInfo);}