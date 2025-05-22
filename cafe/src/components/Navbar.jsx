import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('user');
  useEffect(() => {
  const token = localStorage.getItem("authToken"); 
  if (token) {
    setIsLoggedIn(true);
  }

  const r = localStorage.getItem('role');
  if (r) {
    setRole(r);
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    setIsLoggedIn(false);
    navigate('/');
    setRole('user');
    window.location.reload(); 
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" style={{color:'white', fontWeight:'900', fontFamily:'cursive'}}>Campus Eats</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/" style={{color:'white', fontWeight:'700', fontFamily:'cursive'}}>Home</a>
              </li>
              <li className="nav-item">
                {isLoggedIn ? (
                  <button className="btn btn-danger nav-link" onClick={handleLogout} style={{color:'white', fontWeight:'700', fontFamily:'cursive'}}>Logout</button>
                ) : (
                  <a className="nav-link" href="/signup" style={{color:'white', fontWeight:'700', fontFamily:'cursive'}}>Sign up</a>
                )}
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about" style={{color:'white', fontWeight:'700', fontFamily:'cursive'}}>About us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/menu" style={{color:'white', fontWeight:'700', fontFamily:'cursive'}}>Menu</a>
              </li>
              {
                role==='admin'?(
                    <li className="nav-item">
                <a className="nav-link" href="/orders" style={{color:'white', fontWeight:'700', fontFamily:'cursive'}}>Orders</a>
              </li>
                ):(<p/>)
              }
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
