import React, { useState, useContext } from "react";
import { addCar } from "../api/UserApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { CarMakesAndModels } from "../res/CarMakesAndModels";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { AllCarsContext } from "../contexts/AllCarsContext";
import { getCar } from "../api/CarApi";
import { selectStyle } from "../res/SelectStyle";
import { notify } from "../HelperFunctions/Notify";
import {insertActivity} from "../api/AdminApi";

export default function AddCar() {
 
  // get the userId from the local storage. so we can send it with the car object
  const userId = localStorage.getItem("userId");

  // create user navigate object.
  const navigate = useNavigate();

  const { setAllCars } = useContext(AllCarsContext);

  const sortedManufacturers = CarMakesAndModels.map((make) => ({
    value: make.brand,
    label: make.brand,
  })).sort((a, b) => a.label.localeCompare(b.label));
  const [manufacturers, setManufacturers] = useState(sortedManufacturers);
  const [models, setModels] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [platesNumber, setPlatesNumber] = useState(1000000);
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [seatsAmount, setSeatsAmount] = useState("");
  const [engineType, setEngineType] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [description, setDescription] = useState("");
  const [rentalPricePerDay, setRentalPricePerDay] = useState(30);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleManufacturerChange = (selectedOption) => {
    setSelectedManufacturer(selectedOption);
    const manufacturerModels = CarMakesAndModels.find(
      (make) => make.brand === selectedOption.value
    ).models;
    setModels(manufacturerModels);
    setSelectedModel(""); // Clear the selected model when the manufacturer changes
  };
  const handleModelChange = (selectedOption) => {
    setSelectedModel(selectedOption.value);
  };

  const handlePlatesNumberChange = (event) => {
    setPlatesNumber(event.target.value);
  };

  const handleYearChange = (selectedOption) => {
    setYear(selectedOption);
  };

  const handleColorChange = (selectedOption) => {
    setColor(selectedOption);
  };

  const handleSeatsAmountChange = (selectedOption) => {
    setSeatsAmount(selectedOption);
  };

  const handleEngineTypeChange = (selectedOption) => {
    setEngineType(selectedOption);
  };

  const handleTransmissionTypeChange = (selectedOption) => {
    setTransmissionType(selectedOption);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleRentalPricePerDayChange = (event) => {
    setRentalPricePerDay(event.target.value);
  };

  const uploadImages = (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("carpics", files[i]);
    }

    return axios.post("http://localhost:3001/cars/uploadImages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleImageUpload = (event) => {
    const fileList = event.target.files;
    const files = Array.from(fileList);
    setUploadedImages(files); // Store the selected files temporarily
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !selectedManufacturer ||
      !selectedModel ||
      platesNumber === "" ||
      !year ||
      !color ||
      !seatsAmount ||
      !engineType ||
      !transmissionType ||
      description === "" ||
      rentalPricePerDay === ""
    ) {
      setErrorMessage(
        "Please fill in all the car details(pictures are optional)"
      );
      return;
    }

    if(rentalPricePerDay < 30){
      setErrorMessage("Rental Price per day cant be negative number or below 30")
      return;
    }
    if(platesNumber < 1000000 || platesNumber > 99999999){
      setErrorMessage("Car plates number must be a 7 or 8 digits numbers only")
      return;
    }
    getCar(platesNumber)
      .then((res) => {
        if (res.data.length > 0) {
          setErrorMessage(
            "A car with this plates number already exists, check your cars list or enter a different one"
          );
          return;
        } else {
          uploadImages(uploadedImages)
            .then((response) => {
              const { files } = response.data;
              const filenames = files.map((url) => {
                const pathname = new URL(url).pathname;
                return pathname.substring(pathname.lastIndexOf("/") + 1);
              });
              const defaultImageUrl = "default-car.jpg"; // Replace with your actual default image URL
              const carData = {
                Manufacturer_Name: selectedManufacturer.value,
                Manufacturer_Code: selectedManufacturer.value.toLowerCase(),
                model_name: selectedModel,
                model_code: selectedModel.toLowerCase(),
                Plates_Number: platesNumber,
                Year: year.value,
                Color: color.value,
                Seats_Amount: seatsAmount.value,
                Engine_Type: engineType.value,
                Transmission_type: transmissionType.value,
                Description: description,
                Rental_Price_Per_Day: rentalPricePerDay,
                Renter_Id: userId,
                image_url: uploadedImages.length > 0 ? filenames : [defaultImageUrl],
              };
              addCar(carData)
                .then((res) => {
                  // update the allCars state
                  setAllCars((prevCars) => [...prevCars, res.data.car]);
                  notify("success", res.data.message);
                  const activityDetails = {
                    userId:userId,
                    activity_type:"New Car Inserted",
                    details: `User ${userId} Added a new car to the website of type : ${carData.Manufacturer_Name}${carData.model_name}`
                  }
                  insertActivity(activityDetails)
                  .then((res) => {
                    console.log(res.data);
                  })
                  .catch((error) => notify("error", error));
                  // navigate to the homepage after adding a car.
                  navigate("/homepage");
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((error) => {
              notify("error", "Failed to add car");
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 2xl:w-1/4 justify-center items-center bg-[#f6f6f6] shadow-lg rounded-lg p-6">
      <h2 className="text-2xl text-center font-semibold mb-4">Add Car</h2>

      <form className="w-full  p-6 mx-auto rounded-lg">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="manufacturer"
          >
            Manufacturer:
          </label>

          <Select
            value={selectedManufacturer}
            onChange={handleManufacturerChange}
            options={manufacturers}
            placeholder="Select Manufacturer"
            styles={selectStyle}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="model"
          >
            Model:
          </label>
          <Select
            classNamePrefix="react-select"
            options={models.map((model) => ({
              value: model,
              label: model,
            }))}
            value={
              selectedModel
                ? { value: selectedModel, label: selectedModel }
                : null
            } // Update the line here
            onChange={handleModelChange}
            isDisabled={!selectedManufacturer}
            styles={selectStyle}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="platesNumber"
          >
            Plates Number:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="platesNumber"
            type="number"
            value={platesNumber}
            onChange={handlePlatesNumberChange}
            min={1000000}
            max={99999999}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="year"
          >
            Year:
          </label>
          <Select
            value={year}
            onChange={handleYearChange}
            options={Array.from({ length: 2025 - 1990 }, (_, index) => ({
              value: 1990 + index,
              label: (1990 + index).toString(),
            }))}
            placeholder="Select Year"
            styles={selectStyle}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="color"
          >
            Color:
          </label>
          <Select
            value={color}
            onChange={handleColorChange}
            options={[
              "Red",
              "Black",
              "Blue",
              "Green",
              "Yellow",
              "Orange",
              "Purple",
              "Pink",
              "Gray",
              "Brown",
              "White",
              "Silver",
              "Gold",
              "Bronze",
              "Beige",
              "Champagne",
              "Maroon",
              "Navy",
              "Teal",
              "Charcoal",
              "Gunmetal",
              "Turquoise",
              "Burgundy",
              "Ivory",
              "Cream",
              "Mocha",
              "Indigo",
              "Lavender",
              "Ruby",
              "Emerald",
              "Sapphire",
              "Amber",
              "Copper",
              "Pearl",
              "Platinum",
              "Rust",
              "Steel",
              "Midnight Blue",
              "Sunset Orange",
              "Electric Blue",
              "Lime Green",
              "Deep Ocean",
              "Crimson",
              "Mahogany",
              "Tangerine",
              "Olive",
              "Graphite",
              "Cobalt",
              "Mint Green",
              "Chocolate",
              "Frost White",
            ].map((colorOption) => ({
              value: colorOption,
              label: colorOption,
            }))}
            placeholder="Select Color"
            styles={selectStyle}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="seatsAmount"
          >
            Seats Amount:
          </label>
          <Select
            value={seatsAmount}
            onChange={handleSeatsAmountChange}
            options={[
              { value: 2, label: "2" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 7, label: "7" },
              { value: 8, label: "8" },
              { value: 9, label: "9" },
              { value: 12, label: "12" },
              { value: 15, label: "15" },
            ]}
            placeholder="Select Seats Amount"
            styles={selectStyle}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="engineType"
          >
            Engine Type:
          </label>
          <Select
            value={engineType}
            onChange={handleEngineTypeChange}
            options={["Petrol", "Diesel", "Electric", "Hybrid"].map(
              (engineOption) => ({
                value: engineOption,
                label: engineOption,
              })
            )}
            placeholder="Select Engine Type"
            styles={selectStyle}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="transmissionType"
          >
            Transmission Type:
          </label>
          <Select
            value={transmissionType}
            onChange={handleTransmissionTypeChange}
            options={["Manual", "Auto"].map((transmissionOption) => ({
              value: transmissionOption,
              label: transmissionOption,
            }))}
            placeholder="Select Transmission Type"
            styles={selectStyle}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="rentalPricePerDay"
          >
            Rental Price Per Day:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="rentalPricePerDay"
            type="number"
            min={30}
            value={rentalPricePerDay}
            onChange={handleRentalPricePerDayChange}
          />
        </div>

        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="carimages"
          >
            Choose Car Images :
          </label>
          <input
            id="carimages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </div>
        <div className="flex justify-center items-center mt-4  w-full ">
          <button
            onClick={handleSubmit}
            className="bg-[#CC6200] w-1/2 hover:text-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add
          </button>
        </div>
        <p className="m-2 text-center text-red-700 font-bold">{errorMessage}</p>
      </form>
    </div>
  );
}
