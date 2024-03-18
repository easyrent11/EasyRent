import React, { useState, useContext } from "react";
import Select from "react-select";
import { Cities } from "../res/Cities";
import { searchCars } from "../api/UserApi";
import { AllCarsContext } from "../contexts/AllCarsContext";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { clearSearchParameters } from "../HelperFunctions/ClearSearchParams";
import { formatDate } from "../HelperFunctions/FormatDate";
import { checkDate } from "../HelperFunctions/checkDate";
import { notify } from "../HelperFunctions/Notify";
import { selectStyle } from "../res/SelectStyle";

export default function SearchCar() {
  const navigate = useNavigate();
  // getting the update car list from the car list context so we can update it after searching for a car and getting the result back.
  const { allCars, setAllCars } = useContext(AllCarsContext);

  // sorting the cities object list ascendingly
  const sortedCities = Cities.sort((a, b) => a.label.localeCompare(b.label));

  // use states for all form fields
  const [city, setCity] = useState("");
  const [selectedCityLabel, setSelectedCityLabel] = useState("City");
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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // checking if the user provided the order details.
    if (!city || !pickupDate || !returnDate || !fromTime || !toTime) {
      notify("error", "Error: Please fill in all required fields.");
      return;
    }

    // Check if the Start Date and End Date are invalid
    const dateObj1 = {
      date: pickupDate,
      time: fromTime,
    };
    const dateObj2 = {
      date: returnDate,
      time: toTime,
    };
    // check if the start date is smaller than the end date or equal with more than 1 hour difference
    if (checkDate(dateObj1, dateObj2)) {
      notify(
        "error",
        "Start date must be smaller than the end date or equal with a time difference more than 1 hour."
      );
      return;
    }

    // check if the start date is bigger than the current date or equal with more than 1 hour difference
    const currentDate = new Date();
    const currentDateObj = {
      date: formatDate(currentDate, true),
      time: currentDate.getHours() + ":" + currentDate.getMinutes(),
    };
    if (checkDate(currentDateObj, dateObj1)) {
      notify(
        "error",
        "Please dont pick dates in the past or dates with time difference less than 1 hour from now."
      );
      return;
    }

    clearSearchParameters(); // clearing previous search parameters.
    handleFormReset(); // reset the form fields.

    // Creating the search object
    const requestData = {
      city: city,
      pickupDate: pickupDate,
      returnDate: returnDate,
      startTime: fromTime,
      endTime: toTime,
    };

    searchCars(requestData)
      .then((res) => {
        const { pickupDate, returnDate, startTime, endTime, city } =
          requestData;
        // Saving search params in localStorage
        localStorage.setItem("startDate", pickupDate);
        localStorage.setItem("endDate", returnDate);
        localStorage.setItem("startTime", startTime);
        localStorage.setItem("endTime", endTime);
        localStorage.setItem("city", city);

        const token = localStorage.getItem("token");
        if (token) {
          navigate("/homepage");
        } else {
          navigate("/DisplaySearchResults");
        }
        // Updating the Cars List with the new search Array
        setAllCars(res.data);
      })
      .catch((err) => console.log("Failed", err));
  };

  // function to reset all form fields to their initial values
  const handleFormReset = () => {
    setCity("");
    setSelectedCityLabel("City");
    setPickUpDate("");
    setReturnDate("");
    setFromTime("10:00");
    setToTime("10:00");
  };

  return (
    <form
      className=" flex flex-col lg:flex-row  xl:w-full  xl:items-center 2xl:flex-row 2xl:w-2/3 2xl:items-center   items-center justify-center p-2 m-4 rounded-md w-full md:w-3/5 lg:w-full  bg-[#f6f6f6]"
      onSubmit={handleFormSubmit}
    >
      <div className="w-full text-center 4 m-2 p-2">
        <label htmlFor="city">Choose a location</label>
        <Select
          id="city"
          value={{ value: city, label: selectedCityLabel }}
          onChange={handleCityChange}
          noOptionsMessage={() => "Not Found"}
          options={sortedCities}
          className="text-base  md:text-sm  lg:text-base xl:text-sm"
          styles={selectStyle}
        />
      </div>

      <div className="w-full text-center m-2 p-2">
      <label htmlFor="pickupdate">Start date</label>
        <input
          type="date"
          id="pickupdate"
          min={new Date().toISOString().split("T")[0]}
          value={pickupDate}
          onChange={handlePickUpDateChange}
          className="w-full p-1.5 rounded-md"
        />
      </div>

      <div className="w-full text-center m-2 p-2">
        <label htmlFor="fromtime">Start time</label>
        <input
          type="time"
          id="fromtime"
          value={fromTime}
          onChange={handleFromTimeChange}
          className="w-full p-1.5 rounded-md border border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div className="w-full text-center m-2 p-2">
      <label htmlFor="returndate">End date </label>
        <input
          type="date"
          id="returnDate"
          min={new Date().toISOString().split("T")[0]}
          value={returnDate}
          onChange={handleReturnDateChange}
          className="w-full p-1.5 rounded-md"
        />
      </div>

      <div className="w-full text-center m-2 p-2">
      <label htmlFor="totime">End time </label>
        <input
          type="time"
          id="totime"
          value={toTime}
          onChange={handleToTimeChange}
          className="w-full p-1.5 rounded-md"
        />
      </div>

      <div className="flex w-full mt-6 justify-center  items-center">
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
