import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Profile = ({ onProfileCreate }) => {
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState('');
  const [goals, setGoals] = useState('');
  const [error, setError] = useState('');

  // This function runs when the user submits the form
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !subjects || !goals) {
      setError('All fields are required.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        // Creates a new document in the 'users' collection with the user's ID
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name,
          email: user.email,
          subjects: subjects.split(',').map(s => s.trim()), // Saves subjects as a list
          goals: goals,
        });
        // This tells our main app that the profile is now created
        onProfileCreate(); 
      }
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="profile-container">
      <h2>Create Your Study Profile</h2>
      <p>This helps others find you!</p>
      <form onSubmit={handleProfileSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
        />
        <input
          type="text"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          placeholder="Subjects (e.g., Math, Physics, History)"
          required
        />
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="What are your study goals?"
          required
        />
        <button type="submit">Save Profile</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Profile;