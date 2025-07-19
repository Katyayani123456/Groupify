import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConnectModal = ({ session, onClose }) => {
  const navigate = useNavigate();

  if (!session) return null;

  const handleVideoCall = () => {
    // We'll use the session's unique ID as the group/channel ID
    navigate(`/group/${session.id}/call`);
  };

  const handleChat = () => {
    // This now navigates to the chat room for the specific session
    navigate(`/group/${session.id}/chat`);
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