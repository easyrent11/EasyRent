import React from "react";
import logoImage from "../Assets/logo.png";
import { Link } from "react-router-dom";
export default function Logo() {
  return (
    <Link to="/">
      <figure className="flex items-center mr-10">
        <img className="w-12  h-auto md:w-16 lg:w-20" src={logoImage} alt="Logo" />
        <figcaption className="ml-2 text-xl font-bold">EasyRent</figcaption>
      </figure>
    </Link>
  );
}
