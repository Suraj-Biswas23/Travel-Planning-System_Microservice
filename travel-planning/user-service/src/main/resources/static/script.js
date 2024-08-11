document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('user-form');
    const saveButton = form.querySelector('button[type="submit"]');
    const updateButton = document.getElementById('update-button');
    let users = [];

    // Fetch all users and display them
    fetch('/users')
        .then(response => response.json())
        .then(data => {
            users = data;
            displayUsers(users);
        });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const user = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value
        };

        if (document.getElementById('user-id').value) {
            // Update existing user
            user.id = document.getElementById('user-id').value;
            updateUser(user);
        } else {
            // Create new user
            createUser(user);
        }
    });

    // Attach click event to Update button
    updateButton.addEventListener('click', function() {
        const user = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
            id: document.getElementById('user-id').value
        };
        updateUser(user);
    });

    function createUser(user) {
        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            users.push(data);
            displayUsers(users);
            form.reset();
            saveButton.classList.remove('d-none'); // Ensure Save button is shown again
            updateButton.classList.add('d-none'); // Ensure Update button is hidden
        });
    }

    function updateUser(user) {
        fetch(`/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            users = users.map(u => u.id === data.id ? data : u);
            displayUsers(users);
            form.reset();
            document.getElementById('user-id').value = '';
            saveButton.classList.remove('d-none'); // Ensure Save button is shown again
            updateButton.classList.add('d-none'); // Ensure Update button is hidden
        })
        .catch(error => console.error('Update error:', error));
    }

    function displayUsers(users) {
        const tableBody = document.getElementById('user-table-body');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.password}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editUser('${user.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    window.editUser = function(id) {
        const user = users.find(u => u.id === id);

        document.getElementById('username').value = user.username;
        document.getElementById('password').value = user.password;
        document.getElementById('email').value = user.email;
        document.getElementById('user-id').value = user.id;

        saveButton.classList.add('d-none'); // Hide Save button
        updateButton.classList.remove('d-none'); // Show Update button
    };

    window.deleteUser = function(id) {
        fetch(`/users/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            users = users.filter(u => u.id !== id);
            displayUsers(users);
        });
    };
});
