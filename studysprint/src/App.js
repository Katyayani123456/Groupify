import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; // We need db now
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Import all our components
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
// We will create this file in the next step
import './App.css'; 

function App() {
  // State to hold the current user object
  const [user, setUser] = useState(null);
  // State to show a loading message while we check for a user
  const [loading, setLoading] = useState(true);
  // State to check if the user has created a profile in the database
  const [profileExists, setProfileExists] = useState(false);

  // This useEffect runs once to set up a listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
        // Now, check if they have a profile document in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        setProfileExists(userDoc.exists());
      } else {
        // User is signed out
        setUser(null);
        setProfileExists(false);
      }
      // Finished checking, so we can hide the loading message
      setLoading(false);
    });

    // Cleanup the listener when the component is removed
    return () => unsubscribe();
  }, []);

  const handleProfileCreated = () => {
    setProfileExists(true);
  };

  // While we are checking, show a loading screen
  if (loading) {
    return <h1>Loading...</h1>;
  }

  // This is the main rendering logic
  return (
    <div className="App">
      {!user ? (
        // If no user, show the Auth page
        <Auth />
      ) : profileExists ? (
        // If there IS a user AND a profile, show the Dashboard
        <Dashboard />
      ) : (
        // If there IS a user but NO profile, show the Profile creation page
        <Profile onProfileCreate={handleProfileCreated} />
      )}
    </div>
  );
}

export default App;