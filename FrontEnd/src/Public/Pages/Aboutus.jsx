// Importing necessary hooks and libraries
import React, { useEffect, useRef } from 'react'; // useEffect for side effects, useRef for DOM references
import '../Styles/About.css'; // Import custom CSS for the About page
import gsap from 'gsap'; // Import GSAP animation library
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger plugin for scroll-based animations

// Importing reusable components
import Header from './Header'; // Header component
import Footer from './Footer'; // Footer component

// Registering the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// Functional component for the About page
const About = () => {
  // Creating references to DOM elements for animation targeting
  const contentRef = useRef(null); // Ref for the main content section
  const statsRef = useRef(null);   // Ref for the stats section

  // useEffect runs once when the component mounts
  useEffect(() => {
    // Animate the main content to fade in and slide up when it enters the viewport
    gsap.fromTo(
      contentRef.current, // Target element
      { y: 50, opacity: 0 }, // Initial state: 50px lower and fully transparent
      {
        y: 0,
        opacity: 1,
        duration: 1.5, // Animation lasts 1.5 seconds
        ease: 'power3.out', // Easing function
        scrollTrigger: {
          trigger: contentRef.current, // Trigger when this element scrolls into view
          start: 'top 80%', // Start animation when top of element hits 80% of viewport
        },
      }
    );

    // Animate each stat card with staggered fade and slide-up effect
    gsap.fromTo(
      statsRef.current.children, // Target children of stats section
      { y: 30, opacity: 0 }, // Initial state for each stat card
      {
        y: 0,
        opacity: 1,
        duration: 1, // Each animation lasts 1 second
        ease: 'power3.out',
        stagger: 0.2, // Delay between each card's animation
        scrollTrigger: {
          trigger: statsRef.current, // Trigger when the stats section enters view
          start: 'top 90%',
        },
      }
    );
  }, []); // Empty dependency array means this runs once on mount

  // Component return JSX structure
  return (
    <>
      <Header /> {/* Renders the top navigation/header */}

      <main className="about-container" ref={contentRef}> {/* Main container for the About page */}
        <h1>About Us</h1> {/* Page heading */}

        {/* Company intro paragraph */}
        <p>
          Welcome to VROOM TRACK, your premier destination for luxury car rentals. 
          We believe that ordinary is never an option, and every journey should be an experience to remember.
        </p>

        {/* Company mission and value description */}
        <p>
          Founded with a passion for automotive excellence, our mission is to provide an exceptional fleet of high-end vehicles 
          combined with unparalleled customer service. Our fully insured fleet ensures peace of mind, while our dedicated team 
          is available 24/7 to support your needs.
        </p>

        {/* Fleet quality and variety statement */}
        <p>
          From elegant sedans to powerful sports cars, each vehicle in our collection is meticulously maintained to deliver 
          the perfect blend of performance, luxury, and reliability.
        </p>

        {/* Stats Section - animated with GSAP */}
        <section className="about-stats" ref={statsRef}>
          {/* Individual stat cards */}
          <div className="stat-card">
            <h2>15K+</h2>
            <p>Satisfied Customers</p>
          </div>
          <div className="stat-card">
            <h2>10+</h2>
            <p>Luxury Fleet</p>
          </div>
          <div className="stat-card">
            <h2>24/7</h2>
            <p>Customer Support</p>
          </div>
          <div className="stat-card">
            <h2>100%</h2>
            <p>Fully Insured</p>
          </div>
        </section>

        {/* Mission/commitment section */}
        <section className="about-mission">
          <h2>Our Commitment</h2>
          <p>
            We strive to deliver more than just cars — we deliver confidence, style, and freedom. 
            Whether for business, pleasure, or special occasions, VROOM TRACK ensures your experience on the road is extraordinary.
          </p>
        </section>
      </main>

      <Footer /> {/* Renders the page footer */}
    </>
  );
};

// Export the About component for use in the app
export default About;
