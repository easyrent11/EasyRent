import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import  {TbManualGearbox} from "react-icons/tb";
import { FaCogs } from "react-icons/fa";


import { Link } from 'react-router-dom';


export default function Car({car}) {
 
  return (
    <div className="flex flex-col items-center justify-center rounded-md w-1/2 bg-[#FFFFFF] border-2 border-green-500  m-2 p-2 ">
        <Link to={`/CarView/${car.Plates_Number}`}>
          <figure className="flex flex-col items-center w-full  h-40 justify-center border-2 border-blue-500">
            <img
              className="w-full h-full rounded-md "
              src={`http://localhost:3001/images/${car.car_urls[0]}`}
              alt="Car Image"
            />
          </figure>
        </Link>

      <div className="flex flex-col justify-center border-2 border-black w-full m-4 p-1">
        <div className=" p-2">
          <h2 className="text-2xl">
            {car.Manufacturer_Code} {car.model_code}
          </h2>
        </div>

        <p className="p-2 text-md font-sans text-[#6d6d6d]">{car.Year}</p>

        <div className="flex justify-around border-2 border-blue-500 w-full mb-2 p-2">
          <p className="m-1 ">
            {" "}
            <PersonIcon className="m-1 text-[#777777]" />
            {car.Seats_Amount}
          </p>
          <p className="flex items-center">
            <FaCogs className="m-1 text-2xl text-[#777777]" />
            {car.Engine_Type}
          </p>
          <p className="flex items-center">
            <TbManualGearbox className="m-1 text-2xl text-[#777777]" />
            {car.Transmission_type}
          </p>
        </div>

        <div className="flex items-center justify-between p-2">
          <p className="text-[#00215e]">₪{car.Rental_Price_Per_Day}/day</p>
          <button className="bg-black text-white p-2 rounded-md">
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
}