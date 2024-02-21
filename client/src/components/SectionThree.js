import React from "react";
import carIcon from "../Assets/CarIcon.png";
import { Element } from "react-scroll";

export default function SectionThree() {
  return (
    <Element
      id="about"
      name="about"
      className="flex flex-col  border-2 lg:flex-1 lg:justify-center items-center p-4 w-full bg-[#EDEDED]"
    >
      <section className="flex flex-col md:flex-row items-center justify-around w-full bg-[#EDEDED]">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-2xl  2xl:text-4xl text-center lg:mx-auto pb-4 text-black font-bold mb-4">
            About Us
          </h2>
          <p className="text-lg  2xl:p-2 2xl:text-start 2xl:text-2xl text-center text-black leading-loose">
            At <span className="text-[#CC6200] text-center">EasyRent</span>, we are
            dedicated to providing a seamless and hassle-free car rental
            experience to our customers. Our website offers a platform for car
            owners to list their cars for rent, and it allows renters to easily
            find and rent cars that meet their needs. Our mission is to make car
            rental easy, convenient, and affordable for everyone. We strive to
            provide exceptional customer service and support. Whether you're a
            car owner looking to earn some extra income, or a renter in need of
            a reliable car, <span className="text-[#CC6200]">EasyRent</span> is
            the ultimate car rental solution.
          </p>
        </div>

        <figure className="w-1/2 md:w-2/6 2xl:w-1/5 lg:w-1/4 mt-4 md:mt-0">
          <img src={carIcon} className="w-full h-full" alt="Car Icon" />
        </figure>
      </section>
    </Element>
  );
}
