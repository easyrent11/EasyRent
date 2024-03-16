import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  changeOrderStatus,
  findAndDeclineConflictingOrders,
} from "../api/UserApi";
import { useUserOrders } from "../contexts/UserOrdersContext";
import { notify } from "../HelperFunctions/Notify";
import io from "socket.io-client";
import { useNotificationContext } from "../contexts/NotificationContext";
import { formatDate } from "../HelperFunctions/FormatDate";
import { sendOrderEmails } from "../api/UserApi";
import { getAllUserDetails } from "../api/UserApi";

export default function Notifications() {
  const { orderId, typeOfNotification } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [socket, setSocket] = useState(null);
  const { userOrders, setUserOrders } = useUserOrders();
  const navigate = useNavigate();
  const { notifications, handleNotificationClick } = useNotificationContext();

  useEffect(() => {
    const socket = io.connect("http://localhost:3001");
    setSocket(socket);

    // Clean up when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    getOrderById(orderId)
      .then((res) => {
        setOrderDetails(res.data);
      })
      .catch((error) => console.error("Error fetching order data:", error));
  }, [orderId, typeOfNotification]);

  // function that will handle the accept order logic for the renter to accept the order made on his cars.
  // we need to also decline all other orders made on the car that conflicts with the order dates.
  const handleAcceptOrder = () => {
    // Fetching the car owner's email
    getAllUserDetails(orderDetails.Rentee_id)
      .then((res) => {
        if (res.data) {
          console.log("Rentee  =", res.data);
          // get the rentee's email.
          const renteeEmail = res.data[0].email;
          // Send an email to the car owner
          const orderEmailDetails = {
            recipientEmail: renteeEmail,
            body: `Hello ${res.data[0].first_name} ${res.data[0].last_name}, The renter has accepted your order,
                  On the car with plates number : ${JSON.stringify(orderDetails.Car_Plates_Number)}. 
                  Please login to your account to view the report and chat with the owner and plan a meetup to get the keys.`,
            subject: "EasyRent Car Order Accepted",
          };
          sendOrderEmails(orderEmailDetails)
            .then((res) => {
              console.log("Email sent to car owner:", res);
            })
            .catch((err) => {
              console.error("Error sending email to car owner:", err);
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      });
    const newOrderStatus = {
      orderId: orderId,
      status: "accepted",
    };
    // declining all conflicting orders first.
    findAndDeclineConflictingOrders({
      orderId: orderId,
      carPlatesNumber: orderDetails.Car_Plates_Number,
    })
      .then((res) => {
        // filtering out the notifications that are for conflicting orders.
        if (res.data && Array.isArray(res.data.conflictingOrders)) {
          const conflictingOrders = res.data.conflictingOrders;
          conflictingOrders.forEach((order) => {
            notifications.forEach((notification) => {
              if (order.Order_Id == notification.order_id) {
                handleNotificationClick(notification.id);
              }
            });
          });
        }

        //after successfully declining we send a notification to all the declined order's users
        res.data.conflictingOrders.forEach((order) => {
          const userId = order.UserId; // get the user id.
          // send a decline order notification to the user.
          socket.emit("notification", {
            userId: userId,
            message: "The renter declined your order",
            type: "order-declined-notification",
            orderId: order.orderId,
          });
        });

        changeOrderStatus(newOrderStatus)
          .then((res) => {
            // getting the declined order's id.
            const acceptedOrderId = res.data.order.Order_Id;
            // Filter out the accepted order from userOrders
            const updatedOrders = userOrders.filter(
              (order) => order.Order_Id !== acceptedOrderId
            );
            // Set the updated orders list including the declined order with updated status
            setUserOrders([...updatedOrders, res.data.order]);
            // sending a notification to the rentee.
            socket.emit("notification", {
              userId: orderDetails.Rentee_id,
              message: "The renter accepted your order",
              type: "order-accepted-notification",
              orderId: orderId,
            });
            navigate("/Orders");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((res) => {
        notify("error", `Failed to accept order we got this message ${res}`);
      });
  };

  // function that will handle the accept order logic for the renter to accept the order made on his cars.
  const handleDeclineOrder = () => {

    getAllUserDetails(orderDetails.Rentee_id)
    .then((res) => {
      if (res.data) {
        console.log("Rentee  =", res.data);
        // get the rentee's email.
        const renteeEmail = res.data[0].email;
        // Send an email to the car owner
        const orderEmailDetails = {
          recipientEmail: renteeEmail,
          body: `Hello ${res.data[0].first_name} ${res.data[0].last_name}, We are sorry to tell you that the renter has declined your order,
                On the car with plates number : ${JSON.stringify(orderDetails.Car_Plates_Number)}. 
                If you have any issues you can contact the owner via chat or you reply to us on this mail.`,
          subject: "EasyRent Car Order Declined",
        };
        sendOrderEmails(orderEmailDetails)
          .then((res) => {
            console.log("Email sent to car owner:", res);
          })
          .catch((err) => {
            console.error("Error sending email to car owner:", err);
          });
      }
    })
    .catch((err) => {
      console.error("Error fetching user details:", err);
    });
    const newOrderStatus = {
      orderId: orderId,
      status: "declined",
    };
    changeOrderStatus(newOrderStatus)
      .then((res) => {
        // getting the declined order's id.
        const declinedOrderId = res.data.order.Order_Id;
        // Filter out the declined order from userOrders
        const updatedOrders = userOrders.filter(
          (order) => order.Order_Id !== declinedOrderId
        );
        // Set the updated orders list including the declined order with updated status
        setUserOrders([...updatedOrders, res.data.order]);
        // sending a notification to the rentee.
        socket.emit("notification", {
          userId: orderDetails.Rentee_id,
          message: "The renter declined your order",
          type: "order-declined-notification",
          orderId: orderId,
        });
        navigate("/Orders");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="w-1/2 m-2 border-2 rounded-md border-black flex flex-col items-center justify-center flex-1">
        <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
        {orderDetails && (
          <div className="shadow w-full overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr key={orderDetails.Order_Id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {orderDetails.Rentee_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {orderDetails.Order_Id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(orderDetails.Start_Date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(orderDetails.End_Date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {orderDetails.Car_Plates_Number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {orderDetails.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(orderDetails.Order_Date)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {typeOfNotification === "order-request-notification" &&
        orderDetails &&
        orderDetails.status === "pending" && (
          <div className="w-1/2 m-2 flex  items-center justify-center">
            <button
              onClick={handleAcceptOrder}
              className="px-4 py-2 mx-2 bg-green-500 text-white rounded-md"
            >
              Accept Order
            </button>
            <button
              onClick={handleDeclineOrder}
              className="px-4 py-2 mx-2 bg-red-500 text-white rounded-md"
            >
              Decline Order
            </button>
          </div>
        )}
    </>
  );
}
