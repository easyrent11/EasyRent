import React from 'react';
import { useLocation } from 'react-router-dom';

export default function CarView() {
  const location = useLocation();
  const car = location.state?.car;

  if (!car) {
    // Handle the case when car data is not available
    return <div>No car data available</div>;
  }

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 text-white bg-slate-600 rounded-3xl">
        <h1>{car.Manufacturer} {car.Model}</h1>
        <p>Year: {car.year}</p>
        <p>Rental Price: {car.RentalPrice}/day</p>
        {/* Display other car information */}
      </div>
    </>
  );
}