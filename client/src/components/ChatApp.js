import React, { useState, useEffect, useContext, useMemo } from "react";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import { FiSend } from "react-icons/fi";
import io from "socket.io-client";
import axios from "axios";
import ReportUserView from "./ReportUserView";
import { markChatMessagesAsRead } from "../api/UserApi";
import { useNotificationContext } from "../contexts/NotificationContext";
import { markChatNotificationsAsRead } from "../api/UserApi";
import { FaCrown } from "react-icons/fa";
import { notify } from "../HelperFunctions/Notify";

import moment from "moment";

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
  const [searchValue, setSearchValue] = useState("");

  // getting the notifications array from the dropdown.
  const { notifications, setNotifications } = useNotificationContext();

  // Check if there's a targetedUser in localStorage
  useEffect(() => {
    const targetedUser = localStorage.getItem("targetedUser");
    if (targetedUser) {
      const targetedUserId = parseInt(targetedUser);
      if (
        !isNaN(targetedUserId) &&
        users.some((user) => user.Id === targetedUserId)
      ) {
        startChat(targetedUserId); // Start a chat with the targeted user
        // clear the local storage.
        localStorage.removeItem("targetedUser");
      }
    }
  }, [localStorage.getItem("targetedUser"), users]);

  // use effect to display all users.
  useEffect(() => {
    displayAllUsers();
  }, [room]);

  // use effect to handle cleanup logic when leaving the component
  useEffect(() => {
    return () => {
      if (room) {
        const chatRoomInfo = {
          user1Id,
          chatroom_id: room,
        };

        markChatMessagesAsRead(chatRoomInfo)
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
  }, [room, user1Id]);

  function displayAllUsers() {
    axios
      .get("http://localhost:3001/user/getAllUsers")
      .then((response) => {
        // Filter out the logged-in user from the users array
        const filteredUsers = response.data.filter(
          (user) => user.Id !== user1Id
        );

        // Find the admin user with the ID 444444444
        const adminUser = filteredUsers.find((user) => user.Id === 444444444);

        // Remove the admin user from the filteredUsers array
        const usersWithoutAdmin = filteredUsers.filter(
          (user) => user.Id !== 444444444
        );

        // Combine the admin user and the rest of the users
        const finalUsers = adminUser
          ? [adminUser, ...usersWithoutAdmin]
          : filteredUsers;

        setUsers(finalUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  // function that will fetch the image of the selected user.
  function getSelectedUserImage(givenUserId) {
    const user = users.find((user) => user.Id == givenUserId);

    if (user) {
      // User found, return the image URL
      return `http://localhost:3001/images/${user.picture}`;
    } else {
      return `http://localhost:3001/images/${userDetails.picture}`;
    }
  }
  // function that will fetch all messages for the given room
  function fetchMessagesForRoom() {
    if (room) {
      console.log("room inside fetch messages for room = ", room);
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
  // function that will start a chat between 2 users.
  function startChat(user2Id) {
    // send request to backend to mark all notifications between the 2 users as read.
    // defining the ids object.
    const idObject = {
      user1Id: user1Id,
      user2Id: user2Id,
    };
    markChatNotificationsAsRead(idObject)
      .then((res) => {
        console.log(res);
        // update the local notifications array to exclude the notifications.
        const excludedNotifications = notifications.filter(
          (notification) =>
            !(
              notification.userId === user1Id &&
              notification.targetId === user2Id &&
              notification.type === "recieve-message-notification"
            )
        );
        // update the notifications array.
        setNotifications(excludedNotifications);
      })
      .catch((error) => {
        notify("error", error);
      });

    // mark messages as read for the previous chat when entering a new chat.
    const chatRoomInfo = {
      user1Id,
      chatroom_id: room,
    };
    markChatMessagesAsRead(chatRoomInfo)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    const roomInfo = {
      user1Id: user1Id,
      user2Id: user2Id,
    };

    // remove the user2Id message count from the array (make it 0)
    axios
      .post("http://localhost:3001/user/startChat", roomInfo)
      .then((response) => {
        const chatRoomInfo = {
          user1Id,
          chatroom_id: response.data.room,
        };
        markChatMessagesAsRead(chatRoomInfo)
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
        setRoom(response.data.room);
        setSelectedUser(user2Id);
        socket.emit("join_room", response.data.room);
      })
      .catch((error) => {
        console.error("Error creating/retrieving chat room:", error);
      });
  }

  // use memo to fetch all messages for a specific room.
  useMemo(() => {
    fetchMessagesForRoom();
  }, [room]);

  // function to send a message to a user.
  function sendMessage() {
    socket.emit("send_message", { message, room, user_id: user1Id });
    socket.emit("notification", {
      userId: selectedUser,
      targetId: user1Id,
      message: "You have a new message",
      type: "recieve-message-notification",
    });

    setMessage("");
  }

  // useeffect to listen for incoming messages from users.
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // if (data.room !== room) {
      //   setRoom(data.room);
      // }
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
      className="min-h-screen flex justify-center w-4/5  bg-[#f6f6f6] show-lg rounded-md m-4"
      style={{ minHeight: "90vh" }}
    >
      <div className="flex flex-col lg:flex-row  w-full h-auto rounded-md shadow-lg">
        <div
          className="w-full lg:w-1/4  text-center  border-r rounded-md h-4/5">
          <h2 className="text-xl text-black font-bold mb-4">All Users:</h2>
          <input
            className="p-2 text-black w-4/5 text-center mb-4 font-bold border-2 rounded-md hover:border-black"
            type="text"
            name="searchreports"
            placeholder="Enter the user's name"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="flex flex-wrap flex-col" style={{ maxHeight: '600px' }}>
          <ul className="block overflow-y-auto ">
            {users.map((user) => {
              const userFullName = `${user.first_name} ${user.last_name}`;
              const userMatchesSearch =
                !searchValue ||
                userFullName.toLowerCase().includes(searchValue.toLowerCase());

              if (userMatchesSearch) {
                return (
                  <li
                    key={user.Id}
                    className={`flex items-center mb-2 cursor-pointer ${
                      selectedUser === user.Id
                        ? "bg-[#c6c3c3] rounded-md p-2 text-white"
                        : " p-2 text-black"
                    }`}
                    onClick={() => startChat(user.Id)}
                  >
                    <div className="relative">
                      <img
                        src={`http://localhost:3001/images/${
                          user.picture || ""
                        }`}
                        alt={user.first_name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    </div>

                    <span
                      className={`font-bold text-lg text-black ${
                        user.Id === 444444444
                          ? "mt-4  w-full text-start p-1 mb-4"
                          : "text-black"
                      }`}
                    >
                      {user.Id === 444444444 && (
                        <FaCrown className="mr-2 text-[#CC6200]" />
                      )}
                      {userFullName}
                      {user.Id === 444444444 && (
                        <span className="text-sm text-[#CC6200] ml-2">
                          (ADMIN)
                        </span>
                      )}
                    </span>
                  </li>
                );
              }

              return null; // Exclude users that don't match the filter
            })}
          </ul>
          </div>
        </div>
        <div className="lg:flex mt-8 md:mt-0 w-full overflow-y-auto lg:flex-col lg:flex-1  lg:rounded-md">
          {room ? (
            <>
              <div className="flex items-center rounded-md shadow-sm bg-[#f1f1f1] border p-2">
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
                      {
                        users.find((user) => user.Id === selectedUser)
                          .first_name
                      }
                    </p>
                  </div>
                ) : null}
                {selectedUser !== null && selectedUser !== 444444444 && (
                  <div
                    className="ml-auto cursor-pointer"
                    onClick={() => setShowReportMenuForUser(selectedUser)}
                  >
                    <p className="text-black p-2 text-lg font-bold ">
                      Report User
                    </p>
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
