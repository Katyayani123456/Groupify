import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// 1. Add onGoBack to the destructured props
const Auth = ({ isLoginView, onGoBack }) => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/'); // Redirect to the main page on successful login/signup
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="auth-page-container">
      {/* 2. Add the back button */}
      <button className="back-button" onClick={onGoBack}>
        &larr; Back
      </button>
      
      <div className="auth-container">
        <h2>{isLoginView ? 'LOGIN' : 'SIGN UP'}</h2>
        <form onSubmit={handleAuth}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="form-button">{isLoginView ? 'LOGIN' : 'SIGN UP'}</button>
        </form>
        {error && <p className="error-message" style={{color: '#d9534f', marginTop: '15px'}}>{error}</p>}
      </div>
    </div>
  );
};

export default Auth;