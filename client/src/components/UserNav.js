import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import NotificationDropdown from "./NotificationDropdown";
import { notify } from "../HelperFunctions/Notify";
import io from "socket.io-client";
import { getUserNotifications } from "../api/UserApi";
import { useNotificationContext } from "../contexts/NotificationContext"
import {Link as ScrollLink} from "react-scroll";
const navigation = [
  { name: "Dashboard", href: "/homepage", current: true },
  { name: "Share your car", href: "/AddCar", current: false },
  { name: "Orders", href: "/Orders", current: false },
  { name: "Chat", href: "/chatapp", current: false },
  { name: "Contact Us", href: "contactus", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserNav({ handleLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const { userDetails } = useContext(UserProfileDetails);
  const { notifications, setNotifications} = useNotificationContext();
  const [socket, setSocket] = useState(null);

  const userProfileImage = userDetails.picture;
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    getUserNotifications(userDetails.Id)
      .then((res) => {
        setNotifications(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        notify("error", error);
      });
  }, [userDetails]);

  useEffect(() => {
    // Connect to the Socket.IO server and authenticate
    const socket = io.connect("http://localhost:3001");
    if (userId) {
      socket.emit("authenticate", userId);
    }

    // Handle incoming notifications
    socket.on("notification", (notification) => {

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

  const logout = () => {
    notify("success", "Successfully logged out");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("filterOptions");
    handleLogout();
    navigate("/");
  };

  return (
    <Disclosure
      as="nav"
      className="w-full border-2 bg-[#f6f6f6]  rounded-md m-8 mt-0"
    >
      {({ open }) => (
        <>
          <div className="mx-auto w-full  px-2 sm:px-6 lg:px-8">
            <div className="relative  flex h-16 items-center justify-between">
              <div className="absolute inset-y-0  left-0 flex items-center  md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1  items-center justify-center max-w-full max-h-full md:items-stretch md:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Logo />
                </div>
                <div className="hidden sm:ml-6  md:block">
                  <div className="flex space-x-4  h-full items-center justify-center">
                    {navigation.map((item) => (
                      <React.Fragment key={item.name}>
                        {item.name === "Contact Us" ? (
                          <ScrollLink
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-black  hover:bg-gray-900 hover:text-white",
                            "rounded-md px-3  py-2 flex items-center text-sm h-4/5 font-medium"
                          )} spy={true} smooth={true} duration={500}
                          >
                        {item.name}
                        </ScrollLink>
                        ):(
                          <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-black  hover:bg-gray-900 hover:text-white",
                            "rounded-md px-3 py-2 flex items-center h-4/5 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                        )}
                        </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-9 p-2 m-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={`http://localhost:3001/images/${userProfileImage}`}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/UserProfile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                  
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
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
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-black hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
