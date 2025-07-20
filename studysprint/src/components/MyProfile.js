import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const MyProfile = () => {
  const [profileData, setProfileData] = useState({ name: '', major: '' });
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
          setProfileData({ name: data.name || '', major: data.major || '' });
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
      await updateDoc(userDocRef, {
        name: profileData.name,
        major: profileData.major,
      });
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
      </div>

      <button onClick={handleSaveChanges} className="form-button">Save Changes</button>
    </div>
  );
};

export default MyProfile;