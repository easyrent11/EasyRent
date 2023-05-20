import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CarView from './components/CarView';
import React from "react";
import HomeLayout from "./pages/HomeLayout";
import NavBar from "./components/NavBar";
import { createContext } from "react";

export const CarListContext = createContext([]);


function App() {
  const ListOfCars = [
    {
      platesNumber:11122233,
      Images:[
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "https://stimg.cardekho.com/images/carexteriorimages/930x620/Mercedes-Benz/GLA/7269/1621948227508/front-left-side-47.jpg?tr=w-375",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg"
      ],
      Image:
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
      Manufacturer: "Mercedes",
      Model: "E300",
      year: 2019,
      RentalPrice: 80,
      gearbox: "auto",
      luggage: 2,
      seats: 3,
    },
    {
      platesNumber:11133344,
      Images:[
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg"
      ],
      Image:
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
      Manufacturer: "Mercedes",
      Model: "E300",
      year: 2020,
      RentalPrice: 80,
      gearbox: "auto",
      luggage: 2,
      seats: 1,
    },
    {
      platesNumber:11122299,
      Images:[
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg"
      ],
      Image:
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
      Manufacturer: "Mercedes",
      Model: "E300",
      year: 2019,
      RentalPrice: 80,
      gearbox: "manual",
      luggage: 2,
      seats: 3,
    },
    {
      platesNumber:11122237,
      Images:[
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg"
      ],
      Image:
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
      Manufacturer: "Toyota",
      Model: "Corola",
      year: 2005,
      RentalPrice: 20,
      gearbox: "auto",
      luggage: 3,
      seats: 5,
    },
    {
      platesNumber:11121133,
      Images:[
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg"
      ],
      Image:
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
      Manufacturer: "Mercedes",
      Model: "E300",
      year: 2019,
      RentalPrice: 80,
      gearbox: "auto",
      luggage: 2,
      seats: 3,
    },
  ];

  return (
    <Router>
      <NavBar/>
      <CarListContext.Provider value={ListOfCars}>
        <Routes>
          {/* <Route path="/" element={<CarListContext.Provider value={ListOfCars}><HomeLayout /></CarListContext.Provider>} /> */}
          <Route path="/" element={<HomeLayout/>}/>
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/CarView/:platesNumber" element={<CarView />} />
          <Route path="/about" />
          <Route path="/contact" />
        </Routes>
      </CarListContext.Provider>
    </Router>
  );
}

export default App;
