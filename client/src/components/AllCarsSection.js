import React, { useContext, useState } from "react";
import Car from "../components/Car";

const carsPerPage = 6; // Number of cars to show per page

export default function AllCarsSection({filteredCars}) {
  const [currentPage, setCurrentPage] = useState(1);


  if (!filteredCars || filteredCars.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <h2 className="font-bold text-2xl text-black">No cars Yet...</h2>
      </div>
    );
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  // Get the cars to display for the current page
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Handle page navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  const navigationLocation = "/CarView";
  return (
    <>
    <h2 className="p-4 font-bold text-2xl text-gray-600 items-center w-full  bg-[#f5f5f5] text-start">{filteredCars.length} Cars Available</h2>
    <div className="flex flex-col p-4 lg:p-0 items-center  min-h-screen w-full  bg-[#f5f5f5] rounded-md">
      <article className="min-h-screen lg:grid lg:grid-cols-3 lg:grid-rows-7 justify-center items-center w-full p-4">
        {currentCars.map((car, index) => (
          <Car key={index} car={car} btnText="Rent Now" navigationLocation={navigationLocation}/>
        ))}
      </article>
      <div className="flex self-center align-self-end mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`mx-1 p-2 border ${
              page === currentPage ? "bg-black rounded-md text-white" : "bg-white"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
    </>
  );
} 