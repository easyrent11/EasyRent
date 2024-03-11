import axios from "axios";
const BASE_URL_USER = "http://localhost:3001/user"; // user api url.

// api function to register a user.
export const register = (registerInfo) => {
  return axios.post(`${BASE_URL_USER}/register`, registerInfo);
};
// api function to login a user.
export const login = (loginInfo) => {
  return axios.post(`${BASE_URL_USER}/login`, loginInfo);
};

// api function to fetch all user details.
export const getAllUserDetails = (userId) => axios.get(`${BASE_URL_USER}/getuser/${userId}`);

// api function to reset a user's password
export const resetPassword = (info) => axios.post(`${BASE_URL_USER}/changepassword`, info);

// api function to add a car for a user.
export const addCar = (carInfo) => {
  return axios.post(`${BASE_URL_USER}/addcar`, carInfo);
};
// api function to fetch all users.
export const getAllUsers = () => {
  return axios.get(`${BASE_URL_USER}/getAllUsers`)
}    
// api function to search for cars.
export const searchCars = (requestData) => {
  return axios.post(`${BASE_URL_USER}/searchcar`, requestData);
};
// api function to fetch all reports
export const getAllReports = () => {
  return axios.get(`${BASE_URL_USER}/reports`);
}
// api function to fetch all reports for a user
export const getUserReports = (userId) => {
  return axios.get(`${BASE_URL_USER}/reports/${userId}`)
}
// api function to report a user.
export const reportUser = (reportDetails) => {
  return axios.post(`${BASE_URL_USER}/reportuser`, reportDetails)
}
// api function to fetch all messages for a room
export const getMessagesForRoom = (room) => {
  return axios.get(`${BASE_URL_USER}/messages/${room}`)
}
// api function to fetch chat room for a given user
export const getRoomForUser = (userId) => {
  return axios.get(`${BASE_URL_USER}/chatroom/${userId}`);
}
// api function to make an order on a car .
export const sendOrderRequest = (orderInfo) => {
  return axios.post(`${BASE_URL_USER}/ordercar`, orderInfo);
}
// api function to fetch orders with renter_id matching userId
export const getOrdersByRenterId = (userId) => {
  return axios.get(`${BASE_URL_USER}/getOrdersByRenterId/${userId}`);
};
// api function to fetch orders with rentee_id matching userId
export const getOrdersByRenteeId = (userId) => {
  return axios.get(`${BASE_URL_USER}/getOrdersByRenteeId/${userId}`);
};
// api function to fetch a user by id.
export const getOrderById = (orderId) => {
  return axios.get(`${BASE_URL_USER}/orders/${orderId}`)
}
// api function to fetch all orders.
export const getAllOrders = () => {
  return axios.get(`${BASE_URL_USER}/orders`);
}
// api function to change an order's status.
export const changeOrderStatus = (newOrderStatus) => {
  return axios.put(`${BASE_URL_USER}/changeorderstatus`,newOrderStatus);
}
// api function to check if user details exist.
export const checkUserDetailsExist = (userDetails) => {
  return axios.post(`${BASE_URL_USER}/userdetailsexist`, userDetails);
}
// api function to change a user's status.
export const changeUserStatus = (userDetails) => {
  return axios.put(`${BASE_URL_USER}/changeuserstatus`, userDetails)
}
// api function to fetch all user notifications.
export const getUserNotifications = (userId) => {
  return axios.get(`${BASE_URL_USER}/notifications/${userId}`);
}
// api function to mark a notification as read.
export const markNotificationAsRead = (notificationId) => {
  return axios.put(`${BASE_URL_USER}/notifications/${notificationId}`);
}
// api call to find and decline conflicting orders with a given order.
export const findAndDeclineConflictingOrders = (orderDetails) => {
  return axios.put(`${BASE_URL_USER}/decline-conficting-orders`, orderDetails);
}

// api call to mark chat messages as read
export const markChatMessagesAsRead = (chatRoomInfo) => {
  return axios.put(`${BASE_URL_USER}/mark-user-messages-asread`, chatRoomInfo);
}

// api call that will fetch the amount of unread messages for every person for the logged in user.
export const checkUnreadMessages = (user1Id) => {
  return axios.get(`${BASE_URL_USER}/unread-messages/${user1Id}`);
} 
// api to mark all notifications as read.
export const markAllNotificationsAsRead = () => {
  return axios.put(`${BASE_URL_USER}/markallnotifications`);
}
// api for user forgot password
export const forgotPassword = (email) => {
  return axios.post(`${BASE_URL_USER}/forgotpassword`, {email});
}
// api to mark chat notifications as read.
export const markChatNotificationsAsRead = (idObject) => {
  return axios.put(`${BASE_URL_USER}/markchatnotificationsread`, idObject);
}
// api to check if a car is in use for a given order date and time.
export const checkIfCarInUse = (orderObject) => {
  return axios.post(`${BASE_URL_USER}/checkcarinuse`, orderObject);
}

// api to send order email to the users
export const sendOrderEmails = (orderDetails) => {
  return axios.post(`${BASE_URL_USER}/send-order-email`, orderDetails);
}