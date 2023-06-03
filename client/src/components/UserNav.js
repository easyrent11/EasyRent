import React from "react";
import { Link, useNavigate} from "react-router-dom";
import Logo from "./Logo";
import { Link as ScrollLink } from "react-scroll";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




export default function UserNav({handleLogout}) {
  const navigate = useNavigate();
    const logout = () => {
        toast.success("Sucessfully logged out");
        localStorage.removeItem('token');
        handleLogout();
        navigate('/');
    };

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
          <button  className="m-2 hover:text-[#CC6200]" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
