import React, { useContext } from "react";
import { CarListContext } from "../contexts/CarListContext";
import Car from "../components/Car";

export default function SearchResultDisplay() {
    const {carList} = useContext(CarListContext);
    return (
      <div className="min-w-screen">
        <article className="min-wscreen flex flex-wrap items-center pl-20 max-w-full p-4 mr-2 ml-2">
          {carList.map((car, index) => (
            <Car key={index} car={car} />
          ))}
        </article>
      </div>
    );
}

