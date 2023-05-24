import React, { useState } from "react";
import Select from "react-select";
import { Cities } from "../res/Cities";
import { CarTypes } from "../res/CarTypes";

export default function SearchCarForm() {
  const [city, setCity] = useState("");
  const [selectedCityLabel, setSelectedCityLabel] = useState("Choose a city");
  const [pickupDate, setPickUpDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [carType, setCarType] = useState("");
  const [selectedCarTypeLabel, setSelectedCarTypeLabel] = useState("Choose a car type");

  const handleCityChange = (selectedOption) => {
    setCity(selectedOption.value);
    setSelectedCityLabel(selectedOption.label);
  };

  const handlePickUpDateChange = (e) => {
    setPickUpDate(e.target.value);
  };

  const handleReturnDateChange = (e) => {
    setReturnDate(e.target.value);
  };

  const handleCarTypeChange = (selectedOption) => {
    setCarType(selectedOption.value);
    setSelectedCarTypeLabel(selectedOption.label);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    // You can access the form values using the state variables (location, pickDate, returnDate, carType)
  };

  return (
    <form className="grid grid-cols-4 gap-4 p-4 pt-6 w-1/2" onSubmit={handleSubmit}>
      <div className="col-span-2 md:col-span-1">
        <Select
          id="city"
          value={{value:city, label:selectedCityLabel }}
          onChange={handleCityChange}
          noOptionsMessage={() => 'Not Found'}
          options={Cities}
        />
      </div>

      <div className="col-span-2 md:col-span-1">
        <input
          type="date"
          id="pickupdate"
          value={pickupDate}
          onChange={handlePickUpDateChange}
          className="w-full p-1.5 rounded-md"
        />

      </div>


      <div className="col-span-2 md:col-span-1">
        <input
          type="date"
          id="returnDate"
          value={returnDate}
          onChange={handleReturnDateChange}
          className="w-full p-1.5  rounded-md"
        />
      </div>

      <div className="col-span-2 md:col-span-1">
        <Select
          id="carType"
          value={{value:carType, label:selectedCarTypeLabel}}
          onChange={handleCarTypeChange}
          options={CarTypes}
          noOptionsMessage={() => 'Not Found'}
          placeholder="Select a car type"
        />
      </div>

      <div className="col-span-5 flex justify-center items-center">
        <button
          className="bg-black text-1xl mt-4 text-white p-2 w-full md:w-1/1 lg:w-1/4 rounded-md"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}