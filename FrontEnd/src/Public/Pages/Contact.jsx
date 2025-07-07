import React, { useEffect, useRef, useState } from 'react';
import '../Styles/Contact.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './Header';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Contact = () => {
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      shakeButton();
      return;
    }

    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error(err);
    }
  };

  return (
    <>
      <Header />

      <main className="contact-container">
        <h1>Contact Us</h1>
        <p>Have questions or want to book a luxury car? We’re here to help! Fill out the form below and we’ll get back to you as soon as possible.</p>

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
          {error && <p className="error-message">{error}</p>}
        </form><br />
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4998.207757824396!2d85.41040770045248!3d27.647222233118647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb11a772250ddd%3A0x7098894cd34efef4!2sMatsyashwor%20Mahadev%20Mandir!5e0!3m2!1sen!2snp!4v1751898452057!5m2!1sen!2snp" width="500" height="350" ></iframe>     
      </main>

      <Footer />
    </>
  );
};

export default Contact;
