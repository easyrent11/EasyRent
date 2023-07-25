import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import  {TbManualGearbox} from "react-icons/tb";
import { FaCogs } from "react-icons/fa";


import { Link } from 'react-router-dom';


export default function Car({car,btnText,navigationLocation}) {
  console.log(navigationLocation);
  return (
    
    <article className='flex border-2 border-red-500 w-1/2 h-1/2'>
      <div className="w-full flex flex-col items-center justify-center rounded-md m-7 bg-white">
          <Link to={`${navigationLocation}/${car.Plates_Number}`}>
            <figure className="flex flex-col items-center w-full border-2  h-full justify-center ">
              <img
                className="w-full h-full rounded-md object-cover"
                src={`http://localhost:3001/images/${car.car_urls[0]}`}
                alt="Car Image"
              />
            </figure>
          </Link>

        <div className="flex flex-col justify-center  w-full m-4 p-1">
          <div className=" p-2">
            <h2 className="text-2xl">
              {car.Manufacturer_Code} {car.model_code}
            </h2>
          </div>

          <p className="p-2 text-md font-sans text-[#6d6d6d]">{car.Year}</p>

          <div className="flex justify-around w-full mb-2 p-2">
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
            <Link to={`${navigationLocation}/${car.Plates_Number}`}>
              <button className="bg-black text-white p-2 rounded-md">
                {btnText}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}