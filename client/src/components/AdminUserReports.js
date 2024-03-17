import React, { useState, useEffect } from "react";
import { getAllReports } from "../api/UserApi";
import { AES} from 'crypto-js';


export default function AdminUserReports() {
  const [reports, setReports] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;

  const handleSelectUser = (userId) => {
    const encryptedIdToString = userId ? userId.toString() : "";
    const encryptedId = encodeURIComponent(AES.encrypt(encryptedIdToString, secretKey).toString());
    console.log("In User reports = ",encryptedId)
    if (encryptedId) {
      const url = `/UserReportsView/${encryptedId}`;
      window.location.href = url;
    }
  };




 
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getAllReports();
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const userReports = {}; // To store user IDs and their report counts

  reports.forEach((report) => {
    if (!userReports[report.Reported_User_Id]) {
      userReports[report.Reported_User_Id] = {
        count: 1,
        firstName: report.reported_first_name,
        lastName: report.reported_last_name,
      };
    } else {
      userReports[report.Reported_User_Id].count++;
    }
  });

  return (
    <div className="flex w-full flex-col items-center ">
      <h2 className="text-3xl font-bold m-20">Admin User Reports</h2>
      <div className="w-1/2 flex flex-col  mb-4 p-4 items-center justify-center">
        <h3 className="text-xl text-[#cc6200] p-2 rounded-md font-bold mb-2">Search User Reports</h3>
        <input
          className="p-2 text-black w-full xl:w-1/4  font-bold border-2 rounded-md hover:border-black"
          type="text"
          name="searchreports"
          placeholder="Enter the user's name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="flex w-4/5  flex-wrap flex-1 p-8 justify-around">
        <div className="max-h-60 overflow-y-auto">
          <table className="w-full text-center rounded-md shadow-lg">
            <thead className="rounded-md bg-black text-white">
              <tr>
                <th className="p-2 font-bold">Reported Person</th>
                <th className="p-2 font-bold">First Name</th>
                <th className="p-2 font-bold">Last Name</th>
                <th className="p-2 font-bold">Amount of Reports</th>
                <th className="p-2 font-bold">View All Reports</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(userReports).map((userId) => {
                const user = userReports[userId];
                const fullName = `${user.firstName} ${user.lastName}`;

                if (
                  fullName.toLowerCase().includes(searchValue.toLowerCase())
                ) {
                  return (
                    <tr key={userId}>
                      <td>{userId}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td
                        className={
                          user.count > 3 ? "text-red-500 font-bold" : "text-black"
                        }
                      >
                        {user.count > 3 ? "3+" : user.count}
                      </td>
                      <td>
                        <button
                          onClick={() => handleSelectUser(userId)}
                          className="p-2 m-2 font-bold bg rounded-md bg-black text-white hover:text-[#cc6200]"
                        >
                          View All Reports
                        </button>
                      </td>
                    </tr>
                  );
                }
                return;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
