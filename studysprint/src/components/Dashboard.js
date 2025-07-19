import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs
        .map(doc => doc.data())
        .filter(user => user.uid !== auth.currentUser.uid); // Exclude current user
      setUsers(userList);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.major.toLowerCase().includes(term) ||
      user.subjects.some(subject => subject.toLowerCase().includes(term))
    );
  });

  if (loading) {
    return <div className="loading-screen"><h1>Loading study partners...</h1></div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Partner Finder</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, major, or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="user-cards-container">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            // Each card is now a clickable link
            <Link to={`/user/${user.uid}`} key={user.uid} className="user-card-link">
              <div className="user-card">
                <h4>{user.name}</h4>
                <p><strong>Major:</strong> {user.major}</p>
                <p><strong>Subjects:</strong> {user.subjects.join(', ')}</p>
                <p><strong>Availability:</strong> {user.availability}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No users found. Try a different search or invite your friends!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;