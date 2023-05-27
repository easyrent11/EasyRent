import Axios from 'axios';

const BASE_URL = 'http://localhost:3001/api'; // Replace with your actual API base URL


export const getCars = () => {return Axios.get(`${BASE_URL}/cars/searchcar`);}
export const searchCars = (requestData) => {return Axios.post(`${BASE_URL}/cars/searchcar`, requestData);}

