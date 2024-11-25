import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBdUd6j_UJcIPJKUlODxJrBgKeninMWopE",
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
const storage = getStorage(app);

async function uploadFile(file: File | null) {
    if (file){
        const storageRef = ref(storage, `pdf/${file.name}`);
        const uploadTask = uploadBytes(storageRef, file);
    
        try {
        await uploadTask;
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
        } catch (error) {
        console.error('Error uploading file:', error);   
    
        throw error;
        }
    }
}

export { app, auth, db, storage, uploadFile };