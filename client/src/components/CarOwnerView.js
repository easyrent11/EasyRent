import React, { useState, useContext } from "react";
import { Carousel } from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PersonIcon from "@mui/icons-material/Person";
import { TbManualGearbox } from "react-icons/tb";
import { FaCogs } from "react-icons/fa";
import { updateCarDetails } from "../api/CarApi";
import { CarMakesAndModels } from "../res/CarMakesAndModels";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AllCarsContext } from "../contexts/AllCarsContext";
export default function CarOwnerView() {
  const notify = (status, message) =>
    status === "success" ? toast.success(message) : toast.error(message);
  let flag = false;

  const navigate = useNavigate();

  const { allCars } = useContext(AllCarsContext);

  //getting the plates number out of the paramaters that are passed in the car component.
  let { platesNumber } = useParams();
  // extracting the car from the car list using the plates Number to match it to the one we click on.
  const car = allCars.find(
    (car) => Number(car.Plates_Number) === Number(platesNumber)
  );
  const [editMode, setEditMode] = useState(false);
  const [updatedManufacturerCode, setUpdatedManufacturerCode] = useState(
    car.Manufacturer_Code
  );
  const [updatedModelCode, setUpdatedModelCode] = useState(car.model_code);
  const [updatedYear, setUpdatedYear] = useState(car.Year);
  const [updatedColor, setUpdatedColor] = useState(car.Color);
  const [updatedSeatsAmount, setUpdatedSeatsAmount] = useState(
    car.Seats_Amount
  );
  const [updatedEngineType, setUpdatedEngineType] = useState(car.Engine_Type);
  const [updatedTransmissionType, setUpdatedTransmissionType] = useState(
    car.Transmission_type
  );
  const [updatedDescription, setUpdatedDescription] = useState(car.Description);
  const [updatedRentalPrice, setUpdatedRentalPrice] = useState(
    car.Rental_Price_Per_Day
  );

  const handleSaveClick = () => {
    const updatedCarDetails = {
      Manufacturer_Code: updatedManufacturerCode.toLowerCase(),
      model_name: updatedModelCode,
      model_code: updatedModelCode.toLowerCase(),
      Manufacturer_Name: updatedManufacturerCode.toUpperCase(),
      Year: updatedYear,
      Color: updatedColor,
      Seats_Amount: updatedSeatsAmount,
      Engine_Type: updatedEngineType,
      Transmission_type: updatedTransmissionType,
      Description: updatedDescription,
      Rental_Price_Per_Day: updatedRentalPrice,
      Plates_Number: car.Plates_Number,
    };
    // checking if we made any changes to any car field.
    const equal =
      updatedCarDetails.Manufacturer_Code === car.Manufacturer_Code&&
      updatedCarDetails.model_code === car.model_code&&
      updatedCarDetails.Year === car.Year &&
      updatedCarDetails.Color === car.Color &&
      updatedCarDetails.Seats_Amount === car.Seats_Amount &&
      updatedCarDetails.Engine_Type === car.Engine_Type &&
      updatedCarDetails.Transmission_type === car.Transmission_type &&
      updatedCarDetails.Description === car.Description &&
      updatedCarDetails.Rental_Price_Per_Day === car.Rental_Price_Per_Day &&
      updatedCarDetails.Plates_Number === car.Plates_Number;
      // if the user didnt make any changes exit edit mode and make no changes.
      if(equal){
        setEditMode(false);
        return;
      }
    updateCarDetails(updatedCarDetails)
      .then(() => {
        console.log("Car details updated successfully");
        setEditMode(false);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Failed to update car details:", error);
      });
  };

  const getModelOptions = () => {
    const selectedBrand = CarMakesAndModels.find(
      ({ brand }) => brand === updatedManufacturerCode
    );
    return (
      selectedBrand?.models.map((model) => ({
        value: model,
        label: model,
      })) || []
    );
  };
  const handleCancelClick = () => {
    // Revert changes by setting the state back to the original car data
    setUpdatedManufacturerCode(car.Manufacturer_Code);
    setUpdatedModelCode(car.model_code);
    setUpdatedYear(car.Year);
    setUpdatedColor(car.Color);
    setUpdatedSeatsAmount(car.Seats_Amount);
    setUpdatedEngineType(car.Engine_Type);
    setUpdatedTransmissionType(car.Transmission_type);
    setUpdatedDescription(car.Description);
    setUpdatedRentalPrice(car.Rental_Price_Per_Day);

    setEditMode(false);
  };

  return (
    <div className="w-full flex-1 border-2 border-red-500">
      <button
        className="absolute top-4 right-4 text-white font-bold py-2 px-4 rounded bg-red-500"
        onClick={() => navigate("/UserProfile")}
      >
        X
      </button>
      <div className="w-full flex justify-center">
        <Carousel className="max-w-lg">
          {car.car_urls.map((image, index) => (
            <div key={index}>
              <img
                src={`http://localhost:3001/images/${image}`}
                alt={`Car Pic ${index + 1}`}
                className="h-96 object-cover w-full rounded-lg"
              />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="w-full p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-2">
              {editMode ? (
                <>
                  <div className="mb-2">
                    <label
                      className="text-sm font-semibold"
                      htmlFor="manufacturer"
                    >
                      Manufacturer:
                    </label>
                    <Select
                      value={{
                        value: updatedManufacturerCode,
                        label: updatedManufacturerCode,
                      }}
                      onChange={(selectedOption) =>
                        setUpdatedManufacturerCode(selectedOption.value)
                      }
                      options={CarMakesAndModels.map(({ brand }) => ({
                        value: brand,
                        label: brand,
                      }))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-sm font-semibold" htmlFor="model">
                      Model:
                    </label>
                    <Select
                      value={{
                        value: updatedModelCode,
                        label: updatedModelCode,
                      }}
                      onChange={(selectedOption) =>
                        setUpdatedModelCode(selectedOption.value)
                      }
                      options={getModelOptions()}
                      isDisabled={!updatedManufacturerCode}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </>
              ) : (
                `${car.Manufacturer_Code} ${car.model_code}`
              )}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {editMode ? (
                <>
                  <label className="text-sm font-semibold" htmlFor="year">
                    Year:
                  </label>
                  <Select
                    value={{
                      value: updatedYear,
                      label: updatedYear.toString(),
                    }}
                    onChange={(selectedOption) =>
                      setUpdatedYear(selectedOption.value)
                    }
                    options={Array.from(
                      { length: 2025 - 1990 },
                      (_, index) => ({
                        value: 1990 + index,
                        label: (1990 + index).toString(),
                      })
                    )}
                    className="w-full p-2 border rounded-md"
                  />
                </>
              ) : (
                `Year: ${car.Year}`
              )}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <h3 className="text-xl font-semibold mb-2">
                Rental Price (per day)
              </h3>
              <div className="flex items-center">
                {editMode ? (
                  <input
                    type="number"
                    value={updatedRentalPrice}
                    onChange={(e) => setUpdatedRentalPrice(e.target.value)}
                    className="w-24 p-2 border rounded-md mr-4"
                  />
                ) : (
                  <p>{car.Rental_Price_Per_Day} USD</p>
                )}
                {editMode && (
                  <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSaveClick}
                  >
                    Save
                  </button>
                )}
                {editMode && (
                  <button
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded ml-4"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <ul className="flex flex-wrap mt-4 mb-2">
              <li className="flex items-center mr-8">
                <PersonIcon className="text-blue-500 mr-2" />
                {editMode ? (
                  <>
                    <label
                      className="text-sm font-semibold"
                      htmlFor="seatsAmount"
                    >
                      Seats Amount:
                    </label>
                    <Select
                      value={{
                        value: updatedSeatsAmount,
                        label: updatedSeatsAmount.toString(),
                      }}
                      onChange={(selectedOption) =>
                        setUpdatedSeatsAmount(selectedOption.value)
                      }
                      options={Array.from(
                        { length: 15 - 2 + 1 },
                        (_, index) => ({
                          value: 2 + index,
                          label: (2 + index).toString(),
                        })
                      )}
                      className="w-full p-2 border rounded-md ml-2"
                    />
                  </>
                ) : (
                  `Seats Amount: ${car.Seats_Amount}`
                )}
              </li>
              <li className="flex items-center mr-8">
                <TbManualGearbox className="text-blue-500 mr-2" />
                {editMode ? (
                  <>
                    <label
                      className="text-sm font-semibold"
                      htmlFor="transmissionType"
                    >
                      Transmission Type:
                    </label>
                    <Select
                      value={{
                        value: updatedTransmissionType,
                        label: updatedTransmissionType,
                      }}
                      onChange={(selectedOption) =>
                        setUpdatedTransmissionType(selectedOption.value)
                      }
                      options={["Manual", "Auto"].map((transmissionOption) => ({
                        value: transmissionOption,
                        label: transmissionOption,
                      }))}
                      className="w-full p-2 border rounded-md ml-2"
                    />
                  </>
                ) : (
                  `Transmission Type: ${car.Transmission_type}`
                )}
              </li>
              <li className="flex items-center">
                <FaCogs className="text-blue-500 mr-2" />
                {editMode ? (
                  <>
                    <label
                      className="text-sm font-semibold"
                      htmlFor="engineType"
                    >
                      Engine Type:
                    </label>
                    <Select
                      value={{
                        value: updatedEngineType,
                        label: updatedEngineType,
                      }}
                      onChange={(selectedOption) =>
                        setUpdatedEngineType(selectedOption.value)
                      }
                      options={["Petrol", "Diesel", "Electric", "Hybrid"].map(
                        (engineOption) => ({
                          value: engineOption,
                          label: engineOption,
                        })
                      )}
                      className="w-full p-2 border rounded-md ml-2"
                    />
                  </>
                ) : (
                  `Engine Type: ${car.Engine_Type}`
                )}
              </li>
            </ul>
            <ul className="flex mt-4">
              <li className="mr-8">
                <h3 className="text-sm font-semibold mb-2">Color:</h3>
                {editMode ? (
                  <Select
                    value={{ value: updatedColor, label: updatedColor }}
                    onChange={(selectedOption) =>
                      setUpdatedColor(selectedOption.value)
                    }
                    options={[
                      "red",
                      "black",
                      "blue",
                      "green",
                      "yellow",
                      "orange",
                      "purple",
                      "pink",
                      "gray",
                      "brown",
                      "white",
                    ].map((colorOption) => ({
                      value: colorOption,
                      label: colorOption,
                    }))}
                    className="w-36 p-2 border rounded-md"
                  />
                ) : (
                  `${car.Color}`
                )}
              </li>
              <li>
                <h3 className="text-sm font-semibold mb-2">Description:</h3>
                {editMode ? (
                  <textarea
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                    className="w-64 h-24 p-2 border rounded-md"
                  />
                ) : (
                  <p className="text-sm">{car.Description}</p>
                )}
              </li>
            </ul>
          </div>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
