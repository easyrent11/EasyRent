import React, { useCallback, useContext, useState } from "react";
import { addCar } from "../api/CarApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { CarMakesAndModels } from "../res/CarMakesAndModels";
import Select from "react-select";
import {UserProfileDetails} from "../contexts/UserProfileDetails";

export default function AddCarForm() {
  const userDetails = useContext(UserProfileDetails);
  const userId = userDetails.Id;

  const sortedManufacturers = CarMakesAndModels.map((make) => ({
    value: make.brand,
    label: make.brand,
  })).sort((a, b) => a.label.localeCompare(b.label));
  const [manufacturers, setManufacturers] = useState(sortedManufacturers);
  const [models, setModels] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [platesNumber, setPlatesNumber] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [seatsAmount, setSeatsAmount] = useState("");
  const [engineType, setEngineType] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [description, setDescription] = useState("");
  const [rentalPricePerDay, setRentalPricePerDay] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);

  const notify = (status, message) =>
    status === "success" ? toast.success(message) : toast.error(message);

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
  
    uploadImages(uploadedImages)
      .then((response) => {
        const { files } = response.data;
        const filenames = files.map((url) => {
          const pathname = new URL(url).pathname;
          return pathname.substring(pathname.lastIndexOf("/") + 1);
        });
  
        const carData = {
          Manufacturer_Name: selectedManufacturer ? selectedManufacturer.value : "",
          Manufacturer_Code: selectedManufacturer
            ? selectedManufacturer.value.toLowerCase()
            : "",
          model_name: selectedModel,
          model_code: selectedModel ? selectedModel.toLowerCase() : "",
          Plates_Number: platesNumber,
          Year: year.value,
          Color: color.value,
          Seats_Amount: seatsAmount.value,
          Engine_Type: engineType.value,
          Transmission_type: transmissionType.value,
          Description: description,
          Rental_Price_Per_Day: rentalPricePerDay,
          Renter_Id: userId,
          image_url: filenames
        };
  
        addCar(carData)
          .then((res) => {
            console.log(res);
            notify("success", res.data.message);
          })
          .catch((err) => {
            notify("error", err.response.data.message);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  return (
    <div className="flex flex-col w-1/4 justify-center items-center bg-[#f6f6f6] shadow-lg rounded-lg p-6">
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
            placeholder="Select Color"
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
            options={Array.from({ length: 15 - 2 + 1 }, (_, index) => ({
              value: 2 + index,
              label: (2 + index).toString(),
            }))}
            placeholder="Select Seats Amount"
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
      </form>
    </div>
  );
}
