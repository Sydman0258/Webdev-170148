import React from "react";
import  "../Styles/Footer.css"

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
          Email: <a href="mailto:iamsid0258@gmail.com">iamsid0258@gmail.com</a><br />
          Phone: <a >+977 9841258444</a><br />
          123 Car ave, Suite 100<br />
         Madhyapur Thimi, Bhaktapur, Nepal
        </p>
      </div>
      <div className="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
      
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <span>
        &copy; {new Date().getFullYear()} VROOM TRACK<sup>®</sup>. All rights reserved. 
        <span className="footer-legal"> | Registered Trademark. | Designed by Siddhartha.</span>
      </span>
    </div>
  </footer>
);

export default Footer;