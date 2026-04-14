import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithRedirect,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
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
export const auth = getAuth(app);
export const firestoreDb = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const loginWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    const fallbackCodes = [
      "auth/popup-blocked",
      "auth/cancelled-popup-request",
      "auth/operation-not-supported-in-this-environment",
    ];

    if (fallbackCodes.includes(error?.code)) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }

    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signupWithEmail = async (name, email, password) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }
  return credential;
};

export const resetPasswordEmail = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const logoutUser = async () => {
  return signOut(auth);
};

export default app;
