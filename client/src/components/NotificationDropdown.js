import React from "react";
import { Link } from "react-router-dom";

const NotificationDropdown = ({ userOrders, userRenteeOrders }) => {
  const hasNewOrderRequest = userOrders.length > 0;
  const hasAcceptedRenteeOrder = userRenteeOrders.some(
    (order) => order.status === "accepted"
  );

  return (
    <div className="py-1 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="px-4 py-3 text-sm text-gray-700">
        {hasNewOrderRequest && (
          <Link to={`/Notifications/${userOrders[0].Order_Id}`}>
            <p className="mb-2">You have a new car order request</p>
          </Link>
        )}
        {hasAcceptedRenteeOrder && (
          <Link to={`/Notifications/${userRenteeOrders[0].Order_Id}`}>
            <p>The renter accepted your car.</p>
          </Link>
        )}
        {!hasNewOrderRequest && !hasAcceptedRenteeOrder && (
          <p>No notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
