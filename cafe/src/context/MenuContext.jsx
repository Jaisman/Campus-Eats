// MenuContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import classicB from '../assets/classicB.jpg';
import cheeseB from '../assets/cheeseB.jpg';
import baconB from '../assets/baconB.jpg';
import mushB from '../assets/mushB.jpg';
import margherita from '../assets/margherita.jpg';
import peppironi from '../assets/peppironi.jpg';
import vege from '../assets/vege.jpg';
import supreme from '../assets/supreme.jpg';

const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
  const [menuData, setMenuData] = useState(() => {
    const storedMenu = localStorage.getItem('menuData');
    if (storedMenu) {
      return JSON.parse(storedMenu);
    } else {
      return [
        {
          id: 1,
          name: 'burger',
          items: [
            { id: 1, name: 'Classic Burger', price: 8.99, description: 'Beef patty with lettuce, tomato, onion, and our special sauce', image: classicB },
            { id: 2, name: 'Cheese Burger', price: 9.99, description: 'Classic burger with American cheese', image: cheeseB },
            { id: 3, name: 'Bacon Burger', price: 10.99, description: 'Classic burger with crispy bacon and cheese', image: baconB },
            { id: 4, name: 'Mushroom Swiss', price: 11.99, description: 'Beef patty with sautéed mushrooms and Swiss cheese', image: mushB },
          ]
        },
        {
          id: 2,
          name: 'pizza',
          items: [
            { id: 5, name: 'Margherita', price: 12.99, description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil', image: margherita },
            { id: 6, name: 'Pepperoni', price: 13.99, description: 'Tomato sauce, mozzarella, and pepperoni slices', image: peppironi },
            { id: 7, name: 'Vegetarian', price: 14.99, description: 'Tomato sauce, mozzarella, bell peppers, mushrooms, and onions', image: vege },
            { id: 8, name: 'Supreme', price: 16.99, description: 'Loaded with pepperoni, sausage, bell peppers, onions, and olives', image: supreme },
          ]
        }
      ];
    }
  });

  // Update localStorage whenever menuData changes
  useEffect(() => {
    localStorage.setItem('menuData', JSON.stringify(menuData));
  }, [menuData]);

  const updateMenu = (newMenuData) => {
    setMenuData(newMenuData);
  };

  return (
    <MenuContext.Provider value={{ menuData, updateMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
