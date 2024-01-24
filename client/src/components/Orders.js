import React, { useEffect, useState } from "react";
import { useUserOrders } from "../contexts/UserOrdersContext";
import { useNavigate, Link } from "react-router-dom";
import { changeOrderStatus } from "../api/UserApi";
import { notify } from "../HelperFunctions/Notify";
import { formatDate } from "../HelperFunctions/FormatDate";
import {getOrderById} from "../api/UserApi";


import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

const Orders = () => {
  const navigate = useNavigate();
  const { userOrders, userRenteeOrders, setUserRenteeOrders,fetchUserOrders } = useUserOrders();
  const [renterId, setRenterId] = useState(null);


  useEffect(() => {
    // Call the fetch function when the component mounts
    fetchUserOrders();
  }, [fetchUserOrders]);


  // function that cancels a user's order.
  function handleCancelOrder(orderId) {
    // get the renter id 
    getOrderById(orderId)
    .then((res) => {
      console.log("res data from get order by id",res.data);
      setRenterId(res.data.Renter_Id); //save the renter id.

    })  
    .catch((error) => {
      console.log(error);
    })
    // declare the new status.
    const status = "cancelled";
    // change the status to cancelled.
    const newOrderStatus = {
      orderId,
      status,
    };
    changeOrderStatus(newOrderStatus)
      .then((res) => {
        const canceledOrderId = res.data.order.Order_Id;
        const updatedOrders = userRenteeOrders.filter(
          (order) => order.Order_Id !== canceledOrderId
        );
        setUserRenteeOrders(updatedOrders);
        socket.emit("order-cancelled", {userId:renterId,orderId:canceledOrderId });
        notify("success", "Your order has been successfully cancelled");
      })
      .catch((err) => {
        notify("error", `Failed to cancel order ${err}`);
      });
  }

  useEffect(() => {
    socket.on('order-cancelled', (data) => {
      console.log("I got data from cancel order ", data);
    })
  },[renterId])

  return (
    <div className="flex-1 p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-4">
          Orders Made on Your Cars:
        </h1>
        {userOrders.length === 0 ? (
          <p>No orders made by you.</p>
        ) : (
          <div className="shadow w-full overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Car Plates Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Renter Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rentee Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Report
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userOrders.map((order) => (
                  <tr key={order.Order_Id}>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900"
                      onClick={() =>
                        navigate(
                          `/Notifications/${order.Order_Id}/renterAccepted`
                        )
                      }
                    >
                      {order.Order_Id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(order.Start_Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(order.End_Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Car_Plates_Number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Renter_Id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Rentee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Start_Time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.End_Time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(order.Order_Date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    {order.status === "pending" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        <Link
                          to={`/Notifications/${order.Order_Id}/order-request-notification`}
                        >
                          View Order
                        </Link>
                      </td>
                    )}
                    {order.status === "accepted" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        <Link to={`/Reports/${order.Order_Id}`}>
                          View Report
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-semibold mb-4">Orders you made : </h1>
        {userRenteeOrders.length === 0 ? (
          <p>No orders made on your cars.</p>
        ) : (
          <div className="shadow w-full overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Car Plates Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Renter Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rentee Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order Date
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Report
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cancel Order
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userRenteeOrders.map((order) => (
                  <tr key={order.Order_Id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Order_Id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(order.Start_Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(order.End_Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Car_Plates_Number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Renter_Id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Rentee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Start_Time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.End_Time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(order.Order_Date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    {order.status === "accepted" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        <Link to={`/Reports/${order.Order_Id}`}>
                          View Report
                        </Link>
                      </td>
                    )}

                    {order.status === "pending" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-900 cursor-pointer p-2">
                          <button
                            onClick={() => {
                              handleCancelOrder(order.Order_Id);
                            }}
                          >
                            Cancel Order
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;