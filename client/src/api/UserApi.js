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
