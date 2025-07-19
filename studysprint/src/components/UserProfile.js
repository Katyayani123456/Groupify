import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const UserProfile = () => {
  const { userId } = useParams(); // Gets the userId from the URL (e.g., /user/xyz123)
  const navigate = useNavigate(); // Hook to allow programmatic navigation
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.log("No such user!");
          // Optional: Redirect to a 'not found' page or dashboard
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [userId, navigate]); // Rerun if userId or navigate changes

  if (loading) {
    return <div className="loading-screen"><h1>Loading profile...</h1></div>;
  }

  if (!profile) {
    return <div>User not found.</div>;
  }

  return (
    <div className="profile-view-container">
      <button className="back-button" onClick={() => navigate('/')}>&lt; Back to Dashboard</button>
      <div className="profile-details">
        <h1>{profile.name}</h1>
        <p><strong>Major:</strong> {profile.major}</p>
        <p><strong>Availability:</strong> {profile.availability}</p>
        <div className="profile-section">
          <h3>Courses / Subjects</h3>
          <ul className="subjects-list">
            {profile.subjects.map((subject, index) => (
              <li key={index}>{subject}</li>
            ))}
          </ul>
        </div>
        <div className="profile-section">
          <h3>Study Goals</h3>
          <p>{profile.goals}</p>
        </div>
        <div className="profile-section">
            <h3>Contact to connect</h3>
            <p>{profile.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;