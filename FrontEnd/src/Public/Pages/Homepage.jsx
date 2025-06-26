import React from 'react';
import '../Styles/Homepage.css';

// Slick carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Slider from 'react-slick';

import Header from './Header';
import Footer from './Footer';

// Import your car images

import rollsroyce from '../../assets/Rolls.png';
import lotus from '../../assets/lotus.png';
import lotus2 from '../../assets/lotus2.png';
import lotus3 from '../../assets/lotus3.png';


// Import professional icons from react-icons
import { FaShieldAlt, FaClock, FaCarSide } from 'react-icons/fa';

const Homepage = () => {
  const cars = [
 
    {
      name: "Rolls Royce Phantom",
      image: rollsroyce,
      price: "$500/day",
      type: "Petrol",
    },
    {
      name: "Lotus Elise",
      image: lotus,
      price: "$310/day",
      type: "Petrol",
    },
    {
      name: "Lotus Evora",
      image: lotus2,
      price: "$320/day",
      type: "Hybrid",
    },
    {
      name: "Lotus Exige",
      image: lotus3,
      price: "$330/day",
      type: "Petrol",
    },
  ];

  const services = [
    {
      title: "Fully Insured",
      icon: <FaShieldAlt />,
      description: "All vehicles are fully insured for your peace of mind.",
    },
    {
      title: "24/7 Service",
      icon: <FaClock />,
      description: "Our support team is available around the clock.",
    },
    {
      title: "Premium Fleet",
      icon: <FaCarSide />,
      description: "Choose from the latest luxury and performance cars.",
    },
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
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="Motto">
          <h1>
            Because Ordinary Is
            <br />
            Never an Option
          </h1>
          <p>Discover a curated fleet reserved for those who demand more</p>
        </div>
      </div>

      <div className="vehicles-section">
        <h2>Choose What Others Only Dream Of</h2>
        <p>Because when you choose from the extraordinary, you don’t browse — you claim</p>

        <div className="carousel-container">
          <Slider {...settings}>
            {cars.map((car, idx) => (
              <div key={idx}>
                <div className="car-card">
                  <img src={car.image} alt={car.name} className="car-img" />
                  <h3>{car.name}</h3>
                  <div className="car-info-row">
                    <span className="car-type">{car.type}</span>
                    <span className="car-price">{car.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

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
