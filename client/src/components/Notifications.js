import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

export default function Notifications() {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null); // Initialize as null

  useEffect(() => {
    // Example API call using Axios
    axios.get(`http://localhost:3001/user/orders/${orderId}`)
      .then((res) => {
        console.log(res.data);
        setOrderDetails(res.data); // Assuming the actual data is stored directly in res.data
      })
      .catch((error) => console.error("Error fetching order data:", error));
  }, [orderId]);

  return (
    <>
    <div className="w-1/2 m-2 border-2 rounded-md border-black flex flex-col items-center justify-center  flex-1">
      <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
      {orderDetails && (
        <div className="shadow w-full overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car Plates Number
                </th>
                {/* Add more table headers for other order details */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr key={orderDetails.Order_Id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {orderDetails.Order_Id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {orderDetails.Start_Date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {orderDetails.End_Date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {orderDetails.Car_Plates_Number}
                </td>
                {/* Add more table cells for other order details */}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}
