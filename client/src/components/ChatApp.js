import React, { useState, useEffect, useContext, useMemo } from "react";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import { FiSend } from "react-icons/fi";
import io from "socket.io-client";
import axios from "axios";
import ReportUserView from "./ReportUserView";

const socket = io.connect("http://localhost:3001");

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // the selected user to chat with
  const { userDetails, setUserDetails } = useContext(UserProfileDetails);
  const user1Id = parseInt(localStorage.getItem("userId"));
  const [showReportMenuForUser, setShowReportMenuForUser] = useState(null);

  useEffect(() => {
    displayAllUsers();
  }, [room]);

  function displayAllUsers() {
    axios
      .get("http://localhost:3001/user/getAllUsers")
      .then((response) => {
        console.log(response.data);
        // Filter out the logged-in user from the users array
        const filteredUsers = response.data.filter(
          (user) => user.Id !== user1Id
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

  function fetchMessagesForRoom() {
    if (room) {
      axios
        .get(`http://localhost:3001/user/messages/${room}`)
        .then((response) => {
          console.log("response in fetch messages", response);
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }

  function startChat(user2Id) {
    const roomInfo = {
      user1Id: user1Id,
      user2Id: user2Id,
    };

    axios
      .post("http://localhost:3001/user/startChat", roomInfo)
      .then((response) => {
        setRoom(response.data.room);
        setSelectedUser(user2Id);
        socket.emit("join_room", response.data.room);
      })
      .catch((error) => {
        console.error("Error creating/retrieving chat room:", error);
      });
  }

  useMemo(() => {
    fetchMessagesForRoom();
  }, [room]);

  function sendMessage() {
    socket.emit("send_message", { message, room, user_id: user1Id });
    setMessage("");
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.room !== room) {
        setRoom(data.room);
      }
      if (data.room === room) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: data.message,
            room: data.room,
            user_id: data.user_id,
          },
        ]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [room]);

  return (
    <main
      className="min-h-screen flex justify-center w-4/5 border-2 bg-[#f6f6f6] show-lg rounded-md m-4"
      style={{ minHeight: "90vh" }}
    >
      <div className="flex w-full rounded-md shadow-lg">
        <div className="w-1/4 p-4 border-r rounded-md h-4/5">
          <h2 className="text-xl text-black font-bold mb-4">All Users:</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user.Id}
                className={`flex items-center mb-2 cursor-pointer ${
                  selectedUser === user.Id
                    ? "bg-[#c6c3c3] rounded-md p-2 text-white"
                    : " p-2 text-black"
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
                <span className="text-black font-bold text-lg">
                  {user.first_name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col flex-1 rounded-md">
          {room ? (
            <>
              <div className="flex items-center  rounded-md shadow-sm bg-[#f1f1f1] border p-2">
                {users.find((user) => user.Id === selectedUser) ? (
                  <div className="flex p-2 items-center">
                    <img
                      className="w-10 h-10 rounded-full mr-2"
                      src={`http://localhost:3001/images/${
                        users.find((user) => user.Id === selectedUser).picture
                      }`}
                      alt="User Avatar"
                    />
                    <p>
                      {users.find((user) => user.Id === selectedUser).first_name}
                    </p>
                  </div>
                ) : null}
                {selectedUser !== null && (
                  <div
                    className="ml-auto cursor-pointer"
                    onClick={() => setShowReportMenuForUser(selectedUser)}
                  >
                    <p className="text-black p-2 text-lg font-bold ">Report User</p>
                  </div>
                )}
              </div>
              <div className="rounded p-4 h-full">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 flex ${
                      msg.user_id == user1Id ? "justify-start" : "justify-end"
                    }`}
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
                      className={`flex flex-col w-1/12 items-center justify-center m-2 max-w-sm rounded-lg p-2 ${
                        msg.user_id == user1Id
                          ? "order-2 bg-black text-white"
                          : "order-1 bg-gray-200"
                      }`}
                    >
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-2 bg-white flex">
                <input
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border rounded p-2 flex-1 mr-2"
                />
                <button
                  onClick={sendMessage}
                  className="bg-black hover:bg-[#CC6200] text-white font-bold py-2 px-4 rounded"
                >
                  <FiSend />
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
      {showReportMenuForUser !== null && (
        <ReportUserView
          reportedUserId={showReportMenuForUser}
          reportingUserId={user1Id}
          setShowReportMenuForUser={setShowReportMenuForUser}
        />
      )}
    </main>
  );
}
