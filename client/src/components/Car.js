import React, {useContext} from 'react';
import PersonIcon from '@mui/icons-material/Person';
import  {TbManualGearbox} from "react-icons/tb";
import { FaCogs } from "react-icons/fa";
import {xorEncrypt} from "../HelperFunctions/Encrypt";
import {deleteCar} from "../api/CarApi";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AllCarsContext } from '../contexts/AllCarsContext';
import {notify} from "../HelperFunctions/Notify";

export default function Car({car,btnText,navigationLocation}) {
  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;
  const {setAllCars} = useContext(AllCarsContext);
  const navigate = useNavigate();
  const handleDeleteClick = () => {
    const platesNumber = car.Plates_Number;
    if (window.confirm("Are you sure you want to delete this car?")) {
      deleteCar(platesNumber)
        .then(() => {
        // Remove the deleted car from the AllCarsContext
          setAllCars((prevCars) => prevCars.filter((c) => c.Plates_Number !== platesNumber));
          notify("success", "Car Deleted Successfully");
        })
        .catch((error) => {
          notify("error",`Failed To Delete Car ${error}`);
        });
    }
  };

  const encryptedPlatesNumber = xorEncrypt(car.Plates_Number.toString(), secretKey);
  return (
    
    <article className='flex border-2 border-red-500 w-1/2 h-1/2'>
      <div className="w-full flex flex-col items-center justify-center rounded-md m-7 bg-white">
          <Link to={`${navigationLocation}/${encryptedPlatesNumber}`}>
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
            <Link to={`${navigationLocation}/${encryptedPlatesNumber}`}>
              <button className="bg-black text-white p-2 rounded-md">
                {btnText}
              </button>
            </Link>
            <button onClick={handleDeleteClick} className='bg-red-500 m-2 text-white p-2 rounded-md'>Delete</button>
          </div>
        </div>
      </div>
    </article>
  );
}