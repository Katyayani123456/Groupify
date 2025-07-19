import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import ConnectModal from './ConnectModal';
import PomodoroTimer from './PomodoroTimer'; // 1. Re-import the timer

const Dashboard = () => {
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchAllSessions = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      let sessions = [];
      const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

      userSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.uid !== currentUserId && userData.studySessions) {
          userData.studySessions.forEach(session => {
            sessions.push({ ...session, userName: userData.name, userEmail: userData.email, userId: userData.uid });
          });
        }
      });
      setAllSessions(sessions);
      setLoading(false);
    };
    fetchAllSessions();
  }, []);

  const handleConnectClick = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const filteredSessions = allSessions.filter(session => {
    const term = searchTerm.toLowerCase();
    return (
      session.title.toLowerCase().includes(term) ||
      session.goal.toLowerCase().includes(term) ||
      session.userName.toLowerCase().includes(term)
    );
  });

  if (loading) return <div className="loading-screen"><h1>Loading study sessions...</h1></div>;

  return (
    <>
      <div className="dashboard-container">
        <h2>Find a Partner</h2>

        <PomodoroTimer /> {/* 2. Add the timer back here */}
        
        <div className="search-container">
          <input type="text" placeholder="Search for a session..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="user-cards-container">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div key={session.id} className="user-card">
                <h4>{session.title}</h4>
                <p><strong>Goal:</strong> {session.goal}</p>
                <p><strong>Availability:</strong> {session.availability}</p>
                <p>Hosted by: <Link to={`/user/${session.userId}`}>{session.userName}</Link></p>
                <button 
                  className="form-button" 
                  style={{marginTop: '15px', width: 'auto', padding: '10px 15px'}}
                  onClick={() => handleConnectClick(session)}
                >
                  Connect
                </button>
              </div>
            ))
          ) : (
            <p>No study sessions found. Try creating one!</p>
          )}
        </div>
      </div>
      
      {isModalOpen && <ConnectModal session={selectedSession} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Dashboard;