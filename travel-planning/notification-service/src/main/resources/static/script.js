let editingNotificationId = null; // Track the ID of the notification being edited

// Fetch and display notifications
function fetchNotifications() {
    fetch('/notifications')
        .then(response => response.json())
        .then(notifications => displayNotifications(notifications));
}

function displayNotifications(notifications) {
    const tableBody = document.getElementById('notification-table-body');
    tableBody.innerHTML = '';

    notifications.forEach(notification => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${notification.id}</td>
            <td>${notification.userId}</td>
            <td>${notification.message}</td>
            <td>${notification.notificationDate}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editNotification('${notification.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteNotification('${notification.id}')">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Create or update notification
document.getElementById('notification-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const notification = {
        userId: document.getElementById('user-id').value,
        message: document.getElementById('message').value,
        notificationDate: document.getElementById('notification-date').value
    };

    if (editingNotificationId) {
        // Update existing notification
        fetch(`/notifications/${editingNotificationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notification)
        }).then(response => response.json())
          .then(() => {
              fetchNotifications();
              resetForm();
          });
    } else {
        // Create new notification
        fetch('/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notification)
        }).then(response => response.json())
          .then(() => {
              fetchNotifications();
              resetForm();
          });
    }
});

// Edit notification (populate form)
function editNotification(id) {
    fetch(`/notifications/${id}`)
        .then(response => response.json())
        .then(notification => {
            document.getElementById('user-id').value = notification.userId;
            document.getElementById('message').value = notification.message;
            document.getElementById('notification-date').value = notification.notificationDate;
            editingNotificationId = notification.id; // Set the ID of the notification being edited
        });
}

// Delete notification
function deleteNotification(id) {
    fetch(`/notifications/${id}`, { method: 'DELETE' })
        .then(() => fetchNotifications());
}

// Reset the form and clear the editing state
function resetForm() {
    document.getElementById('notification-form').reset();
    editingNotificationId = null; // Clear editing state
}

// Initial fetch
fetchNotifications();
