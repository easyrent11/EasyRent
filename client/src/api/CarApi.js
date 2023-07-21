import axios from 'axios';
const BASE_URL = "http://localhost:3001/cars";


//#######################################################################
//                                Cars apis.                            #
//#######################################################################

export const searchCars = (requestData) => {
  return axios.post(`${BASE_URL}/searchcar`, requestData);
};

export const getAllCars = () => {
  return axios.get(`${BASE_URL}/getallcars`);
}

// Make an API call to send the verification code to the user's email
const sendVerificationCode = (email) => axios.post(`${BASE_URL_USER}/sendVerificationCode`,email);
