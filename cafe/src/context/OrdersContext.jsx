// OrdersContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const localOrders = localStorage.getItem('orders');
    return localOrders ? JSON.parse(localOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };
  const removeOrder = (orderId)=>{
    setOrders((prevOrders) => prevOrders.filter((o) => o.id!== orderId));
  }
  return (
    <OrdersContext.Provider value={{ orders, addOrder, removeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};
