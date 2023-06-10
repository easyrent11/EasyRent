import React from "react";
import carIcon from "../Assets/CarIcon.png";
import { Element } from "react-scroll";
export default function SectionThree() {
  return (
    <>
      <Element id="about" name="about">
        <section
          id="about"
          className="flex items-center  p-4 justify-around w-full bg-[#EDEDED]"
        >
          <div className="flex flex-wrap w-2/6 p-4">
            <h2 className="text-2xl mx-auto pb-4 text-black font-bold mb-4">
              About Us
            </h2>
            <p className="text-lg text-black leading-loose">
              At <span className="text-[#CC6200]">EasyRent</span>, we are
              dedicated to providing a seamless and hassle-free car rental
              experience to our customers. Our website offers a platform for car
              owners to list their cars for rent, and it allows renters to
              easily find and rent cars that meet their needs. Our mission is to
              make car rental easy, convenient, and affordable for everyone. We
              strive to provide exceptional customer service and support.
              Whether you're a car owner looking to earn some extra income, or a
              renter in need of a reliable car,{" "}
              <span className="text-[#CC6200]">EasyRent</span> is the ultimate
              car rental solution.
            </p>
          </div>

          <figure className="w-1/4">
            <img src={carIcon} className="w-full h-full" alt="Car Icon" />
          </figure>
        </section>
      </Element>
    </>
  );
}
