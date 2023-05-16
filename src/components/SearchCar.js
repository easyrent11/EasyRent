import React, { useState } from "react";
import Select from "react-select";
import { Cities } from "../res/Cities";
import { CarTypes } from "../res/CarTypes";

export default function SearchCarForm() {
  const [location, setLocation] = useState("");
  const [pickDate, setPickDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [carType, setCarType] = useState("");

  const handleLocationChange = (selectedOption) => {
    setLocation(selectedOption.value);
  };

  const handlePickDateChange = (e) => {
    setPickDate(e.target.value);
  };

  const handleReturnDateChange = (e) => {
    setReturnDate(e.target.value);
  };

  const handleCarTypeChange = (selectedOption) => {
    setCarType(selectedOption.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    // You can access the form values using the state variables (location, pickDate, returnDate, carType)
    console.log("Form submitted:", location, pickDate, returnDate, carType);
  };

  return (
    <form className="grid grid-cols-4 gap-4 p-4 w-5/6" onSubmit={handleSubmit}>
      <div className="col-span-2 md:col-span-1">
        <Select
          id="location"
          value={{ value: location, label: location }}
          onChange={handleLocationChange}
          options={Cities}
        />
      </div>

      <div className="col-span-2 md:col-span-1">
        <input
          type="date"
          id="pickDate"
          value={pickDate}
          onChange={handlePickDateChange}
          className="w-full"
        />
      </div>

      <div className="col-span-2 md:col-span-1">
        <input
          type="date"
          id="returnDate"
          value={returnDate}
          onChange={handleReturnDateChange}
          className="w-full"
        />
      </div>

      <div className="col-span-2 md:col-span-1">
        <Select
          id="carType"
          value={{ value: carType, label: carType }}
          onChange={handleCarTypeChange}
          options={CarTypes}
        />
      </div>

      <div className="col-span-2">
        <button
          className="bg-black text-1xl text-white mx-0 m-auto p-1 w-1/2 md:w-3/5"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}
