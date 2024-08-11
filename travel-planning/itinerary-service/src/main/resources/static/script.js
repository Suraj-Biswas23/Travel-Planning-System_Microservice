document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('itinerary-form');
    const saveButton = form.querySelector('button[type="submit"]');
    const updateButton = document.getElementById('update-button');
    let itineraries = [];

    // Fetch all itineraries and display them
    fetch('/itineraries')
        .then(response => response.json())
        .then(data => {
            itineraries = data;
            displayItineraries(itineraries);
        });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const itinerary = {
            userId: document.getElementById('user-id').value,
            destinations: document.getElementById('destinations').value.split(','),
            activities: document.getElementById('activities').value.split(','),
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value
        };

        if (document.getElementById('itinerary-id').value) {
            // Update existing itinerary
            itinerary.id = document.getElementById('itinerary-id').value;
            updateItinerary(itinerary);
        } else {
            // Create new itinerary
            createItinerary(itinerary);
        }
    });

    // Attach click event to Update button
    updateButton.addEventListener('click', function() {
        const itinerary = {
            userId: document.getElementById('user-id').value,
            destinations: document.getElementById('destinations').value.split(','),
            activities: document.getElementById('activities').value.split(','),
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            id: document.getElementById('itinerary-id').value
        };
        updateItinerary(itinerary);
    });

    function createItinerary(itinerary) {
        fetch('/itineraries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itinerary)
        })
        .then(response => response.json())
        .then(data => {
            itineraries.push(data);
            displayItineraries(itineraries);
            form.reset();
            saveButton.classList.remove('d-none'); // Ensure Save button is shown again
            updateButton.classList.add('d-none'); // Ensure Update button is hidden
        });
    }

    function updateItinerary(itinerary) {
        console.log("Updating itinerary:", itinerary);
        fetch(`/itineraries/${itinerary.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itinerary)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Updated itinerary response:", data);
            itineraries = itineraries.map(it => it.id === data.id ? data : it);
            displayItineraries(itineraries);
            form.reset();
            document.getElementById('itinerary-id').value = '';
            saveButton.classList.remove('d-none'); // Ensure Save button is shown again
            updateButton.classList.add('d-none'); // Ensure Update button is hidden
        })
        .catch(error => console.error('Update error:', error));
    }

    function displayItineraries(itineraries) {
        const tableBody = document.getElementById('itinerary-table-body');
        tableBody.innerHTML = '';

        itineraries.forEach(itinerary => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${itinerary.id}</td>
                <td>${itinerary.userId}</td>
                <td>${itinerary.destinations.join(', ')}</td>
                <td>${itinerary.activities.join(', ')}</td>
                <td>${itinerary.startDate}</td>
                <td>${itinerary.endDate}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editItinerary('${itinerary.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteItinerary('${itinerary.id}')">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    window.editItinerary = function(id) {
        const itinerary = itineraries.find(it => it.id === id);

        document.getElementById('user-id').value = itinerary.userId;
        document.getElementById('destinations').value = itinerary.destinations.join(', ');
        document.getElementById('activities').value = itinerary.activities.join(', ');
        document.getElementById('start-date').value = itinerary.startDate;
        document.getElementById('end-date').value = itinerary.endDate;
        document.getElementById('itinerary-id').value = itinerary.id;

        saveButton.classList.add('d-none'); // Hide Save button
        updateButton.classList.remove('d-none'); // Show Update button
    };

    window.deleteItinerary = function(id) {
        fetch(`/itineraries/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            itineraries = itineraries.filter(it => it.id !== id);
            displayItineraries(itineraries);
        });
    };
});
