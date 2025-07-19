import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import Header from './components/Header';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import VideoCall from './components/VideoCall';
import GroupChat from './components/GroupChat'; // 1. Import the new component
import './App.css'; 

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('landing');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          setUserProfile(null); 
        }
      } else {
        setUser(null);
        setUserProfile(null);
        navigate('/'); 
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);
  
  const handleProfileCreated = async () => {
    const user = auth.currentUser;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      setUserProfile(userDoc.data());
    }
  };
  
  if (loading) return <div className="loading-screen"><h1>Loading...</h1></div>;

  if (!user) {
    switch (authView) {
      case 'login': return <Auth isLoginView={true} onGoBack={() => setAuthView('landing')} />;
      case 'signup': return <Auth isLoginView={false} onGoBack={() => setAuthView('landing')} />;
      default: return <Landing onGoToLogin={() => setAuthView('login')} onGoToSignup={() => setAuthView('signup')} />;
    }
  }
  
  if (!userProfile) {
    return <Profile onProfileCreate={handleProfileCreated} />;
  }

  return (
    <>
      <Header userProfile={userProfile} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/settings" element={<EditProfile />} />
          <Route path="/group/:groupId/call" element={<VideoCall />} />
          {/* 2. Add the route for the chat page */}
          <Route path="/group/:groupId/chat" element={<GroupChat />} />
        </Routes>
      </main>
    </>
  );
}

export default App;