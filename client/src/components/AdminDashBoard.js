import React, { useState, useEffect } from "react";
import { getAllUsers, getLatestOrders } from "../api/UserApi";
import { getAllCars } from "../api/CarApi";
import { format } from "date-fns";

export default function AdminDashBoard() {
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);

  useEffect(() => {
    // Fetch data using API functions and update state
    async function fetchData() {
      try {
        const usersResponse = await getAllUsers();
        const carsResponse = await getAllCars();
        const latestOrdersResponse = await getLatestOrders();

        setUsers(usersResponse.data);
        setCars(carsResponse.data);
        setLatestOrders(latestOrdersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen w-full flex flex-col items-center mt-4">
      <h1 className="text-2xl font-bold mb-4">Welcome Admin</h1>

      <div className="flex items-center justify-center">
        {/* Display Total Users */}
        <div className="bg-blue-200 m-4 rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-xl">{users.length}</p>
        </div>

        {/* Display Total Cars */}
        <div className="bg-red-200 m-4 rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Total Cars</h2>
          <p className="text-xl">{cars.length}</p>
        </div>
      </div>

      {/* Display Latest Orders */}
      <div className="w-full">
        {latestOrders.length === 0 ? (
          <p className="text-center text-2xl m-6">No orders available</p>
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
                {latestOrders.map((order) => (
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
    </main>
  );
}
