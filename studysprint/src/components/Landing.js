import React from 'react';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';

const Landing = ({ onGoToLogin, onGoToSignup }) => {
  return (
    <div className="landing-page-container">
      <header className="landing-header">
        <div className="header-logo">GROUPIFY</div>
        <nav>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="logo-section">
          <div className="logo-diamond"></div>
          <h1>GROUPIFY</h1>
        </div>
        <p>FIND YOUR PERFECT STUDY GROUP.</p>
        <div className="button-group">
          <button className="landing-button" onClick={onGoToLogin}>
            LOGIN <span>&gt;</span>
          </button>
          <button className="landing-button" onClick={onGoToSignup}>
            SIGN UP <span>&gt;</span>
          </button>
        </div>
      </section>

      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default Landing;