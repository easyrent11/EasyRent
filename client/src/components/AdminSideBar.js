import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import NotificationDropdown from "./NotificationDropdown";
import { notify } from "../HelperFunctions/Notify";

const adminNavigation = [
  { name: "Dashboard", href: "/adminpage" },
  { name: "Users", href: "/users" },
  { name: "Profile", href: "/profile" },
  { name: "Reports", href: "/reports" },
  { name: "Chat History", href: "/chathistory"},
  { name: "Chat App", href: "/ChatApp" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminSideBar({ handleLogout, userDetails }) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    notify("success", "Successfully logged out");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    handleLogout();
    navigate("/");
  };

  return (
    <>
      <nav className="flex flex-col w-2/12 items-center m-4 bg-white shadow-md rounded-md justify-start  p-4">
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
            className="rounded-full ml-16 mb-4 bg-black p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
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
