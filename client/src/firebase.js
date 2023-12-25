// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-b7eb1.firebaseapp.com",
  projectId: "mern-estate-b7eb1",
  storageBucket: "mern-estate-b7eb1.appspot.com",
  messagingSenderId: "308030942053",
  appId: "1:308030942053:web:9bb61ecd144d923c43cf8c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
