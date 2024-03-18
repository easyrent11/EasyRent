import React, { useState, useEffect } from "react";
import { getAllUsers } from "../api/UserApi"; // Replace with actual API call
import AdminUserChatHistory from "./AdminUserChatHistory";
import { notify } from "../HelperFunctions/Notify";

export default function AdminChatHistory() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getAllUsers()
      .then((response) => setUsers(response.data))
      .catch((error) => notify("error", error));
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };
  const onClose = () => {
    setSelectedUser(null);
  }
  
  return (
    <div className="w-full lg:w-4/5 flex flex-col items-center">
      {selectedUser ? (
        <AdminUserChatHistory userId={selectedUser} users={users} onClose={onClose}/>
      ) : (
        <div className="w-full lg:w-1/2 max-h-120  text-center" style={{ maxHeight: "50vh"}}>
        
          <h2 className="text-3xl  font-bold mt-8 mb-8">Admin Chat History</h2>
          <input
            className="p-2 text-black w-full xl:w-1/4 mb-4 font-bold border-2 rounded-md hover:border-black"
            type="text"
            name="searchreports"
            placeholder="Enter the user's name"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <h3 className="text-xl text-[#cc6200] mb-8">
            Select a User to View Chat History
          </h3>
          <div className="w-full rounded-lg mt-10" style={{ maxHeight: "50vh", overflow: "auto" }}>
          <table className="w-full overflow-y-auto rounded-md   shadow-lg bg-white">
            <thead className="rounded-md">
              <tr className="bg-black text-white">
                <th className="p-2 font-bold">Id</th>
                <th className="p-2 font-bold">First Name</th>
                <th className="p-2 font-bold">Last Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const fullName = `${user.first_name} ${user.last_name}`;
                if (
                  !searchValue ||
                  fullName
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) 
                ) {
                  return (
                    <tr
                      key={user.id}
                      className="border cursor-pointer"
                      onClick={() => handleUserSelect(user.Id)}
                    >
                      <td className="border p-2">{user.Id}</td>
                      <td className="border p-2">{user.first_name}</td>
                      <td className="border p-2">{user.last_name}</td>
                    </tr>
                  );
                }
                return null; 
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
