import React, { useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";
import CarView from "./components/CarView";
import HomeLayout from "./pages/HomeLayout";
import NavBar from "./components/NavBar";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import Rating from "./components/Rating";
import { CarListContext } from './contexts/CarListContext';


function App() {
  const [carList, setCarList] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const getCarList = async () => {
      try {
        const response = await Axios.get('http://localhost:3001/api/cars/searchcar');
        console.log("app response data = ", response.data);
      } catch (error) {
        console.error('Error fetching car list:', error);
      }
    };
    getCarList();
  }, []);

  const updateCarList = (updatedList) => {
    setCarList(updatedList);
  };

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

  return (
    <CarListContext.Provider value={{carList, updateCarList}}>
      <Router>
        <NavBar openLogin={openLogin} openRegister={openRegister} />
        <Routes>
          <Route path="/" element={<HomeLayout />} />
          <Route path="/CarView/:platesNumber" element={<CarView />} />
          <Route path="/Rating" element={<Rating />} />
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
  );
}

export default App;
