// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcYCcJsIJAA-flprfv4vKEwWoeYMbi0j4",
  authDomain: "testing-project-7c27e.firebaseapp.com",
  databaseURL: "https://testing-project-7c27e-default-rtdb.firebaseio.com",
  projectId: "testing-project-7c27e",
  storageBucket: "testing-project-7c27e.firebasestorage.app",
  messagingSenderId: "61851461710",
  appId: "1:61851461710:web:9e3204d2bea97d6e573b1f",
  measurementId: "G-K609925YJF"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const Firedb = getFirestore(app);
const Auth  = getAuth(app);

export {Auth , Firedb}