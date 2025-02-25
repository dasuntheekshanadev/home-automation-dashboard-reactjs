// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCPXNMaQRME1ePKRwl6mjZVm-Wp-Ih0ngg",
    authDomain: "home-automation-cda06.firebaseapp.com",
    databaseURL: "https://home-automation-cda06-default-rtdb.firebaseio.com",
    projectId: "home-automation-cda06",
    storageBucket: "home-automation-cda06.firebasestorage.app",
    messagingSenderId: "189808051058",
    appId: "1:189808051058:web:3205130628ba279cc613eb",
    measurementId: "G-N9D7VXKG4K"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };