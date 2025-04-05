// Define Google Sheets API settings
const SHEET_ID = '1Drhe2Hh4e_Vmw8XMa8e7Oyh-4bOB178BoBYRF06n0Gk'; // Your Google Sheets ID
const API_KEY = 'AIzaSyCNxV6lXO282697QMTfh50Cmrl0OSKLW9Q'; // Your API key

// Initialize Google API client
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        // Now the client is initialized, we can start fetching data
        loadCheckboxes();
    });
}

// Load Google API client
gapi.load('client', initClient);

// Function to load checkboxes from Google Sheets
function loadCheckboxes() {
    const range = "Sheet1!A2:B"; // Sheet1 is the name of your sheet, adjust if necessary

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: range
    }).then(function (response) {
        const data = response.result.values;
        const checkboxListDiv = document.getElementById("checkbox-list");

        if (data) {
            data.forEach((row, index) => {
                const checkboxName = row[0];
                const checkedStatus = row[1] === 'TRUE'; // Convert string to boolean

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = checkedStatus;
                checkbox.id = `checkbox${index + 1}`;

                checkbox.addEventListener("change", () => {
                    updateCheckboxStatus(index + 1, checkbox.checked);
                });

                const label = document.createElement("label");
                label.textContent = checkboxName;

                checkboxListDiv.appendChild(checkbox);
                checkboxListDiv.appendChild(label);
                checkboxListDiv.appendChild(document.createElement("br"));
            });
        }
    });
}

// Function to update checkbox status in Google Sheets
function updateCheckboxStatus(index, status) {
    const range = `Sheet1!B${index + 1}`; // Adjust the range based on your row numbers
    const value = status ? 'TRUE' : 'FALSE';

    const params = {
        spreadsheetId: SHEET_ID,
        range: range,
        valueInputOption: 'RAW',
        resource: {
            values: [[value]]
        }
    };

    gapi.client.sheets.spreadsheets.values.update(params).then((response) => {
        console.log("Checkbox status updated");
    });
}

// Add new checkbox (for testing)
document.getElementById("add-checkbox-btn").addEventListener("click", function () {
    const newIndex = document.querySelectorAll('input[type="checkbox"]').length + 1;
    const newCheckboxName = `Checkbox ${newIndex}`;
    const newCheckedStatus = 'FALSE'; // Default status

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
            values: values
        }
    };

    gapi.client.sheets.spreadsheets.values.update(params).then(() => {
        loadCheckboxes(); // Reload checkboxes after adding
    });
});
