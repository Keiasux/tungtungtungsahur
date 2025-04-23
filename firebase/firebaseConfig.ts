// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6v8BobHXg6LPlAna23F5Msbyj-ZjD6s4",
  authDomain: "shopfurar.firebaseapp.com",
  projectId: "shopfurar",
  storageBucket: "shopfurar.firebasestorage.app",
  messagingSenderId: "63848347199",
  appId: "1:63848347199:web:21154d963d1e4692aeea8a",
  measurementId: "G-H2D2HPF42P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);  // Initialize Firestore
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export { auth };
export { firestore }; 