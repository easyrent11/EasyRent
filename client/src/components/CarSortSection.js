import React, { useContext, useState } from "react";
import Select from "react-select";
import { AllCarsContext } from "../contexts/AllCarsContext";
import { getAllCars } from "../api/CarApi";
import { clearSearchParameters } from "../HelperFunctions/ClearSearchParams";
import CarFilterPopout from "./CarFilterPopOut";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { selectStyle } from "../res/SelectStyle";

export default function CarSortSection() {
  // getting all of the cars list from the context so we can preform a sort and update the list after.
  const { allCars, setAllCars } = useContext(AllCarsContext);
  const [showFilterSection, setShowFilterSection] = useState(false);

  const token = localStorage.getItem("token");

  // function to toggle and untoggle car filter section.
  const toggleCarFilterSection = () => {
    setShowFilterSection(!showFilterSection);
  };

  // function to reset the car list after search.
  const handleResetSearch = () => {
    getAllCars()
      .then((response) => {
        setAllCars(response.data);
        clearSearchParameters();
      })
      .catch((error) => {
        console.error("Error fetching cars:", error);
      });
  };

  const handleSort = (sortOption) => {
    let sortedCarsList = [...allCars]; // Create a copy of the original car list
    console.log(sortOption === "priceLowToHigh");

    if (sortOption === "priceLowToHigh") {
      sortedCarsList.sort(
        (a, b) => a.Rental_Price_Per_Day - b.Rental_Price_Per_Day
      );
    } else if (sortOption === "priceHighToLow") {
      sortedCarsList.sort(
        (a, b) => b.Rental_Price_Per_Day - a.Rental_Price_Per_Day
      );
    }
    console.log(sortedCarsList);
    setAllCars(sortedCarsList);
  };

  // the select combo box options.
  const options = [
    { value: "priceLowToHigh", label: "Price: Low to High" },
    { value: "priceHighToLow", label: "Price: High to Low" },
  ];

  

  // event handler for select change value.
  const handleOptionSelect = (selectedOption) => {
    handleSort(selectedOption.value);
    selectedOption.label = "Select an option";
  };

  return (
    <div className="w-full mb-4 flex  justify-between lg:rounded-md items-center bg-[#f6f6f6] relative">
      <div className="w-4/5 h-full flex items-center lg:justify-between justify-around  lg:w-1/2 p-2 2xl:w-1/3">
        {token ? (
          <button
            onClick={handleResetSearch}
            className="border-2 bg-white border-black hover:text-black hover:bg-[#CC6200] hover:border-none p-1 lg:w-1/3 2xl:w-1/4 size-md w-1/2 text-grey-500 font-bold "
          >
            Clear Search Results
          </button>
        ) : (
          <Link to="/" className="text-black">
            <FontAwesomeIcon icon={faArrowLeft} size="2xl"/> Back
          </Link>
        )}

        <div className="lg:hidden bg-[#f6f6f6]  p-4 rounded-md">
          <button onClick={toggleCarFilterSection}>Car Filters</button>
        </div>
      </div>

      <div className="flex flex-col  p-2 h-full lg:justify-end justify-center items-center lg:items-end lg:w-1/2 2xl:w-1/4">
        <Select
          className="lg:w-1/2 rounded-md text-center p-2 w-full"
          options={options}
          onChange={handleOptionSelect}
          placeholder="Car Sort Options"
          isSearchable={false}
          styles={selectStyle}
        />
      </div>

      {showFilterSection && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white w-full p-4 rounded-md">
            <CarFilterPopout toggleCarFilterSection={toggleCarFilterSection} />
          </div>
        </div>
      )}
    </div>
  );
}
