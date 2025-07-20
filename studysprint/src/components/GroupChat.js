import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const GroupChat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const dummy = useRef();

  useEffect(() => {
    if (!groupId) return;

    // Fetch messages in real-time
    const messagesRef = collection(db, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('createdAt'));
    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      setMessages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch goals in real-time
    const groupDocRef = doc(db, 'groups', groupId);
    const unsubscribeGoals = onSnapshot(groupDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setGoals(docSnap.data().goals || []);
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeGoals();
    };
  }, [groupId]);

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

  const handleAddGoal = async () => {
    if (newGoal.trim() === '') return;
    const newGoalObject = {
      id: Date.now().toString(),
      text: newGoal,
      completed: false
    };
    const updatedGoals = [...goals, newGoalObject];
    const groupDocRef = doc(db, 'groups', groupId);
    await updateDoc(groupDocRef, { goals: updatedGoals });
    setNewGoal('');
  };

  const handleToggleGoal = async (goalId) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    const groupDocRef = doc(db, 'groups', groupId);
    await updateDoc(groupDocRef, { goals: updatedGoals });
  };

  return (
    <div className="group-page-container">
      <div className="goal-planner-container">
        <h3>Group Goals</h3>
        <div className="goal-list">
          {goals.map(goal => (
            <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => handleToggleGoal(goal.id)}
              />
              <span>{goal.text}</span>
            </div>
          ))}
        </div>
        <div className="add-goal-form">
          <input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a new goal..."
          />
          <button onClick={handleAddGoal} className="add-button">+</button>
        </div>
      </div>

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
    </div>
  );
};

export default GroupChat;