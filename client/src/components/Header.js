import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
export default function Header() {
  return (
    <header className="w-full flex justify-around align-center">
      <nav className="flex justify-between w-full p-3 m-1">
        <Logo/>
        <div className="flex items-center justify-center w-1/2 ">
          <Link
            className="m-2 hover:text-[#CC6200]"
            to="/Login"
          >
            Login
          </Link>
          <Link
            className="m-2 hover:text-[#CC6200]"
            to="/Register"
          >
            Register
          </Link>
          <Link
            className="m-2 hover:text-[#CC6200] "
            to="/"
          >
            Home
          </Link>
          <Link
            className="m-2 hover:text-[#CC6200] hover:border-b-2 border-black"
            to="/about"
          >
            About
          </Link>
          <Link
            className="m-2 hover:text-[#CC6200] hover:border-b-2 border-black"
            to="/contact"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
