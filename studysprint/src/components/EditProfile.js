import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const EditProfile = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({ title: '', goal: '', availability: 'Weekdays' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSessions(data.studySessions || []);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleAddSession = async () => {
    if (!newSession.title || !newSession.goal) {
      alert("Please fill out all fields for the new session.");
      return;
    }
    const updatedSessions = [...sessions, { ...newSession, id: uuidv4() }];
    setSessions(updatedSessions);
    setNewSession({ title: '', goal: '', availability: 'Weekdays' });
  };

  const handleDeleteSession = (sessionId) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
  };

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { studySessions: sessions });
      navigate('/');
    }
  };

  if (loading) return <div className="loading-screen"><h1>Loading Your Profile...</h1></div>;

  return (
    <div className="profile-container">
      <h2>Manage My Sessions</h2>
      
      <div className="sessions-list">
        {sessions.map(session => (
          <div key={session.id} className="session-item">
            <div>
              <strong>{session.title}</strong> ({session.availability})
              <p>{session.goal}</p>
            </div>
            <button onClick={() => handleDeleteSession(session.id)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>

      <div className="add-session-form">
        <h3>Add a New Session</h3>
        <input type="text" placeholder="Session Title (e.g., Calculus II Homework)" value={newSession.title} onChange={(e) => setNewSession({...newSession, title: e.target.value})} />
        <input type="text" placeholder="Goal (e.g., Complete weekly problem set)" value={newSession.goal} onChange={(e) => setNewSession({...newSession, goal: e.target.value})} />
        <select value={newSession.availability} onChange={(e) => setNewSession({...newSession, availability: e.target.value})}>
          <option value="Weekdays">Weekdays</option>
          <option value="Weekends">Weekends</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Flexible">Flexible</option>
        </select>
        <button onClick={handleAddSession} className="add-button">Add Session to List</button>
      </div>
      
      <button onClick={handleSaveChanges} className="form-button">Save All Changes</button>
      <button type="button" className="back-button" style={{ marginTop: '10px' }} onClick={() => navigate('/')}>Cancel</button>
    </div>
  );
};

export default EditProfile;