import React from "react";
import { Link} from "react-router-dom";
import Logo from "./Logo";
import { Link as ScrollLink } from "react-scroll";


export default function NavBar({ openLogin, openRegister }) {
  return (
    <>
      <nav className="flex justify-between items-center w-full p-1 m-1">
        <div className=" flex items-center justify-start">
          <Logo/>
          <Link className="m-2  p-2 rounded-md text-[#404040] hover:bg-[#f6f6f6]" to="/">
            Home
          </Link>
            <ScrollLink
              className="cursor-pointer m-2 p-2 rounded-md text-[#404040] hover:bg-[#f6f6f6]"
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              duration={500}
            > About 
            </ScrollLink>
          {/* <Link className="m-2 p-2 rounded-md  text-[#404040]  hover:bg-[#f6f6f6]" to="/ContactUs">
            Contact
          </Link> */}
        </div>
        <div className=" flex items-center justify-end mr-56 w-1/2">
          <button className="m-2 hover:border-[#b8b8b8] border-2 rounded-md p-2" onClick={openLogin}>
            Login
          </button>
          <button className="m-2 bg-black text-white p-2 rounded-md" onClick={openRegister}>
            Register
          </button>
        </div>
      </nav>
    </>
  );
}
