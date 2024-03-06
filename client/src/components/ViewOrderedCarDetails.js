import React, { useState, useEffect, useMemo } from "react";
import { useParams} from "react-router-dom";
import { Carousel } from "@material-tailwind/react";
import PersonIcon from "@mui/icons-material/Person";
import { TbManualGearbox } from "react-icons/tb";
import { FaCogs } from "react-icons/fa";
import { getAllUserDetails} from "../api/UserApi";
import { FaTimes } from "react-icons/fa";
import { xorDecrypt } from "../HelperFunctions/Encrypt";
import { notify } from "../HelperFunctions/Notify";
import { getCar } from "../api/CarApi";

import { useNavigate } from "react-router-dom";


export default function ViewOrderedCarDetails() {

  // State variables for car owner and for error message.
  const [carOwnerName, setCarOwnerName] = useState("");
  const [carOwnerPicture, setCarOwnerPicture] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [car, setCar] = useState([]);
  const navigate = useNavigate();

  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;

  //getting encrypted the plates number out of the paramaters that are passed in the car component.
  let { encryptedPlatesNumber } = useParams();
  // decryping the encrypted plates number from the parameters.
  let platesNumber = xorDecrypt(encryptedPlatesNumber, secretKey);

  // usememo that will fetch a car and its images based on plates number
  useMemo(() => {
    getCar(platesNumber)
      .then((res) => {
        setCar(res.data[0]);
      })
      .catch((error) => {
        notify("error", error);
      });
  }, []);

  const carImageUrls = useMemo(() => {
    if (car && car.car_urls) {
      return car.car_urls.split(",");
    }
    return [];
  }, [car]);

  // use effect that will fetch all user details based on renter id.
  useEffect(() => {
    getAllUserDetails(car.Renter_Id)
      .then((result) => {
        setCarOwnerName(result.data[0].first_name);
        setCarOwnerPicture(result.data[0].picture);
        setOwnerId(result.data[0].Id);
      })
      .catch((err) => {
        notify("error", err);
      });
  }, [car]);

  // get the rentee id.
  let renteeId = localStorage.getItem("userId");
  renteeId = renteeId ? parseInt(renteeId) : null;

  
  // handling the User View window close click.
  const handleCloseCarView = () => {
    navigate('/Orders/')
  };


  return (
    <div className="shadow-lg min-h-full  mb-4 bg-[#f6f6f6] rounded-lg flex flex-col items-center">
      <div className="text-right m-2  w-full ">
        <button
          className="p-2 m-2 rounded-md text-2xl text-gray-500 transform hover:scale-110"
          onClick={handleCloseCarView}
        >
          <FaTimes />
        </button>
      </div>
      <section className="w-full max-w-3xl mt-10">
        {/* A Photo slider that has all the car images where we can select and view them */}
        <Carousel className="rounded-md">
          {carImageUrls.length > 0 ? (
            carImageUrls.map((imageUrl, index) => (
              <figure key={index} className="rounded-xl">
                <img
                  src={`http://localhost:3001/images/${imageUrl}`}
                  alt={`Car Pic ${index + 1}`}
                  className="object-cover w-full h-80"
                />
              </figure>
            ))
          ) : (
            <figure>
              <img src="/images/noImages.png" alt="No Images" />
            </figure>
          )}
        </Carousel>
      </section>
      {/* Displaying additional car information. */}

      <div className="flex w-full flex-col lg:flex-row">
        <section className="w-full max-w-3xl mt-2 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl">Car Owner : </h2>
          <figure className="flex flex-col justify-center ">
            <img
              src={`http://localhost:3001/images/${carOwnerPicture}`}
              className="border-2 flex w-32 h-32 rounded-full"
            />
            <figcaption className="text-2xl ml-6">{carOwnerName}</figcaption>
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
      </div>
    </div>
  );
}
