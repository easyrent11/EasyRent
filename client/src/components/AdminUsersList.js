import React, { useState, useEffect } from "react";
import { getAllUsers,changeUserStatus} from "../api/UserApi";

export default function AdminUsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users from the database
    getAllUsers()
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const toggleUserStatus = (userId, newStatus) => {
    console.log(userId,newStatus);
    const userDetails = {
      userId,
      newStatus,
    };
    changeUserStatus(userDetails) 
      .then(() => {
        // Update the users' status locally 
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.Id === userId ? { ...user, status: newStatus } : user
          )
        );
      })
      .catch((error) => {
        console.error("Error updating user status:", error);
      });
  };

  return (
    <div className="flex-1 flex text-center items-center flex-col mt-8 border-2 border-red-500 justify-start">
      <h1 className="text-3xl border-2 w-4/5 border-red-500 mt-8 font-bold ">Users List </h1>
      <div className="w-4/5  rounded-lg mt-40">
      <table className="w-full rounded-md  shadow-lg ">
          <thead className="rounded-md">
            <tr className="bg-black text-white">            
              <th className="p-2 font-bold">Id </th>
              <th className="p-2 font-bold">First Name</th>
              <th className="p-2 font-bold">Last Name </th>
              <th className="p-2 font-bold">Email </th>
              <th className="p-2 font-bold">Driving License</th>
              <th className="p-2 font-bold">Phone Number</th>
              <th className="p-2 font-bold">Street Name</th>
              <th className="p-2 font-bold">Is Admin </th>
              <th className="p-2 font-bold">Status</th>
              <th className="p-2 font-bold">Change User Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border">
                <td className="border p-2">{user.Id}</td>
                <td className="border p-2">{user.first_name}</td>
                <td className="border p-2">{user.last_name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.driving_license}</td>
                <td className="border p-2">{user.phone_number}</td>
                <td className="border p-2">{user.street_name}</td>
                <td className="border p-2">{user.isadmin}</td>
                <td className="border p-2">
                  {user.status === "disabled" ? "disabled" : "Active"}
                </td>
                <td className="border p-2">
                <button
                    onClick={() =>
                      toggleUserStatus(
                        user.Id,
                        user.status === "disabled" ? "active" : "disabled"
                      )
                    }
                    className={
                      user.status === "active"
                        ? "bg-red-500 p-2 w-full rounded-md text-white"
                        : "bg-green-500 p-2 w-full rounded-md text-white"
                    }
                  >
                    {user.status === "disabled" ? "Enable" : "Disable"}
                  </button>
                </td>
       
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
