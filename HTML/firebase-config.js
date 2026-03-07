
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc, serverTimestamp, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA1aCeTwrQv_VFQBLWLZ4mGrDPe_lnJfmQ",
    authDomain: "student-database-hmhs.firebaseapp.com",
    projectId: "student-database-hmhs",
    storageBucket: "student-database-hmhs.firebasestorage.app",
    messagingSenderId: "875500623199",
    appId: "1:875500623199:web:205551f0aa1a9a8f5e52ea",
    measurementId: "G-5FRVZN9Y6B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
    auth, db, doc, getDoc, setDoc, collection, getDocs, deleteDoc, 
    serverTimestamp, signInWithEmailAndPassword, signOut, onAuthStateChanged,
    createUserWithEmailAndPassword, updateProfile, query, where
};
