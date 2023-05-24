import React from "react";
import { Link} from "react-router-dom";
import Logo from "./Logo";
import { Link as ScrollLink } from "react-scroll";


export default function NavBar({ openLogin, openRegister }) {
  return (
    <>
      <nav className="flex justify-between items-center w-full p-1 m-1">
        <Logo />
        <div className="flex items-center justify-center w-1/2">
          <Link className="m-2 hover:text-[#CC6200] " to="/">
            Home
          </Link>
          <ScrollLink
          className="cursor-pointer m-2  hover:text-[#CC6200]"
            activeClass="active"
            to="about"
            spy={true}
            smooth={true}
            duration={500}
          > About </ScrollLink>
          <Link className="m-2 hover:text-[#CC6200] " to="/ContactUs">
            Contact
          </Link>
          <button className="m-2 hover:text-[#CC6200]" onClick={openLogin}>
            Login
          </button>
          <button className="m-2 hover:text-[#CC6200]" onClick={openRegister}>
            Register
          </button>
        </div>
      </nav>
    </>
  );
}
