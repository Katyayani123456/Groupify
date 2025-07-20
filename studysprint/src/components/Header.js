import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import ProfileIcon from './ProfileIcon';

const Header = ({ userProfile }) => {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="header-logo">GROUPIFY</Link>
        <nav className="header-nav">
          {userProfile ? (
            // --- Logged-in user links ---
            <>
              <Link to="/" className="nav-link">Find Sessions</Link>
              {/* This new link has been added */}
              <Link to="/progress" className="nav-link">My Progress</Link> 
              <Link to="/settings">
                <ProfileIcon userName={userProfile.name} />
              </Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            // --- Logged-out user links ---
            <>
              <a href="/#about" className="nav-link">About</a>
              <a href="/#contact" className="nav-link">Contact</a>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link signup-button">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;