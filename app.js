// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Firebase configuration from your Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyCAbCD5eLXKW-izbCmVOpA-9jAjcLSN3b4",
  authDomain: "jpapr25.firebaseapp.com",
  projectId: "jpapr25",
  storageBucket: "jpapr25.firebasestorage.app",
  messagingSenderId: "664046829915",
  appId: "1:664046829915:web:7d16ace7d82bf918295a7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database
const db = getDatabase(app);
const checkboxRef = ref(db, 'checkbox'); // A single checkbox state reference

// Get the checkbox DOM element
const checkboxElement = document.getElementById('checkbox');

// Sync the checkbox state with Firebase on page load
onValue(checkboxRef, (snapshot) => {
  const checkboxState = snapshot.val();
  if (checkboxState !== null) {
    checkboxElement.checked = checkboxState;
  }
});

// Update Firebase when checkbox is toggled
checkboxElement.addEventListener('change', (event) => {
  set(checkboxRef, event.target.checked);
});
