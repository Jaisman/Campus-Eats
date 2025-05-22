import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu from MongoDB on mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('/fetch-categories');
        setMenuData(res.data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const updateMenu = (newMenuData) => {
    setMenuData(newMenuData);
  };

  return (
    <MenuContext.Provider value={{ menuData, updateMenu, loading }}>
      {children}
    </MenuContext.Provider>
  );
};
