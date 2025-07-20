// src/utils/gamification.js
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

export const checkAndAwardBadges = async (user, studyHistory) => {
  if (!user || !user.uid || !studyHistory) return;

  const userDocRef = doc(db, 'users', user.uid);
  const badges = user.badges || []; // Current badges
  let newBadges = [];

  // Badge 1: First Pomodoro
  if (studyHistory.length >= 1 && !badges.includes('first_pomodoro')) {
    newBadges.push('first_pomodoro');
  }

  // Badge 2: 10 Pomodoros
  if (studyHistory.length >= 10 && !badges.includes('ten_pomodoros')) {
    newBadges.push('ten_pomodoros');
  }

  // Badge 3: 25 Pomodoros (Study Master)
  if (studyHistory.length >= 25 && !badges.includes('study_master')) {
    newBadges.push('study_master');
  }

  // If new badges were earned, update the user's profile
  if (newBadges.length > 0) {
    // Use arrayUnion to safely add new badges without duplicates
    await updateDoc(userDocRef, {
      badges: arrayUnion(...newBadges)
    });
    alert(`Congratulations! You've earned a new badge! Check your profile.`);
  }
};