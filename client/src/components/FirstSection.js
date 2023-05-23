import React from "react";
import MainTitle from './MainTitle';
import SearchCar from './SearchCar';

export default function FirstSection() {
  return (
    <>
      <div class="flex flex-col justify-center items-center p-4 w-full bg-no-repeat bg-cover  bg-center">
        <article className='flex justify-between items-center m-4 w-full'>
        <SearchCar/>
        <MainTitle/>
        </article>
        <button className="bg-[#CC6200] rounded-md w-2/2 p-3"><a href="getstarted">Get Started Now</a></button>
      </div>
    </>
  )
}
