import React from "react";
import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#262626] py-6 w-full">
      <div className="flex container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-2  border-red-500 p-2 gap-6">
          {/* About Us */}
          <div className="text-white border-2 p-4 border-blue-500">
            <h4 className="text-xl font-bold mb-4">About Us</h4>
            <p>
              EasyRent is a car rental website that provides a seamless and hassle-free experience to our customers. We offer a platform for car owners to list their cars for rent, allowing renters to easily find and book cars that meet their needs.
            </p>
            <h2 className="mt-4 font-bold text-[#CC6200] text-2xl">EasyRent</h2>
          </div>

          {/* Contact Info */}
          <div className="text-white border-2 p-4 border-yellow-500" >
            <h4 className="text-xl font-bold mb-4">Contact Info</h4>
            <p>
              Phone: 123-456-7890
            </p>
            <p>
              Street Address: 123 EasyRent St, City, Country
            </p>
            <p>
              Opening Hours: Mon-Fri: 9am-5pm
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center items-center space-x-4 p-4 border-2 border-red-500 ">
            <a href="https://www.facebook.com">
              <FaFacebook className="text-white text-4xl hover:text-blue-500" />
            </a>
            <a href="https://www.instagram.com">
              <FaInstagram className="text-white text-4xl hover:text-pink-500" />
            </a>
            <a href="https://www.github.com">
              <FaGithub className="text-white text-4xl  hover:text-gray-500" />
            </a>
          </div>
        </div>
        <span className=" text-white p-2 m-2">© Copyright EasyRent 2023</span>
      </div>
    </footer>
  );
}