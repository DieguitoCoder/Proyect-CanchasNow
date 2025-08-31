// Authentication system for CanchasYa platform

// Mock user database
const mockUsers = [
    // Ejemplo de usuario OwnerCanchas (solo creado manualmente por admin)
    {
        id: 100,
        email: 'ownercanchas@canchasya.com',
        password: 'owner123',
        name: 'Dueño Canchas',
        role: 'ownercanchas',
        courtId: null
    },
    {
        id: 1,
        email: 'admin@ladelpibe.com',
        password: 'admin123',
        name: 'La del Pibe Admin',
        role: 'admin',
        courtId: 'La del Pibe'
    },
    {
        id: 2,
        email: 'admin@elitesports.com',
        password: 'admin123',
        name: 'La Patiada Admin',
        role: 'admin',
        courtId: 'La Patiada'
    },
    {
        id: 3,
        email: 'admin@championscourt.com',
        password: 'admin123',
        name: 'La Tiburona Admin',
        role: 'admin',
        courtId: 'La Tiburona'
    },
    {
        id: 4,
        email: 'admin@goldenfield.com',
        password: 'admin123',
        name: 'La 21 Futbol Club Admin',
        role: 'admin',
        courtId: 'La 21 Futbol Club'
    },
    {
        id: 5,
        email: 'admin@victoryarena.com',
        password: 'admin123',
        name: 'Cancha Brasileirao Admin',
        role: 'admin',
        courtId: 'Cancha Brasileirao'
    },
    {
        id: 6,
        email: 'user@canchasya.com',
        password: 'user123',
        name: 'John Doe',
        role: 'user',
        courtId: null
    },
    {
        id: 7,
        email: 'player@example.com',
        password: 'player123',
        name: 'Maria Garcia',
        role: 'user',
        courtId: null
    }
];

// Authentication functions
function authenticateUser(email, password) {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user session
        const userSession = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            courtId: user.courtId,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        localStorage.setItem('authToken', generateAuthToken(user.id));
        
        // Show success notification
        if (window.showNotification) {
            window.showNotification(`Welcome back, ${user.name}!`, 'success');
        }
    // Redirigir a index.html tras login para cualquier rol
    window.location.href = 'index.html';
    return userSession;
    }
    return null;
}

// Hacer globales las funciones para uso en window
window.getCurrentUser = getCurrentUser;
window.logout = logout;

function logout() {
    const currentUser = getCurrentUser();
    
    // Clear session data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    
    // Show logout notification
    if (window.showNotification && currentUser) {
        window.showNotification(`Goodbye, ${currentUser.name}!`, 'success');
    }
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function getCurrentUser() {
    const userSession = localStorage.getItem('currentUser');
    if (userSession) {
        try {
            return JSON.parse(userSession);
        } catch (e) {
            console.error('Error parsing user session:', e);
            return null;
        }
    }
    return null;
}

function isAuthenticated() {
    const user = getCurrentUser();
    const token = localStorage.getItem('authToken');
    return user && token && isValidToken(token);
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

function isCourtOwner(courtId) {
    const user = getCurrentUser();
    return user && user.role === 'admin' && user.courtId === courtId;
}

function requireAuth() {
    if (!isAuthenticated()) {
        if (window.showNotification) {
            window.showNotification('Please login to access this feature', 'error');
        }
        if (typeof openLoginModal === 'function') {
            openLoginModal();
        } else {
            window.location.href = 'login.html';
        }
        return false;
    }
    return true;
}

function requireAdmin() {
    if (!requireAuth()) return false;
    
    if (!isAdmin()) {
        if (window.showNotification) {
            window.showNotification('Admin access required', 'error');
        }
        return false;
    }
    return true;
}

// Token management
function generateAuthToken(userId) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2);
    return btoa(`${userId}:${timestamp}:${randomStr}`);
}

function isValidToken(token) {
    try {
        const decoded = atob(token);
        const [userId, timestamp] = decoded.split(':');
        const tokenAge = Date.now() - parseInt(timestamp);
        
        // Token expires after 24 hours
        return tokenAge < (24 * 60 * 60 * 1000);
    } catch (e) {
        return false;
    }
}

