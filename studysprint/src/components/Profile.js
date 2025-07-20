import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Profile = ({ onProfileCreate }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    major: '',
    availability: 'Weekdays',
    courses: '',
    studyGoal: '',
    contact: ''
  });
  const [error, setError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check for required fields
    if (!profileData.name || !profileData.major || !profileData.courses) {
        setError('Name, Major, and Courses are required.');
        return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          ...profileData,
          contact: profileData.contact || user.email, // Default to email
        }, { merge: true });
        
        onProfileCreate();
      } catch (err) {
        setError('Failed to save profile. Please try again.');
        console.error(err);
      }
    }
  };
  
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-container">
      <h2>Create Your Study Profile</h2>
      <p>This helps others find you!</p>
      <form onSubmit={handleProfileSubmit}>
        <label>Your Name</label>
        <input type="text" name="name" value={profileData.name} onChange={handleChange} required />
        <label>Your Major</label>
        <input type="text" name="major" value={profileData.major} onChange={handleChange} required />
        <label>Courses/Subjects</label>
        <input type="text" name="courses" value={profileData.courses} onChange={handleChange} placeholder="e.g., Calculus II, CHEM 101" required />
        <label>Your general availability</label>
        <select name="availability" value={profileData.availability} onChange={handleChange}>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Flexible">Flexible</option>
        </select>
        <label>Study Goal</label>
        <textarea name="studyGoal" value={profileData.studyGoal} onChange={handleChange} placeholder="e.g., Prepare for finals" />
        <label>Contact to Connect</label>
        <input type="text" name="contact" value={profileData.contact} onChange={handleChange} placeholder="e.g., Discord: user#1234 (optional)"/>
        
        <button type="submit" className="form-button">Save Profile</button>
        {error && <p className="error-message" style={{color: '#d9534f'}}>{error}</p>}
      </form>
    </div>
  );
};

export default Profile;