import React, { useContext } from "react";
import { SearchCarListResult } from "../contexts/SearchCarListResult";
import Car from "../components/Car";

export default function SearchResultDisplay() {
    const {carList} = useContext(SearchCarListResult);
    if (!carList || carList.length === 0) {
      return (
        <div className='flex items-center justify-center'>
          <h2 className='font-bold text-2xl text-black'>No cars Yet...</h2>
        </div>
      );
    }
    return (
      <div className="min-h-screen min-w-screen">
        <article className="min-wscreen flex flex-wrap items-center pl-20 max-w-full p-4 mr-2 ml-2">
          {carList.map((car, index) => (
            <Car key={index} car={car} />
          ))}
        </article>
      </div>
    );
}

