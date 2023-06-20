import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CarView from "./components/CarView";
import HomeLayout from "./pages/HomeLayout";
import NavBar from "./components/NavBar";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import { SearchCarListResult } from "./contexts/SearchCarListResult";
import { AllCarsContext } from "./contexts/AllCarsContext";
import { UserProfileDetails } from "./contexts/UserProfileDetails";
import SearchResultDisplay from "./pages/SearchResultDisplay";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import UserLayout from "./pages/UserLayout";
import UserNav from "./components/UserNav";
import PageNotFound from "./components/PageNotFound";
import AddCarForm from "./components/AddCar";
import axios from "axios";
import {getAllUserDetails} from "./api/CarApi";
import UserProfile from "./components/UserProfile";

function App() {
  const [carList, setCarList] = useState([]);
  const [allCars, setAllCars] = useState([]);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [userDetails, setUserDetails] = useState("");
 

  const updateCarList = (updatedList) => setCarList(updatedList);
  const closeLogin = () => setShowLogin(false);
  const closeRegister = () => setShowRegister(false);

  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => setIsLoggedIn(true);
  const handleNotFound = () => setNotFound(true);

  useEffect(() => {
    // Fetch all cars from backend API using Axios
    axios
      .get("http://localhost:3001/cars/getallcars")
      .then((response) => {
        console.log(response.data);
        setAllCars(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cars:", error);
      });
  }, []);

  // try to get the token if the token exists change the isLogged state.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    getAllUserDetails(userId)
    .then((res) => {
      console.log(res.data);
      setUserDetails(res.data[0]);
    })
    .catch((err) => console.log("Couldnt get user details ", err));
  },[]);

  return (
    <>
      <SearchCarListResult.Provider value={{ carList, updateCarList }}>
        <AllCarsContext.Provider value={{allCars,setAllCars}}>
          <UserProfileDetails.Provider value={{userDetails,setUserDetails}}>
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
                <Route path="/FAQ" element={<FAQ />} />
                <Route path="/ContactUs" element={<ContactUs />} />
                <Route path="/AddCar" element={<AddCarForm />} />
                <Route path="/UserProfile" element={<UserProfile />} />

                <Route
                  path="/SearchResultDisplay"
                  element={<SearchResultDisplay />}
                />
                {/* Private Home route for the logged in users */}
                <Route
                  path="/homepage"
                  element={
                    <PrivateRoute
                      openLogin={openLogin}
                      component={UserLayout}
                    />
                  }
                />
                {/* catch all */}
                <Route
                  path="*"
                  element={<PageNotFound handleNotFound={handleNotFound} />}
                />
              </Routes>

              {/* conditional rendering login and register components. */}
              {showLogin && (
                <Login handleLogin={handleLogin} onClose={closeLogin}/>
              )}
              {showRegister && (
                <Register
                  onClose={closeRegister}
                  openLogin={openLogin}
                />
              )}
              <Footer />
            </Router>
          </UserProfileDetails.Provider>
        </AllCarsContext.Provider>
      </SearchCarListResult.Provider>
      <ToastContainer />
    </>
  );
}

export default App;
