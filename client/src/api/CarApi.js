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

export const uploadImages = (images) => {
  return axios.post(`${BASE_URL}/uploadImages`, images, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export const getCarImages = (PlatesNumber) => {
  return axios.get(`${BASE_URL}/getallcarimages/${PlatesNumber}`);
}
export const updateCarImages = (carDetails) => {
  return axios.post(`${BASE_URL}/insertimages`, carDetails);
}

export const deleteOldImages = (platesNumber) => {
  return axios.post(`${BASE_URL}/deleteoldimages`, platesNumber);
}
