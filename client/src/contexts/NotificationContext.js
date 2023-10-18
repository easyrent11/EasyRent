import React, { createContext, useContext, useState } from "react";
import { markNotificationAsRead } from "../api/UserApi";
import { notify } from "../HelperFunctions/Notify";

// Create the context
const NotificationContext = createContext();

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Function that will mark a notification as read.
  const handleNotificationClick = (notificationId) => {
    markNotificationAsRead(notificationId)
      .then((res) => {
        // Filter out the clicked notification from the notifications list
        const updatedNotifications = notifications.filter(
          (notification) => notification.id !== notificationId
        );
        // Update the notifications state
        setNotifications(updatedNotifications);
      })
      .catch((error) => {
        notify("error", error);
      });
  };
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        handleNotificationClick,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
