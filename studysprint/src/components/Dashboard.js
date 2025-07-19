import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect runs once when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        // Get data from each document and filter out the current user
        const userList = userSnapshot.docs
          .map(doc => doc.data())
          .filter(user => user.uid !== auth.currentUser.uid); 
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []); // The empty array means this effect runs only once

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <div>Loading study partners...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>StudySprint Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      
      <h3>Find Your Study Partners</h3>
      <div className="user-cards-container">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.uid} className="user-card">
              <h4>{user.name}</h4>
              <p><strong>Subjects:</strong> {user.subjects.join(', ')}</p>
              <p><strong>Goals:</strong> {user.goals}</p>
              <p><strong>Contact:</strong> {user.email}</p>
            </div>
          ))
        ) : (
          <p>No other users found yet. Invite your friends!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;