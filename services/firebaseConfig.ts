// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxyY8A67mPvQS38nBcdhreEXggj-k2TGI",
  authDomain: "my-tracker-app-106.firebaseapp.com",
  projectId: "my-tracker-app-106",
  storageBucket: "my-tracker-app-106.firebasestorage.app",
  messagingSenderId: "557833679414",
  appId: "1:557833679414:web:5ff7fe35388fd5bf769e97",
  measurementId: "G-N7PZGP1MQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
