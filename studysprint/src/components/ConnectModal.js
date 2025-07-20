import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const ConnectModal = ({ session, onClose }) => {
  const navigate = useNavigate();

  if (!session) return null;

  const createGroupAndNavigate = async (path) => {
    const groupId = session.id;
    const groupDocRef = doc(db, 'groups', groupId);
    const currentUser = auth.currentUser;

    if (!currentUser) {
        alert("You must be logged in to connect.");
        return;
    }

    // Create the group document in Firestore if it doesn't exist
    await setDoc(groupDocRef, {
      createdAt: serverTimestamp(),
      groupName: session.title,
      members: [session.userId, currentUser.uid]
    }, { merge: true }); // Use merge to avoid overwriting existing goals or notes

    navigate(path);
  };

  const handleVideoCall = () => {
    createGroupAndNavigate(`/group/${session.id}/call`);
  };

  const handleChat = () => {
    createGroupAndNavigate(`/group/${session.id}/chat`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Connect with {session.userName}</h3>
        <p>for the session: "{session.title}"</p>
        <div className="modal-actions">
          <button onClick={handleChat} className="my-profile-button">Start a Chat</button>
          <button onClick={handleVideoCall} className="form-button">Start a Video Call</button>
        </div>
        <button onClick={onClose} className="back-button" style={{marginTop: '20px'}}>Close</button>
      </div>
    </div>
  );
};

export default ConnectModal;