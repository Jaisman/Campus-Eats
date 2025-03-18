// Menu.js
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useMenu } from '../context/MenuContext';
import bg_menu from '../assets/bg_menu.jpg';

const Menu = () => {
  const navigate = useNavigate();
  const { cart = [], addToCart } = useCart(); 

  // useEffect(() => {
  //   const user = localStorage.getItem('user');
  //   if (!user) navigate('/');
  // }, [navigate]);

  const { menuData } = useMenu();
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    menuData.length > 0 ? menuData[0].id : null
  );

  const selectedCategory = menuData.find(c => c.id === selectedCategoryId);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div
              style={{
                backgroundImage: `url(${bg_menu})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(0.7)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1, // ensures this div is behind everything else
              }}
            />
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar - Categories */}
          <div className="col-md-3 p-4">
            <h3 className="mb-4" style={{color:'white'}}>Categories</h3>
            <div className="list-group">
              {menuData.map((category) => (
                <button
                key={category.id}
                className="list-group-item list-group-item-action text-capitalize"
                onClick={() => setSelectedCategoryId(category.id)}
                style={{
                  backgroundColor: selectedCategoryId === category.id ? '#ffe71c' : '',
                  color: selectedCategoryId === category.id ? 'black' : '',
                }}
              >
                {category.name}
              </button>
              
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="col-md-9 p-4"  style={{color:'white'}}>
            {selectedCategory ? (
              <>
                <h2 className="mb-4 text-capitalize text-center">{selectedCategory.name}</h2>
                <div className="row row-cols-2 g-4">
                  {selectedCategory.items.map((item) => {
                    const cartItem = cart?.find((cartItem) => cartItem.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;
  
                    return (
                      <div key={item.id} className="col">
                        <div className="card h-100 shadow-sm">
                          <img src={item.image} className="card-img-top" alt={item.name} style={{ height: '180px', objectFit: 'cover' }} />
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="card-title mb-0">{item.name}</h5>
                              <span className="badge bg-primary">${item.price}</span>
                            </div>
                            <p className="card-text">{item.description}</p>
                            <div className="d-flex align-items-center">
                              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => addToCart(item)}>
                                Add to Order
                              </button>
                              {quantity > 0 && (
                                <span className="badge bg-success px-2 py-1">
                                  {quantity} in Cart
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="alert alert-info">
                No category selected.
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="p-3 text-center">
        <button className="btn btn-success px-4" onClick={() => navigate('/cart')}>
          View Cart
        </button>
      </footer>
    </div>
  );
};

export default Menu;
