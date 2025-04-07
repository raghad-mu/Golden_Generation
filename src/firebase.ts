import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkYqgeWj2L_8GfjzaoPukqukhKyOX5rjw",
  authDomain: "golden-generation-de85d.firebaseapp.com",
  projectId: "golden-generation-de85d",
  storageBucket: "golden-generation-de85d.firebasestorage.app",
  messagingSenderId: "831262574697",
  appId: "1:831262574697:web:43706a0f54f269a4977af8",
  measurementId: "G-BERH0Y74K9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
