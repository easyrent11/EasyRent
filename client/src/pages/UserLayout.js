import React, { useContext, useEffect, useState } from 'react';
import AllCarsSection from '../components/AllCarsSection';
import CarSortSection from '../components/CarSortSection';
import CarFilterSection from '../components/CarFilterSection';
import SearchCar from '../components/SearchCar';
import { UserProfileDetails } from '../contexts/UserProfileDetails';
import { useUserOrders } from '../contexts/UserOrdersContext';
import { AllCarsContext } from '../contexts/AllCarsContext';


export default function UserLayout() {
  const { userOrders, userRenteeOrders } = useUserOrders();
  const { allCars} = useContext(AllCarsContext);
  const userDetails = useContext(UserProfileDetails);
  const [filteredCars, setFilteredCars] = useState([...allCars]); // Copy allCars initially

  
  

  function filterCars(filterOptions) {
    let filteredCars = [... allCars]; //copying the array.
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


  // You can update filteredCars whenever allCars changes
  useEffect(() => {
    if(!localStorage.getItem('filterOptions'))
      setFilteredCars([...allCars]); // Copy allCars when it changes
    else{
      filterCars(JSON.parse(localStorage.getItem('filterOptions')));
    }
  }, [allCars]);



  return (
    <>
      <h1 className="font-lobster text-6xl">Welcome {userDetails.userDetails.first_name} </h1>
      <SearchCar />

      <h1 className="text-3xl mb-4">All Available Cars On The Website : </h1>
      <div className="flex  items-start justify-around p-4 m-4 w-3/4 ">
        <div className="bg-[#f6f6f6] rounded-md p-4 h-full">
          <CarFilterSection filterCars={filterCars} filteredCars={filteredCars} allCars={allCars} setFilteredCars={setFilteredCars} />
        </div>

        <div className="flex flex-col items-center w-4/5">
          <CarSortSection />
          <AllCarsSection filteredCars={filteredCars} />
        </div>
      </div>
    </>
  );
}
