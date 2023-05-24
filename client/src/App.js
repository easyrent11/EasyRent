import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CarView from "./components/CarView";
import React from "react";
import HomeLayout from "./pages/HomeLayout";
import NavBar from "./components/NavBar";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import { createContext, useState } from "react";
import Footer from "./components/Footer";
import Rating from './components/Rating';
export const CarListContext = createContext([]);

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeLogin = () => {
    setShowLogin(false);
  };

  const closeRegister = () => {
    setShowRegister(false);
  };

  const ListOfCars = [
    {
      platesNumber: 11122233,
      profilePicture: "profileimage.png",
      Images: [
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "https://stimg.cardekho.com/images/carexteriorimages/930x620/Mercedes-Benz/GLA/7269/1621948227508/front-left-side-47.jpg?tr=w-375",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
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
      platesNumber: 11133344,
      profilePicture: "profileimage.png",
      Images: [
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
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
      platesNumber: 11122299,
      profilePicture: "profileimage.png",
      Images: [
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
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
      platesNumber: 11122237,
      profilePicture: "profileimage.png",
      Images: [
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
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
      platesNumber: 11121133,
      profilePicture: "profileimage.png",
      Images: [
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
        "http://www.mercedesbenzcary.com/static/agency-leith/mercedes-benz-cary/mr/2017/E-Class/2017-Mercedes-Benz-E-Class-main.jpg",
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
    <>
      <CarListContext.Provider value={ListOfCars}>
        <Router>
          <NavBar openLogin={openLogin} openRegister={openRegister} />
          <Routes>
            <Route path="/" element={<HomeLayout />} />
            <Route path="/CarView/:platesNumber" element={<CarView />} />
            <Route path="/Rating" element={<Rating/>}/>
            <Route path="/about" />
            <Route path="/contact" />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/ContactUs" element={<ContactUs />} />
          </Routes>

          {showLogin && <Login onClose={closeLogin} />}
          {showRegister && (
            <Register onClose={closeRegister} openLogin={openLogin} />
          )}
          <Footer />
        </Router>
      </CarListContext.Provider>
    </>
  );
}

export default App;
