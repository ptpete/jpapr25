// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAbCD5eLXKW-izbCmVOpA-9jAjcLSN3b4",
  authDomain: "jpapr25.firebaseapp.com",
  projectId: "jpapr25",
  storageBucket: "jpapr25.firebasestorage.app",
  messagingSenderId: "664046829915",
  appId: "1:664046829915:web:7d16ace7d82bf918295a7e"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// DOM elements
const checkboxListDiv = document.getElementById("checkbox-list");
const addCheckboxBtn = document.getElementById("add-checkbox-btn");

// Reference to the database location for 'checkboxes'
const checkboxRef = database.ref('checkboxes');

// Listen for changes to the 'checkboxes' node in Firebase
checkboxRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    // Clear the existing checkbox list
    checkboxListDiv.innerHTML = '';

    // Loop through the checkboxes data and display them
    Object.keys(data).forEach(key => {
      const checkboxData = data[key];
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = checkboxData.checked;
      checkbox.addEventListener("change", () => {
        // Update the checked state in Firebase when the checkbox is changed
        checkboxRef.child(key).update({
          checked: checkbox.checked
        });
      });

      const label = document.createElement("label");
      label.textContent = `Checkbox ${key}`;

      // Append the checkbox and label to the list
      checkboxListDiv.appendChild(checkbox);
      checkboxListDiv.appendChild(label);
      checkboxListDiv.appendChild(document.createElement("br"));
    });
  }
});

// Add new checkbox to Firebase
addCheckboxBtn.addEventListener("click", () => {
  const newCheckboxRef = checkboxRef.push();
  newCheckboxRef.set({
    checked: false
  });
});
