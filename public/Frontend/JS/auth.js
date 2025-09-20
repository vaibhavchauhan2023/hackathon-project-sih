// Authentication Helper Functions

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Get current user data
    getCurrentUser() {
        return this.userData;
    }

    // Get auth token
    getToken() {
        return this.token;
    }

    // Redirect to login if not authenticated
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login';
            return false;
        }
        return true;
    }

    // Logout user
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.token = null;
        this.userData = {};
        window.location.href = '/login';
    }

    // Update user data
    updateUserData(newData) {
        this.userData = { ...this.userData, ...newData };
        localStorage.setItem('userData', JSON.stringify(this.userData));
    }

    // Make authenticated API requests
    async makeAuthenticatedRequest(url, options = {}) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                ...options.headers
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        
        // If token is invalid, redirect to login
        if (response.status === 401) {
            this.logout();
            throw new Error('Session expired');
        }

        return response;
    }
}

// Create global auth manager instance
window.authManager = new AuthManager();

// Auto-redirect to login if not authenticated (except on login page)
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login.html') || currentPath === '/login';
    
    if (!isLoginPage && !window.authManager.isAuthenticated()) {
        window.location.href = '/login';
    }
});

// Add logout functionality to any element with class 'logout-btn'
document.addEventListener('DOMContentLoaded', () => {
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                window.authManager.logout();
            }
        });
    });
});
