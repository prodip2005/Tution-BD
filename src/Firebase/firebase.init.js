// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1OXPHsyel_i_PvuRdbQIO-zGh5upQ_3s",
    authDomain: "tutor-owl-d4ee7.firebaseapp.com",
    projectId: "tutor-owl-d4ee7",
    storageBucket: "tutor-owl-d4ee7.firebasestorage.app",
    messagingSenderId: "1044924496854",
    appId: "1:1044924496854:web:9ae1589aa4bce0c3df0277"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
