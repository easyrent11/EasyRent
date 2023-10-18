import axios from "axios";
const BASE_URL_ADMIN = "http://localhost:3001/admin"; // the admin api url

// api call to fetchc order statistics from the backend.
export const getOrdersStatistics = () => {
    return axios.get(`${BASE_URL_ADMIN}/getorderstatistics`);
}
// api call to fetch the best seller of the month.
export const getBestSellerUserThisMonth = () => {
    return axios.get(`${BASE_URL_ADMIN}/bestmonthlyseller`);
}
// api call to fetch all graph data.
export const getGraphData = () => {
    return axios.get(`${BASE_URL_ADMIN}/getgraphdata`);
}
// api call to log a user's activity
export const insertActivity = (activityDetails) => {
    return axios.post(`${BASE_URL_ADMIN}/logActivity`, activityDetails);
}
// api call to fetch the latest activities in the website.
export const getLatestActivities = () => {
    return axios.get(`${BASE_URL_ADMIN}/getlatestactivities`);

}