import React, { useEffect, useRef } from 'react'; // React core and hooks
import '../Styles/Homepage.css'; // Import CSS styles for homepage

import 'slick-carousel/slick/slick.css'; // Slick carousel default styles
import 'slick-carousel/slick/slick-theme.css'; // Slick carousel theme styles

import Slider from 'react-slick'; // Carousel component
import gsap from 'gsap'; // GSAP animation library
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // GSAP plugin for scroll animations

import Header from './Header'; // Site header component
import Footer from './Footer'; // Site footer component

import rollsroyce from '../../assets/Rolls.png'; // Rolls Royce car image
import lotus from '../../assets/lotus.png'; // Lotus Elise car image
import lotus2 from '../../assets/lotus2.png'; // Lotus Evora car image
import lotus3 from '../../assets/lotus3.png'; // Lotus Exige car image
import heroimg from '../../assets/hero-image.png'; // Hero section main image

import { FaShieldAlt, FaClock, FaCarSide } from 'react-icons/fa'; // Service icons

gsap.registerPlugin(ScrollTrigger); // Register GSAP scroll trigger plugin

const Homepage = () => {
  const textRef = useRef(null); // Ref for hero text container
  const imageRef = useRef(null); // Ref for hero image container

  // Array of car objects to display in carousel
  const cars = [
    { name: "Rolls Royce Phantom", image: rollsroyce, price: "$500/day", type: "Petrol" },
    { name: "Lotus Elise", image: lotus, price: "$310/day", type: "Petrol" },
    { name: "Lotus Evora", image: lotus2, price: "$320/day", type: "Hybrid" },
    { name: "Lotus Exige", image: lotus3, price: "$330/day", type: "Petrol" },
  ];

  // Array of service info with icons and descriptions
  const services = [
    { title: "Fully Insured", icon: <FaShieldAlt />, description: "All vehicles are fully insured for your peace of mind." },
    { title: "24/7 Service", icon: <FaClock />, description: "Our support team is available around the clock." },
    { title: "Premium Fleet", icon: <FaCarSide />, description: "Choose from the latest luxury and performance cars." },
  ];

  // Settings for react-slick carousel
  const settings = {
    infinite: true, // Infinite looping carousel
    slidesToShow: 3, // Show 3 slides at once
    slidesToScroll: 1, // Scroll one slide per action
    autoplay: true, // Auto-scroll slides
    autoplaySpeed: 3000, // 3 seconds between auto-scrolls
    speed: 1000, // Animation speed 1 second
    cssEase: 'ease', // Animation easing
    pauseOnHover: true, // Pause auto-scroll on hover
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } }, // Show 2 slides on tablets
      { breakpoint: 600, settings: { slidesToShow: 1 } }, // Show 1 slide on phones
    ],
  };

  useEffect(() => {
    const tl = gsap.timeline(); // Create a GSAP timeline for sequencing

    // Animate hero image from offscreen left to its place
    tl.fromTo(
      imageRef.current, // Target hero image container
      { x: '-100vw', opacity: 0 }, // Start fully left offscreen & invisible
      { x: 0, opacity: 1, duration: 2.5, ease: 'power3.out' } // Animate to position & visible
    )
    // Animate hero text from below, fading and moving up after image animation
    .fromTo(
      textRef.current, // Target hero text container
      { y: 50, opacity: 0 }, // Start 50px below and invisible
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, // Animate up to normal and visible
      "+=0.2" // Start after 0.2s delay following image animation
    );

    // Animate each car card when scrolled into view
    gsap.utils.toArray('.car-card').forEach(card => {
      gsap.fromTo(
        card, // Target each car card
        { y: 50, opacity: 0 }, // Start slightly below and invisible
        {
          y: 0, // Animate to original position
          opacity: 1, // Fade in fully
          duration: 0.8, // Animation duration 0.8s
          ease: 'power2.out', // Easing for smoothness
          scrollTrigger: { // Trigger animation on scroll
            trigger: card, // Element that triggers animation
            start: 'top 90%', // When top of card is 90% from top viewport
          },
        }
      );
    });
  }, []); // Empty dependency array to run once on mount

  return (
    <>
      <Header /> {/* Render site header */}

      <div className="hero-section"> {/* Hero section container */}
        <div className="Motto" ref={textRef}> {/* Hero text with ref for animation */}
          <h1>
            Because Ordinary Is<br />
            Never an Option
          </h1>
          <p>Discover a curated fleet reserved for those who demand more</p>
        </div>
        <div className="hero-image" ref={imageRef}> {/* Hero image with ref for animation */}
          <img src={heroimg} alt="Luxury Car" />
        </div>
      </div>

      <div className="vehicles-section"> {/* Vehicles showcase section */}
        <h2>Choose What Others Only Dream Of</h2>
        <p>Because when you choose from the extraordinary, you don’t browse — you claim</p>

        <div className="carousel-container"> {/* Container for carousel */}
          <Slider {...settings}> {/* React slick carousel with settings */}
            {cars.map((car, idx) => (
              <div key={idx}>
                <div className="car-card"> {/* Single car card */}
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

      <div className="services-section"> {/* Services section */}
        <h2>Our Services</h2>
        <div className="services-cards"> {/* Container for service cards */}
          {services.map((service, idx) => (
            <div className="card" key={idx}> {/* Single service card */}
              <div className="card-inner">
                <div className="card-front"> {/* Front side of flip card */}
                  <div className="icon">{service.icon}</div>
                  <div className="title">{service.title}</div>
                </div>
                <div className="card-back">{service.description}</div> {/* Back side */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer /> {/* Render site footer */}
    </>
  );
};

export default Homepage; // Export component as default
