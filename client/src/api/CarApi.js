import axios from 'axios';
const BASE_URL = "http://localhost:3001/cars";
const BASE_URL_USER = "http://localhost:3001/user";

//#######################################################################
//                                Cars apis.                            #
//#######################################################################

export const searchCars = (requestData) => {
  return axios.post(`${BASE_URL}/searchcar`, requestData);
};

export const getAllCars = () => {
  return axios.get(`${BASE_URL}/getallcars`);
}

export const addCar = (carInfo) => {
  return axios.post(`${BASE_URL_USER}/addcar`, carInfo);
}

// export async function fetchManufacturers() {
//   try {
//     const response = await axios.get(`${BASE_URL}/api/manufacturers`);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch car manufacturers:', error);
//     throw error;
//   }
// }

// export async function fetchModels(manufacturerId) {
//   try {
//     const response = await axios.get(`${BASE_URL}/api/models/${manufacturerId}`)
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch car models:', error);
//     throw error;
//   }
// }


// Users apis.
export const register = (registerInfo) => {
  return axios.post(`${BASE_URL_USER}/register`, registerInfo);
};
export const login = (loginInfo) => {
  return axios.post(`${BASE_URL_USER}/login`, loginInfo);
};
