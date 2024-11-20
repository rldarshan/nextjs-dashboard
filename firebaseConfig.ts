import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "myangularfirebase-74aff.firebaseapp.com",
    projectId: "myangularfirebase-74aff",
    storageBucket: "myangularfirebase-74aff.appspot.com",
    messagingSenderId: "431015899903",
    appId: "1:431015899903:web:01fe0314456e33ec"
};


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Example: Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
