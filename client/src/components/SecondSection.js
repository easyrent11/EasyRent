import React,{useContext} from 'react';
import Car from '../components/Car';
import { CarListContext } from '../App';

export default function SecondSection() {
  const ListOfCars = useContext(CarListContext);
  console.log(ListOfCars);
  return (
    <>
      <div className="flex w-2/3 flex-col">
        <article className="flex items-center justify-between w-full">
          <h1 className="p-4 ml-10 font-sans">Featured Cars:</h1>
          <h1 className="mr-10">View All Cars</h1>
        </article>

        <article className="flex flex-wrap w-full p-4 m-4">
          {ListOfCars.map((car, index) => (
            <Car key={index} car={car} />
          ))}
        </article>
      </div>
    </>
  );
}