<br>

<div align="center">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Rocket.png" alt="Rocket" width="80" height="80" />
<h1>Groupify</h1>
<p><strong>AI-Powered Study Groups</strong></p>
<p><em>Collaborate. Focus. Succeed—together.</em></p>
</div>

<br>

[!NOTE]
Groupify is a next-generation web platform empowering students to form dynamic micro study groups, find the perfect partners, and keep each other motivated—no one studies alone!

📚 About Groupify
Designed for the modern student, Groupify solves the biggest hurdles in collaborative learning: finding compatible peers, managing group study, and building lasting academic accountability. With seamless smart-matching, real-time collaboration, robust accountability tools, and an engaging interface, Groupify transforms studying into a social, productive, and rewarding experience.

💡 Why Groupify?
Students often face challenges in collaborative learning:

Finding the Right Partners: Struggling to find compatible study partners with aligned subjects, timing, and goals.

Maintaining Focus: Motivation, focus, and accountability are difficult to sustain—especially for remote learners and those preparing for critical exams.

Cumbersome Coordination: Legacy solutions often lack true personalization or make coordination cumbersome.

Groupify bridges these gaps, making collaborative, focused study accessible to all.

✨ Key Features
Feature

Description

🧑‍🤝‍🧑 Smart Partner Matching

Advanced algorithm matches students by subject, course, goals, preferences, and timing.

📅 Weekend & Session Planner

View, schedule, and join sessions—especially designed for busy weekends.

📝 Collaborative Notes

Live shared notes editor per group and per session.

💬 Chat & Video Calls

Built-in messaging and video with screen sharing for seamless communication.

⏰ Pomodoro Focus Timer

Integrated group/solo Pomodoro timer for staying on task.

🎯 Group Goal Tracker

Set, assign, and track progress on shared goals and milestones.

📈 Heritage (Progress History)

Timeline of all group activity, completed sessions, and academic achievements.

🚦 Accountability & Gamification

Daily check-ins, streak tracking, XP, badges, and (optional) leaderboards.

📂 Resource Sharing

Upload, store, and exchange PDFs, slides, and group study materials.

🟢 Live Status & Reminders

See who’s online, who’s studying now, with auto reminders for sessions & goals.

🔒 Privacy & Safety

Profile options, anonymous mode, reporting/blocking, and Firebase authentication.

👤 Personalization

Profile images, bios, academic interests, dark mode, responsive design, accessibility.

🎓 Flashcards & Quizzes

Custom flashcard and quiz builder, shareable within groups.

🛠 Community & Support

FAQ/help, contact/feedback, and newsletter signup.

🌟 User Experience Highlights
1-Minute Signup: Quick set-up—get matched and begin collaborating instantly.

Weekend Card: Special section to manage and join weekend study sessions.

All-in-One Collaboration: Notes, group chat, video, resource sharing—nothing scattered.

Live Accountability: Streaks, reminders, and real-time dashboards keep you on track.

Mobile-Optimized and Accessible: Beautiful UI for all devices, featuring dark mode and full accessibility.

🛠️ Tech Stack
Frontend: React, CSS

Backend & Real-Time Database: Firebase (Firestore, Auth, Storage)

Live Collaboration: Firestore real-time sync

AI Integration: Google Generative AI (for summarization, etc.)

Deployment: Firebase Hosting

🏁 Quick Start
To get Groupify up and running on your local machine, follow these steps:

1. Clone the Repository and Install Dependencies

git clone https://github.com/Katyayani123456/Groupify.git
cd groupify
npm install
# or
yarn install

2. Configure Firebase

Create a new project at firebase.google.com.

Enable Firestore, Authentication, and Storage services.

In your project settings, find your web app's Firebase configuration keys.

Create a new file src/firebase.js and add your configuration:

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

3. Configure AI Features

Create a .env file in the root of your project.

Add your Google Generative AI API key:

REACT_APP_GEMINI_API_KEY=YOUR_GEMINI_API_KEY

4. Run the Application Locally

npm start
# or
yarn start

The application will be available at https://studysprint-2ed69.web.app.

⚡ How It Works
Sign Up & Set Preferences: Register your interests, courses, available times, and study goals.

Get Smart Matches: Find peers with matched subjects/goals—especially for weekends or crucial exams.

Join Sessions: Enter chat and video rooms, open collaborative notes, and launch synchronized Pomodoro timers.

Track Progress: Set group goals, view completed sessions, unlock badges, and check your heritage log.

Stay Accountable: Get daily reminders, track streaks, and celebrate group achievements.

🧐 Evaluation Guide
For anyone reviewing this project, we recommend the following steps to experience the full user flow:

✅ Register with a few different profiles to experience the automatic matching.

📝 Use collaborative notes in multiple browser tabs to see real-time editing.

⏱️ Test the Pomodoro timer, group goals tracker, chat, and file uploads.

📊 Observe how the group progress history ("Heritage") builds as you interact with the platform.

🚀 About the Developer
Crafted with a passion for collaborative learning and modern web technology. Designed to empower students everywhere to achieve more together.



<br>

<div align="center">
<h3>Groupify — Study smarter, together.</h3>
<p><em>No one studies alone—ever again!</em></p>
</div>