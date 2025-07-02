import React, { useEffect, useRef, useState } from 'react';
import '../Styles/Contact.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from './Header';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

//This is made by Siddhartha Bhattarai.


const Contact = () => {
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 90%',
        },
      }
    );

    const btn = buttonRef.current;
    const onEnter = () => {
      gsap.to(btn, { scale: 1.1, backgroundColor: '#b85a4d', duration: 0.3, ease: 'power1.out' });
    };
    const onLeave = () => {
      gsap.to(btn, { scale: 1, backgroundColor: '#d96c5f', duration: 0.3, ease: 'power1.out' });
    };

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);

    return () => {
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  //This is made by Siddhartha Bhattarai.


  const shakeButton = () => {
    const btn = buttonRef.current;
    gsap.fromTo(
      btn,
      { x: -100 },
      {
        x: 100,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: 'power1.inOut',
        onComplete: () => gsap.to(btn, { x: 0, duration: 0.1 }),
      }
    );
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      shakeButton();
      return;
    }

    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Header />

      <main className="contact-container">
        <h1>Contact Us</h1>
        <p>
          Have questions or want to book a luxury car? We’re here to help! Fill out the form below and we’ll get back to you as soon as possible.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
          />

          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows={5}
          ></textarea>

          <button ref={buttonRef} type="submit">Send Message</button>

          {submitted && <p className="success-message">Thank you! Your message has been sent.</p>}
        </form>

        {/* Google Map iframe below the form */}
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

      <Footer />
    </>
  );
};

export default Contact;
