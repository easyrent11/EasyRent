import React from 'react'
import { CarListContext } from '../contexts/CarListContext';
import Car from '../components/Car';

export default function CarSearchResults() {
    const {carList} = useContext(CarListContext);

    if (!carList || carList.length === 0) {
        return (
        <div className='flex items-center justify-center'>
            <h2 className='font-bold text-2xl text-black'>No avaliable cars...</h2>
        </div>
    );
  }
  return (
    <>
        <article className='flex flex-wrap items-center pl-20 max-w-full p-4 mr-2 ml-2'>
          {carList.map((car, index) => (
            <Car key={index} car={car} />
          ))}
        </article>
    </>
  )
}
