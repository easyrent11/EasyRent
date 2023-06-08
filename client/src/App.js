import React, { useState} from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CarView from "./components/CarView";
import HomeLayout from "./pages/HomeLayout";
import NavBar from "./components/NavBar";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import { CarListContext } from "./contexts/CarListContext";
import SearchResultDisplay from "./pages/SearchResultDisplay";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import UserLayout from "./pages/UserLayout";
import UserNav from './components/UserNav';
import PageNotFound from "./components/PageNotFound";
import AddCarForm from "./components/AddCar";

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
<<<<<<< HEAD
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
            <Route path="/AddCar" element={<AddCarForm />} />

            <Route
              path="/SearchResultDisplay"
              element={<SearchResultDisplay />}
            />
            {/* Private Home route for the logged in users */}
            <Route
              path="/user/homepage"
              element={
                <PrivateRoute openLogin={openLogin} component={UserLayout} />
              }
            />
            {/* catch all */}
            <Route
              path="*"
              element={<PageNotFound handleNotFound={handleNotFound} />}
            />
          </Routes>

=======
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
              <Route path="/ContactUs" element={<ContactUs isLoggedIn={isLoggedIn}/>} />
              <Route
                path="/SearchResultDisplay"
                element={<SearchResultDisplay />}
              />
              {/* Private Home route for the logged in users */}
              <Route path="/homepage" element={<PrivateRoute openLogin={openLogin} component={UserLayout} />} />
              {/* catch all */}
            <Route path="*" element={<PageNotFound handleNotFound={handleNotFound}/>} />
            </Routes>
        
>>>>>>> 4bd80dce2f0bef7879f49538336e09dfc7e5af17
          {/* conditional rendering login and register components. */}
          {showLogin && (
            <Login handleLogin={handleLogin} onClose={closeLogin} />
          )}
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
