// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyAUq_J2EJ2pIdtA1-m8cYYxdnDJYmuvCMc",
    authDomain: "integrals-and-derivatives.firebaseapp.com",
    projectId: "integrals-and-derivatives",
    storageBucket: "integrals-and-derivatives.firebasestorage.app",
    messagingSenderId: "837195297861",
    appId: "1:837195297861:web:13916f8e519b5ce9729f2c",
    measurementId: "G-YJ0PM4SJPM"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
