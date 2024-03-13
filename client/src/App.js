// ########################################################################################
// #                             IMPORTS OF REACT/OTHER LIBRARIES.                        #
// ########################################################################################
import React, { useState, useEffect, useMemo } from "react";
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
import NoAccountPrivateRoute from "./components/NoAccountPrivateRoute";
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
import AdminViewUserProfile from "./components/AdminViewUserProfile";
// admin components.
import PrivateAdminRoute from "./components/PrivateAdminRoute";
import AdminDashboard from "./components/AdminDashBoard";
import AdminProfile from "./components/AdminProfile";
import AdminUserReports from "./components/AdminUserReports";
import AdminUserChatHistory from "./components/AdminUserChatHistory";
import AdminChatHistory from "./components/AdminChatHistory";
import AdminUsersList from "./components/AdminUsersList";
import AdminSideBar from "./components/AdminSideBar";
import AdminUserReportsView from "./components/AdminUserReportsView";
import ViewOrderedCarDetails from "./components/ViewOrderedCarDetails";
// ########################################################################################
// #                             Imports of contexts.                                     #
// ########################################################################################
import { SearchCarListResult } from "./contexts/SearchCarListResult";
import { AllCarsContext } from "./contexts/AllCarsContext";
import { UserProfileDetails } from "./contexts/UserProfileDetails";
import { UserOrdersProvider } from "./contexts/UserOrdersContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// ########################################################################################
// #                             Imports Of pages.                                        #
// ########################################################################################
import UserLayout from "./pages/UserLayout";
import HomeLayout from "./pages/HomeLayout";
// ########################################################################################
// #                             IMPORTS OF API CALLS/HELPER FUNCTIONS.                   #
// ########################################################################################
import { getAllCars } from "./api/CarApi";
import { getAllUserDetails,getAllUsers } from "./api/UserApi";


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
  const [allCars, setAllCars] = useState([]); // useState to save all of the cars from the database to display them whenever needed.
  const [allUsers,setAllUsers] = useState([]); // useState to save all of the users fron the database to display them whenever needed.
 
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
  useMemo(() => {
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

  useEffect(() => {
    // Fetch all cars from backend API using Axios
    getAllUsers()
      .then((response) => {
        console.log(response.data);
        setAllUsers(response.data);
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
    if (!userId) {
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
              <NotificationProvider>
              <Router>
                <div
                  className={
                    localStorage.getItem('isAdmin') === "true" ? "admin-layout" : "default-layout"
                  }
                >
                  {notFound ? (
                    <PageNotFound handleNotFound={handleNotFound} />
                  ) : isLoggedIn ? (
                    localStorage.getItem("isAdmin") === "true" ?
                     (
                      <AdminSideBar handleLogout={handleLogout} userDetails={userDetails}/>
                    ) : (
                      <UserNav handleLogout={handleLogout} />
                    )
                  ) : (
                    <NavBar openLogin={openLogin} openRegister={openRegister} />
                  )}

                  <Routes>
                    {/* Normal User Routes  NO ADMIN */}
                  
                    <Route path="/" element={
                      <NoAccountPrivateRoute
                        component={HomeLayout}
                      />
                    }
                    />
                    
                    <Route
                      path="/CarView/:encryptedPlatesNumber"
                      element={
                        <NoAccountPrivateRoute
                          openLogin={openLogin}
                          component={CarView}
                        />
                      }
                    />
                     <Route
                      path="/ViewOrderedCarDetails/:encryptedPlatesNumber"
                      element={
                        <NoAccountPrivateRoute
                          component={ViewOrderedCarDetails}
                        />
                      }
                    />
                    <Route path="/FAQ" element={
                      <NoAccountPrivateRoute
                        component={FAQ}
                      />
                    } 
                    />
                    <Route path="/ContactUs" element={
                      <NoAccountPrivateRoute
                        component={ContactUs}
                      />
                    } />
                
                    {/* Routes for only logged in users. NO ADMIN */}
                    <Route
                      path="/CarOwnerView/:encryptedPlatesNumber"
                      element={
                        <PrivateRoute
                          openLogin={openLogin}
                          component={CarOwnerView}
                          setAllCars={setAllCars}
                        />
                      }
                    />
                    <Route
                      path="/AddCar"
                      element={
                        <PrivateRoute
                          openLogin={openLogin}
                          component={AddCar}
                        />
                      }
                    />
                    <Route
                      path="/UserProfile"
                      element={
                        <PrivateRoute
                          openLogin={openLogin}
                          component={UserProfile}
                        />
                      }
                    />
                    <Route
                      path="/Orders"
                      element={
                        <PrivateRoute
                          openLogin={openLogin}
                          component={Orders}
                        />
                      }
                    />
                    <Route
                      path="/ChatApp"
                      element={
                        <PrivateRoute
                          openLogin={openLogin}
                          component={ChatApp}
                          flag={"true"}
                        />
                      }
                    />
                    <Route
                      path="/Notifications/:orderId/:typeOfNotification"
                      element={
                        <PrivateRoute
                          openLogin={openLogin}
                          component={Notifications}
                          flag={"true"}
                        />
                      }
                    />
                    <Route
                      path="/Reports/:orderId"
                      element={
                        <PrivateRoute
                          openLogin={openLogin}
                          component={Reports}
                        />
                      }
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
                    {/* Private route for the admin */}
                    <Route
                      path="/adminpage"
                      element={
                        <PrivateAdminRoute
                          handleLogout={handleLogout}
                          component={AdminDashboard}
                          users={allUsers}
                          cars={allCars}
                        />
                      }
                    />
                    <Route
                      path="profile"
                      element={
                        <PrivateAdminRoute
                          openLogin={openLogin}
                          component={AdminProfile}
                        />
                      }
                    />
                    <Route
                      path="/ViewUserProfile/:encryptedId"
                      element={
                        <PrivateAdminRoute
                         openLogin={openLogin}
                         component={AdminViewUserProfile}
                        />
                      }
                    />
                     <Route
                      path="reports"
                      element={
                        <PrivateAdminRoute
                          openLogin={openLogin}
                          component={AdminUserReports}
                        />
                      }
                    />
                   
                    <Route
                      path="users"
                      element={
                        <PrivateAdminRoute
                          openLogin={openLogin}
                          component={AdminUsersList}
                        />
                      }
                    />
                     <Route
                      path="/UserReportsView/:encryptedId"
                      element={
                        <PrivateAdminRoute
                          openLogin={openLogin}
                          component={AdminUserReportsView}
                        />
                      }
                    />
                     <Route
                      path="/chathistory/:encryptedId" 
                      element={
                        <PrivateAdminRoute
                          openLogin={openLogin}
                          component={AdminUserChatHistory}
                        />
                      }
                    />
                      <Route
                      path="/chathistory" 
                      element={
                        <PrivateAdminRoute
                          openLogin={openLogin}
                          component={AdminChatHistory}
                        />
                      }
                    />

                    {/* End of private routes for admin */}

                    {/* catch all */}
                    <Route
                      path="*"
                      element={<PageNotFound handleNotFound={handleNotFound} />}
                    />
                  </Routes>

                  {/* conditional rendering login and register components. */}
                  {showLogin && (
                    <Login handleLogin={handleLogin} onClose={closeLogin} />
                  )}
                  {showRegister && (
                    <Register onClose={closeRegister} openLogin={openLogin} setAllUsers={setAllUsers}/>
                  )}
                </div>
                <Footer />
              </Router>

              </NotificationProvider>
            </UserOrdersProvider>
          </UserProfileDetails.Provider>
        </AllCarsContext.Provider>
      </SearchCarListResult.Provider>
      <ToastContainer />
    </>
  );
}

export default App;
