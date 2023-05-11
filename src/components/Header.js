import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full flex justify-around align-center border-2 border-black">
      <h1 className="">EasyRent</h1>
      <nav className="flex justify-end w-full p-6 m-3 border-black border-2">
        <Link className="m-2" to="/Login">
          Login
        </Link>
        <Link className="m-2" to="/Register">
          Register
        </Link>
        <Link className="m-2" to="/">
          Home
        </Link>
        <Link className="m-2" to="/about">
          About
        </Link>
        <Link className="m-2" to="/contact">
          Contact
        </Link>
      </nav>
    </header>
  );
}
