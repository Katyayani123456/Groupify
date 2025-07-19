import React, { useState, useEffect } from 'react';
// Import the new components from react-router-dom
import { Routes, Route } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import Landing from './components/Landing';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import './App.css'; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [authView, setAuthView] = useState('landing');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        setProfileExists(userDoc.exists());
      } else {
        setUser(null);
        setProfileExists(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleProfileCreated = () => setProfileExists(true);

  const renderAuthView = () => {
    switch (authView) {
      case 'login':
        return <Auth isLoginView={true} onGoBack={() => setAuthView('landing')} />;
      case 'signup':
        return <Auth isLoginView={false} onGoBack={() => setAuthView('landing')} />;
      case 'landing':
      default:
        return <Landing onGoToLogin={() => setAuthView('login')} onGoToSignup={() => setAuthView('signup')} />;
    }
  };

  if (loading) return <div className="loading-screen"><h1>Loading...</h1></div>;

  return (
    <div className="App">
      {/* All page content is now managed by Routes */}
      <Routes>
        {/* This Route handles your existing logic for the main page */}
        <Route path="/" element={
          user ? (
            profileExists ? <Dashboard /> : <Profile onProfileCreate={handleProfileCreated} />
          ) : (
            renderAuthView()
          )
        } />

        {/* We will add routes for new pages here later */}
        {/* e.g., <Route path="/user/:userId" element={<SomeComponent />} /> */}
      </Routes>
    </div>
  );
}

export default App;