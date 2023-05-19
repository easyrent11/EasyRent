import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CarView from './components/CarView';
import React from "react";
import HomeLayout from "./pages/HomeLayout";
import {CarListContext} from "./CarListContext";



function App() {
  const ListOfCars = [
    {
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
      <CarListContext.Provider value={ListOfCars}>
        <Routes>
          <Route path="/" element={<CarListContext.Provider value={ListOfCars}><HomeLayout /></CarListContext.Provider>} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/CarView" element={<CarView />} />
          <Route path="/about" />
          <Route path="/contact" />
        </Routes>
      </CarListContext.Provider>
    </Router>
  );
}

export default App;
