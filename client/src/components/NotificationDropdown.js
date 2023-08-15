import React from "react";
import { Link, renderMatches } from "react-router-dom";
import { useUserOrders } from "../contexts/UserOrdersContext";

const NotificationDropdown = ({ userOrders, userRenteeOrders, setOrder }) => {
  const { readNotifications, markNotificationAsRead } = useUserOrders();

  // Filter out the clicked notifications from the list for the renter(the one that owns the car.)
  const filteredUserOrders = userOrders.filter(
    // get the orders that their id isnt in the notifications array state and their status is pending
    (order) =>
      !readNotifications.includes(order.Order_Id) && order.status == "pending"
  );

  // Filter out the clicked notifications from the list for the rentee(the one that is ordering the car.)
  const filteredUserRenteeOrders = userRenteeOrders.filter(
    // get the orders that their id isnt in the notifications array state and their status is accepted or declined
    (order) =>
      !readNotifications.includes(order.Order_Id) &&
      (order.status === "accepted" || order.status === "declined")
  );

  return (
    <div className="py-1 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 space-y-2">
      <div className="px-4 py-3 text-sm text-gray-700">
        {filteredUserOrders.length > 0 ? (
          filteredUserOrders.map((order) => (
            <div
              key={order.Order_Id}
              className={`mb-2 p-2 rounded-lg bg-black`}
            >
              <Link
                to={`/Notifications/${order.Order_Id}/orderRequest`}
                onClick={() => markNotificationAsRead(order.Order_Id)}
              >
                <p className="mb-2 text-white">
                  You have a new order on one of your cars click .
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p className="p-2">No new order requests.</p>
        )}

        {filteredUserRenteeOrders.length > 0 ? (
          filteredUserRenteeOrders.map((order) => (
            <div
              key={order.Order_Id}
              className={`text-white p-2 rounded-lg bg-black mb-2`}
            >
              <Link
                to={`/Notifications/${order.Order_Id}/renterAccepted`}
                onClick={() => markNotificationAsRead(order.Order_Id)}
              >
                <p className="mb-2">
                  order status :{" "}
                  <span className="text-[#641515]">{order.status}</span>
                </p>
                {order.status === "accepted" && (
                  <p>
                    <Link to={`/Reports/${order.Order_Id}`}>
                      View Report
                    </Link>
                  </p>
                )}
              </Link>
            </div>
          ))
        ) : (
          <p></p>
        )}

        {filteredUserOrders.length === 0 &&
          filteredUserRenteeOrders.length === 0 && (
            <p className="border-t-2 p-2 border-black">No notifications.</p>
          )}
      </div>
    </div>
  );
};

export default NotificationDropdown;