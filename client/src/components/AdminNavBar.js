import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import NotificationDropdown from "./NotificationDropdown";
import { notify } from "../HelperFunctions/Notify";

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Users", href: "/users", current: false },
  { name: "Orders", href: "/adminorders", current: false },
  { name: "Cars", href: "/cars", current: false },
  { name: "Profile", href: "/profile", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminNav({ handleLogout }) {
    const navigate = useNavigate();
  const logout = () => {
    notify("success", "Successfully logged out");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    handleLogout();
    navigate("/");
  };

  return (

      <nav className="flex w-full items-center border-2 border-red-500 justify-center bg-[#d7d7d7] p-4">
        <div className="flex items-center border-2 border-blue-500 justify-center">
         <Logo />
        </div>
        <div className="flex w-full m-2 ">
          {adminNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-black hover:bg-gray-900 hover:text-white",
                "rounded-md px-3 py-2 text-xl font-bold"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button
          className=" bg-black rounded-md p-2 text-white border-none text-xl font-bold cursor-pointer"
          onClick={logout}
        >
          Logout
        </button>
      </nav>

  );
}


