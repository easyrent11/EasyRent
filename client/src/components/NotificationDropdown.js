import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNotificationContext } from "../contexts/NotificationContext";
import { getAllUserDetails } from "../api/UserApi";

const NotificationDropdown = () => {
  const { notifications, handleClearAllNotifications, handleNotificationClick } = useNotificationContext();
  const [updatedNotifications, setUpdatedNotifications] = useState([]);

  useEffect(() => {
    async function updateNotificationsWithSenderName() {
      const updatedNotifs = await Promise.all(
        notifications.map(async (notification) => {
          if (notification.type === "recieve-message-notification") {
            try {
              const userDetails = await getAllUserDetails(notification.userId);
              if (userDetails) {
                console.log(userDetails);
                const senderName = `${userDetails.data[0].first_name} ${userDetails.data[0].last_name}`;
                return { ...notification, message: `New message from "${senderName}"` };
              }
            } catch (error) {
              console.error("Error fetching user details:", error);
            }
          }
          return notification;
        })
      );
      setUpdatedNotifications(updatedNotifs);
    }

    updateNotificationsWithSenderName();
  }, [notifications]);

  return (
    <div className="flex border-2 border-red-500 align-center flex-col py-1 w-full border-2  space-y-2">
      <div className="px-4 py-3 text-sm text-gray-700">
        {updatedNotifications.length > 0 ? (
          updatedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`mb-2 p-2 rounded-lg bg-black`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <Link
                to={
                  notification.type === "recieve-message-notification"
                    ? "/ChatApp"
                    : {
                        pathname: `/Notifications/${notification.order_id}/${notification.type}`,
                        state: { notifications: updatedNotifications },
                      }
                }
              >
                <p className="mb-2 text-white">{notification.message}</p>
              </Link>
            </div>
          ))
        ) : (
          <p className="p-2 w-full text-center">No New Notifications</p>
        )}
      </div>
      <p className="flex text-sm font-bold cursor-pointer justify-end p-2" onClick={handleClearAllNotifications}>
        Clear All
      </p>
    </div>
  );
};

export default NotificationDropdown;
