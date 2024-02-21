import React from "react";
import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

export default function Footer() {
  const isAdmin = localStorage.getItem("isAdmin");
  return (
    <footer className="bg-black  py-6 w-full">
      <article className="flex flex-col  lg:flex-row lg:flex-wrap lg:flex-1 lg:items-start items-center justify-around m-2 p-2  ">
        {/* About Us */}
        <div className="text-white 2xl:w-1/5 w-full  p-2 lg:w-2/6 lg:p-4">
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
        <section
          id="contactus"
          className="flex flex-col w-full  lg:flex-1 2xl:items-center 2xl:w-1/5 2xl:flex-none   p-2 items-start  justify-center text-white lg:w-1/4 lg:ml-4"
        >
          <h4 className="text-xl font-bold m-2">Contact Info</h4>
          <p className="flex items-center lg:mt-4 lg:mb-4">
            <FiMapPin className="m-1" />
            Street Address: 123 EasyRent St, Haifa, Israel
          </p>
          <p className="flex items-center lg:mb-4 justify-center">
            <FiPhone className="m-1" /> Phone: 123-456-7890
          </p>
          <p className="flex items-center lg:mb-4 justify-center">
            <FiMail className="m-1" /> Email: easyrent11@outlook.com
          </p>
        </section>
        {/* Navigate */}
        {isAdmin !== "true" && (
          <div className="flex flex-col  w-full  lg:w-2/12 2xl:w-1/5 items-start lg:items-center lg:justify-center m-4 lg:p-0 lg:m-0 lg:ml-1 text-2lg  text-white">
            <h2 className="m-4 text-2xl"> Navigate </h2>
            <Link to="/FAQ" className="text-[#CC6200] mt-0 m-4 lg:mb-2">
              FAQ
            </Link>
            <ScrollLink
              className="cursor-pointer lg:mb-2 m-4 mt-0 text-[#CC6200]"
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              duration={500}
            >
              {" "}
              About
            </ScrollLink>
          </div>
        )}
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
          © Copyright 2023, All rights reserved.
        </span>
      </div>
    </footer>
  );
}
