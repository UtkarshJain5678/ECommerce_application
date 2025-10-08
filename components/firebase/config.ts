// Filename: lib/firebase/config.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics"; // Added for Analytics

// Your web app's Firebase configuration from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // Add Measurement ID if you want to initialize Analytics
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, 
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);


// Initialize Analytics: ONLY run this in the browser environment (client)
let analytics;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    // Check if window is available (browser context) AND if the measurementId is set
    try {
        analytics = getAnalytics(app);
    } catch (e) {
        // Suppress any errors if analytics fails to initialize (e.g., ad blocker)
        console.error("Firebase Analytics initialization failed:", e);
    }
}
export { analytics }; // Export it if needed later
export default app;