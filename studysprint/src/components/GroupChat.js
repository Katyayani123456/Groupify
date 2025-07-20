import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { debounce } from 'lodash';
import FocusMusic from './FocusMusic';

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
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [activeTab, setActiveTab] = useState('goals');
    const [flashcards, setFlashcards] = useState([]);
    const [newCard, setNewCard] = useState({ front: '', back: '' });
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const dummy = useRef();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const saveNotes = useCallback(
        debounce(async (newNotes) => {
            if (groupId) {
                const groupDocRef = doc(db, 'groups', groupId);
                await updateDoc(groupDocRef, { notes: newNotes });
            }
        }, 1000),
        [groupId]
    );

    useEffect(() => {
        if (!groupId) return;
        const groupDocRef = doc(db, 'groups', groupId);

        const unsubMessages = onSnapshot(query(collection(groupDocRef, 'messages'), orderBy('createdAt')), snapshot => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubFiles = onSnapshot(query(collection(groupDocRef, 'files'), orderBy('uploadedAt')), snapshot => {
            setFiles(snapshot.docs.map(doc => doc.data()));
        });
        const unsubFlashcards = onSnapshot(query(collection(groupDocRef, 'flashcards'), orderBy('createdAt')), snapshot => {
            setFlashcards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubGroup = onSnapshot(groupDocRef, docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setGoals(data.goals || []);
                setNotes(data.notes || '');
            }
        });

        return () => {
            unsubMessages();
            unsubFiles();
            unsubFlashcards();
            unsubGroup();
        };
    }, [groupId]);

    useEffect(() => {
        if (dummy.current) {
            dummy.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        const { uid, displayName } = auth.currentUser;
        await addDoc(collection(db, 'groups', groupId, 'messages'), {
            text: newMessage,
            createdAt: serverTimestamp(),
            uid,
            authorName: displayName || auth.currentUser.email,
        });
        setNewMessage('');
    };
    
    const handleNotesChange = e => { setNotes(e.target.value); saveNotes(e.target.value); };
    
    const handleAddGoal = async () => {
        if (newGoal.trim() === '') return;
        const groupDocRef = doc(db, 'groups', groupId);
        const newGoalObject = { id: Date.now().toString(), text: newGoal, completed: false };
        await updateDoc(groupDocRef, { goals: [...goals, newGoalObject] });
        setNewGoal('');
    };
    
    const handleToggleGoal = async (goalId) => {
        const groupDocRef = doc(db, 'groups', groupId);
        const updatedGoals = goals.map(goal =>
          goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
        );
        await updateDoc(groupDocRef, { goals: updatedGoals });
    };
    
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const storage = getStorage();
        const fileRef = ref(storage, `groups/${groupId}/${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        await addDoc(collection(db, 'groups', groupId, 'files'), {
          fileName: file.name,
          url: downloadURL,
          uploadedBy: auth.currentUser.displayName || auth.currentUser.email,
          uploadedAt: serverTimestamp()
        });
        setIsUploading(false);
    };
    
    const handleSummarizeNotes = async () => {
        if (!notes) return alert("There are no notes to summarize!");
        setIsSummarizing(true);
        try {
          const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-pro"});
          const prompt = `Summarize the following study notes in a few bullet points: \n\n${notes}`;
          const result = await model.generateContent(prompt);
          const summary = result.response.text();
          alert(`AI Summary:\n\n${summary}`);
        } catch (error) {
          console.error("Error summarizing notes:", error);
          alert("Sorry, the AI summary could not be generated.");
        }
        setIsSummarizing(false);
    };

    const handleAddCard = async () => {
        if (!newCard.front || !newCard.back) return;
        await addDoc(collection(db, 'groups', groupId, 'flashcards'), {
          ...newCard,
          createdAt: serverTimestamp()
        });
        setNewCard({ front: '', back: '' });
    };
    
    const nextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex(prevIndex => (prevIndex + 1) % flashcards.length);
    };
    
    const prevCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex(prevIndex => (prevIndex - 1 + flashcards.length) % flashcards.length);
    };

    return (
        <div className="group-page-container">
            <div className="left-panel">
                <div className="tabs">
                    <button onClick={() => setActiveTab('goals')} className={activeTab === 'goals' ? 'active' : ''}>Goals</button>
                    <button onClick={() => setActiveTab('notes')} className={activeTab === 'notes' ? 'active' : ''}>Notes</button>
                    <button onClick={() => setActiveTab('files')} className={activeTab === 'files' ? 'active' : ''}>Files</button>
                    <button onClick={() => setActiveTab('flashcards')} className={activeTab === 'flashcards' ? 'active' : ''}>Flashcards</button>
                    <button onClick={() => setActiveTab('music')} className={activeTab === 'music' ? 'active' : ''}>Music</button>
                </div>

                {activeTab === 'goals' && (
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
                )}
                {activeTab === 'notes' && (
                     <div className="notes-container">
                        <h3>Collaborative Notes</h3>
                        <textarea className="notes-editor" value={notes} onChange={handleNotesChange} placeholder="Type your shared notes here..." />
                        <button onClick={handleSummarizeNotes} className="summarize-button" disabled={isSummarizing}>{isSummarizing ? 'Summarizing...' : '✨ Summarize with AI'}</button>
                    </div>
                )}
                {activeTab === 'files' && (
                    <div className="file-sharing-container">
                        <h3>Shared Files</h3>
                        <div className="file-list">
                            {files.map((file, index) => (
                                <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="file-item">{file.fileName}</a>
                            ))}
                        </div>
                        <input type="file" onChange={handleFileUpload} id="file-upload" style={{display: 'none'}} disabled={isUploading} />
                        <label htmlFor="file-upload" className={`upload-button ${isUploading ? 'disabled' : ''}`}>{isUploading ? 'Uploading...' : 'Upload File'}</label>
                    </div>
                )}
                {activeTab === 'flashcards' && (
                    <div className="flashcard-container">
                        <h3>Flashcards ({flashcards.length})</h3>
                        <div className="flashcard-viewer">
                            {flashcards.length > 0 ? (
                                <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                                    <div className="flashcard-front">{flashcards[currentCardIndex].front}</div>
                                    <div className="flashcard-back">{flashcards[currentCardIndex].back}</div>
                                </div>
                            ) : <p>No flashcards yet.</p>}
                        </div>
                        {flashcards.length > 1 && (
                            <div className="flashcard-nav">
                                <button onClick={prevCard}>&larr; Prev</button>
                                <span>{currentCardIndex + 1} / {flashcards.length}</span>
                                <button onClick={nextCard}>Next &rarr;</button>
                            </div>
                        )}
                        <div className="add-flashcard-form">
                            <input value={newCard.front} onChange={(e) => setNewCard({...newCard, front: e.target.value})} placeholder="Front of card" />
                            <input value={newCard.back} onChange={(e) => setNewCard({...newCard, back: e.target.value})} placeholder="Back of card" />
                            <button onClick={handleAddCard} className="add-button">Add Card</button>
                        </div>
                    </div>
                )}
                {activeTab === 'music' && (
                    <FocusMusic />
                )}
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