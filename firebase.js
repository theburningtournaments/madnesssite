<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  export const db = getFirestore(app);
  export const auth = getAuth(app);
</script>