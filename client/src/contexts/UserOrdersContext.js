// UserOrdersContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOrdersByRenterId, getOrdersByRenteeId } from '../api/UserApi';

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
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Fetch orders with renter_id matching userId from localStorage
    getOrdersByRenterId(userId)
      .then((res) => {
        setUserOrders(res.data); // Store the fetched orders in state
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // Fetch orders with rentee_id matching userId from localStorage
    getOrdersByRenteeId(userId)
      .then((res) => {
        setUserRenteeOrders(res.data); // Store the fetched orders in state
      })
      .catch((err) => {
        console.log(err);
        // Handle error
      });
  }, []);

  return (
    <UserOrdersContext.Provider value={{ userOrders, userRenteeOrders }}>
      {children}
    </UserOrdersContext.Provider>
  );
}
