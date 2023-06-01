import React, { useState, useContext } from "react";
import Select from "react-select";
import { Cities } from "../res/Cities";
import { CarTypes } from "../res/CarTypes";
import { searchCars } from "../api/CarApi";
import { CarListContext } from "../contexts/CarListContext";
import { useNavigate } from 'react-router-dom';




export default function SearchCar() {
  const navigate = useNavigate();
  // getting the update car list from the car list context so we can update it after searching for a car and getting the result back.
  const { updateCarList } = useContext(CarListContext);



  // use states for all form fields
  const [city, setCity] = useState("");
  const [selectedCityLabel, setSelectedCityLabel] = useState("Choose a city");
  const [pickupDate, setPickUpDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [carType, setCarType] = useState("");
  const [selectedCarTypeLabel, setSelectedCarTypeLabel] =
    useState("Choose a car type");

  // on change event listener handlers for all the use states..
  const handleCityChange = (selectedOption) => {
    setCity(selectedOption.value);
    setSelectedCityLabel(selectedOption.label);
  };
  const handleCarTypeChange = (selectedOption) => {
    setCarType(selectedOption.value);
    setSelectedCarTypeLabel(selectedOption.label);
  };
  const handlePickUpDateChange = (e) => {
    setPickUpDate(e.target.value);
  };
  const handleReturnDateChange = (e) => {
    setReturnDate(e.target.value);
  };
  const handleFromTimeChange = (e) => {setFromTime(e.target.value);}
  const handleToTimeChange = (e) => {setToTime(e.target.value);}


  // function that will run once we submit the form and will send the search info to the backend and recieve the result back.
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("I am getting here");
    // creating the search object.
    const requestData = {
      city: city,
      pickupDate: pickupDate,
      returnDate: returnDate,
      carType: carType,
      startTime: fromTime,
      endTime: toTime,
    };

    searchCars(requestData)
      .then((res) => {
        console.log(res.data);
        navigate('/SearchResultDisplay')
        updateCarList(res.data);
      })
      .catch((err) => console.log("Failed", err));
  };

  return (
    <form
      className="flex items-center justify-center flex-wrap w-1/2 border-2 border-red-500"
      onSubmit={handleFormSubmit}
    >
      <div className="flex-2 m-2 p-2">
        <Select
          id="city"
          value={{ value: city, label: selectedCityLabel }}
          onChange={handleCityChange}
          noOptionsMessage={() => "Not Found"}
          options={Cities}
        />
      </div>

      <div className="m-2 p-2">
        <input
          type="date"
          id="pickupdate"
          value={pickupDate}
          onChange={handlePickUpDateChange}
          className="w-full p-1.5 rounded-md"
        />
      </div>

      <div className="m-2 p-2">
        <input
          type="time"
          id="fromtime"
          value={fromTime}
          onChange={handleFromTimeChange}
          className="w-full p-1.5 rounded-md"
        />
      </div>

      <div className="m-2 p-2">
        <input
          type="date"
          id="returnDate"
          value={returnDate}
          onChange={handleReturnDateChange}
          className="w-full p-1.5 rounded-md"
        />
      </div>

      <div className="m-2 p-2">
        <input
          type="time"
          id="totime"
          value={toTime}
          onChange={handleToTimeChange}
          className="w-full p-1.5 rounded-md"
        />
      </div>

      <div className="flex-2 m-2 p-2">
        <Select
          id="carType"
          value={{ value: carType, label: selectedCarTypeLabel }}
          onChange={handleCarTypeChange}
          options={CarTypes}
          noOptionsMessage={() => "Not Found"}
          placeholder="Select a car type"
        />
      </div>

      <div className="col-span-4 flex w-2/12 justify-center items-center">
        <button type="submit" className="bg-black text-1xl mt-4 text-white p-2 w-full rounded-md mb-2"> 
          Submit
        </button>
      </div>
    </form>
  );
}
