import React, { useState, useContext } from "react";
import Select from "react-select";
import { Cities } from "../res/Cities";
import { searchCars } from "../api/UserApi";
import { AllCarsContext } from "../contexts/AllCarsContext";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchCar() {
  const { setIsSearch } = useContext(SearchStatusContext);
  const navigate = useNavigate();
  // getting the update car list from the car list context so we can update it after searching for a car and getting the result back.
  const { allCars, setAllCars } = useContext(AllCarsContext);

  // sorting the cities object list ascendingly
  const sortedCities = Cities.sort((a, b) => a.label.localeCompare(b.label));

  // use states for all form fields
  const [city, setCity] = useState("");
  const [selectedCityLabel, setSelectedCityLabel] = useState("Choose a city");
  const [pickupDate, setPickUpDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [fromTime, setFromTime] = useState("10:00");
  const [toTime, setToTime] = useState("10:00");


  // on change event listener handlers for all the use states..
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
  const handleFromTimeChange = (e) => {
    setFromTime(e.target.value);
  };
  const handleToTimeChange = (e) => {
    setToTime(e.target.value);
  };

  // function that will run once we submit the form and will send the search info to the backend and recieve the result back.
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // creating the search object.

    const requestData = {
      city: city,
      pickupDate: pickupDate,
      returnDate: returnDate,
      startTime: fromTime,
      endTime: toTime,
    };
    searchCars(requestData)
      .then((res) => {
        const token = localStorage.getItem('token');
        if(token){
          navigate("/homepage");
        }
        else{
          navigate('/DisplaySearchResults');
        }
        // updating the Cars List with the new search Array
        setIsSearch(true);
        setAllCars(res.data);
      })
      .catch((err) => console.log("Failed", err));
  };

  // function to reset all form fields to their initial values
  const handleFormReset = () => {
    setCity("");
    setSelectedCityLabel("Choose a city");
    setPickUpDate("");
    setReturnDate("");
    setFromTime("10:00");
    setToTime("10:00");
  };

  return (
    <form
      className="flex items-center justify-center p-2 m-4 rounded-md w-1/2 bg-[#f6f6f6]"
      // className="flex items-center justify-center flex-wrap xl:1/2 max-w-1/2 sm:max-w-full md:max-w-3/4 2xl:w-1/2 lg:w-2/3 "
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
    >
      <div className="flex-2 m-2 p-2">
        <Select
          id="city"
          value={{ value: city, label: selectedCityLabel }}
          onChange={handleCityChange}
          noOptionsMessage={() => "Not Found"}
          options={sortedCities}
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

      <div className="flex  justify-center w-1/12 items-center">
        <button
          type="submit"
          className="bg-black text-1xl  text-white p-2 w-full rounded-md"
        >
          <SearchIcon className="hover:text-orange-500" />
        </button>
      </div>
    </form>
  );
}
