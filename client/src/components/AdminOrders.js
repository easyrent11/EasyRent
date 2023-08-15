import React, { useState, useEffect } from 'react';
import { getLatestOrders } from "../api/UserApi";
import { format } from 'date-fns';

export default function AdminOrders() {
  const [latestOrders, setLatestOrders] = useState([]);

  useEffect(() => {
    // Fetch latest orders using API function and update state
    async function fetchLatestOrders() {
      try {
        const latestOrdersResponse = await getLatestOrders();
        setLatestOrders(latestOrdersResponse.data);
      } catch (error) {
        console.error("Error fetching latest orders:", error);
      }
    }

    fetchLatestOrders();
  }, []);

  return (
    <div className="w-full flex-1 flex-col flex justify-center">
      {latestOrders.length === 0 ? (
        <p className='text-center text-2xl'>No orders available</p>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">Latest Orders</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Car Plates Number</th>
                <th className="p-2 border">Rentee ID</th>
                <th className="p-2 border">Start Time</th>
                <th className="p-2 border">End Time</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Renter ID</th>
                <th className="p-2 border">Order Date</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map(order => (
                <tr key={order.Order_Id}>
                  <td className="p-2 border">{order.Order_Id}</td>
                  <td className="p-2 border">{order.Car_Plates_Number}</td>
                  <td className="p-2 border">{order.Rentee_id}</td>
                  <td className="p-2 border">{order.Start_Time}</td>
                  <td className="p-2 border">{order.End_Time}</td>
                  <td className="p-2 border">{order.status}</td>
                  <td className="p-2 border">{order.Renter_Id}</td>
                  <td className="p-2 border">
                    {format(new Date(order.Order_Date), "yyyy-MM-dd HH:mm:ss")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
