import React, { useState, useEffect } from "react";
import {
  getMessagesForRoom,
  getRoomForUser,
  getAllUserDetails,
  getAllUsers,
} from "../api/UserApi";
import { notify } from "../HelperFunctions/Notify";
import AdminUserChatPopOut from "../components/AdminUserChatPopOut";

export default function AdminUserChatHistory({
  userId,
  setShowChatHistory,
  onClose,
}) {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showPopout, setShowPopout] = useState(false); // State to manage pop-out visibility
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then((response) => setUsers(response.data))
      .catch((error) => notify("error", error));
  }, []);

  // function that takes a user id and returns his full name.
  function getFullNameById(id) {
    const user = users.find((user) => user.Id === id);
    if (user) {
      return `${user.first_name} ${user.last_name}`;
    }
    return "User not found";
  }

  useEffect(() => {
    getRoomForUser(userId)
      .then((response) => setChatRooms(response.data))
      .catch((error) => notify("error", error));
  }, [userId]);

  useEffect(() => {
    if (selectedRoom) {
      getMessagesForRoom(selectedRoom)
        .then((res) => {
          console.log(res);
          const messagesWithDetails = res.data.map(async (message) => {
            const senderId = message.user_id;
            const chatRoom = chatRooms.find((room) => room.id === selectedRoom);
            const recipientId =
              senderId === chatRoom.user1_id
                ? chatRoom.user2_id
                : chatRoom.user1_id;
            const senderPromise = getAllUserDetails(senderId);
            const recipientPromise = getAllUserDetails(recipientId);

            const [senderDetails, recipientDetails] = await Promise.all([
              senderPromise,
              recipientPromise,
            ]);
            console.log(senderDetails, recipientDetails);
            return {
              ...message,
              senderName: senderDetails.data[0].first_name,
              recipientName: recipientDetails.data[0].first_name,
            };
          });

          Promise.all(messagesWithDetails)
            .then((messagesWithNames) => {
              setMessages(messagesWithNames);
            })
            .catch((error) => {
              notify("error", error);
            });
        })
        .catch((error) => {
          notify("error", error);
        });
    }
  }, [selectedRoom]);

  const openPopout = () => {
    setShowPopout(true);
  };

  const closePopout = () => {
    setShowPopout(false);
  };

  return (
    <div className="p-4 w-4/5 flex flex-col items-center">
      <button
        className="p-2 bg-black text-white text-lg hover:bg-[#cc6200] rounded-md shadow-lg"
        onClick={() => onClose()}
      >
        Return
      </button>
      <h2 className="mt-8 mb-8 text-2xl font-bold">
        Chat History for {getFullNameById(userId)}
      </h2>
      <div className="flex items-center p-4 w-1/2 border border-black shadow-lg rounded-md bg-white justify-center flex-col">
        <h3 className="mb-4 font-bold text-xl text-[#cc6200]">
          Select a Chat Room to View Chat History
        </h3>
        <input
          className="p-2 text-black w-1/2  mt-4 text-center font-bold border-2 rounded-md hover:border-black"
          type="text"
          name="searchreports"
          placeholder="Search user"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <ul className="w-full text-center p-4">
          {chatRooms.length !== 0 ? (
            chatRooms.map((room) => {
              const otherUserId =
                room.user1_id === userId ? room.user2_id : room.user1_id;
              const otherUserFullName = getFullNameById(otherUserId);

              // Filter based on the search query
              const isMatch =
                otherUserFullName
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                otherUserId.toString() === searchValue.toString() ||
                !searchValue;

              if (isMatch) {
                return (
                  <li
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`text-lg ${
                      selectedRoom === room.id ? "selected" : ""
                    }`}
                  >
                    View Chats With User
                    <p
                      onClick={openPopout}
                      className="font-bold hover:text-[#cc6200] cursor-pointer"
                    >
                      {otherUserFullName}
                    </p>
                  </li>
                );
              }

              return null; // Exclude users that don't match the search criteria
            })
          ) : (
            <p>No chat rooms for this person.</p>
          )}
        </ul>
      </div>

      {/* Display ChatPopout if showPopout is true */}
      {showPopout && (
        <div className="fixed top-0 left-0 w-screen h-screen z-20 flex justify-center items-center">
          <div
            className="bg-black bg-opacity-50 absolute top-0 left-0 w-full h-full"
            onClick={closePopout}
          />
          <AdminUserChatPopOut messages={messages} onClose={closePopout} />
        </div>
      )}
    </div>
  );
}
