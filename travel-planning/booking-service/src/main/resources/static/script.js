document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('booking-form');
    const saveButton = form.querySelector('button[type="submit"]');
    const updateButton = document.getElementById('update-button');
    let bookings = [];

    // Fetch all bookings and display them
    fetch('/bookings')
        .then(response => response.json())
        .then(data => {
            bookings = data;
            displayBookings(bookings);
        });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const booking = {
            userId: document.getElementById('user-id').value,
            itineraryId: document.getElementById('itinerary-id').value,
            bookingDate: document.getElementById('booking-date').value
        };

        if (document.getElementById('booking-id').value) {
            // Update existing booking
            booking.id = document.getElementById('booking-id').value;
            updateBooking(booking);
        } else {
            // Create new booking
            createBooking(booking);
        }
    });

    updateButton.addEventListener('click', function() {
        const booking = {
            userId: document.getElementById('user-id').value,
            itineraryId: document.getElementById('itinerary-id').value,
            bookingDate: document.getElementById('booking-date').value,
            id: document.getElementById('booking-id').value
        };
        updateBooking(booking);
    });

    function createBooking(booking) {
        fetch('/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(booking)
        })
        .then(response => response.json())
        .then(data => {
            bookings.push(data);
            displayBookings(bookings);
            form.reset();
            saveButton.classList.remove('d-none');
            updateButton.classList.add('d-none');
        });
    }

    function updateBooking(booking) {
        fetch(`/bookings/${booking.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(booking)
        })
        .then(response => response.json())
        .then(data => {
            bookings = bookings.map(b => b.id === data.id ? data : b);
            displayBookings(bookings);
            form.reset();
            document.getElementById('booking-id').value = '';
            saveButton.classList.remove('d-none');
            updateButton.classList.add('d-none');
        })
        .catch(error => console.error('Update error:', error));
    }

    function displayBookings(bookings) {
        const tableBody = document.getElementById('booking-table-body');
        tableBody.innerHTML = '';

        bookings.forEach(booking => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${booking.userId}</td>
                <td>${booking.itineraryId}</td>
                <td>${booking.bookingDate}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editBooking('${booking.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteBooking('${booking.id}')">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    window.editBooking = function(id) {
        const booking = bookings.find(b => b.id === id);

        document.getElementById('user-id').value = booking.userId;
        document.getElementById('itinerary-id').value = booking.itineraryId;
        document.getElementById('booking-date').value = booking.bookingDate;
        document.getElementById('booking-id').value = booking.id;

        saveButton.classList.add('d-none');
        updateButton.classList.remove('d-none');
    };

    window.deleteBooking = function(id) {
        fetch(`/bookings/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            bookings = bookings.filter(b => b.id !== id);
            displayBookings(bookings);
        });
    };
});