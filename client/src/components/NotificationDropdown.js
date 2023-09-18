import React from "react";
import { Link } from "react-router-dom";
import { markNotificationAsRead } from "../api/UserApi";
import { notify } from "../HelperFunctions/Notify";

const NotificationDropdown = ({ notifications }) => {

  const handleNotificationClick = (notificationId) => {
    markNotificationAsRead(notificationId)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        notify('error', error);
      })
  }

  return (
    <div className="py-1 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 space-y-2">
      <div className="px-4 py-3 text-sm text-gray-700">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              className={`mb-2 p-2 rounded-lg bg-black`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <Link
                to={notification.type === 'recieve-message-notification' ? '/ChatApp' : '/Notification'}
              >
                <p className="mb-2 text-white">
                  {notification.message}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p className="p-2">No new order requests.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;