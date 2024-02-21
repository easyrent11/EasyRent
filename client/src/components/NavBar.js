import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Link as ScrollLink } from "react-scroll";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function NavBar({ openLogin, openRegister }) {
  const [showDropdownMenu, setShowDropdownMenu] = React.useState(false);
  const handleToggleDropdownMenu = () => {
    setShowDropdownMenu(!showDropdownMenu);
  };

  return (
    <>
      {/* Dropdown menu */}
      {showDropdownMenu && (
        <div className="lg:hidden xl:hidden 2xl:hidden absolute top-0 left-0 w-full bg-white z-50">
        <nav className="flex flex-col items-center">
            <Link
              className="m-2 p-2 w-full rounded-md text-[#404040] hover:bg-[#f6f6f6]"
              to="/"
            >
              Home
            </Link>
            <ScrollLink
              className="m-2 p-2 w-full rounded-md text-[#404040] hover:bg-[#f6f6f6]"
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              duration={500}
            >
              About
            </ScrollLink>
            <ScrollLink
              className="m-2 p-2 w-full rounded-md text-[#404040] hover:bg-[#f6f6f6]"
              activeClass="active"
              to="contactus"
              spy={true}
              smooth={true}
              duration={500}
            >
              Contact Us
            </ScrollLink>
            <button
              className="m-2 w-full text-start text-[#404040] hover:bg-[#f6f6f6] rounded-md p-2"
              onClick={openLogin}
            >
              Login
            </button>
            <button
              className="m-2 w-full text-start p-2 rounded-md  text-[#404040] hover:bg-[#f6f6f6]"
              onClick={openRegister}
            >
              Register
            </button>
          </nav>
          <XMarkIcon
            className="w-8 h-8 cursor-pointer absolute top-0 right-0 m-2"
            onClick={handleToggleDropdownMenu}
          />
        </div>
      )}

      {/* Normal navbar */}
      <nav className="hidden lg:flex  justify-between w-full p-1 m-1">
        <div className="flex lg:w-4/5  items-center justify-start">
          <Logo />
          <Link
            className="m-2  p-2 rounded-md text-[#404040] hover:bg-[#f6f6f6]"
            to="/"
          >
            Home
          </Link>
          <ScrollLink
            className="cursor-pointer m-2 p-2 rounded-md text-[#404040] hover:bg-[#f6f6f6]"
            activeClass="active"
            to="about"
            spy={true}
            smooth={true}
            duration={500}
          >
            {" "}
            About
          </ScrollLink>

          <ScrollLink
            className="cursor-pointer m-2 p-2 rounded-md text-[#404040] hover:bg-[#f6f6f6]"
            activeClass="active"
            to="contactus"
            spy={true}
            smooth={true}
            duration={500}
          >
            {" "}
            Contact Us
          </ScrollLink>
        </div>
        <div className=" flex items-center  justify-end mr-56 lg:mr-0 2xl:mr-56 w-1/2">
          <button
            className="m-2 hover:border-[#b8b8b8] border-2 rounded-md p-2"
            onClick={openLogin}
          >
            Login
          </button>
          <button
            className="m-2 bg-black text-white p-2 rounded-md"
            onClick={openRegister}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hamburger icon for toggling dropdown menu on small screens */}
      {!showDropdownMenu && (
        <Bars3Icon
          className="w-16 h-16 lg:hidden xl:hidden 2xl:hidden cursor-pointer"
          onClick={handleToggleDropdownMenu}
        />
      )}
    </>
  );
}
