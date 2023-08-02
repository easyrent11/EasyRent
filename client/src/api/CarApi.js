import axios from 'axios';
const BASE_URL = "http://localhost:3001/cars";


//#######################################################################
//                                Cars apis.                            #
//#######################################################################

export const getAllCars = () => {
  return axios.get(`${BASE_URL}/getallcars`);
}
export const getCar = (PlatesNumber) => {
  return axios.get(`${BASE_URL}/getcar/${PlatesNumber}`);
} 
export const getCarWithUserId = (userId) => {
  return axios.get(`${BASE_URL}/getcarwithuserid/${userId}`);
}

export const updateCarDetails = (carDetails) => {
  return axios.put(`${BASE_URL}/updatecardetails`, carDetails);
}
