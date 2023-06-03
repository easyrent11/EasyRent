import Axios from 'axios';

const BASE_URL = 'http://localhost:3001/cars';
const BASE_URL_USER = 'http://localhost:3001/user'; 


// Cars apis.
export const searchCars = (requestData) => {return Axios.post(`${BASE_URL}/searchcar`, requestData);}

// Users apis.
export const register = (registerInfo) =>  {return Axios.post(`${BASE_URL_USER}/register`, registerInfo);}
export const login = (loginInfo) =>  {return Axios.post(`${BASE_URL_USER}/login`, loginInfo);}