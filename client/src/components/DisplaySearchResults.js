import React, { useContext, useEffect, useState } from "react";
import { AllCarsContext } from "../contexts/AllCarsContext";
import Car from "../components/Car";
import CarSortSection from "../components/CarSortSection";
import CarFilterSection from '../components/CarFilterSection';
import { useLocation } from "react-router-dom";

const carsPerPage = 4; // Number of cars to show per page

export default function AllCarsSection() {
  const location = useLocation();
  const { allCars } = useContext(AllCarsContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilteredCars, setSearchFilteredCars] = useState([...allCars]); // Copy allCars initially
  const searchParams = new URLSearchParams(location.search);
 const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");
  const fromTime = searchParams.get("fromTime");
  const toTime = searchParams.get("toTime");

  const dateSearchParams = {
    pickupDate,
    returnDate,
    fromTime,
    toTime
  }
  

  function filterCars(filterOptions) {
    let filteredCars = [...allCars]; //copying the array.
    if (filterOptions.manufacturer) {
      filteredCars = filteredCars.filter(
        (car) => car.Manufacturer_Code === filterOptions.manufacturer
      );
    }

    if (filterOptions.model) {
      filteredCars = filteredCars.filter(
        (car) => car.model_code === filterOptions.model.toLowerCase()
      );
    }
    if (filterOptions.fromYear) {
      filteredCars = filteredCars.filter(
        (car) => car.Year >= filterOptions.fromYear
      );
    }

    if (filterOptions.toYear) {
      filteredCars = filteredCars.filter(
        (car) => car.Year <= filterOptions.toYear
      );
    }

    if (filterOptions.seatAmount) {
      filteredCars = filteredCars.filter(
        (car) => car.Seats_Amount === filterOptions.seatAmount
      );
    }

    if (filterOptions.engineType) {
      filteredCars = filteredCars.filter(
        (car) => car.Engine_Type === filterOptions.engineType
      );
    }

    if (filterOptions.transmissionType) {
      filteredCars = filteredCars.filter(
        (car) => car.Transmission_type === filterOptions.transmissionType
      );
    }

    if (filterOptions.priceRange) {
      console.log(filterOptions.priceRange[0], filterOptions.priceRange[1]);
      filteredCars = filteredCars.filter(
        (car) =>
          car.Rental_Price_Per_Day >= filterOptions.priceRange[0] &&
          car.Rental_Price_Per_Day <= filterOptions.priceRange[1]
      );
    }

    setSearchFilteredCars(filteredCars);
  }


  // You can update filteredCars whenever allCars changes
  useEffect(() => {
    if (!localStorage.getItem('filterOptions'))
      setSearchFilteredCars([...allCars]); // Copy allCars when it changes
    else {
      filterCars(JSON.parse(localStorage.getItem('filterOptions')));
    }
  }, [allCars]);



  if (!searchFilteredCars || searchFilteredCars.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <h2 className="font-bold text-2xl text-black">No cars Yet...</h2>
        <CarFilterSection filterCars={filterCars} setFilteredCars={setSearchFilteredCars} />
      </div>
    );
  }


  // Calculate total number of pages
  const totalPages = Math.ceil(searchFilteredCars.length / carsPerPage);

  // Get the cars to display for the current page
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = searchFilteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Handle page navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const navigationLocation = "/CarView";




  return (
    <>
      <div className="flex m-20 w-4/5 items-start justify-around">
        <div className='bg-[#f6f6f6] flex rounded-md p-4 h-full'>
          <CarFilterSection filterCars={filterCars} setFilteredCars={setSearchFilteredCars} />
        </div>
        <div className="flex flex-col rounded-md shadow-md items-center min-h-screen w-4/5 p-4 bg-[#f5f5f5] ">
          <CarSortSection />
          <article className="flex border-2 border-blue-900 min-h-screen  flex-wrap w-full p-4">
            {currentCars.map((car, index) => (
              <Car key={index} car={car} btnText="Rent Now" navigationLocation={navigationLocation} searchParams={dateSearchParams}/>
            ))}
          </article>
          <div className="flex self-center align-self-end mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`mx-1 p-2 border ${page === currentPage ? "bg-black rounded-md text-white" : "bg-white"
                  }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
