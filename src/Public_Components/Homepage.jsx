import React, { useEffect } from 'react';
import './Homepage.css';
import Header from './Header';
import luxuryCar from '../assets/Landing_PORSCHE.png';
import tesla from'../assets/tesla.jpg';
import bmwi8 from '../assets/bmwi8.jpg'; // Importing the images for the cars
import Footer from './Footer';

const Homepage = () => {
   

    const cars = [ // This is the array of cars that will be displayed on the homepage
  {
    name: "Porsche 911",
    image: luxuryCar,
    price: "$350/day",
    type: "Petrol"
  },
  {
    name: "Tesla Model S",
    image: tesla,
    price: "$300/day",
    type: "Electric"
  },
  {
    name: "BMW i8",
    image: bmwi8,
    price: "$320/day",
    type: "Hybrid"
  },
   {
    name: "BMW i8",
    image: bmwi8,
    price: "$320/day",
    type: "Hybrid"
  },
   {
    name: "BMW i8",
    image: bmwi8,
    price: "$320/day",
    type: "Hybrid"
  },
   {
    name: "BMW i8",
    image: bmwi8,
    price: "$320/day",
    type: "Hybrid"
  },
   {
    name: "BMW i8",
    image: bmwi8,
    price: "$320/day",
    type: "Hybrid"
  }
  ,
   {
    name: "BMW i8",
    image: bmwi8,
    price: "$320/day",
    type: "Hybrid"
  }
  

];

const services = [  // This is the array of services that will be displayed on the homepage
  {
    title: "Fully Insured",
    description: "All vehicles are fully insured for your peace of mind.",
    icon: "INSURED"
  },
  {
    title: "24/7 Service",
    description: "Our support team is available around the clock.",
    icon: "ALWAYS ON"
  },
  {
    title: "Premium Fleet",
    description: "Choose from the latest luxury and performance cars.",
icon: "PREMIUM FLEET"
  }
];

    return (
        <>
            <Header />
            <div className="hero-section" >
                <div className='Motto'>
                    <h1>Because Ordinary Is<br/> Never an Option</h1>
                    <br/>
                    <p>Discover a curated fleet reserved for those who demand more</p>
                </div>
                <div className='hero-content'>
                    <img 
                        src={luxuryCar}
                        alt="Luxury Car"
                        style={{ width: '100%', maxWidth: '600px', borderRadius: '1rem' }}
                    />
                </div>
            </div>
            {/* From here we start with the vehicles */}
            <div className="vehicles-section">
                <h2>Choose What Others Only Dream Of</h2>
                <br/>
                <p>Because when you choose from the extraordinary, you don’t browse — you claim</p>
            </div>
            <div className="vehicle-type-navbar">{/* This is the navbar for the vehicle types */}
    <button className="type-btn">All</button>
    <button className="type-btn">Electric</button>
    <button className="type-btn">Hybrid</button>
    <button className="type-btn">Petrol</button>
    <button className="type-btn">Diesel</button>
</div>

<div className="car-flashcards">{/* This is the section where the car cards are displayed */}
  {cars.map((car, idx) => (  // This maps through the cars array and displays each car as a card */}
    <div className="car-card" key={idx}>
      <img src={car.image} alt={car.name} className="car-img" /> {/* This is the image of the car */}
      <h3>{car.name}</h3>{/* This is the name of the car */}
      <div className="car-info-row"> {/* This is the row that contains the car type and price */}
        <span className="car-type">{car.type}</span>
        <span className="car-price">{car.price}</span>
      </div>

     
    </div>
  ))}
  </div>
  <div className="vehicle-type-navbar"> {/* This is the section where the buttons for booking the car are displayed */}
   <button className="type-btn">Show more</button> {/* This is the button to book the car */}
   <button className="type-btn">Book now</button> 
</div>

<div className="services-section"> {/* This is the section where the services are displayed */}
  <h2>Our Services</h2>
  <div className="services-cards">
    {services.map((service, idx) => (
      <div className="card" key={idx}>
        {/* You can use an SVG here if you want, or just the emoji/icon */}
        <div className="service-icon" style={{ fontSize: 48 }}>{service.icon}</div>
        <div className="card__content">
          <h3 className="card__title">{service.title}</h3>
          <p className="card__description">{service.description}</p>
        </div>
      </div>
    ))}
  </div>
</div>

<Footer /> {/* This is the footer of the homepage */}
        </>
    );
};

export default Homepage;