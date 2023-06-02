import React, { useContext } from 'react';
import Car from '../components/Car';
import { Link } from 'react-router-dom';
import { CarListContext } from '../contexts/CarListContext';
export default function SecondSection() {
  const {carList} = useContext(CarListContext);
  if (!carList || carList.length === 0) {
    return (
      <div className='flex items-center justify-center'>
        <h2 className='font-bold text-2xl text-black'>No cars Yet...</h2>
      </div>
    );
  }
  return (
    <>
      <div className='flex w-2/3 flex-col'>
        <article className='flex items-center justify-between w-full'>
          <h1 className='ml-10 text-lg font-bold'>Featured Cars:</h1>
          <Link className='mr-10 text-lg font-bold hover:border-b-2 border-[#CC6200]'>View All Cars</Link>
        </article>

        <article className='flex flex-wrap items-center pl-20 max-w-full p-4 mr-2 ml-2'>
          {carList.map((car, index) => (
            <Car key={index} car={car} />
          ))}
        </article>
      </div>

      
    </>
  );
}
