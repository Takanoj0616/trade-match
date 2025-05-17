import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "match-next.firebaseapp.com",
    projectId: "match-next",
    storageBucket: "match-next.firebasestorage.app",
    messagingSenderId: "492635654726",
    appId: "1:492635654726:web:9899c1097b3cf68e129847",
    measurementId: "G-9RWWVVY6X1"
};
  

// Firebaseの初期化
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };