import React, { useEffect, useRef, useState } from 'react';
// React hooks: useEffect for lifecycle, useRef for DOM refs, useState for form state

import '../Styles/Contact.css';
// Importing the CSS file for Contact component styles

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Importing GSAP animation library and ScrollTrigger plugin for scroll-based animations

import Header from './Header';
import Footer from './Footer';
// Importing Header and Footer components

gsap.registerPlugin(ScrollTrigger);
// Registering ScrollTrigger with GSAP

//This is made by Siddhartha Bhattarai.

const Contact = () => {
  const formRef = useRef(null);        // Reference to the form element
  const buttonRef = useRef(null);      // Reference to the submit button

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  // State to store form input values

  const [submitted, setSubmitted] = useState(false);
  // State to show submission confirmation

  useEffect(() => {
    // Animate the form entrance using GSAP when it scrolls into view
    gsap.fromTo(
      formRef.current,
      { y: 50, opacity: 0 },     // Starting position (offscreen and transparent)
      {
        y: 0, opacity: 1, duration: 1.5, ease: 'power3.out',
        scrollTrigger: {
          trigger: formRef.current,    // Trigger the animation when form appears
          start: 'top 90%',
        },
      }
    );

    const btn = buttonRef.current;   // Get button DOM element

    // Hover animation: scale up and change color
    const onEnter = () => {
      gsap.to(btn, { scale: 1.1, backgroundColor: '#b85a4d', duration: 0.3, ease: 'power1.out' });
    };

    // Mouse leave animation: scale back to normal and restore color
    const onLeave = () => {
      gsap.to(btn, { scale: 1, backgroundColor: '#d96c5f', duration: 0.3, ease: 'power1.out' });
    };

    // Add event listeners to button
    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);

    // Cleanup event listeners on unmount
    return () => {
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  //This is made by Siddhartha Bhattarai.

  // Animation function to shake the button if form is incomplete
  const shakeButton = () => {
    const btn = buttonRef.current;
    gsap.fromTo(
      btn,
      { x: -100 },   // Move left
      {
        x: 100,      // Move right
        duration: 0.1,
        yoyo: true,  // Go back and forth
        repeat: 5,   // Repeat 5 times
        ease: 'power1.inOut',
        onComplete: () => gsap.to(btn, { x: 0, duration: 0.1 }),  // Reset position
      }
    );
  };

  // Update formData state as user types
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent default form behavior

    // If any field is empty, shake the button
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      shakeButton();
      return;
    }

    console.log('Form submitted:', formData);  // Log form data
    setSubmitted(true);                        // Show success message
    setFormData({ name: '', email: '', message: '' }); // Clear form
  };

  return (
    <>
      <Header />  {/* Reusable header component */}

      <main className="contact-container">
        <h1>Contact Us</h1>
        <p>
          Have questions or want to book a luxury car? We’re here to help! Fill out the form below and we’ll get back to you as soon as possible.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>
          {/* Controlled form input for name */}
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
          />

          {/* Controlled form input for email */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
          />

          {/* Controlled textarea for message */}
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows={5}
          ></textarea>

          {/* Submit button with animation reference */}
          <button ref={buttonRef} type="submit">Send Message</button>

          {/* Success message on form submission */}
          {submitted && <p className="success-message">Thank you! Your message has been sent.</p>}
        </form>

        {/* Embedded Google Map below the form */}
        <div
          className="map-container"
          style={{
            marginTop: '3rem',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <iframe
            title="Business Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2971.265512962217!2d85.36905180212175!3d27.672480652145808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1064a3e5d0e5%3A0xc118922cd7da2d45!2sAnantalingeshwar!5e0!3m2!1sen!2snp!4v1751352123533!5m2!1sen!2snp"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </main>

      <Footer />  {/* Reusable footer component */}
    </>
  );
};

export default Contact;
