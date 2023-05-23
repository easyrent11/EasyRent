import React,{useContext} from 'react';
import Car from '../components/Car';
import { CarListContext } from '../App';
import { Link } from 'react-router-dom';

export default function SecondSection() {
  const ListOfCars = useContext(CarListContext);
  console.log(ListOfCars);
  return (
    <>
      <div className="flex w-2/3 flex-col">
        <article className="flex items-center  justify-between w-full">
          <h1 className="ml-10 text-lg font-bold">Featured Cars:</h1>
          {/* When We click on the link we want a list of all the car available on the website. */}
          <Link className="mr-10 text-lg font-bold hover:border-b-2 border-[#CC6200]">View All Cars </Link>
        </article>

        <article className="flex flex-wrap items-center  pl-20   max-w-full p-4 mr-2 ml-2">
          {ListOfCars.map((car, index) => (
            <Car key={index} car={car} />
          ))}
        </article>
      </div>
    </>
  );
}