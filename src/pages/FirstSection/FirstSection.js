import React from "react";
import MainTitle from '../../components/MainTitle';
import SearchCar from '../../components/SearchCar';

export default function FirstSection() {
  return (
    <div className='flex flex-col justify-center items-center  p-4 w-full border-2 border-red-600'>
      <article className='flex justify-between items-center m-4 w-4/5 '>
      <SearchCar/>
      <MainTitle/>
      </article>
      <button className='bg-[#CC6200] w-1/12 p-3'>Get Started Now</button>
    </div>
  )
}
