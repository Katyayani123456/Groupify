import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import ProfileIcon from './ProfileIcon';
import ThemeSwitcher from './ThemeSwitcher';

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
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/find" className="nav-link">Find Sessions</Link>
              <Link to="/forum" className="nav-link">Forum</Link> {/* This link has been added */}
              <ThemeSwitcher />
              <div className="profile-menu-container">
                <ProfileIcon userName={userProfile.name} />
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">My Profile</Link>
                  <Link to="/sessions" className="dropdown-item">Manage My Sessions</Link>
                  <Link to="/progress" className="dropdown-item">My Progress</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">Logout</button>
                </div>
              </div>
            </>
          ) : (
            // --- Logged-out user links ---
            <>
              <a href="/#about" className="nav-link">About</a>
              <a href="/#contact" className="nav-link">Contact</a>
              <ThemeSwitcher />
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