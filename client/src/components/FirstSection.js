import React from "react";
import MainTitle from './MainTitle';
import SearchCar from './SearchCar';

export default function FirstSection() {
  return (
    <>
      <div className="flex flex-col  justify-center items-center p-4 w-full bg-no-repeat bg-cover bg-center">
        <article className="flex flex-col 2xl:flex-row justify-between items-center m-4 w-full">
          <MainTitle/>
          <SearchCar />
        </article>
      </div>
    </>
  );
}