// User registration (mock)
function registerUser(userData) {
    const { email, password, name, phone } = userData;
    
    // Check if email already exists
    if (mockUsers.find(u => u.email === email)) {
        throw new Error('Email already registered');
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
    }
    
    // Validate password strength
    if (!isValidPassword(password)) {
        throw new Error('Password must be at least 6 characters long');
    }
    
    // Create new user
    const newUser = {
        id: mockUsers.length + 1,
        email,
        password,
        name,
        phone,
        role: 'user', // Solo puede ser user desde el front
        courtId: null,
        registrationDate: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    // Auto-login after registration
    return authenticateUser(email, password);
}

// Password reset (mock)
function requestPasswordReset(email) {
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
        throw new Error('Email not found');
    }
    
    // In a real app, this would send an email
    const resetToken = generateAuthToken(user.id);
    localStorage.setItem(`reset_${user.id}`, resetToken);
    
    if (window.showNotification) {
        window.showNotification('Password reset instructions sent to your email', 'success');
    }
    
    return true;
}

function resetPassword(resetToken, newPassword) {
    if (!isValidPassword(newPassword)) {
        throw new Error('Password must be at least 6 characters long');
    }
    
    // Find user by reset token (simplified)
    const user = mockUsers.find(u => {
        const storedToken = localStorage.getItem(`reset_${u.id}`);
        return storedToken === resetToken;
    });
    
    if (!user) {
        throw new Error('Invalid or expired reset token');
    }
    
    // Update password
    user.password = newPassword;
    
    // Clear reset token
    localStorage.removeItem(`reset_${user.id}`);
    
    if (window.showNotification) {
        window.showNotification('Password updated successfully', 'success');
    }
    
    return true;
}

// Validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password && password.length >= 6;
}

// Profile management
function updateProfile(profileData) {
    if (!requireAuth()) return false;
    
    const currentUser = getCurrentUser();
    const { name, phone, email } = profileData;
    
    // Find user in mock database
    const user = mockUsers.find(u => u.id === currentUser.id);
    if (!user) {
        throw new Error('User not found');
    }
    
    // Update user data
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email && email !== user.email) {
        if (mockUsers.find(u => u.email === email && u.id !== user.id)) {
            throw new Error('Email already in use');
        }
        user.email = email;
    }
    
    // Update session
    const updatedSession = { ...currentUser, name: user.name, email: user.email };
    localStorage.setItem('currentUser', JSON.stringify(updatedSession));
    
    if (window.showNotification) {
        window.showNotification('Profile updated successfully', 'success');
    }
    
    return true;
}

function changePassword(currentPassword, newPassword) {
    if (!requireAuth()) return false;
    
    const currentUser = getCurrentUser();
    const user = mockUsers.find(u => u.id === currentUser.id);
    
    if (!user || user.password !== currentPassword) {
        throw new Error('Current password is incorrect');
    }
    
    if (!isValidPassword(newPassword)) {
        throw new Error('New password must be at least 6 characters long');
    }
    
    user.password = newPassword;
    
    if (window.showNotification) {
        window.showNotification('Password changed successfully', 'success');
    }
    
    return true;
}

// Session management
function extendSession() {
    if (isAuthenticated()) {
        const user = getCurrentUser();
        localStorage.setItem('authToken', generateAuthToken(user.id));
        return true;
    }
    return false;
}

function getSessionTimeRemaining() {
    const token = localStorage.getItem('authToken');
    if (!token) return 0;
    
    try {
        const decoded = atob(token);
        const [, timestamp] = decoded.split(':');
        const tokenAge = Date.now() - parseInt(timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        return Math.max(0, maxAge - tokenAge);
    } catch (e) {
        return 0;
    }
}

// Auto-logout warning
function setupSessionWarning() {
    setInterval(() => {
        const timeRemaining = getSessionTimeRemaining();
        
        // Warn user 30 minutes before expiration
        if (timeRemaining > 0 && timeRemaining < (30 * 60 * 1000)) {
            if (confirm('Your session will expire soon. Would you like to extend it?')) {
                extendSession();
            }
        } else if (timeRemaining === 0) {
            logout();
        }
    }, 60000); // Check every minute
}

// Initialize session management
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (isAuthenticated()) {
            setupSessionWarning();
        }
    });
}

// Export for global use
window.auth = {
    authenticateUser,
    logout,
    getCurrentUser,
    isAuthenticated,
    isAdmin,
    isCourtOwner,
    requireAuth,
    requireAdmin,
    registerUser,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    changePassword,
    extendSession
};
