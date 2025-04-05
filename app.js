const SHEET_ID = '1Drhe2Hh4e_Vmw8XMa8e7Oyh-4bOB178BoBYRF06n0Gk';  // Your Google Sheets ID
const API_KEY = 'AIzaSyCNxV6lXO282697QMTfh50Cmrl0OSKLW9Q';  // Your API Key

// Initialize Google API client
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        loadCheckboxes();  // Load checkboxes when the page is ready
    });
}

// Load the Google API client
gapi.load('client', initClient);

// Load checkboxes from Google Sheets
function loadCheckboxes() {
    const range = "Sheet1!A2:B"; // Assuming checkboxes are in columns A and B

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: range,
    }).then(function(response) {
        const data = response.result.values;
        const checkboxListDiv = document.getElementById("checkbox-list");

        // Clear existing checkboxes (if any)
        checkboxListDiv.innerHTML = '';

        if (data) {
            data.forEach((row, index) => {
                const checkboxName = row[0];
                const checkedStatus = row[1] === 'TRUE';  // TRUE or FALSE

                // Create checkbox element
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = checkedStatus;
                checkbox.id = `checkbox${index + 1}`;

                // Add event listener to update the Google Sheet when the checkbox is changed
                checkbox.addEventListener("change", function() {
                    updateCheckboxStatus(index + 1, checkbox.checked);
                });

                const label = document.createElement("label");
                label.textContent = checkboxName;

                checkboxListDiv.appendChild(checkbox);
                checkboxListDiv.appendChild(label);
                checkboxListDiv.appendChild(document.createElement("br"));
            });
        } else {
            console.log("No data found.");
        }
    });
}

// Update checkbox status in Google Sheets
function updateCheckboxStatus(index, status) {
    const range = `Sheet1!B${index + 1}`;  // Update the second column (B) with the status
    const value = status ? 'TRUE' : 'FALSE';

    const params = {
        spreadsheetId: SHEET_ID,
        range: range,
        valueInputOption: 'RAW',
        resource: {
            values: [[value]],
        },
    };

    gapi.client.sheets.spreadsheets.values.update(params).then(() => {
        console.log(`Checkbox ${index} status updated to ${value}`);
    }).catch((error) => {
        console.error('Error updating checkbox status:', error);
    });
}

// Add new checkbox (for testing)
document.getElementById("add-checkbox-btn").addEventListener("click", function () {
    const newIndex = document.querySelectorAll('input[type="checkbox"]').length + 1;
    const newCheckboxName = `Checkbox ${newIndex}`;
    const newCheckedStatus = 'FALSE';  // Default status is unchecked

    // Add new row in Google Sheets with default status
    const range = `Sheet1!A${newIndex + 1}:B${newIndex + 1}`;
    const values = [
        [newCheckboxName, newCheckedStatus]
    ];

    const params = {
        spreadsheetId: SHEET_ID,
        range: range,
        valueInputOption: 'RAW',
        resource: {
            values: values,
        },
    };

    gapi.client.sheets.spreadsheets.values.update(params).then(() => {
        loadCheckboxes(); // Reload checkboxes after adding a new one
    }).catch((error) => {
        console.error('Error adding new checkbox:', error);
    });
});

// Set an interval to periodically reload the checkboxes to reflect Google Sheets updates (for testing)
setInterval(loadCheckboxes, 5000); // Reload every 5 seconds to sync with Google Sheets
