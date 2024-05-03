// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-app-69b01.firebaseapp.com",
  projectId: "mern-blog-app-69b01",
  storageBucket: "mern-blog-app-69b01.appspot.com",
  messagingSenderId: "619885591784",
  appId: "1:619885591784:web:1f372ebf45b1e27120dd5d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);