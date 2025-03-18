import React from 'react';
import Navbar from './Navbar';
import headChef from '../assets/headChef.jpg';
import chef1 from '../assets/chef1.jpg';
import chef2 from '../assets/chef2.jpg';
import aboutBg from '../assets/aboutBg.jpg';

export default function About() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Navbar remains at the top */}
      <Navbar />
      
      {/* Background layer: absolutely positioned and dimmed */}
      <div
        style={{
          backgroundImage: `url(${aboutBg})`,
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
      
      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '15px' }}>
          <h2 className="text-center">About Campus Eats</h2>
          <div
            style={{
              backgroundColor: 'rgba(208, 206, 199, 0.5)',
              borderRadius: '5px',
              padding: '35px',
              margin: '35px',
            }}
          >
            <h3>Our Story</h3>
            <p>
              Welcome to Campus Eats, the heart of culinary life at IIIT Allahabad. Established in 2010, our cafeteria has evolved from a simple dining hall to a vibrant community hub where students, faculty, and staff come together to share meals and create memories.
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(208, 206, 199, 0.5)',
              borderRadius: '5px',
              padding: '35px',
              margin: '35px',
            }}
          >
            <h3>Our Mission</h3>
            <p>
              At Campus Eats, we believe that good food fuels great minds. Our mission is to provide nutritious, delicious, and diverse dining options that energize our campus community while promoting sustainability and wellness. We're committed to creating a welcoming space where everyone can find something to enjoy, regardless of dietary preferences or restrictions.
            </p>
          </div>
        </div>

        {/* Meet Our Team Section */}
        <div style={{ backgroundColor: 'gray', padding: '50px' }}>
          <h2 className="text-center m-4">Meet Our Team</h2>
          <div className="container">
            <div className="row m-4 mb-6">
              {/* First Card */}
              <div className="col-md-4">
                <div className="card" style={{ width: '18rem', height: '300px' }}>
                  <img
                    src={headChef}
                    className="card-img-top"
                    alt="Head Chef"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">Alberto Doe</h5>
                    <p className="card-text">Head Chef</p>
                    <button className="btn btn-success">15 yrs experience</button>
                  </div>
                </div>
              </div>

              {/* Second Card */}
              <div className="col-md-4">
                <div className="card" style={{ width: '18rem', height: '300px' }}>
                  <img
                    src={chef1}
                    className="card-img-top"
                    alt="Assistant Chef"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">Siya Oberoi</h5>
                    <p className="card-text">Assistant Chef</p>
                    <button className="btn btn-success">3 yrs experience</button>
                  </div>
                </div>
              </div>

              {/* Third Card */}
              <div className="col-md-4">
                <div className="card" style={{ width: '18rem', height: '300px' }}>
                  <img
                    src={chef2}
                    className="card-img-top"
                    alt="Dessert Specialist"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">Alflredo Remiz</h5>
                    <p className="card-text">Dessert Specialist</p>
                    <button className="btn btn-success">10 yrs experience</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
