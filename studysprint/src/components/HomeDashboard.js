import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const HomeDashboard = () => {
  const [mySessions, setMySessions] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.name || '');
          setMySessions(data.studySessions || []);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) return <div className="loading-screen"><h1>Loading Your Dashboard...</h1></div>;

  return (
    <div className="home-dashboard-container">
      <div className="welcome-header">
        <h2>Welcome back, {userName}!</h2>
        <p>What would you like to do today?</p>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/find" className="action-card">
          <h3>Find a Study Session</h3>
          <p>Browse sessions hosted by other students.</p>
        </Link>
        {/* This link has been corrected to point to /sessions */}
        <Link to="/sessions" className="action-card">
          <h3>Manage My Sessions</h3>
          <p>Create, edit, or delete your study sessions.</p>
        </Link>
      </div>

      <div className="my-sessions-list">
        <h3>Your Active Sessions</h3>
        {mySessions.length > 0 ? (
          mySessions.map(session => (
            <div key={session.id} className="my-session-item">
              <span>{session.title}</span>
              <span className="availability-tag">{session.availability}</span>
            </div>
          ))
        ) : (
          <p>You haven't created any study sessions yet. Go to "Manage My Sessions" to create your first one!</p>
        )}
      </div>
    </div>
  );
};

export default HomeDashboard;