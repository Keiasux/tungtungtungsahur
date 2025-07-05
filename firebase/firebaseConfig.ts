// firebase/firebaseconfig.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // ✅ No initializeAuth needed here

const firebaseConfig = {
  apiKey: "AIzaSyCPVFY0jgnjv49ItkeoThdLgUh8WpNOCII",
  authDomain: "shopfur-f0673.firebaseapp.com",
  databaseURL: "https://shopfur-f0673-default-rtdb.firebaseio.com",
  projectId: "shopfur-f0673",
  storageBucket: "shopfur-f0673.firebasestorage.app",
  messagingSenderId: "980572185774",
  appId: "1:980572185774:web:d83a99459af94d6754b93f",
  measurementId: "G-EY6LNPWYBZ"
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const database = getDatabase(app);
const auth = getAuth(app); // Use default web persistence

export { app, firestore, database, auth };
