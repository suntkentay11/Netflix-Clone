// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP4M9ogSaRfI0yo7ea8MgDWz39rVpQ_Js",
  authDomain: "netflix-clone-2e19d.firebaseapp.com",
  projectId: "netflix-clone-2e19d",
  storageBucket: "netflix-clone-2e19d.firebasestorage.app",
  messagingSenderId: "893330645076",
  appId: "1:893330645076:web:96e7272a97c2e9075ecdc1",
  measurementId: "G-67Q5S8XSSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  const user = res.user;

  await addDoc(collection(db, "user"), {
    uid: user.uid,
    name,
    authProvider: "local",
    email,
  });

  return user;
};

const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
}

const logout = () => {
    signOut(auth);
}

export {auth, db, signup, login, logout};