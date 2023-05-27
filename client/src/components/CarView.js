import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "@material-tailwind/react";
import UserProfile from "./UserProfile";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import  {TbManualGearbox} from "react-icons/tb";
import {CarListContext}  from "../contexts/CarListContext";

export default function CarView() {
  const {carList}  = useContext(CarListContext);

  //getting the plates number out of the paramaters that are passed.
  let { platesNumber } = useParams();
  // extracting the car from the car list using the plates Number to match it to the one we click on.
  const car = carList.find((car) => Number(car.platesNumber) === Number(platesNumber));


  //function that will make the image full screen when clicked on.
  const handleImageClick = (e) => {
    e.target.requestFullScreen();
  }

  
  return (
    <div className="min-h-screen flex flex-col items-center border-2 border-blue-500">
      <section className="w-full max-w-3xl mt-10">
        {/* A Photo slider that has all the car images where we can select and view them */}
        <Carousel>
          {car.Images.map((image, index) => (
            <figure key={index} className="rounded-xl">
              <img
                onClick={handleImageClick}
                src={image}
                alt={`Car Pic ${index + 1}`}
                className="object-cover w-full h-80"
              />
            </figure>
          ))}
        </Carousel>
      </section>
      {/* Displaying additional car information. */}


      <div className="flex p-2 m-2">
        <section className="w-full max-w-3xl mt-10 p-6 mr-4  bg-white shadow-md rounded-lg">
          <UserProfile imagePath={"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"}/>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {car.Manufacturer} {car.Model}
            </h2>
            <p className="text-gray-500 text-lg">Year: {car.Year}</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 text-xl mb-2">
                Features and Specifications:
              </p>
              <ul className="space-y-2">
                <li>
                  <span className="font-bold">Seats:</span> {car.seats}
                </li>
                <li>
                  <span className="font-bold">Luggage:</span> {car.luggage}
                </li>
                <li>
                  <span className="font-bold">Gearbox:</span> {car.gearbox}
                </li>
              </ul>
            </div>

            <div>
              <p className="text-gray-700 text-xl mb-2">Rental Price:</p>
              <p className="text-3xl font-bold  text-[#CC6200]">
                ₪{car.RentalPrice}/day
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-[#CC6200] text-white py-2 px-4 rounded-lg">
              Rent Now
            </button>
          </div>
        </section>

        <section className="w-full max-w-3xl mt-10 p-6 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Book this car</h2>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              From Date:
            </label>
            <input
              className="border-2 border-gray-300 rounded-md p-2 w-full"
              type="date"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              To Date:
            </label>
            <input
              className="border-2 border-gray-300 rounded-md p-2 w-full"
              type="date"
            />
          </div>

          <p className="text-gray-500 mb-4">
            You'll pickup and return the key by meeting with the owner face to
            face.
          </p>

          <section className="flex flex-col ">
            <div>
              <p className="text-lg font-bold mb-2">
                Total Price (including fees):
              </p>
              {/* Calculate and display the total price including fees */}
              {/* Example: ₪{car.RentalPrice * numberOfDays * (1 + 0.05)} */}
            </div>

            <div>
              <button className="bg-[#CC6200] text-white py-2 px-4 rounded-lg m-1">
                Send Request
              </button>
              <button className="bg-[#CC6200] text-white py-2 px-4 rounded-lg m-1">
                Start Chat with Seller
              </button>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}