import React from 'react';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import  {TbManualGearbox} from "react-icons/tb";
import { Link } from 'react-router-dom';


export default function Car({car}) {
 
  return (

      <div className='flex flex-col rounded-md w-1/4 items-center bg-[#FFFFFF] m-8 p-4 min-w-screen-2xl:w-1/5'>
        
        <Link to={`/CarView/${car.Plates_Number}`}>
          <figure className='flex items-center w-full h-40 justify-center'> 
            <h1>car img</h1>
            {/* <img className="w-full h-full rounded-md " src={car.Image} alt="Logo" /> */}
          </figure>
        </Link>

       

        <div className='flex flex-col item-center w-full m-4 p-1'>

          <div className=' p-2'>
            <h2>{car.Manufacturer_Name} {car.model_name}</h2>
          </div>

          <p className='p-2 text-sm font-sans text-[#6d6d6d]'>{car.Year}</p>

          <div className='flex items-center  w-full mb-2 p-2'>
            <p className='m-1 w-full '> <PersonIcon className='m-1 text-[#777777]'/>{car.Seats_Amount}</p> 
            <p className=' m-1 w-full'><BusinessCenterIcon className='m-1 text-[#777777]'/>{car.Engine_Type}</p>
            <p className='flex items-center'><TbManualGearbox className='m-1 text-2xl text-[#777777]' />{car.Transmission_Type}</p>
          </div>

          <div className='flex items-center justify-between p-2'>
            <p className='text-[#00215e]'>₪{car.Rental_Price_Per_Day}/day</p>
            <button className='bg-black text-white p-2 rounded-md'>Rent Now</button>
          </div>

        </div>
      </div>
  );
}