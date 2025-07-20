import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // 'updateDoc' has been removed

const Profile = ({ onProfileCreate }) => {
  const [profileData, setProfileData] = useState({ name: '', major: '' });
  const [isNewUser, setIsNewUser] = useState(false);
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
          setIsNewUser(false);
        } else {
          setIsNewUser(true);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...profileData,
        uid: user.uid,
        email: user.email,
      }, { merge: true });
      
      alert("Profile details updated!");
      if (isNewUser && onProfileCreate) {
        onProfileCreate();
      }
    }
  };

  if (loading) return <div className="loading-screen"><h1>Loading...</h1></div>;

  return (
    <div className="profile-container">
      <h2>{isNewUser ? 'Create Your Study Profile' : 'My Profile'}</h2>
      <form onSubmit={handleSaveChanges}>
        <label>Your Name</label>
        <input type="text" name="name" value={profileData.name} onChange={handleChange} required />
        <label>Your Major</label>
        <input type="text" name="major" value={profileData.major} onChange={handleChange} placeholder="e.g., Computer Science" required />
        <button type="submit" className="form-button">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;