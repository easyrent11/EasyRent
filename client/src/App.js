import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import axios from "axios";
import CarView from "./components/CarView";
import HomeLayout from "./pages/HomeLayout";
import NavBar from "./components/NavBar";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import Rating from "./components/Rating";
import { CarListContext } from "./contexts/CarListContext";
import SearchResultDisplay from "./pages/SearchResultDisplay";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [carList, setCarList] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const uploadImages = (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("carpics", files[i]);
    }

    return axios.post("http://localhost:3001/api/uploadImages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  // Usage example
  const handleFileUpload = (event) => {
    const fileList = event.target.files;
    const files = Array.from(fileList);
    uploadImages(files)
      .then((response) => {
        console.log(response.data); // Handle the response data
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
    <>
    <CarListContext.Provider value={{ carList, updateCarList }}>
      <Router>
        <NavBar openLogin={openLogin} openRegister={openRegister} />
        <input
          className="text-black text-3xl"
          type="file"
          multiple
          onChange={handleFileUpload}
        />

        <Routes>
          <Route path="/" element={<HomeLayout />} />
          <Route path="/CarView/:platesNumber" element={<CarView />} />
          <Route path="/Rating" element={<Rating />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/SearchResultDisplay" element={<SearchResultDisplay/>}/>
        </Routes>
        {showLogin && <Login onClose={closeLogin} />}
        {showRegister && (
          <Register onClose={closeRegister} openLogin={openLogin} />
        )}
        <Footer />
      </Router>
    </CarListContext.Provider>
    <ToastContainer />
  </>
  );
}

export default App;
