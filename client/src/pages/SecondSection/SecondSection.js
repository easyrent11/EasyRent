import React from 'react';
import Car from '../../components/Car'; 

export default function SecondSection() {
  const arr = [
    {Image: 'http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg', Manufacturer:'Mercedes', Model:'E300', year:2019, RentalPrice:80 ,gearbox:'auto', luggage:2, seats:3},
    {Image: 'http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg', Manufacturer:'Mercedes', Model:'E300', year:2019, RentalPrice:80,gearbox:'auto', luggage:2, seats:3},
    {Image: 'http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg', Manufacturer:'Mercedes', Model:'E300', year:2019, RentalPrice:80,gearbox:'manual', luggage:2, seats:3},
    {Image: 'http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg', Manufacturer:'Mercedes', Model:'E300', year:2019, RentalPrice:80,gearbox:'manual', luggage:2, seats:3},
    {Image: 'http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg', Manufacturer:'Mercedes', Model:'E300', year:2019, RentalPrice:80, gearbox:'auto', luggage:2, seats:3},
  ];

  return (
    <div className='flex w-2/3  flex-col'>
      <article className='flex items-center justify-between w-full'>
        <h1 className='p-4 ml-10 font-sans '>Featured Cars : </h1>
        <h1 className='mr-10' >View All Cars</h1>
      </article>

        <article className='flex flex-wrap  w-full p-4 m-4'>
          {arr.map((car, index) => (
            <Car
              key={index}
              Image={car.Image}
              manufacturer={car.Manufacturer}
              model={car.Model}
              year={car.year}
              rentalPrice={car.RentalPrice}
              seats={car.seats}
              luggage={car.luggage}
              gearbox={car.gearbox}
            />
          ))}
        </article>

      </div>
   
  );
}
