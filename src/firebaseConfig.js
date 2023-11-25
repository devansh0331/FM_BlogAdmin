// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV_e0h1FAtJZN-0VZ1VL4QEx-gO9BCSaQ",
  authDomain: "blog-admin-add78.firebaseapp.com",
  projectId: "blog-admin-add78",
  storageBucket: "blog-admin-add78.appspot.com",
  messagingSenderId: "343469858930",
  appId: "1:343469858930:web:187cd54a772b54728b22eb",
  measurementId: "G-XFPVMKPL62",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const storage = getStorage(app);
export const db = getFirestore(app);
