import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCGOeYS9VS8zSIDHTuGx0HVGtFC61CBeh8",
  authDomain: "workshop-tracker-24b18.firebaseapp.com",
  projectId: "workshop-tracker-24b18",
  storageBucket: "workshop-tracker-24b18.firebasestorage.app",
  messagingSenderId: "310131742653",
  appId: "1:310131742653:web:2f1f9d864fb591453064d4",
  measurementId: "G-5Z8KM5NQ5K"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };