import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBaSbNiXZIUVP0j7TiCeCxjTClxohM1mw4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-resume-400b1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-resume-400b1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-resume-400b1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "290679156507",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:290679156507:web:8ed6e44a15e47f252c2dbe"
};

export const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);

export default app;
