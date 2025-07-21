Groupify - AI-Powered Study Groups
Live Demo: https://studysprint-2ed69.web.app

🚀 The Problem
Studying can be an isolating and inefficient process. Students often struggle to find compatible study partners who share their subjects, goals, and availability. Even when groups are formed, coordination is messy, focus is hard to maintain, and accountability often fades, especially for remote learners and those facing high-stakes exams. This leads to procrastination, ineffective study sessions, and a feeling of being left to struggle alone.

✨ Our Solution
Groupify is a real-time, AI-powered web platform designed to replace study-related chaos with connection and clarity. It provides a seamless, centralized hub for students to form dynamic micro-groups, collaborate effectively, and hold each other accountable. By intelligently matching peers and integrating all necessary study tools, Groupify transforms learning into a social, productive, and rewarding experience.

🔑 Key Features
🧑‍🤝‍🧑 Smart Partner Matching: An advanced algorithm connects students based on subjects, courses, study goals, and availability, ensuring you always find the right people to study with.

📅 Dynamic Session Planner: A beautiful interface to view, schedule, and join study sessions. The "Weekend Card" feature specifically helps plan for crucial weekend study time.

📝 All-in-One Collaboration Suite:

Live Notes: A shared real-time notes editor for each group and session.

Chat & Video: Integrated messaging and video calls with screen sharing.

Resource Sharing: Easily upload, store, and exchange PDFs, slides, and other study materials.

⏰ Integrated Focus Tools: A built-in Pomodoro timer that can be used solo or synchronized with the group to keep everyone on task and focused.

🎯 Accountability & Progress Tracking:

Group Goals: Set, assign, and track progress on shared objectives and milestones.

Heritage Log: A complete timeline of all group activity, completed sessions, and achievements.

🚦 Gamification & Motivation: Earn XP, unlock badges, and maintain streaks for daily check-ins and session completion to keep motivation high.

🎓 Custom Learning Tools: A built-in flashcard and quiz builder to create and share study sets within your groups.

👤 Personalized & Secure: Customize your profile, see who's online, and feel secure with Firebase authentication, privacy controls, and reporting tools.

🛠️ Tech Stack
Frontend: React.js (with Hooks for state management)

Backend & Database: Google Firebase

Firestore: For our real-time, NoSQL database and live collaboration features.

Firebase Authentication: For secure user management.

Firebase Storage: For file uploads and resource sharing.

Firebase Hosting: For fast, global deployment.

AI Integration: Google Generative AI for features like summarization and smart matching enhancements.

Styling: Custom CSS with a modern, responsive, and accessible design (including dark mode).

⚙️ Running the Project Locally
Clone the repository:

git clone https://github.com/Katyayani123456/Groupify.git

Navigate into the project directory:

cd groupify

Install dependencies:

npm install

Configure Firebase: Create a src/firebase.js file and add your Firebase project configuration:

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

Configure AI: Create a .env file in the root of the project and add your Google Generative AI API key:

REACT_APP_GEMINI_API_KEY=YourApiKeyHere

Start the development server:

npm start

🚀 Next Steps & Future Ideas
AI-Powered Flashcards: Automatically generate flashcards from uploaded notes or PDFs.

LMS Integration: Connect with university Learning Management Systems (like Canvas or Moodle) to auto-import courses and schedules.

Public Study Rooms: Allow users to host or join public, topic-based study sessions that anyone can join.

Advanced Analytics: Provide users with personal insights into their most effective study times and habits.