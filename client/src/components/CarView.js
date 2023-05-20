import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { CarListContext } from "../App";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function CarView() {
  const ListOfCars = useContext(CarListContext);
  let { platesNumber } = useParams();
  const car = ListOfCars.find((car) => car.platesNumber == platesNumber);

  return (
    <div className="flex flex-wrap border-2 border-red-500">
      <section className="w-full flex items-center justify-center border-2 border-blue-500 p-4">
        <div className="max-w-screen-lg w-full mx-auto">
          <Carousel
            className="w-full border-2 border-black"
            showStatus={false}
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={5000}
          >
            {car.Images.map((image, index) => (
              <figure key={index}>
                <img src={image} alt={`Car Image ${index + 1}`} />
              </figure>
            ))}
          </Carousel>
        </div>
      </section>

      <section className="w-1/2 bg-red-300 p-4">
        <h1>Hello world</h1>
      </section>

      <section className="w-1/2 bg-gray-500 p-4">
        <h1>Hello world</h1>
      </section>
    </div>
  );
}