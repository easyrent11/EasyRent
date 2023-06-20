import React, { useContext } from "react";
import { AllCarsContext } from "../contexts/AllCarsContext"
import Car from "../components/Car";

export default function AllCarsSection() {
    const {allCars} = useContext(AllCarsContext);
    console.log("All cars",allCars);
    if (!allCars || allCars.length === 0) {
      return (
        <div className='flex items-center justify-center'>
          <h2 className='font-bold text-2xl text-black '>No cars Yet...</h2>
        </div>
      );
    }
    return (
      <div className="flex items-start justify-center min-h-screen w-4/5 bg-[#f5f5f5] rounded-md">
        <article className=" flex flex-wrap w-full p-2 ">
          {allCars.map((car, index) => (
            <Car key={index} car={car} />
          ))}
        </article>
      </div>
    );
}

