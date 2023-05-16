import React from "react";
import MainTitle from '../../components/MainTitle';
import SearchCar from '../../components/SearchCar';

export default function FirstSection() {
  return (
    <div className='flex flex-col justify-center items-center  p-4 w-full '>
      <article className='flex justify-between items-center m-4 w-full '>
      <SearchCar/>
      <MainTitle/>
      </article>
      <button className="bg-[#CC6200] rounded-md w-2/2 p-3">Get Started Now</button>
    </div>
  )
}
