import React from "react";
import { Link } from "react-router-dom";
import { useNotificationContext } from "../contexts/NotificationContext"


const NotificationDropdown = () => {
  const { notifications,handleNotificationClick} = useNotificationContext();
  
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
                to={
                  notification.type === "recieve-message-notification"
                    ? "/ChatApp"
                    : {
                        pathname: `/Notifications/${notification.order_id}/${notification.type}`,
                        state: { notifications: notifications},
                      }
                }
              >
                   <p className="mb-2 text-white">{notification.message}</p>
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
