import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const GroupChat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const dummy = useRef();

  // Fetch messages in real-time
  useEffect(() => {
    const messagesRef = collection(db, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return unsubscribe;
  }, [groupId]);

  // Automatically scroll to the bottom
  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const { uid, displayName } = auth.currentUser;
    const messagesRef = collection(db, 'groups', groupId, 'messages');

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid,
      authorName: displayName || auth.currentUser.email,
    });

    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Study Session Chat</h3>
        <button onClick={() => navigate('/')} className="back-button">&lt; Back to Dashboard</button>
      </div>
      <div className="messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
            <div className="message-bubble">
              <span className="author-name">{msg.authorName}</span>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <span ref={dummy}></span>
      </div>
      <form onSubmit={handleSendMessage} className="send-message-form">
        <input 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="form-button">Send</button>
      </form>
    </div>
  );
};

export default GroupChat;