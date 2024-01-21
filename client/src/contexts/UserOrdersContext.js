// UserOrdersContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOrdersByRenterId, getOrdersByRenteeId } from '../api/UserApi';
import io from "socket.io-client";

const UserOrdersContext = createContext();

export function useUserOrders() { 
  const context = useContext(UserOrdersContext);
  if (!context) {
    throw new Error('useUserOrders must be used within a UserOrdersProvider');
  }
  return context;
}

export function UserOrdersProvider({ children }) {
  const [userOrders, setUserOrders] = useState([]);
  const [userRenteeOrders, setUserRenteeOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Connect to the Socket.IO server and authenticate
    const socket = io.connect("http://localhost:3001");
    
    socket.on("notification", (notification) => {
      console.log("in context")
      if (notification.type === "order-request-notification") {
        getOrdersByRenterId(userId)
          .then((res) => {
            setUserOrders(res.data); // Store the fetched orders in state
          })
          .catch((err) => {
            console.log(err);
          });
  
        getOrdersByRenteeId(userId)
          .then((res) => {
            setUserRenteeOrders(res.data); // Store the fetched orders in state
          })
          .catch((err) => {
            console.log(err);
            // Handle error
          });
      }
    });
  
    setSocket(socket);
  
    // Clean up when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);



  // fetching all the orders where the logged in user is the renter (the one who owns the car.)
  useEffect(() => {
    getOrdersByRenterId(userId)
      .then((res) => {
        setUserOrders(res.data); // Store the fetched orders in state
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // fetching all the orders where the logged in user is the rentee (the one who wants to rent the car.)
  useEffect(() => {
    getOrdersByRenteeId(userId)
      .then((res) => {
        setUserRenteeOrders(res.data); // Store the fetched orders in state
      })
      .catch((err) => {
        console.log(err);
        // Handle error
      });
  }, []);



  // Provide the state and the function separately
  const contextValue = {
    userOrders,
    userRenteeOrders,
    setUserRenteeOrders,
    setUserOrders,
  };


  return (
    <UserOrdersContext.Provider value={contextValue}>
      {children}
    </UserOrdersContext.Provider>
  );
}
