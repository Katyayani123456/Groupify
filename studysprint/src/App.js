import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, set, onDisconnect } from "firebase/database";

import Header from './components/Header';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import VideoCall from './components/VideoCall';
import GroupChat from './components/GroupChat';
import Footer from './components/Footer';
import ProgressDashboard from './components/ProgressDashboard';
import HomeDashboard from './components/HomeDashboard';
import MyProfile from './components/MyProfile';
// 1. Import the new forum components
import ForumPage from './components/ForumPage';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
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

        const rtdb = getDatabase();
        const myStatusRef = ref(rtdb, 'status/' + currentUser.uid);
        set(myStatusRef, { isOnline: true });
        onDisconnect(myStatusRef).set({ isOnline: false });

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
    return (
      <>
        {(() => {
          switch (authView) {
            case 'login': return <Auth isLoginView={true} onGoBack={() => setAuthView('landing')} />;
            case 'signup': return <Auth isLoginView={false} onGoBack={() => setAuthView('landing')} />;
            default: return <Landing onGoToLogin={() => setAuthView('login')} onGoToSignup={() => setAuthView('signup')} />;
          }
        })()}
        <Footer />
      </>
    );
  }
  
  if (!userProfile) {
    return (
      <>
        <Profile onProfileCreate={handleProfileCreated} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header userProfile={userProfile} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/find" element={<Dashboard />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/sessions" element={<EditProfile />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/group/:groupId/call" element={<VideoCall />} />
          <Route path="/group/:groupId/chat" element={<GroupChat />} />
          <Route path="/progress" element={<ProgressDashboard />} />
          {/* 2. Add the new routes for the forum */}
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;