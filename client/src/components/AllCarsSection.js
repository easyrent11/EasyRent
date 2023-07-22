import React, { useContext, useState } from "react";
import { AllCarsContext } from "../contexts/AllCarsContext";
import Car from "../components/Car";

const carsPerPage = 4; // Number of cars to show per page

export default function AllCarsSection() {
  const { allCars } = useContext(AllCarsContext);
  const [currentPage, setCurrentPage] = useState(1);

  console.log("All cars", allCars);

  if (!allCars || allCars.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <h2 className="font-bold text-2xl text-black">No cars Yet...</h2>
      </div>
    );
  }

  // Calculate total number of pages
  const totalPages = Math.ceil(allCars.length / carsPerPage);

  // Get the cars to display for the current page
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = allCars.slice(indexOfFirstCar, indexOfLastCar);

  // Handle page navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-4/5 p-4 bg-[#f5f5f5] rounded-md">
      <article className="flex border-2 border-blue-900 min-h-screen  flex-wrap w-full p-4">
        {currentCars.map((car, index) => (
          <Car key={index} car={car} />
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
  );
}
