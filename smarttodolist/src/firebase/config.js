// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRdgUKCIYXBMolCmIa_E5RV80VFMH7FXw",
  authDomain: "smarttodo-f7f51.firebaseapp.com",
  projectId: "smarttodo-f7f51",
  storageBucket: "smarttodo-f7f51.firebasestorage.app",
  messagingSenderId: "80912904226",
  appId: "1:80912904226:web:d00f94b121f9b58f32da7b",
  measurementId: "G-BRPF1VKFXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;