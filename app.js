// Load users and tasks from local storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let tasks = [];

// Handle dark mode toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
}

// Initialize the app based on user status
window.onload = function () {
    if (currentUser) {
        loadUserTasks();
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('task-form-section').style.display = 'block';
        document.getElementById('filters').style.display = 'block';
        document.getElementById('task-list-section').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'inline';
    } else {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('task-form-section').style.display = 'none';
        document.getElementById('filters').style.display = 'none';
        document.getElementById('task-list-section').style.display = 'none';
    }
}

// Sign up a new user
function signUp() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Please enter a username and password.');
        return;
    }

    if (users.find(user => user.username === username)) {
        alert('Username already exists.');
        return;
    }

    const newUser = { username, password, tasks: [] };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Sign-up successful! Please log in.');
}

// Log in an existing user
function logIn() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        alert('Invalid username or password.');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    loadUserTasks();
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('task-form-section').style.display = 'block';
    document.getElementById('filters').style.display = 'block';
    document.getElementById('task-list-section').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'inline';
}

// Load tasks for the current user
function loadUserTasks() {
    tasks = currentUser.tasks || [];
    displayTasks();
}

// Log out the user
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// Add a new task for the current user
function addTask() {
    const title = document.getElementById('task-title').value.trim();
    const category = document.getElementById('task-category').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;
    const progress = document.getElementById('task-progress').value;

    if (!title || !category || !priority || !progress) {
        alert('Please fill out all required fields.');
        return;
    }

    const task = { title, category, dueDate, priority, progress };
    tasks.push(task);
    currentUser.tasks = tasks;
    localStorage.setItem('users', JSON.stringify(users));
    displayTasks();
}

// Display tasks for the current user
function displayTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${task.title}</strong> 
                <span>(${task.category}, ${task.dueDate || 'No Due Date'})</span>
                <br>
                Priority: ${task.priority} | Progress: ${task.progress}
            </div>
            <button onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

// Delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    currentUser.tasks = tasks;
    localStorage.setItem('users', JSON.stringify(users));
    displayTasks();
}

// Filter tasks based on category, priority, or progress
function filterTasks() {
    const filterCategory = document.getElementById('filter-category').value;
    const filterPriority = document.getElementById('filter-priority').value;
    const filterProgress = document.getElementById('filter-progress').value;

    const filteredTasks = tasks.filter(task => {
        return (filterCategory === '' || task.category === filterCategory) &&
               (filterPriority === '' || task.priority === filterPriority) &&
               (filterProgress === '' || task.progress === filterProgress);
    });

    displayTasks(filteredTasks);
}
