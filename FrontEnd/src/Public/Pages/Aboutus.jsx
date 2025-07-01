import React, { useEffect, useRef } from 'react';
import '../Styles/About.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from './Header';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const contentRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Animate main content fade and slide up
    gsap.fromTo(
      contentRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        },
      }
    );

    // Animate stats cards fade and slide up, staggered
    gsap.fromTo(
      statsRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 90%',
        },
      }
    );
  }, []);

  return (
    <>
      <Header />

      <main className="about-container" ref={contentRef}>
        <h1>About Us</h1>

        <p>
          Welcome to VROOM TRACK, your premier destination for luxury car rentals. 
          We believe that ordinary is never an option, and every journey should be an experience to remember.
        </p>

        <p>
          Founded with a passion for automotive excellence, our mission is to provide an exceptional fleet of high-end vehicles 
          combined with unparalleled customer service. Our fully insured fleet ensures peace of mind, while our dedicated team 
          is available 24/7 to support your needs.
        </p>

        <p>
          From elegant sedans to powerful sports cars, each vehicle in our collection is meticulously maintained to deliver 
          the perfect blend of performance, luxury, and reliability.
        </p>

        {/* Stats Section */}
        <section className="about-stats" ref={statsRef}>
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

        <section className="about-mission">
          <h2>Our Commitment</h2>
          <p>
            We strive to deliver more than just cars — we deliver confidence, style, and freedom. 
            Whether for business, pleasure, or special occasions, VROOM TRACK ensures your experience on the road is extraordinary.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;
