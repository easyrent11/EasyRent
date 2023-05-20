import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CarListContext } from '../App';


export default function CarView() {
  const ListOfCars = useContext(CarListContext);
  let {platesNumber} = useParams();

  const car = ListOfCars.find(car => car.platesNumber == platesNumber);


  
  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 text-white bg-slate-600 rounded-3xl">
        <h1>{car.Manufacturer}{ car.Model}</h1>
        <p>Year: {car.year}</p>
        <p>Rental Price: {car.RentalPrice}/day</p>
      </div>
    </>
  );
}