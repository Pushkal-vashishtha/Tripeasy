// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:'AIzaSyAZTu_UV59LrXsX6ovnX74uhP_4G-ZXJpI',
  authDomain: "aitravel-26cfc.firebaseapp.com",
  projectId: "aitravel-26cfc",
  storageBucket: "aitravel-26cfc.appspot.com",
  messagingSenderId: "921303027241",
  appId: "1:921303027241:web:700ee8ceb38fd0fffb1638",
  measurementId: "G-032S0G2LKV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
