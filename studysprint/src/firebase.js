import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
const firebaseConfig = {
  apiKey:  "AIzaSyBjGXRJEybXWz36j5qEkrVHq5ASbWVov5Q",
  authDomain: "studysprint-2ed69.firebaseapp.com",
  projectId:  "studysprint-2ed69",
  storageBucket:  "studysprint-2ed69.firebasestorage.app",
  messagingSenderId:  "307559389324",
  appId:  "1:307559389324:web:78f7d9cc667412c6da83a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them
export const auth = getAuth(app);
export const db = getFirestore(app);