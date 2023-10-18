import axios from 'axios';
const BASE_URL = "http://localhost:3001/cars"; // cars api url.


// api call to fetch all cars.
export const getAllCars = () => {
  return axios.get(`${BASE_URL}/getallcars`);
}
// api call to fetch a car via plates number.
export const getCar = (PlatesNumber) => {
  return axios.get(`${BASE_URL}/getcar/${PlatesNumber}`);
} 
// api call to fetch a car via owner id.
export const getCarWithUserId = (userId) => {
  return axios.get(`${BASE_URL}/getcarwithuserid/${userId}`);
}
// api call to update car details.
export const updateCarDetails = (carDetails) => {
  return axios.put(`${BASE_URL}/updatecardetails`, carDetails);
}
// api call to upload a car's images.
export const uploadImages = (images) => {
  return axios.post(`${BASE_URL}/uploadImages`, images, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
// api call to fetch all car images.
export const getCarImages = (PlatesNumber) => {
  return axios.get(`${BASE_URL}/getallcarimages/${PlatesNumber}`);
}
// api call to update car images.
export const updateCarImages = (carDetails) => {
  return axios.post(`${BASE_URL}/insertimages`, carDetails);
}
// api call to delete old images.
export const deleteOldImages = (platesNumber) => {
  return axios.post(`${BASE_URL}/deleteoldimages`, platesNumber);
}
// api call to delete a car
export const deleteCar = (platesNumber) => {
  return axios.put(`${BASE_URL}/deletecar/${platesNumber}`);
};
// api call to check if a car is in use (exists in an order.)
export const carExistsInOrders = (platesNumber) => {
  return axios.get(`${BASE_URL}/carexistsinorders/${platesNumber}`);
};