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
  // const handleFromTimeChange = (e) => {setFromTime(e.target.value);}
  // const handleToTimeChange = (e) => {setToTime(e.target.value);}


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
      startTime: "10:00:00",
      endTime: "14:00:00",
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
      className="grid grid-cols-4 gap-4 p-4 pt-6 w-1/2"
      onSubmit={handleFormSubmit}
    >
      <div className="col-span-2 md:col-span-1">
        <Select
          id="city"
          value={{ value: city, label: selectedCityLabel }}
          onChange={handleCityChange}
          noOptionsMessage={() => "Not Found"}
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
          value={{ value: carType, label: selectedCarTypeLabel }}
          onChange={handleCarTypeChange}
          options={CarTypes}
          noOptionsMessage={() => "Not Found"}
          placeholder="Select a car type"
        />
      </div>

      <div className="col-span-5 flex justify-center items-center">
        <button  type="submit" className="bg-black text-1xl mt-4 text-white p-2 w-full md:w-1/1 lg:w-1/4 rounded-md"> 
          Submit
        </button>
      </div>
    </form>
  );
}
