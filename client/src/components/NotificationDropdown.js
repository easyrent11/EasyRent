import React from 'react';
import { Link } from 'react-router-dom';
import { useUserOrders } from '../contexts/UserOrdersContext';

const NotificationDropdown = ({ userOrders, userRenteeOrders, setOrder }) => {
  const { readNotifications, markNotificationAsRead } = useUserOrders(); // Access the readNotifications and markNotificationAsRead from the context

  // Filter out the clicked notifications from the list
  const filteredUserOrders = userOrders.filter((order) => !readNotifications.includes(order.Order_Id));
  const filteredUserRenteeOrders = userRenteeOrders.filter((order) => !readNotifications.includes(order.Order_Id));

  return (
    <div className="py-1 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 space-y-2">
      <div className="px-4 py-3 text-sm text-gray-700">
        {filteredUserOrders.length > 0 ? (
          filteredUserOrders.map((order) => (
            <div key={order.Order_Id} className={`mb-2 p-2 rounded-lg bg-black`}>
              <Link to={`/Notifications/${order.Order_Id}/orderRequest`} onClick={() => markNotificationAsRead(order.Order_Id)}>
                <p className="mb-2 text-white">
                  You have a new car order request
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p>No new order requests.</p>
        )}

        {filteredUserRenteeOrders.length > 0 ? (
          filteredUserRenteeOrders.map((order) => (
            <div key={order.Order_Id} className={`text-white p-2 rounded-lg bg-black mb-2`}>
              <Link to={`/Notifications/${order.Order_Id}/renterAccepted`} onClick={() => markNotificationAsRead(order.Order_Id)}>
                <p className="mb-2">The renter {order.status} your car.</p>
              </Link>
            </div>
          ))
        ) : (
          <p></p>
        )}

        {filteredUserOrders.length === 0 && filteredUserRenteeOrders.length === 0 && (
          <p>No notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
