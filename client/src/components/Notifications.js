import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Notifications() {
  const { Order_Id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  console.log(Order_Id)

  // Replace this with your API call to fetch order details based on orderId
  useEffect(() => {
    // Example API call using fetch
    axios.get(`http://localhost:3001/user/orders/${Order_Id}`)
      .then((response) => response.json())
      .then((data) => setOrderDetails(data))
      .catch((error) => console.error("Error fetching order data:", error));
  }, [Order_Id]);

  return (
    <div>
      <h1>Order Details</h1>
      {orderDetails ? (
        <div>
          <p>Order ID: {orderDetails.Order_Id}</p>
          {/* Display other order details here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
