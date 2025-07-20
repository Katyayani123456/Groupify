import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { checkAndAwardBadges } from '../utils/gamification'; // Import badge logic

const PomodoroTimer = () => {
  const workTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes

  const [time, setTime] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime(time - 1), 1000);
    } else if (time === 0) {
      if (isWorkSession) {
        const saveAndCheckBadges = async () => {
          const user = auth.currentUser;
          if (user) {
            // Save the session
            const historyRef = collection(db, 'users', user.uid, 'studyHistory');
            await addDoc(historyRef, {
              completedAt: serverTimestamp(),
              duration: workTime / 60,
            });

            // --- New Logic ---
            // Fetch the updated history to check for badges
            const historySnapshot = await getDocs(historyRef);
            const fullHistory = historySnapshot.docs.map(doc => doc.data());
            const userProfile = { uid: user.uid, badges: (await getDocs(collection(db, 'users'))).docs.find(doc => doc.id === user.uid)?.data()?.badges || [] };
            checkAndAwardBadges(userProfile, fullHistory);
          }
        };
        saveAndCheckBadges();
        // --- End of New Logic ---

        alert("Time for a break!");
        setTime(breakTime);
        setIsWorkSession(false);
      } else {
        alert("Back to work!");
        setTime(workTime);
        setIsWorkSession(true);
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time, isWorkSession, workTime, breakTime]);

  // ... (rest of the component is the same)
  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setIsWorkSession(true);
    setTime(workTime);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-container">
      <h4>{isWorkSession ? 'Study Session' : 'Break Time'}</h4>
      <div className="timer-display">{formatTime(time)}</div>
      <div className="timer-controls">
        <button onClick={toggleTimer} className="form-button">{isActive ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer} className="my-profile-button">Reset</button>
      </div>
    </div>
  );
};

export default PomodoroTimer;