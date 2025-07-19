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
          <Link to="/settings">
            <ProfileIcon userName={userProfile.name} />
          </Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;