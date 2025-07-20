import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

const ProgressDashboard = () => {
  const [studyHistory, setStudyHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (user) {
        const historyRef = collection(db, 'users', user.uid, 'studyHistory');
        const q = query(historyRef, orderBy('completedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setStudyHistory(history);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const totalSessions = studyHistory.length;
  const totalStudyTime = totalSessions * 25; // Each session is 25 minutes

  if (loading) return <div className="loading-screen"><h1>Loading Your Progress...</h1></div>;

  return (
    <div className="progress-container">
      <h2>My Progress</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Pomodoros</h3>
          <p className="stat-number">{totalSessions}</p>
        </div>
        <div className="stat-card">
          <h3>Total Study Time</h3>
          <p className="stat-number">{totalStudyTime} <span className="stat-unit">minutes</span></p>
        </div>
        <div className="stat-card">
          <h3>Study Streak</h3>
          <p className="stat-number">Coming Soon</p>
        </div>
      </div>

      <h3>Recent Activity</h3>
      <ul className="history-list">
          {studyHistory.slice(0, 5).map(session => (
              <li key={session.id}>
                  A 25-minute study session completed on {new Date(session.completedAt?.toDate()).toLocaleDateString()}
              </li>
          ))}
      </ul>
    </div>
  );
};

export default ProgressDashboard;