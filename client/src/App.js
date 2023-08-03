// ########################################################################################
// #                             IMPORTS OF REACT/OTHER LIBRARIES.                        #
// ########################################################################################
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// ########################################################################################
// #                             IMPORTS OF COMPONENTS.                                   #
// ########################################################################################
import Register from "./components/Register";
import Login from "./components/Login";
import CarView from "./components/CarView";
import NavBar from "./components/NavBar";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import UserNav from "./components/UserNav";
import PageNotFound from "./components/PageNotFound";
import AddCar from "./components/AddCar";
import UserProfile from "./components/UserProfile";
import DisplaySearchResults from "./components/DisplaySearchResults";
import Orders from "./components/Orders";
import Notifications from "./components/Notifications";
import Reports from "./components/Reports";
import CarOwnerView from "./components/CarOwnerView";
import ChatApp from "./components/ChatApp";
// ########################################################################################
// #                             Imports of contexts.                                     #
// ########################################################################################
import { SearchCarListResult } from "./contexts/SearchCarListResult";
import { AllCarsContext } from "./contexts/AllCarsContext";
import { UserProfileDetails } from "./contexts/UserProfileDetails";
import { UserOrdersProvider } from "./contexts/UserOrdersContext";

// ########################################################################################
// #                             Imports Of pages.                                        #
// ########################################################################################
import UserLayout from "./pages/UserLayout";
import HomeLayout from "./pages/HomeLayout";
// ########################################################################################
// #                             IMPORTS OF API CALLS/HELPER FUNCTIONS.                   #
// ########################################################################################
import { getAllCars } from "./api/CarApi";
import { getAllUserDetails } from "./api/UserApi";

function App() {
  // ########################################################################################
  // #                             UseState Declarations.                                   #
  // ########################################################################################
  const [showLogin, setShowLogin] = useState(false); // useState to show the login component
  const [showRegister, setShowRegister] = useState(false); //useState to show the register component
  const [isLoggedIn, setIsLoggedIn] = useState(false); // useState to check if a user is logged in or not.
  const [notFound, setNotFound] = useState(false); // useState for when a page is not found.
  const [userDetails, setUserDetails] = useState(""); // useState to save all of the retrieved User Details.
  const [carList, setCarList] = useState([]); // useState to save all of the retrieved cars from the *USER SEARCH*.
  const [allCars, setAllCars] = useState([]); // useState to save all of the cars in the database to display them 

  // ########################################################################################
  // #                             OnClick Functions.                                       #
  // ########################################################################################
  const updateCarList = (updatedList) => setCarList(updatedList); // on click function to update the car list .
  const closeLogin = () => setShowLogin(false); // on click function to set the show login window to false.
  const closeRegister = () => setShowRegister(false); // on click function to set the show login window to false.
  // function to handle when a user has logged in
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleNotFound = () => setNotFound(true); // function to handle when a page was not found
  // on click function to open the login window and close the register.
  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  // on click function to open the register window and close the login window.
  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };
  // on click function to handle when a user has logged out.
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserDetails(""); // resetting the state.
  };
  // ########################################################################################
  // #                                     USE-EFFECTS                                      #
  // ########################################################################################
  useEffect(() => {
    // Fetch all cars from backend API using Axios
    getAllCars()
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
    if(!userId){
      return;
    }
    getAllUserDetails(userId)
      .then((res) => {
        console.log(res.data);
        setUserDetails(res.data[0]);
      })
      .catch((err) => console.log("Couldnt get user details ", err));
  }, []);


  

  return (
    <>
      <SearchCarListResult.Provider value={{ carList, updateCarList }}>
        <AllCarsContext.Provider value={{ allCars, setAllCars }}>
          <UserProfileDetails.Provider value={{ userDetails, setUserDetails }}>
            <UserOrdersProvider>
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
                  <Route path="/CarOwnerView/:platesNumber" element={<CarOwnerView setAllCars={setAllCars} />} />
                  <Route path="/FAQ" element={<FAQ />} />
                  <Route path="/ContactUs" element={<ContactUs />} />
                  <Route path="/AddCar" element={<AddCar />} />
                  <Route path="/UserProfile" element={<UserProfile />} />
                  <Route path="/Orders" element={<Orders />} />
                  <Route path="/ChatApp" element={<ChatApp />} />
                  <Route
                    path="/Notifications/:orderId/:typeOfNotification"
                    element={<Notifications />}
                  />
                  <Route
                    path="/Reports/:orderId"
                    element={<Reports />}
                  />

                  <Route
                    path="/DisplaySearchResults"
                    element={<DisplaySearchResults />}
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
                  <Register onClose={closeRegister} openLogin={openLogin} />
                )}
                <Footer />
              </Router>
            </UserOrdersProvider>
          </UserProfileDetails.Provider>
        </AllCarsContext.Provider>
      </SearchCarListResult.Provider>
      <ToastContainer />
    </>
  );
}

export default App;