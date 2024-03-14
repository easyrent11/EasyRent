import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";
import NotificationDropdown from "./NotificationDropdown";
import { notify } from "../HelperFunctions/Notify";
import { getUserNotifications } from "../api/UserApi";
import io from "socket.io-client";
import { useNotificationContext } from "../contexts/NotificationContext"

const adminNavigation = [
  { name: "Dashboard", href: "/adminpage" },
  { name: "Users", href: "/users" },
  { name: "Profile", href: "/profile" },
  { name: "Reports", href: "/reports" },
  { name: "Chat History", href: "/chathistory" },
  { name: "Chat App", href: "/ChatApp" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminSideBar({ handleLogout, userDetails }) {
  const [socket, setSocket] = useState(null); // socket object.
  const { notifications, setNotifications} = useNotificationContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const userId = parseInt(localStorage.getItem("userId")); // getting admin id
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // function that will run once the admin clicks logout button
  const logout = () => {
    notify("success", "Successfully logged out");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    handleLogout();
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // fetching all notifications
  useEffect(() => {
    getUserNotifications(userId)
      .then((res) => {
        setNotifications(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        notify("error", error);
      });
  }, [userId]);

  useEffect(() => {
    // Connect to the Socket.IO server and authenticate
    const socket = io.connect("http://localhost:3001");
    if (userId) {
      socket.emit("authenticate", userId);
    }

    // Handle incoming notifications
    socket.on("notification", (notification) => {
      console.log("notification in navbar = ", notification);

      // Create a new notification object with default values
      const newNotification = {
        id: notification.notificationId,
        userId: notification.userId,
        targetId:notification.targetId,
        message: notification.message,
        type: notification.type,
        isRead: 0, // Set the default value for isRead
        created_at: new Date().toISOString(), // Set the current timestamp
        order_id: notification.orderId,
      };

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
      console.log(notifications);
    });

    setSocket(socket);

    // Clean up when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId]);

  return (
    <>
      <nav className="flex flex-col w-2/12 items-center m-4 border-2 border-red-500 bg-white shadow-md rounded-md justify-start  p-4">
        <div className="flex flex-col items-start justify-center  ">
          <div className="m-2 p-2 w-full flex items-center justify-start">
            <img
              src={`http://localhost:3001/images/${
                userDetails.picture != null ? userDetails.picture : null
              }`}
              alt="User Image"
              className="border-2 flex w-32 h-32 rounded-full"
            />
            {/* Admin name and logout button section */}
            <section className="flex flex-col  items-center justify-between p-4 h-full  m-4">
              <p className="text-lg text-center  font-bold">
                {userDetails.first_name}
              </p>
              <button
                className="bg-black rounded-md text-white border-none p-2 self-end cursor-pointer hover:bg-[#cc6200] transition-colors"
                onClick={logout}
              >
                Logout
              </button>
            </section>
            {/* End of admin name and logout button section */}
          </div>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span className="sr-only border-2 border-red-500">View notifications</span>
            <BellIcon
              className="h-6 w-6 bg-black color-white rounded-full"
              aria-hidden="true"
            />
            {notifications.length > 0 && (
              <span className="absolute top-44  p-2 m-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute border-2 border-red-500 left-0 top-12 w-48 origin-top-left bg-[#f4f4f4]  rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <NotificationDropdown
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </div>
          )}
        </div>
        <div className="flex justify-center flex-1 flex-col  w-full m-2 ">
          {adminNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                "m-2",
                location.pathname === item.href
                  ? "bg-[#cc6200] text-white"
                  : "text-black hover:bg-gray-900 hover:text-white",
                "rounded-md px-3 py-2 text-xl font-bold"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <figure className="flex-1  w-full flex items-center justify-center">
          <Logo />
        </figure>
      </nav>
    </>
  );
}
