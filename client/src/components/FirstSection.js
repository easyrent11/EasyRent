import React from "react";
import MainTitle from './MainTitle';
import SearchCar from './SearchCar';

export default function FirstSection() {
  return (
    <>
      <div className="flex flex-col justify-center items-center p-4 w-full bg-no-repeat bg-cover  bg-center">
        <article className='flex justify-between items-center m-4 w-full'>
        <SearchCar/>
        <MainTitle/>
        </article>
      </div>
    </>
  )
}
