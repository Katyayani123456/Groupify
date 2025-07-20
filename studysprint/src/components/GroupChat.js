import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const GroupChat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const dummy = useRef();
  
  // Note-saving logic
  const saveNotes = useRef(debounce(async (newNotes) => {
    if (groupId) {
      const groupDocRef = doc(db, 'groups', groupId);
      await updateDoc(groupDocRef, { notes: newNotes });
    }
  }, 1000)).current;

  useEffect(() => {
    if (!groupId) return;
    const groupDocRef = doc(db, 'groups', groupId);

    const messagesRef = collection(groupDocRef, 'messages');
    const qMsg = query(messagesRef, orderBy('createdAt'));
    const unsubscribeMessages = onSnapshot(qMsg, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const filesRef = collection(groupDocRef, 'files');
    const qFiles = query(filesRef, orderBy('uploadedAt'));
    const unsubscribeFiles = onSnapshot(qFiles, (snapshot) => {
      setFiles(snapshot.docs.map(doc => doc.data()));
    });

    const unsubscribeGroup = onSnapshot(groupDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGoals(data.goals || []);
        setNotes(data.notes || '');
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeGroup();
      unsubscribeFiles();
    };
  }, [groupId]);

  useEffect(() => {
    if (dummy.current) {
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    saveNotes(e.target.value);
  };
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const storage = getStorage();
    const fileRef = ref(storage, `groups/${groupId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    const filesCollectionRef = collection(db, 'groups', groupId, 'files');
    await addDoc(filesCollectionRef, {
      fileName: file.name,
      url: downloadURL,
      uploadedBy: auth.currentUser.displayName || auth.currentUser.email,
      uploadedAt: serverTimestamp()
    });
    setIsUploading(false);
  };

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
    const groupDocRef = doc(db, 'groups', groupId);
    const newGoalObject = { id: Date.now().toString(), text: newGoal, completed: false };
    const updatedGoals = [...goals, newGoalObject];
    await updateDoc(groupDocRef, { goals: updatedGoals });
    setNewGoal('');
  };

  const handleToggleGoal = async (goalId) => {
    const groupDocRef = doc(db, 'groups', groupId);
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    await updateDoc(groupDocRef, { goals: updatedGoals });
  };
  
  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <div className="group-page-container">
      <div className="left-panel">
        <div className="goal-planner-container">
          <h3>Group Goals</h3>
          <div className="goal-list">
            {goals.map(goal => (
              <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
                <input type="checkbox" checked={goal.completed} onChange={() => handleToggleGoal(goal.id)} />
                <span>{goal.text}</span>
              </div>
            ))}
          </div>
          <div className="add-goal-form">
            <input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Add a new goal..." />
            <button onClick={handleAddGoal} className="add-button">+</button>
          </div>
        </div>
        <div className="notes-container">
          <h3>Collaborative Notes</h3>
          <textarea 
            className="notes-editor"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Type your shared notes here..."
          />
        </div>
        <div className="file-sharing-container">
          <h3>Shared Files</h3>
          <div className="file-list">
            {files.map((file, index) => (
              <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="file-item">
                {file.fileName}
              </a>
            ))}
          </div>
          <input type="file" onChange={handleFileUpload} id="file-upload" style={{display: 'none'}} disabled={isUploading} />
          <label htmlFor="file-upload" className={`upload-button ${isUploading ? 'disabled' : ''}`}>
            {isUploading ? 'Uploading...' : 'Upload File'}
          </label>
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
          <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." />
          <button type="submit" className="form-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;