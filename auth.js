// Local Storage Keys
const USERS_KEY = 'shopease_users';
const CURRENT_USER_KEY = 'shopease_current_user';

// Initialize local storage with empty users array if it doesn't exist
if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
}

// Helper Functions
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY));
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email === email);
}

function showMessage(message, isError = false) {
    alert(message); // For simplicity, using alert. You can replace with custom UI notification
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = findUserByEmail(email);

        if (!user) {
            showMessage('User not found', true);
            return;
        }

        if (user.password !== password) {
            showMessage('Incorrect password', true);
            return;
        }

        // Store current user session
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
            name: user.name,
            email: user.email
        }));

        showMessage('Login successful!');
        window.location.href = 'index.html';
    });
}

// Handle Signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', true);
            return;
        }

        if (findUserByEmail(email)) {
            showMessage('Email already registered', true);
            return;
        }

        // Save new user
        const users = getUsers();
        users.push({
            name,
            email,
            password
        });
        saveUsers(users);

        showMessage('Registration successful!');
        window.location.href = 'login.html';
    });
}

// Check Authentication Status
function checkAuth() {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    const authBtns = document.querySelectorAll('.auth-btn');

    if (currentUser) {
        // User is logged in
        const user = JSON.parse(currentUser);
        authBtns.forEach(btn => {
            if (btn.textContent === 'Login' || btn.textContent === 'Sign Up') {
                btn.style.display = 'none';
            }
        });
    } else {
        // User is not logged in
        authBtns.forEach(btn => {
            btn.style.display = 'inline-block';
        });
    }
}

// Logout Function
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'login.html';
}

// Initialize auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);