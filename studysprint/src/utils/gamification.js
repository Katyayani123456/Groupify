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

// This new function has been added
export const calculateStreak = (studyHistory) => {
  if (!studyHistory || studyHistory.length === 0) {
    return 0;
  }

  // Remove duplicate days, keeping only the latest entry for each day
  const uniqueDays = [];
  const seenDays = new Set();
  studyHistory.forEach(session => {
      const day = session.completedAt.toDate().toDateString();
      if (!seenDays.has(day)) {
          seenDays.add(day);
          uniqueDays.push(session);
      }
  });

  // Sort the unique sessions by date, descending
  const sortedHistory = uniqueDays.sort((a, b) => b.completedAt.toDate() - a.completedAt.toDate());

  let streak = 0;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1, d2) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Check if the most recent session was today or yesterday
  const lastSessionDate = sortedHistory[0].completedAt.toDate();
  if (isSameDay(lastSessionDate, today) || isSameDay(lastSessionDate, yesterday)) {
    streak = 1;
    let lastDate = lastSessionDate;

    // Iterate through the rest of the history to count consecutive days
    for (let i = 1; i < sortedHistory.length; i++) {
      const currentDate = sortedHistory[i].completedAt.toDate();
      const expectedPreviousDate = new Date(lastDate);
      expectedPreviousDate.setDate(lastDate.getDate() - 1);

      if (isSameDay(currentDate, expectedPreviousDate)) {
        streak++;
        lastDate = currentDate;
      } else {
        break; // Streak is broken
      }
    }
  }

  return streak;
};