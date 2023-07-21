import React, { useContext } from 'react'
import AllCarsSection from '../components/AllCarsSection';
import CarSortSection from "../components/CarSortSection";
import CarFilterSection from '../components/CarFilterSection';
import SearchCar from '../components/SearchCar';
import { UserProfileDetails } from '../contexts/UserProfileDetails';
export default function UserLayout() {
  const userDetails = useContext(UserProfileDetails);
  return (
    <>  

        <h1 className="font-lobster text-6xl">Welcome {userDetails.userDetails.first_name} </h1>
          <SearchCar/>

        <h1 className='text-3xl mb-4'>All Available Cars : </h1>
        <div className='flex  items-start justify-around p-4 m-4 w-3/4 '>

          <div className='bg-[#f6f6f6] rounded-md p-4 h-full'>
          <CarFilterSection/>
          </div>
        
          <div className='flex flex-col items-center w-4/5'>
            <CarSortSection/>
            <AllCarsSection/>
          </div>
        </div>
    </>
  )
}
