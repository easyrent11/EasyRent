import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../api/UserApi'; // Replace with actual API call
import AdminUserChatHistory from './AdminUserChatHistory';
import { notify } from '../HelperFunctions/Notify';

export default function AdminChatHistory() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getAllUsers()
      .then((response) => setUsers(response.data))
      .catch((error) => notify('error', error));
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  return (
    <div className='w-4/5 flex flex-col items-center'>
      {selectedUser ? (
        <AdminUserChatHistory userId={selectedUser} />
      ) : (
        <div className='w-1/2 max-h-120 overflow-y-auto text-center'>
          <h2 className='text-3xl font-bold mt-8 mb-8'>Admin Chat History</h2>
          <h3 className='text-xl text-[#cc6200] mb-8'>Select a User to View Chat History</h3>
          <table className="w-full rounded-md shadow-lg bg-white">
            <thead className="rounded-md">
              <tr className="bg-black text-white">
                <th className="p-2 font-bold">Id</th>
                <th className="p-2 font-bold">First Name</th>
                <th className="p-2 font-bold">Last Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border cursor-pointer"
                  onClick={() => handleUserSelect(user.Id)}
                >
                  <td className="border p-2">{user.Id}</td>
                  <td className="border p-2">{user.first_name}</td>
                  <td className="border p-2">{user.last_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
