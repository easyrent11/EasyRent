import React from "react";
import { Link, useNavigate} from "react-router-dom";
import Logo from "./Logo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




export default function UserNav({ handleLogout }) {

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
          <Link className="m-2 hover:text-[#CC6200] " to="/homepage"> Home </Link>
          <Link className="m-2 hover:text-[#CC6200]" to="/AddCar"> Share your car </Link>
          <Link className="m-2 hover:text-[#CC6200]" to="/chatapp"> Chat </Link>
          <Link className="m-2 hover:text-[#CC6200]" to="/user/ContactUs"> Contact Us </Link>
          <button className="m-2 hover:text-[#CC6200]" to="/notifications"> Notifications </button>
          <button  className="m-2 hover:text-[#CC6200]" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
