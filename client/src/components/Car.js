import React, { useContext } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { TbManualGearbox } from "react-icons/tb";
import { FaCogs } from "react-icons/fa";
import { xorEncrypt } from "../HelperFunctions/Encrypt";
import { deleteCar } from "../api/CarApi";
import { Link } from "react-router-dom";
import { AllCarsContext } from "../contexts/AllCarsContext";
import { notify } from "../HelperFunctions/Notify";

export default function Car({ car, btnText, navigationLocation }) {
  // getting the secret key for encryption.
  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;
  // getting the set all cars function from the context.
  const { setAllCars } = useContext(AllCarsContext);

  // getting the ownerId of the car and checking if its the logged in user so we know if to display the Rent Now or not.
  const loggedInUser = localStorage.getItem("userId");
  const ownerIsLoggedUser = loggedInUser == car.Renter_Id;
  // if the rentee is the same as the logged in user then we want to change the navigation location to the car owner section.
  if (ownerIsLoggedUser) {
    navigationLocation = "/CarOwnerView";
  }
  // function that handles the delete car click.
  const handleDeleteClick = () => {
    const platesNumber = car.Plates_Number;
    if (window.confirm("Are you sure you want to delete this car?")) {
      deleteCar(platesNumber)
        .then((res) => {
          if(res.data.exists){
            // car exists in the orders and cant be deleted.
            alert(`${res.data.message}`)
            return;
          }
          // Remove the deleted car from the AllCarsContext
          setAllCars((prevCars) =>
            prevCars.filter((c) => c.Plates_Number !== platesNumber)
          );
          notify("success", res.message);
        })
        .catch((error) => {
          notify("error", `Failed To Delete Car ${error}`);
        });
    }
  };
  // function that handles the click on 'rent now' button or 'view car'
  const handleBtnClick = () => {
    if (!loggedInUser) {
      console.log("No user");
      return;
    }
  };

  const encryptedPlatesNumber = xorEncrypt(
    car.Plates_Number.toString(),
    secretKey
  );

  return (
    <article className="flex items-start justify-center w-full h-full p-4 ">
      <div className="w-full flex  mx-auto flex-col  items-center justify-center rounded-md m-7 bg-white">
        <Link to={`${navigationLocation}/${encryptedPlatesNumber}`}>
          <figure className="grid items-center justify-center relative max-w-full overflow-hidden">
            <img
              className="w-[700px]  h-[300px] cursor-pointer"
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

          <div className="flex items-center   justify-between p-2">
            <p className="text-[#00215e]">₪{car.Rental_Price_Per_Day}/day</p>
            <Link to={`${navigationLocation}/${encryptedPlatesNumber}`}>
              {!ownerIsLoggedUser && (
                <button
                  onClick={handleBtnClick}
                  className="bg-black text-white p-2 rounded-md"
                >
                  {btnText}
                </button>
              )}
            </Link>
            {(navigationLocation === "/CarOwnerView" && (
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 m-2 text-white p-2 rounded-md"
              >
                Delete
              </button>
            )) ||
              (ownerIsLoggedUser && (
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-500 m-2 text-white p-2 rounded-md"
                >
                  Delete
                </button>
              ))}
          </div>
        </div>
      </div>
    </article>
  );
}
