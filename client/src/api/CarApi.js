import axios from 'axios';
const BASE_URL = "http://localhost:3001/cars";


//#######################################################################
//                                Cars apis.                            #
//#######################################################################

export const getAllCars = () => {
  return axios.get(`${BASE_URL}/getallcars`);
}
