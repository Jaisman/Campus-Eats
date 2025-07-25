import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import axios from 'axios';
import bg_menu from '../assets/bg_menu.jpg';

const Menu = () => {

  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const { cart = [], addToCart } = useCart();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('http://localhost:8080/fetch-categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setSelectedCategoryId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedCategoryId) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/categories/${selectedCategoryId}/items`);
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };
    fetchItems();
  }, [selectedCategoryId]);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

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
          zIndex: -1,
        }}
      />
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar - Categories */}
          <div className="col-md-3 p-4">
            <h3 className="mb-4" style={{ color: 'white' }}>Categories</h3>
            <div className="list-group">
              {categories.map((category) => (
                <button
                  key={category._id}
                  className="list-group-item list-group-item-action text-capitalize"
                  onClick={() => handleSelectCategory(category._id)}
                  style={{
                    backgroundColor: selectedCategoryId === category._id ? '#ffe71c' : '',
                    color: selectedCategoryId === category._id ? 'black' : '',
                  }}
                >
                  {category.Name}
                </button>
              ))}
            </div>

            {role === 'admin' && (
              <button
                className="btn btn-warning mt-4 w-100"
                onClick={() => navigate('/add')}
              >
                Add Category
              </button>
            )}
          </div>

          {/* Menu Items */}
          <div className="col-md-9 p-4" style={{ color: 'white' }}>
            {loading ? (
              <div className="alert alert-info">Loading menu...</div>
            ) : selectedCategoryId ? (
              <>
                <h2 className="mb-4 text-capitalize text-center">
                  {categories.find(cat => cat._id === selectedCategoryId)?.Name || "Items"}
                </h2>
                {items.length === 0 ? (
                  <div className="alert alert-warning text-center">No items found in this category.</div>
                ) : (
                  <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 gx-3 gy-3">


                    {items.map((item) => {
                      const cartItem = cart?.find((cartItem) => cartItem._id === item._id);
                      const quantity = cartItem ? cartItem.quantity : 0;

                      return (
                        <div key={item._id} className="col d-flex justify-content-center">
                          <div className="card shadow-sm" style={{ width: '280px' }}>

                            {/* 4:3 Aspect Ratio (adjusted shorter to ~60%) */}
                            <div style={{ position: 'relative', width: '100%', paddingTop: '60%', overflow: 'hidden' }}>
                              <img
                                src={item.Image}
                                alt={item.Name}
                                className="card-img-top"
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>

                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0" style={{ fontSize: '1rem' }}>{item.Name}</h5>
                                <span className="badge bg-primary">${item.Price}</span>
                              </div>
                              <p className="card-text" style={{ fontSize: '0.9rem' }}>{item.Description}</p>

                              {role === "user" ? (
                                <div className="d-flex align-items-center">
                                  <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => addToCart(item)}
                                  >
                                    Add to Order
                                  </button>
                                  {quantity > 0 && (
                                    <span className="badge bg-success px-2 py-1">
                                      {quantity} in Cart
                                    </span>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>


                      );
                    })}
                  </div>
                )}
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
      {role !== 'admin' && (
        <footer className="p-3 text-center">
          <button className="btn btn-success px-4" onClick={() => navigate('/cart')}>
            View Cart
          </button>
        </footer>
      )}
    </div>
  );
};

export default Menu;
