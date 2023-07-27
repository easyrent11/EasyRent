import React, { useState, useEffect, useContext } from "react";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import { FiSend } from "react-icons/fi";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:3001");
export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // the selected user to chat with
  const user1Id = localStorage.getItem("userId");
  const { userDetails, setUserDetails } = useContext(UserProfileDetails);
  useEffect(() => {
    // Call the function to fetch all users and messages when the component mounts
    displayAllUsers();
    fetchMessagesForRoom();
  }, [room]);

  function displayAllUsers() {
    const loggedInUserId = parseInt(localStorage.getItem("userId")); // Convert the user ID to an integer
    axios
      .get("http://localhost:3001/user/getAllUsers")
      .then((response) => {
        console.log(response.data);
        // Filter out the logged-in user from the users array
        const filteredUsers = response.data.filter(
          (user) => user.Id !== loggedInUserId
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }
  function getSelectedUserImage(givenUserId) {
    const user = users.find((user) => user.Id == givenUserId);

    if (user) {
      // User found, return the image URL
      return `http://localhost:3001/images/${user.picture}`;
    } else {
      return `http://localhost:3001/images/${userDetails.picture}`;
    }
  }

  function startChat(user2Id) {
    // Data to send to the backend for creating/retrieving the chat room
    const roomInfo = {
      user1Id: user1Id,
      user2Id: user2Id,
    };
    axios
      .post("http://localhost:3001/user/startChat", roomInfo)
      .then((response) => {
        console.log(response.data);
        setRoom(response.data.room);
        setSelectedUser(user2Id); // Set the selected user when starting the chat
        // Join the chat room on the frontend
        socket.emit("join_room", response.data.room);
      })
      .catch((error) => {
        console.error("Error creating/retrieving chat room:", error);
      });
  }

  // Fetch all messages for the given chat room
  function fetchMessagesForRoom() {
    axios
      .get(`http://localhost:3001/user/messages/${room}`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }

  const sendMessage = () => {
    // Emit an event to the backend to save the message
    socket.emit("send_message", { message, room, user1Id });
    // Clear the input field after sending the message
    fetchMessagesForRoom();
    setMessage("");
  };

  useEffect(() => {
    // Add the event listener to receive messages
    socket.on("receive_message", (data) => {
      // Add the received message to the frontend state (messages)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data.message,
          user_id: data.user_id,
        },
      ]);

      fetchMessagesForRoom();
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, [room]);

  return (
<main className="flex justify-center min-h-screen border-2 border-red-500">
      <div className="flex  w-full rounded-md shadow-lg m-2">
        {/* Left Section - List of Available Users */}
        <div className="w-1/4 p-4 border-r rounded-md shadow-lg bg-black">
          <h2 className="text-xl text-white font-bold mb-4">All Available Users:</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user.Id}
                className={`flex items-center mb-2 cursor-pointer ${
                  selectedUser === user.Id ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => startChat(user.Id)}
              >
                <img
                  src={`http://localhost:3001/images/${
                    user.picture != null ? user.picture : null
                  }`}
                  alt={user.first_name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-white text-lg">{user.first_name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - Chat Messages */}
        <div className="flex-1 rounded-md">
          {room ? (
            <>
              <h2 className="text-xl text-white font-bold flex rounded-md p-2 bg-black border-2 items-center ">
                {users.find((user) => user.Id === selectedUser) ? (
                  <img
                  className="w-10 h-10 rounded-full mr-2"
                    src={`http://localhost:3001/images/${
                      users.find((user) => user.Id === selectedUser).picture
                    }`}
                    alt="User Avatar"
                  />
                ) : null
                }
                <p>{users.find((user) => user.Id === selectedUser).first_name}</p>
                
              </h2>
              <div className="rounded p-4  border-2 border-pink-700 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 border-2  flex ${
                      msg.user_id == user1Id ? "justify-start" : "justify-end"
                    } border-green-500`}
                  >
                    <span
                      className={`font-bold  p-2 m-2 ${
                        msg.user_id == user1Id ? "order-1" : "order-2"
                      }`}
                    >
                      <img
                        className="w-8 h-8 rounded-full mr-2"
                        src={`${getSelectedUserImage(msg.user_id)}`}
                      />
                    </span>
                    <p
                      className={`flex items-center justify-center m-2 max-w-sm rounded-lg p-2 ${
                        msg.user_id == user1Id
                          ? "order-2 bg-blue-500 text-white"
                          : "order-1 bg-gray-200"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex">
                <input
                  placeholder="Message"
                  onChange={(e) => setMessage(e.target.value)}
                  className="border rounded p-2 flex-1 mr-2"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  <FiSend /> {/* Add the send icon */}
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-xl text-gray-500">
                Select a user to start chatting
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
