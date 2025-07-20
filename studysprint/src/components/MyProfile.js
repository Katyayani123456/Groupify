import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const MyProfile = () => {
  // 1. Add new fields to the state
  const [profileData, setProfileData] = useState({
    name: '',
    major: '',
    availability: 'Weekdays',
    courses: '',
    studyGoal: '',
    contact: ''
  });
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // 2. Fetch the new data from Firestore
          setProfileData({
            name: data.name || '',
            major: data.major || '',
            availability: data.availability || 'Weekdays',
            courses: data.courses || '',
            studyGoal: data.studyGoal || '',
            contact: data.contact || user.email
          });
          setBadges(data.badges || []);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      // 3. Save all the new fields
      await updateDoc(userDocRef, profileData);
      alert("Profile details updated!");
    }
  };

  if (loading) return <div className="loading-screen"><h1>Loading Profile...</h1></div>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="badges-section">
        <h3>My Badges</h3>
        <div className="badges-grid">
          {badges.includes('first_pomodoro') && <div className="badge">🍅 First Pomodoro</div>}
          {badges.includes('ten_pomodoros') && <div className="badge">🔟 10 Pomodoros</div>}
          {badges.includes('study_master') && <div className="badge">🎓 Study Master (25)</div>}
          {badges.length === 0 && <p>No badges yet. Complete a study session to earn your first one!</p>}
        </div>
      </div>

      <div className="profile-form-section">
        <h3>Personal Details</h3>
        <label>Your Name</label>
        <input type="text" name="name" value={profileData.name} onChange={handleChange} />
        <label>Your Major</label>
        <input type="text" name="major" value={profileData.major} onChange={handleChange} />
        
        {/* 4. Add the new input fields to the form */}
        <label>Courses/Subjects</label>
        <input type="text" name="courses" value={profileData.courses} onChange={handleChange} placeholder="e.g., Calculus II, CHEM 101" />
        
        <label>Your general availability</label>
        <select name="availability" value={profileData.availability} onChange={handleChange}>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="Evenings">Evenings</option>
            <option value="Flexible">Flexible</option>
        </select>
        
        <label>Study Goal</label>
        <textarea name="studyGoal" value={profileData.studyGoal} onChange={handleChange} placeholder="e.g., Prepare for finals" />
        
        <label>Contact to Connect</label>
        <input type="text" name="contact" value={profileData.contact} onChange={handleChange} placeholder="e.g., Discord: user#1234 or your email"/>
      </div>

      <button onClick={handleSaveChanges} className="form-button">Save Changes</button>
    </div>
  );
};

export default MyProfile;