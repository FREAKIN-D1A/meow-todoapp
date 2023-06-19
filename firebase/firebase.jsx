import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCwTVdzwmSILePSVs22G2-o8VziHkI-0GI",
	authDomain: "fir-todo-app-7b49f.firebaseapp.com",
	projectId: "fir-todo-app-7b49f",
	storageBucket: "fir-todo-app-7b49f.appspot.com",
	messagingSenderId: "746589241592",
	appId: "1:746589241592:web:b20032e1f5af0b78ae7b0d",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const Provider = new GoogleAuthProvider();
