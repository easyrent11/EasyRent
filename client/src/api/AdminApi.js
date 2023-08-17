import axios from "axios";
const BASE_URL_ADMIN = "http://localhost:3001/admin";


export const getOrdersStatistics = () => {
    return axios.get(`${BASE_URL_ADMIN}/getorderstatistics`);
}

export const getBestSellerUserThisMonth = () => {
    return axios.get(`${BASE_URL_ADMIN}/bestmonthlyseller`);
}