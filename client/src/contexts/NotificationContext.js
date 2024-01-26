import React, { createContext, useContext, useState } from "react";
import { markNotificationAsRead,markAllNotificationsAsRead } from "../api/UserApi";
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
    // finding the current target notification
    const targetNotification = notifications.find(notification => notification.id === notificationId)
    // saving the target user id from the current notification to local storage to go to his chatapp.
    localStorage.setItem('targetedUser', targetNotification.targetId);
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

  // function to clear all user notifications
  const handleClearAllNotifications = () => {
    markAllNotificationsAsRead()
    .then((res) => {
      setNotifications([]); // empty the notifications array.
    })
    .catch((error) => {
      console.log(error)
    })
  }
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        handleNotificationClick,
        handleClearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
