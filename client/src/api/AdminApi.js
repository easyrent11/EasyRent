import axios from "axios";
const BASE_URL_ADMIN = "http://localhost:3001/admin";


export const getOrdersStatistics = () => {
    return axios.get(`${BASE_URL_ADMIN}/getorderstatistics`);
}

export const getBestSellerUserThisMonth = () => {
    return axios.get(`${BASE_URL_ADMIN}/bestmonthlyseller`);
}

export const getGraphData = () => {
    return axios.get(`${BASE_URL_ADMIN}/getgraphdata`);
}

export const insertActivity = (activityDetails) => {
    return axios.post(`${BASE_URL_ADMIN}/logActivity`, activityDetails);
}

export const getLatestActivities = () => {
    return axios.get(`${BASE_URL_ADMIN}/getlatestactivities`);

}