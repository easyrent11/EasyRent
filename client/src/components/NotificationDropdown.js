import React from "react";
import { Link } from "react-router-dom";

const NotificationDropdown = ({ userOrders, userRenteeOrders }) => {
  return (
    <div className="py-1 w-full bg-white rounded-md  shadow-lg ring-1 ring-black ring-opacity-5 space-y-2">
      <div className="px-4 py-3 text-sm  text-gray-700">
        {userOrders.length > 0 ? (
          userOrders.map((order) => (
            <div key={order.Order_Id} className="mb-2 p-2 rounded-lg bg-black">
              <Link to={`/Notifications/${order.Order_Id}`}>
                <p className="mb-2 text-white">You have a new car order request</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No new order requests.</p>
        )}

        {userRenteeOrders.length > 0 ? (
          userRenteeOrders.map((order) => (
            <div key={order.Order_Id} className="text-white p-2 rounded-lg bg-black mb-2">
              <Link to={`/Notifications/${order.Order_Id}`}>
                <p className="mb-2">The renter accepted your car.</p>
              </Link>
            </div>
          ))
        ) : (
          <p></p>
        )}

        {userOrders.length === 0 && userRenteeOrders.length === 0 && (
          <p>No notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
