import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";
import NotificationDropdown from "./NotificationDropdown";
import { notify } from "../HelperFunctions/Notify";
import { getUserNotifications } from "../api/UserApi";
import io from "socket.io-client";
import { useNotificationContext } from "../contexts/NotificationContext";
import { Disclosure } from "@headlessui/react";
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
  const { notifications, setNotifications } = useNotificationContext();
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
        targetId: notification.targetId,
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
      <nav className="flex lg:flex-col w-full lg:w-1/4 2xl:w-2/12 items-center m-4 bg-white shadow-md rounded-md justify-between lg:justify-start  p-4">
        {/* Start of normal navbar */}
        <div className="flex flex-col lg:w-full h-4/5  items-center">
          {/* Admin name and logout button section */}
          <section className="lg:flex-col hidden  lg:flex lg:items-center lg:justify-between lg:p-4 w-full">
            <div className="m-2 p-2  flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="rounded-full m-2 bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon
                  className="h-8 w-8 bg-gray-800 color-white rounded-full"
                  aria-hidden="true"
                />
                {notifications.length > 0 && (
                  <span className="absolute top-24  p-2 m-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>
              <img
                src={`http://localhost:3001/images/${
                  userDetails.picture != null ? userDetails.picture : null
                }`}
                alt="User Image"
                className="border-2 flex w-12 h-12 lg:w-32 lg:h-32 rounded-full"
              />
              {/* End of admin name and logout button section */}
            </div>
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

          <div className="hidden  lg:flex flex-1 flex-col  w-full m-2 ">
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
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute  mt-10 top-3 w-48 origin-top-right bg-[#f4f4f4]  rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <NotificationDropdown
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              </div>
            )}
          </div>
          {/* End of normal navbar */}
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="lg:hidden">
                  <span className="sr-only">Toggle sidebar</span>
                  {open ? (
                    <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel>
                  <div className="flex absolute  left-0  bg-white z-50  justify-center flex-1 flex-col  w-full m-2 ">
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
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>

        <figure className=" flex lg:items-start lg:mt-4 items-center justify-center">
          <Logo />
        </figure>

        <div className="m-2 p-2  lg:hidden  justify-between flex items-center">
          <button
            className="rounded-md lg:hidden border-none p-2  cursor-pointer hover:text-[#cc6200] "
            onClick={logout}
          >
            Logout
          </button>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="rounded-full m-2 bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon
              className="h-6 w-6 bg-gray-800 color-white rounded-full"
              aria-hidden="true"
            />
            {notifications.length > 0 && (
              <span className="absolute top-44  p-2 m-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
          <img
            src={`http://localhost:3001/images/${
              userDetails.picture != null ? userDetails.picture : null
            }`}
            alt="User Image"
            className="border-2 flex w-10 h-10 lg:w-32 lg:h-32 rounded-full"
          />
          {/* End of admin name and logout button section */}

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-12 mt-10 top-3 w-48 origin-top-right bg-[#f4f4f4]  rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <NotificationDropdown
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
