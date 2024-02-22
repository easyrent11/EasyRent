import React, { useContext, useEffect, useState } from "react";
import AllCarsSection from "../components/AllCarsSection";
import CarSortSection from "../components/CarSortSection";
import CarFilterSection from "../components/CarFilterSection";
import SearchCar from "../components/SearchCar";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import { AllCarsContext } from "../contexts/AllCarsContext";
import { clearSearchParameters } from "../HelperFunctions/ClearSearchParams";

// the user's home page.
export default function UserLayout() {
  const { allCars } = useContext(AllCarsContext);
  const userDetails = useContext(UserProfileDetails);
  const [filteredCars, setFilteredCars] = useState([...allCars]); // Copy allCars initially
  const [showSearchCars, setShowSearchCars] = useState(false);

  // function to toggle and untoggle search cars component

  const toggleSearchCars = () => {
    setShowSearchCars(!showSearchCars);
  };

  // function to filter cars.
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

    setFilteredCars(filteredCars);
  }

  // use effect that will apply filter options everytime the page refreshes, if there are any.
  useEffect(() => {
    if (!localStorage.getItem("filterOptions"))
      setFilteredCars([...allCars]); // Copy allCars when it changes
    else {
      filterCars(JSON.parse(localStorage.getItem("filterOptions")));
    }
  }, [allCars]);

  // a use effect that clears the search parameters if a page refreshes.
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      clearSearchParameters(); // calling the function that will remove the search parameters from the local storage.

      // Cancel the default behavior to show a prompt before leaving the page
      event.preventDefault();
      // Chrome requires returnValue to be set
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <>
      <div className="flex  min-h-screen  w-full items-center flex-col">
        <h1 className="font-lobster m-4 text-4xl lg:text-6xl">
          Welcome {userDetails.userDetails.first_name}
        </h1>

        <div className="lg:hidden xl:hidden 2xl:hidden flex items-center flex-col justify-center w-full">
          {showSearchCars ? (
            <>
            <button className="w-full text-lg font-bold text-red-500 p-2 text-start" onClick={() => setShowSearchCars(false)}>Close</button>
              <SearchCar />
            </>
          ) : (
            <button className="text-lg font-bold p-2 " onClick={() => setShowSearchCars(true)}>Open Search Cars</button>
          )}
        </div>

        <div className="hidden lg:flex items-center justify-center w-full">
          <SearchCar/>
        </div>

        <div className="w-full items-center  justify-end flex flex-col">
          <h1 className="text-xl  md:text-3xl mb-4">
            All Available Cars On The Website{" "}
          </h1>

          <div className="flex  items-start justify-around xl:mr-20  w-full ">
            <div className="bg-[#f6f6f6] lg:block hidden rounded-md mr-4 p-4 h-full">
              <CarFilterSection
                filterCars={filterCars}
                filteredCars={filteredCars}
                allCars={allCars}
                setFilteredCars={setFilteredCars}
              />
            </div>

            <div className="flex w-full flex-col rounded-md items-center md:w-4/5 ">
              <CarSortSection />
              <AllCarsSection filteredCars={filteredCars} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
