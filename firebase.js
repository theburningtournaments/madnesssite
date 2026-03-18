import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ⚠️ SUBSTITUI PELOS TEUS DADOS
const firebaseConfig = {
  apiKey: "AIzaSyDKwDmRaPgLUa2jB4MTq_OPAyehPnnVPO8",
  authDomain: "madness-fe0a8.firebaseapp.com",
  projectId: "madness-fe0a8",
  storageBucket: "madness-fe0a8.firebasestorage.app",
  messagingSenderId: "1043654768710",
  appId: "1:1043654768710:web:91bf3c5d33aa6eac643247",
  measurementId: "G-G0M19FBPZC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);