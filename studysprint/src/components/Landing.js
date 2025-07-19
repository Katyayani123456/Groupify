import React from 'react';

// This component receives two functions from App.js to handle navigation
const Landing = ({ onGoToLogin, onGoToSignup }) => {
  return (
    <div className="landing-container">
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
    </div>
  );
};

export default Landing;