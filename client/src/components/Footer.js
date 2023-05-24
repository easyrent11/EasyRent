import React from "react";
import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import { FiMapPin, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-black py-6 w-full">
      <article className="flex items-center justify-around m-2 p-2  ">
        {/* About Us */}
        <div className="text-white w-1/4 p-4">
          <h4 className="text-xl font-bold mb-4">About Us</h4>
          <p>
            EasyRent is a car rental website that provides a seamless and
            hassle-free experience to our customers. We offer a platform for car
            owners to list their cars for rent, allowing renters to easily find
            and book cars that meet their needs.
          </p>
          <h2 className="mt-4 font-bold text-[#CC6200] text-3xl">EasyRent</h2>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-start justify-center text-white w-1/4 ml-4 ">
          <h4 className="text-xl font-bold p-2 m-1 mb-4">Contact Info</h4>
          <p className="flex items-center justify-center p-2 m-1">
            {" "}
            <FiMapPin className="m-1" />
            Street Address: 123 EasyRent St, Haifa, Israel
          </p>
          <p className="flex items-center justify-center p-2 m-1">
            {" "}
            <FiPhone className="m-1" /> Phone: 123-456-7890{" "}
          </p>
        </div>
        {/* Navigate */}
        <div className="flex flex-col items-center justify-center p-2 m-2 text-2lg  text-white">
          <h2 className="m-4"> Navigate </h2>
          <Link to="/Rating" className="text-[#CC6200]  mb-2">
            Rating
          </Link>
          <Link to="/FAQ" className="text-[#CC6200] mb-2">
            FAQ
          </Link>
          <Link to="/ContactUS" className="text-[#CC6200] mb-2 ">
            Contact Us
          </Link>
        </div>
      </article>

      {/* Social Media Icons */}
      <div className=" flex justify-center  flex-1 items-center space-x-4 pb-8 m-10 border-b border-white border-opacity-30">
        <a href="https://www.facebook.com">
          <FaFacebook className="text-white text-4xl hover:text-blue-500" />
        </a>
        <a href="https://www.instagram.com">
          <FaInstagram className="text-white text-4xl hover:text-pink-500" />
        </a>
        <a href="https://github.com/easyrent11">
          <FaGithub className="text-white text-4xl  hover:text-gray-500" />
        </a>
      </div>

      <div className="m-4 p-4 ">
        <span className=" text-white text-lg p-2 m-w-full m-2 ">
          © Copyright EasyRent 2023
        </span>
      </div>
    </footer>
  );
}
