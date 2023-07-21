import React, { useContext,useState,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { Carousel } from "@material-tailwind/react";
import { AllCarsContext } from "../contexts/AllCarsContext";
import PersonIcon from "@mui/icons-material/Person";
import {TbManualGearbox } from "react-icons/tb";
import { FaCogs } from "react-icons/fa";
import { getAllUserDetails } from "../api/UserApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CarView() {
  const navigate = useNavigate();
  // State variables for car owner and for error message.
  const [carOwnerName, setCarOwnerName] = useState("");
  const [carOwnerPicture, setCarOwnerPicture] = useState("");
  const notify = (status, message) =>
  status === "success" ? toast.success(message) : toast.error(message);
  let flag = false;

  const {allCars} = useContext(AllCarsContext);

  //getting the plates number out of the paramaters that are passed in the car component.
  let { platesNumber } = useParams();
  // extracting the car from the car list using the plates Number to match it to the one we click on.
  const car = allCars.find((car) => Number(car.Plates_Number) === Number(platesNumber));
  
  useEffect(() => {
    getAllUserDetails(car.Renter_Id)
      .then((result) => {
        setCarOwnerName(result.data[0].first_name);
        setCarOwnerPicture(result.data[0].picture);
      })
      .catch((err) => {
        notify('error', err);
      });
  }, [car.Renter_Id]);

  const handleCloseCarView = () => navigate('/homepage');
  
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="text-right m-2  w-full ">
      <button className="p-2 m-2 rounded-md   text-[#ffffff] bg-black" onClick={handleCloseCarView}>X</button>
      </div>
      <section className="w-full max-w-3xl mt-10">
        {/* A Photo slider that has all the car images where we can select and view them */}
        <Carousel className="rounded-md">
          {!flag ? (
            car.car_urls.map((image, index) => (
              <figure key={index} className="rounded-xl">
                <img
                  src={`http://localhost:3001/images/${image}`}
                  alt={`Car Pic ${index + 1}`}
                  className="object-cover w-full h-80"
                />
              </figure>
            ))
          ) : (
            <figure>
              <img src="/images/noImages.png" />
            </figure>
          )}
        </Carousel>
      </section>
      {/* Displaying additional car information. */}

      <div className="flex p-2 m-2">
        <section className="w-full max-w-3xl mt-10 p-6 mr-4  bg-white shadow-md rounded-lg">
          <h2 className="text-2xl">Car Owner : </h2>
          <figure className="flex flex-col items-center justify-center ">
            <img
              src={`http://localhost:3001/images/${carOwnerPicture}`}
              className="border-2 flex w-32 h-32 rounded-full"
            />
            <figcaption className="text-2xl">{carOwnerName}</figcaption>
          </figure>

          <div className="flex flex-col justify-around items-start mb-4 ">
            <h2 className="text-2xl font-bold">
              {car.Manufacturer_Code} {car.model_code}
            </h2>
            <p className="text-gray-500 text-lg">Year: {car.Year}</p>
          </div>

          <div className="flex items-center justify-between ">
            <div className="w-full">
              <p className="text-gray-700 text-xl mb-2">
                Features and Specifications:
              </p>
              <ul className="  flex flex-col justify-center items-start w-full">
                <li>
                  <PersonIcon className="inline-block text-3xl m-2" />
                  {car.Seats_Amount}
                </li>
                <li>
                  <TbManualGearbox className="inline-block text-3xl m-2" />
                   {car.Transmission_type}
                </li>
                <li>
                  <FaCogs className="inline-block text-3xl m-2" />
                  
                  {car.Engine_Type}
                </li>
              </ul>
            </div>
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
              <p className="text-xl font-bold  text-[#CC6200]">
                ₪{car.Rental_Price_Per_Day}/day
              </p>
              {/* ₪{car.RentalPrice * numberOfDays * (1 + 0.05)} */}
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