import React from 'react';
import Navbar from './Navbar';
import home_i1 from '../assets/home_i1.jpg';
import paneer from '../assets/paneer.jpg';
import farmhouse from '../assets/farmhouse.jpg';
import pastry from '../assets/pastry.jpg';

export default function Home() {
  return (
    // Parent container that spans the full viewport height
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background layer, absolutely positioned behind content */}
      <div
        style={{
          backgroundImage: `url(${home_i1})`,
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

      {/* Foreground content */}
      <Navbar />

      {/* Main content container */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <div
          className="vh-100 d-flex flex-column align-items-center justify-content-center text-white"
          style={{ marginBottom: 0 }}
        >
          {/* Logo */}
          <h1 className="display-2 fw-bold mb-4">Campus Eats</h1>
          {/* Tagline */}
          <h2 className="h2 text-center mb-5">Discover the best food & drinks in your College</h2>
        </div>

        {/* "Today's special" Section */}
        <div style={{ backgroundColor: 'gray', padding: '50px' }}>
          <h2 className="text-center m-4">Today's special</h2>
          <div className="container">
            <div className="row m-4 mb-6">
              {/* First Card */}
              <div className="col-md-4">
                <div className="card" style={{ width: '18rem', height: '300px' }}>
                  <img
                    src={paneer}
                    className="card-img-top"
                    alt="Paneer Handi"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">Paneer Handi</h5>
                    <p className="card-text">Take it before out of stock</p>
                    <button className="btn btn-success">360 Rupees</button>
                  </div>
                </div>
              </div>

              {/* Second Card */}
              <div className="col-md-4">
                <div className="card" style={{ width: '18rem', height: '300px' }}>
                  <img
                    src={farmhouse}
                    className="card-img-top"
                    alt="Farm house Pizza"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">Farm house Pizza</h5>
                    <p className="card-text">Take it before out of stock</p>
                    <button className="btn btn-success">399 Rupees</button>
                  </div>
                </div>
              </div>

              {/* Third Card */}
              <div className="col-md-4">
                <div className="card" style={{ width: '18rem', height: '300px' }}>
                  <img
                    src={pastry}
                    className="card-img-top"
                    alt="Fruit Pastry"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">Fruit Pastry</h5>
                    <p className="card-text">Take it before out of stock</p>
                    <button className="btn btn-success">89 Rupees</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> {/* End "Today's special" */}
      </div>
    </div>
  );
}
