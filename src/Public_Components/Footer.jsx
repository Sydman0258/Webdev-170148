import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-brand">
        <span className="footer-logo">VROOM TRACK<sup>®</sup></span>
        <p className="footer-desc">
          Luxury Car Rentals &amp; Experiences<br />
          Because Ordinary Is Never an Option.
        </p>
      </div>
      <div className="footer-contact">
        <h4>Contact Us</h4>
        <p>
          Email: <a href="mailto:info@vroomtrack.com">info@vroomtrack.com</a><br />
          Phone: <a href="tel:+1234567890">+1 (234) 567-890</a><br />
          123 Elite Avenue, Suite 100<br />
          Beverly Hills, CA 90210, USA
        </p>
      </div>
      <div className="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <span>
        &copy; {new Date().getFullYear()} VROOM TRACK<sup>®</sup>. All rights reserved. 
        <span className="footer-legal"> | Registered Trademark. | Designed in California.</span>
      </span>
    </div>
  </footer>
);

export default Footer;