let editingBookingId = null; // Track the ID of the booking being edited

// Fetch and display bookings
function fetchBookings() {
    fetch('/bookings')
        .then(response => response.json())
        .then(bookings => displayBookings(bookings));
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
            <td>${booking.status}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editBooking('${booking.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBooking('${booking.id}')">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Create or update booking
document.getElementById('booking-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const booking = {
        userId: document.getElementById('user-id').value,
        itineraryId: document.getElementById('itinerary-id').value,
        bookingDate: document.getElementById('booking-date').value,
        status: document.getElementById('status').value
    };

    if (editingBookingId) {
        // Update existing booking
        fetch(`/bookings/${editingBookingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        }).then(response => response.json())
          .then(() => {
              fetchBookings();
              resetForm();
          });
    } else {
        // Create new booking
        fetch('/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        }).then(response => response.json())
          .then(() => {
              fetchBookings();
              resetForm();
          });
    }
});

// Edit booking (populate form)
function editBooking(id) {
    fetch(`/bookings/${id}`)
        .then(response => response.json())
        .then(booking => {
            document.getElementById('user-id').value = booking.userId;
            document.getElementById('itinerary-id').value = booking.itineraryId;
            document.getElementById('booking-date').value = booking.bookingDate;
            document.getElementById('status').value = booking.status;
            editingBookingId = booking.id; // Set the ID of the booking being edited
        });
}

// Delete booking
function deleteBooking(id) {
    fetch(`/bookings/${id}`, { method: 'DELETE' })
        .then(() => fetchBookings());
}

// Reset the form and clear the editing state
function resetForm() {
    document.getElementById('booking-form').reset();
    editingBookingId = null; // Clear editing state
}

// Initial fetch
fetchBookings();
