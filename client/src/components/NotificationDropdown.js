import React from "react";
import { Link } from "react-router-dom";
import { markNotificationAsRead } from "../api/UserApi";
import { notify } from "../HelperFunctions/Notify";

const NotificationDropdown = ({ notifications,setNotifications }) => {
  console.log(notifications);
  // on click function to change the notification read status and update the notifications array.
  const handleNotificationClick = (notificationId) => {
    console.log("Notification id = ", notificationId);
    markNotificationAsRead(notificationId)
      .then((res) => {
        // Filter out the clicked notification from the notifications list
        const updatedNotifications = notifications.filter(
          (notification) => notification.id !== notificationId
        );
        console.log(updatedNotifications);
        // Update the notifications state
        setNotifications(updatedNotifications);
      })
      .catch((error) => {
        notify('error', error);
      });
  }


  return (
    <div className="py-1 w-full border-2  space-y-2">
      <div className="px-4 py-3 text-sm text-gray-700">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              className={`mb-2 p-2 rounded-lg bg-black`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <Link
                to={notification.type === 'recieve-message-notification' ? '/ChatApp' : `/Notifications/${notification.order_id}/${notification.type}`}
              >
                <p className="mb-2 text-white">
                  {notification.message}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p className="p-2">No New Notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;