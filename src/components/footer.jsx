import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribed with email:', email);
    setEmail('');
    alert('Thank you for subscribing! You will receive 10% off your first purchase.');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section brand-section">
          <h1 className="brand-title">SHOP LazyE</h1>
          <p className="brand-subtitle">The designer men wear</p>
          <div className="contact-info">
            <p className="location">Lahore_Pakistan</p>
            <p className="email">iiabdulsamad05@gmail.com</p>
            <p className="phone">+923187983047</p>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3 className="section-title">QUICK LINKS</h3>
          <ul className="footer-links">
            <li><a href="/collections">All Products</a></li>
            <li><a href="/sale">New Arrivals</a></li>
            <li><a href="/bestsellers">Best Sellers</a></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section newsletter-section">
          <h3 className="section-title">Newsletter Signup</h3>
          <p className="newsletter-text">
            Subscribe to our newsletter
          </p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="email-input"
            />
            <button type="submit" className="subscribe-btn">
              <strong>Subscribe</strong>
            </button>
          </form>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="copyright">
        <p>&copy; 2025 #SHOP LazyE. All rights reserved.</p>
      </div>
    </footer>
  );
}