import React from 'react';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import  {TbManualGearbox} from "react-icons/tb";
import { Link } from 'react-router-dom';


export default function Car({car}) {
  return (

      <div className='flex flex-col rounded-md w-1/4 items-center bg-[#FFFFFF] m-8 p-4 min-w-screen-2xl:w-1/5'>
        
        <Link to={`/CarView/${car.platesNumber}`}>
          <figure className='flex items-center w-full h-40 justify-center'> 
            <img className="w-full h-full rounded-md " src={car.Image} alt="Logo" />
          </figure>
        </Link>

       

        <div className='flex flex-col item-center w-full m-4 p-1'>

          <div className=' p-2'>
            <h2>{car.manufacturer} {car.model}</h2>
          </div>

          <p className='p-2 text-sm font-sans text-[#6d6d6d]'>{car.year}</p>

          <div className='flex items-center  w-full mb-2 p-2'>
            <p className='m-1 w-full '> <PersonIcon className='m-1 text-[#777777]'/>{car.seats}</p> 
            <p className=' m-1 w-full'><BusinessCenterIcon className='m-1 text-[#777777]'/>{car.luggage}</p>
            <p className='flex items-center'><TbManualGearbox className='m-1 text-2xl text-[#777777]' />{car.gearbox}</p>
          </div>

          <div className='flex items-center justify-between p-2'>
            <p className='text-[#00215e]'>₪{car.RentalPrice}/day</p>
            <button className='bg-black text-white p-2 rounded-md'>Rent Now</button>
          </div>

        </div>
      </div>
  );
}