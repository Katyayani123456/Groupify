import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Profile = ({ onProfileCreate }) => {
  const [name, setName] = useState('');
  const [major, setMajor] = useState(''); // New state for Major
  const [subjects, setSubjects] = useState('');
  const [availability, setAvailability] = useState('Weekdays'); // New state for Availability
  const [goals, setGoals] = useState('');
  const [error, setError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !major || !subjects || !goals) {
      setError('All fields are required.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        // Update the document to include the new fields
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name,
          email: user.email,
          major: major, // Save major
          subjects: subjects.split(',').map(s => s.trim()),
          availability: availability, // Save availability
          goals: goals,
          createdAt: new Date(), // Good practice to store creation date
        });
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
        {/* New Input for Major */}
        <input
          type="text"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          placeholder="Your Major (e.g., Computer Science)"
          required
        />
        <input
          type="text"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          placeholder="Courses / Subjects (comma-separated)"
          required
        />
        {/* New Dropdown for Availability */}
        <label htmlFor="availability">Your general availability:</label>
        <select 
          id="availability" 
          value={availability} 
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="Weekdays">Weekdays</option>
          <option value="Weekends">Weekends</option>
          <option value="Evenings">Evenings</option>
          <option value="Flexible">Flexible</option>
        </select>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="What are your study goals?"
          required
        />
        <button type="submit" className="form-button">Save Profile</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Profile;