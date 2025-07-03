import React, { useRef, useEffect, useState } from 'react';
import '../Styles/Homepage.css';
import { Link } from 'react-router-dom';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Slider from 'react-slick';

import Header from './Header';
import Footer from './Footer';

import heroimg from '../../assets/heroimg.png';

import { FaShieldAlt, FaClock, FaCarSide } from 'react-icons/fa';

const Homepage = () => {
  const textRef = useRef(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cars`);
        const data = await res.json();
        setCars(data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const services = [
    { title: "Fully Insured", icon: <FaShieldAlt />, description: "All vehicles are fully insured for your peace of mind." },
    { title: "24/7 Service", icon: <FaClock />, description: "Our support team is available around the clock." },
    { title: "Premium Fleet", icon: <FaCarSide />, description: "Choose from the latest luxury and performance cars." },
  ];

  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 1000,
    cssEase: 'ease',
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="hero-section">
        <img src={heroimg} alt="Luxury Car" className="hero-bg" />
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
        <p>Because when you choose from the extraordinary, you don’t browse — you claim</p>

        {loading ? (
          <p>Loading cars...</p>
        ) : cars.length === 0 ? (
          <p>No cars available</p>
        ) : (
          <div className="carousel-container">
            <Slider {...settings}>
              {cars.map((car, idx) => (
                <div key={idx}>
                  <Link to="/login" className="car-card">
                    <img
                      src={
                        car.image
                          ? `${API_BASE}/uploads/${car.image}`
                          : 'https://via.placeholder.com/300x200?text=No+Image'
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

      <Footer />
    </>
  );
};

export default Homepage;
