import React, { useState, useEffect } from "react";
import {
  getOrdersStatistics,
  getBestSellerUserThisMonth,
} from "../api/AdminApi";
import { FaUsers, FaCar } from "react-icons/fa";
import StatisticsGraph from "../components/StatisticsGraph";
import { xorEncrypt } from "../HelperFunctions/Encrypt";
import { Link } from "react-router-dom";
import AdminOrdersStatisticsCircle from "../components/AdminOrdersStatisticsCircle";
import AdminUserActivities from "./AdminUserActivities";
export default function AdminDashBoard({ users, cars }) {
  // use states.
  const [orderStats, setOrderStats] = useState({});
  const [selectedStatistic, setSelectedStatistic] = useState("today");
  const [bestSeller, setBestSeller] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const ordersStatsResponse = await getOrdersStatistics();
        const bestSellerThisMonth = await getBestSellerUserThisMonth();
        setOrderStats(ordersStatsResponse.data);

        // Check if bestSellerThisMonth.data.user is defined
        const bestSellerData = bestSellerThisMonth.data.user || {};

        setBestSeller(bestSellerData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleStatisticChange = (statistic) => {
    setSelectedStatistic(statistic);
  };
  // the encrypted id.
  let encryptedId = null;
  if(bestSeller){
    // Wait for bestSeller to be populated before accessing its properties
    const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;
    const encryptedIdToString = bestSeller.Id ? bestSeller.Id.toString() : "";
    encryptedId = xorEncrypt(encryptedIdToString, secretKey);
  }
  

  return (
    <>
      <div className="w-full m-2">
        <h1 className="text-3xl self-start p-2 font-bold mb-4">Dashboard</h1>
        <main className="min-h-screen w-4/5 mx-auto flex flex-col items-center">
          <div className="flex items-center  w-full justify-between">
            {/* Display Total Users */}
            <div className="bg-white h-40 w-80 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Total Users</h2>
                <p className="text-4xl">{users.length}</p>
              </div>
              <div>
                <FaUsers color="#cc6200" size={40} />
              </div>
            </div>
            {/*End of display Total Users */}

            {/* Display Order Statistics */}
            <div className="bg-white  h-40 w-80 rounded-lg p-4 flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Orders Made</h2>
              <div className="flex items-center justify-between w-full">
                <div
                  className={`cursor-pointer ${
                    selectedStatistic === "today" && "font-bold"
                  }`}
                  onClick={() => handleStatisticChange("today")}
                >
                  Today
                </div>
                <div
                  className={`cursor-pointer ${
                    selectedStatistic === "thisMonth" && "font-bold"
                  }`}
                  onClick={() => handleStatisticChange("thisMonth")}
                >
                  This Month
                </div>
                <div
                  className={`cursor-pointer ${
                    selectedStatistic === "thisYear" && "font-bold"
                  }`}
                  onClick={() => handleStatisticChange("thisYear")}
                >
                  This Year
                </div>
              </div>
              <p className="text-4xl">{orderStats[`${selectedStatistic}`]}</p>
            </div>

            <div className="bg-white h-40 w-80 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Total Cars</h2>
                <p className="text-4xl">{cars.length}</p>
              </div>
              <div>
                <FaCar color="#cc6200" size={40} />
              </div>
            </div>

            <div className="bg-white h-40 w-80 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  Best seller of the month
                </h2>
                <Link to={`/ViewUserProfile/${encryptedId}`}>
                  <p className="text-4xl hover:text-[#cc6200]">
                    {bestSeller && bestSeller.first_name
                      ? bestSeller.first_name
                      : "No sellers found this month"}
                  </p>
                </Link>
              </div>
              <div>
                <FaCar color="#cc6200" size={40} />
              </div>
            </div>
          </div>
          <div className=" w-full">
            {/* Statistics graph for orders,users,cars amount each month. */}
            <StatisticsGraph />
            <div className="flex items-center justify-between">
              <div className="flex w-full ">
                <AdminUserActivities />
                <AdminOrdersStatisticsCircle />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
