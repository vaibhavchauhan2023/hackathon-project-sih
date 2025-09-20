// DOM Elements
const authForm = document.getElementById('authForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const toggleQuestion = document.getElementById('toggleQuestion');
const toggleLink = document.getElementById('toggleLink');
const message = document.getElementById('message');
const userInfo = document.getElementById('userInfo');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

let isLogin = true;

// Toggle between Login and Signup
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    
    if (isLogin) {
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        toggleQuestion.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign Up';
    } else {
        formTitle.textContent = 'Sign Up';
        submitBtn.textContent = 'Sign Up';
        toggleQuestion.textContent = 'Already have an account?';
        toggleLink.textContent = 'Login';
    }
    clearMessage();
});

// Handle Form Submission
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    
    try {
        submitBtn.textContent = 'Loading...';
        submitBtn.disabled = true;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (isLogin) {
                // Store token and show user info
                localStorage.setItem('token', data.token);
                showUserInfo(data.user);
                showMessage('Login successful!', 'success');
            } else {
                showMessage('Account created! Please check your email to verify.', 'success');
                // Switch to login form
                setTimeout(() => {
                    toggleLink.click();
                }, 2000);
            }
        } else {
            showMessage(data.error, 'error');
        }
    } catch (error) {
        showMessage('Something went wrong. Please try again.', 'error');
    } finally {
        submitBtn.textContent = isLogin ? 'Login' : 'Sign Up';
        submitBtn.disabled = false;
    }
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    hideUserInfo();
    authForm.reset();
    showMessage('Logged out successfully!', 'success');
});

// Utility functions
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
    message.style.display = 'block';
}

function clearMessage() {
    message.style.display = 'none';
    message.textContent = '';
}

function showUserInfo(user) {
    userEmail.textContent = `Email: ${user.email}`;
    userInfo.style.display = 'block';
    authForm.style.display = 'none';
}

function hideUserInfo() {
    userInfo.style.display = 'none';
    authForm.style.display = 'block';
}

// Check if user is already logged in
window.addEventListener('load', async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                showUserInfo(data.user);
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            localStorage.removeItem('token');
        }
    }
});
