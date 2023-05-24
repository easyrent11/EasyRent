import React from 'react'
import UserRatingCard from '../components/UserRatingCard';

export default function RatingSection() {
  return (
    <>
        <div className='flex flex-col items-center justify-center bg-[#E8E8E8] w-full'>
            <h1 className='text-2xl font-bold p-4 m-4'>Rating from our customers </h1>

            <article className='flex'>
                <UserRatingCard/>
                <UserRatingCard/>
                <UserRatingCard/>
                <UserRatingCard/>
            </article>
        </div>
    </>
    
  )
}