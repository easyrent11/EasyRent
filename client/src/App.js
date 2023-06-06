import React, { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CarView from "./components/CarView";
import HomeLayout from "./pages/HomeLayout";
import NavBar from "./components/NavBar";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import Rating from "./components/Rating";
import { CarListContext } from "./contexts/CarListContext";
import SearchResultDisplay from "./pages/SearchResultDisplay";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import UserLayout from "./pages/UserLayout";
import UserNav from './components/UserNav';
import PageNotFound from "./components/PageNotFound";
function App() {

  const [carList, setCarList] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notFound,setNotFound] = useState(false);

  const updateCarList = (updatedList) => setCarList(updatedList);
  const closeLogin = () =>  setShowLogin(false);
  const closeRegister = () => setShowRegister(false);
  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegister = () => {

    setShowRegister(true);
    setShowLogin(false);
  };


  const handleLogout = () =>{
    setIsLoggedIn(false);
  } 

  const handleLogin = () => setIsLoggedIn(true);
  const handleNotFound = () => setNotFound(true);


  return (
    <>
      <CarListContext.Provider value={{ carList, updateCarList }}>
        <Router>
        {notFound ? (
          <PageNotFound handleNotFound={handleNotFound} />
        ) : isLoggedIn ? (
          <UserNav handleLogout={handleLogout} />
        ) : (
          <NavBar openLogin={openLogin} openRegister={openRegister} />
        )}
            <Routes>
              <Route path="/" element={<HomeLayout />} />
              <Route path="/CarView/:platesNumber" element={<CarView />} />
              <Route path="/Rating" element={<Rating />} />
              <Route path="/FAQ" element={<FAQ />} />
              <Route path="/ContactUs" element={<ContactUs />} />
              <Route
                path="/SearchResultDisplay"
                element={<SearchResultDisplay />}
              />
              {/* Private Home route for the logged in users */}
              <Route path="/user/homepage" element={<PrivateRoute openLogin={openLogin} component={UserLayout} />} />
              {/* catch all */}
            <Route path="*" element={<PageNotFound handleNotFound={handleNotFound}/>} />
            </Routes>
        
          {/* conditional rendering login and register components. */}
          {showLogin && <Login handleLogin={handleLogin} onClose={closeLogin} />}
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
