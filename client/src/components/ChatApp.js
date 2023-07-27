import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:3001");
export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const user1Id = localStorage.getItem("userId");

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

  function startChat(user2Id) {
    // Data to send to the backend for creating/retrieving the chat room
    const roomInfo = {
      user1Id: user1Id,
      user2Id: user2Id,
    };
    console.log("room info = ", roomInfo);

    axios
      .post("http://localhost:3001/user/startChat", roomInfo)
      .then((response) => {
        console.log(response.data);
        setRoom(response.data.room);
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
    setMessage("");
    fetchMessagesForRoom();
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
    <>

    <main className="min-h-screen">
      <input
        placeholder="Message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h1>Messages : </h1>
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.user_id}: {msg.text} 
        </div>
      ))}

      <div>
        <h2>All Available Users:</h2>
        <ul>
          {users.map((user) => (
            <li key={user.Id}>
              <button onClick={() => startChat(user.Id)}>
                {user.first_name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
    </>
  );
}
