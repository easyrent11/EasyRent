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
// Function to fetch orders with renter_id matching userId
export const getOrdersByRenterId = (userId) => {
  return axios.get(`${BASE_URL_USER}/getOrdersByRenterId/${userId}`);
};
// Function to fetch orders with rentee_id matching userId
export const getOrdersByRenteeId = (userId) => {
  return axios.get(`${BASE_URL_USER}/getOrdersByRenteeId/${userId}`);
};

export const getOrderById = (orderId) => {
  return axios.get(`${BASE_URL_USER}/orders/${orderId}`)
}

export const changeOrderStatus = (newOrderStatus) => {
  return axios.put(`${BASE_URL_USER}/changeorderstatus`,newOrderStatus);
}

export const checkUserDetailsExist = (userDetails) => {
  return axios.post(`${BASE_URL_USER}/userdetailsexist`, userDetails);
}

