import axios from "axios";
const BASE_URL_USER = "http://localhost:3001/user";

//#######################################################################
//                                User apis.                            #
//#######################################################################
export const register = (registerInfo) => {
  return axios.post(`${BASE_URL_USER}/register`, registerInfo);
};
export const login = (loginInfo) => {
  return axios.post(`${BASE_URL_USER}/login`, loginInfo);
};
export const getAllUserDetails = (userId) =>
  axios.get(`${BASE_URL_USER}/getuser/${userId}`);

export const resetPassword = (info) =>
  axios.post(`${BASE_URL_USER}/changepassword`, info);

export const addCar = (carInfo) => {
  return axios.post(`${BASE_URL_USER}/addcar`, carInfo);
};

export const searchCars = (requestData) => {
  return axios.post(`${BASE_URL_USER}/searchcar`, requestData);
};

export const sendOrderRequest = (orderInfo) => {
  return axios.post(`${BASE_URL_USER}/ordercar`, orderInfo);
}


// // Make an API call to send the verification code to the user's email
// const sendVerificationCode = (email) => axios.post(`${BASE_URL_USER}/sendVerificationCode`,email);
