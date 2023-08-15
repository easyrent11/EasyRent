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
    <div className="flex-1 flex items-center justify-center">
      <div className="w-3/4">
        <h1 className="text-3xl font-bold mb-4">All Users</h1>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">            
              <th className="border p-2 font-bold">Id </th>
              <th className="border p-2 font-bold">First Name</th>
              <th className="border p-2 font-bold">Last Name </th>
              <th className="border p-2 font-bold">Email </th>
              <th className="border p-2 font-bold">Driving License</th>
              <th className="border p-2 font-bold">Phone Number</th>
              <th className="border p-2 font-bold">Street Name</th>
              <th className="border p-2 font-bold">Is Admin </th>
              <th className="border p-2 font-bold">Status</th>
              <th className="border p-2 font-bold">Change User Status</th>
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
