import React, { useRef, useEffect, useState } from 'react';
// Importing necessary React hooks

import '../Styles/Homepage.css';
// Import custom CSS for homepage styling

import { Link } from 'react-router-dom';
// Import Link component for client-side routing

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// Import styles for the slick carousel slider

import Slider from 'react-slick';
// Import the Slider component from react-slick

import Header from './Header';
import Footer from './Footer';
// Import shared Header and Footer components

import onetest from '../../assets/one.jpeg';
import twotest from '../../assets/two.jpeg';

import heroimg from '../../assets/heroimg.png';
// Import hero section background image

import { FaShieldAlt, FaClock, FaCarSide } from 'react-icons/fa';
// Import FontAwesome icons for services section

const Homepage = () => {
  const textRef = useRef(null); // Ref for animated hero text (optional usage)
  const [cars, setCars] = useState([]); // State to store cars fetched from API
  const [loading, setLoading] = useState(true); // State to show loading state

  const API_BASE = import.meta.env.VITE_BACKEND_URL; // Load backend base URL from environment variable

  useEffect(() => {
    // Fetch cars when component mounts
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cars`); // Make request to backend
        const data = await res.json(); // Parse response
        setCars(data); // Save cars in state
      } catch (error) {
        console.error('Failed to fetch cars:', error); // Log error to console
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    fetchCars(); // Call the function
  }, []);

  // Static services content
  const services = [
    {
      title: "Fully Insured",
      icon: <FaShieldAlt />,
      description: "All vehicles are fully insured for your peace of mind."
    },
    {
      title: "24/7 Service",
      icon: <FaClock />,
      description: "Our support team is available around the clock."
    },
    {
      title: "Premium Fleet",
      icon: <FaCarSide />,
      description: "Choose from the latest luxury and performance cars."
    },
  ];

  // Configuration for slick carousel
  const settings = {
    infinite: true,            // Infinite loop
    slidesToShow: 3,           // Show 3 slides at a time
    slidesToScroll: 1,         // Scroll 1 at a time
    autoplay: true,            // Enable auto-slide
    autoplaySpeed: 1500,       // 3-second delay
    speed: 750,               // Transition speed
    cssEase: 'ease',           // CSS easing function
    pauseOnHover: true,        // Pause on hover
    responsive: [              // Responsive breakpoints
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };



  return (
    <>
      <Header />
      {/* Reusable header component */}

      {/* Hero Section */}
      <div className="hero-section">
        <img src={heroimg} alt="Luxury Car" className="hero-bg" />
        {/* Background image for hero section */}

        <div className="hero-text-top-left" ref={textRef}>
          <h1>Drive Your Journey</h1>
          <p>Luxury Rentals • Premium Service</p>
        </div>

        <div className="hero-btns">
          <Link to="/login">Login</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="vehicles-section">
        <h2>Choose What Others Only Dream Of</h2>
        <p>
          Because when you choose from the extraordinary, you don’t browse — you claim
        </p>

        {/* Display messages based on fetch state */}
        {loading ? (
          <p>Loading cars...</p>
        ) : cars.length === 0 ? (
          <p>No cars available</p>
        ) : (
          <div className="carousel-container">
            <Slider {...settings}>
              {/* Render each car inside the slider */}
              {cars.slice(-3).reverse().map((car, idx) => (
                <div key={idx}>
                  <Link to="/login" className="car-card">
                    <img
                      src={
                        car.image
                          ? `${API_BASE}/uploads/${car.image}` // Image from server
                          : 'https://via.placeholder.com/300x200?text=No+Image' // Placeholder
                      }
                      alt={car.model}
                      className="car-img"
                    />
                    <h3>{car.make} {car.model}</h3>
                    <div className="car-info-row">
                      <span className="car-type">{car.fuelType || 'N/A'}</span>
                      <span className="car-price">${car.pricePerDay}/day</span>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>

      {/* Services Section */}
      <div className="services-section">
        <h2>Our Services</h2>
        <div className="services-cards">
          {/* Render each service card */}
          {services.map((service, idx) => (
            <div className="card" key={idx}>
              <div className="card-inner">
                <div className="card-front">
                  <div className="icon">{service.icon}</div>
                  <div className="title">{service.title}</div>
                </div>
                <div className="card-back">{service.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

{/* Testimonials Section */}
<div className="testimonials-wrapper">
    <h2 className="testimonials-title">What Our Customers Say</h2>
  {[
    {
      photo: onetest,
      text: "Renting from this company was an absolute delight! The car was spotless and the service was top-notch.",
      name: "Sam T."
    },
    {
      photo: twotest,
      text: "Fantastic experience. The booking was easy, and the staff was very friendly. Highly recommend!",
      name: "Lil Dicky."
    },
    {
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "A luxury car rental service that truly cares about its customers. I will definitely rent again!",
      name: "Meme hehe."
    },
  ].map((testimony, idx) => (
    <div
      key={idx}
      className={`testimonial-card ${idx === 1 ? 'right-align' : ''}`}
      aria-label={`Testimonial by ${testimony.name}`}
    >
      {/* For odd index (1), image right, text left */}
      <img
        src={testimony.photo}
        alt={testimony.name}
        className={`testimonial-photo ${idx % 2 === 1 ? 'photo-right' : ''}`}
      />
      <div className={`testimonial-content ${idx % 2 === 1 ? 'text-left' : 'text-right'}`}>
        <p className="testimonial-text">{testimony.text}</p>
        <p className="testimonial-name">- {testimony.name}</p>
      </div>
    </div>
  ))}
</div>




      <Footer />
      {/* Reusable footer component */}
    </>
  );
};

export default Homepage;
// Export the Homepage component for use in routing or other components
