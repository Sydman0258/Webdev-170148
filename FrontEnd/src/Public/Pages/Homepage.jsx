import React, { useRef } from 'react'; // React core and hooks
import '../Styles/Homepage.css'; // Import CSS styles for homepage
import { Link } from 'react-router-dom';


import 'slick-carousel/slick/slick.css'; // Slick carousel default styles
import 'slick-carousel/slick/slick-theme.css'; // Slick carousel theme styles

import Slider from 'react-slick'; // Carousel component

import Header from './Header'; // Site header component
import Footer from './Footer'; // Site footer component

import rollsroyce from '../../assets/Rolls.png'; // Rolls Royce car image
import lotus from '../../assets/lotus.png'; // Lotus Elise car image
import lotus2 from '../../assets/lotus2.png'; // Lotus Evora car image
import lotus3 from '../../assets/lotus3.png'; // Lotus Exige car image
import heroimg from '../../assets/heroimg.png'; // Hero section main image

import { FaShieldAlt, FaClock, FaCarSide } from 'react-icons/fa'; // Service icons

const Homepage = () => {
  const textRef = useRef(null); // Ref for hero text (still here if needed)

  // Car list
  const cars = [
    { name: "Rolls Royce Phantom", image: rollsroyce, price: "$500/day", type: "Petrol" },
    { name: "Lotus Elise", image: lotus, price: "$310/day", type: "Petrol" },
    { name: "Lotus Evora", image: lotus2, price: "$320/day", type: "Hybrid" },
    { name: "Lotus Exige", image: lotus3, price: "$330/day", type: "Petrol" },
  ];

  // Services list
  const services = [
    { title: "Fully Insured", icon: <FaShieldAlt />, description: "All vehicles are fully insured for your peace of mind." },
    { title: "24/7 Service", icon: <FaClock />, description: "Our support team is available around the clock." },
    { title: "Premium Fleet", icon: <FaCarSide />, description: "Choose from the latest luxury and performance cars." },
  ];

  // Carousel settings
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

      {/* Hero section with image and static top-left text */}
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

      {/* Vehicles Carousel Section */}
      <div className="vehicles-section">
        <h2>Choose What Others Only Dream Of</h2>
        <p>Because when you choose from the extraordinary, you don’t browse — you claim</p>

      <div className="carousel-container">
  <Slider {...settings}>
    {cars.map((car, idx) => (
      <div key={idx}>
        <Link to="/login" className="car-card">
          <img src={car.image} alt={car.name} className="car-img" />
          <h3>{car.name}</h3>
          <div className="car-info-row">
            <span className="car-type">{car.type}</span>
            <span className="car-price">{car.price}</span>
          </div>
        </Link>
      </div>
    ))}
  </Slider>
</div>

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
//This is made by Siddhartha Bhattarai.
