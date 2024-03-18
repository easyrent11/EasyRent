import React, { useState, useEffect } from "react";
import { getAllUsers, changeUserStatus } from "../api/UserApi";
import {sendOrderEmails} from "../api/UserApi";

export default function AdminUsersList() {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    // Fetch all users from the database
    getAllUsers()
      .then((response) => {
        const filteredUsers = response.data.filter(
          (user) => user.Id !== 121121121
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // function to disable/enable any user from the users list.
  const toggleUserStatus = (userId, newStatus, emailAddress, userFirstName) => {
    // send email to the user.
    if(newStatus === 'disabled'){
      const orderEmailDetails = {
        recipientEmail : emailAddress,
        body : `
            Hello ${userFirstName},
            We regret to inform you that your EasyRent account has been suspended due to your behavior towards other users in the chat app. This decision was made by our admin team based on reports of misconduct.
            If you believe this action was taken in error or if you have any questions or concerns, please reply to this email, and we will investigate further.
            Thank you for your understanding.
  
            Best regards,
            The EasyRent Team
            `,
        subject : "EasyRent account suspended"
      }
      sendOrderEmails(orderEmailDetails)
      .then((res) => {
        console.log("email = ",res);
      })
      .catch((err) => {
        console.log(err);
      })
    }
    
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
    <div className="flex-1 flex text-center items-center flex-col mt-8 justify-start">
      <h1 className="text-3xl  w-4/5 mt-8 font-bold ">Users List</h1>
      <input
        className="p-2 text-black w-1/4  mt-4 text-center font-bold border-2 rounded-md hover:border-black"
        type="text"
        name="searchreports"
        placeholder="Search user"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div
        className="w-4/5  rounded-lg mt-10"
        style={{ maxHeight: "50vh", overflow: "auto" }}
      >
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
            {users.map((user) => {
               if (user.Id === 444444444) {
                return null; // Skip rendering the admin user
              }            
              const fullName = `${user.first_name} ${user.last_name}`;
              if (
                !searchValue ||
                fullName.toLowerCase().includes(searchValue.toLowerCase())
              ) {
                return (
                  <tr key={user.Id} className="border">
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
                            user.status === "disabled" ? "active" : "disabled",
                            user.email,
                            user.first_name
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
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
