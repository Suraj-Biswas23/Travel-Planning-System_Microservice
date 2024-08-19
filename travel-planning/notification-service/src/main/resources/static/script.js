document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('notification-form');
    const saveButton = form.querySelector('button[type="submit"]');
    const updateButton = document.getElementById('update-button');
    let notifications = [];

    // Fetch all notifications and display them
    fetch('/notifications')
        .then(response => response.json())
        .then(data => {
            notifications = data;
            displayNotifications(notifications);
        });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const notification = {
            userId: document.getElementById('user-id').value,
            message: document.getElementById('message').value,
            notificationDate: document.getElementById('notification-date').value
        };

        if (document.getElementById('notification-id').value) {
            // Update existing notification
            notification.id = document.getElementById('notification-id').value;
            updateNotification(notification);
        } else {
            // Create new notification
            createNotification(notification);
        }
    });

    updateButton.addEventListener('click', function() {
        const notification = {
            userId: document.getElementById('user-id').value,
            message: document.getElementById('message').value,
            notificationDate: document.getElementById('notification-date').value,
            id: document.getElementById('notification-id').value
        };
        updateNotification(notification);
    });

    function createNotification(notification) {
        fetch('/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notification)
        })
        .then(response => response.json())
        .then(data => {
            notifications.push(data);
            displayNotifications(notifications);
            form.reset();
            saveButton.classList.remove('d-none');
            updateButton.classList.add('d-none');
        });
    }

    function updateNotification(notification) {
        fetch(`/notifications/${notification.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notification)
        })
        .then(response => response.json())
        .then(data => {
            notifications = notifications.map(n => n.id === data.id ? data : n);
            displayNotifications(notifications);
            form.reset();
            document.getElementById('notification-id').value = '';
            saveButton.classList.remove('d-none');
            updateButton.classList.add('d-none');
        })
        .catch(error => console.error('Update error:', error));
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

    window.editNotification = function(id) {
        const notification = notifications.find(n => n.id === id);

        document.getElementById('user-id').value = notification.userId;
        document.getElementById('message').value = notification.message;
        document.getElementById('notification-date').value = notification.notificationDate;
        document.getElementById('notification-id').value = notification.id;

        saveButton.classList.add('d-none');
        updateButton.classList.remove('d-none');
    };

    window.deleteNotification = function(id) {
        fetch(`/notifications/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            notifications = notifications.filter(n => n.id !== id);
            displayNotifications(notifications);
        });
    };
});