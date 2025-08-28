// Header component functionality for CanchasYa platform

function initializeHeader() {
    setupMobileNavigation();
    setupUserMenu();
    setupScrollEffects();
    updateNavigationState();
}

function setupMobileNavigation() {
    const mobileMenuButton = document.querySelector('[onclick="toggleMobileMenu()"]');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', function(e) {
        e.preventDefault();
        mobileMenu.classList.toggle('hidden');
        
        // Update hamburger icon
        const icon = this.querySelector('i');
        if (icon) {
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-gray-700';
            } else {
                icon.className = 'fas fa-times text-gray-700';
            }
        }
    });
    
    // Close mobile menu when clicking menu items
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars text-gray-700';
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars text-gray-700';
            }
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars text-gray-700';
            }
        }
    });
}

function setupUserMenu() {
    const currentUser = getCurrentUser();
    const loginButton = document.querySelector('button[onclick="openLoginModal()"]');
    
    if (!loginButton) return;
    
    if (currentUser) {
        updateHeaderForLoggedInUser(currentUser, loginButton);
    } else {
        updateHeaderForGuest(loginButton);
    }
}

function updateHeaderForLoggedInUser(user, loginButton) {
    // Create user menu dropdown
    const userMenu = document.createElement('div');
    userMenu.className = 'relative inline-block text-left';
    userMenu.innerHTML = `
        <button onclick="toggleUserMenu()" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-300">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">${user.name.charAt(0).toUpperCase()}</span>
            </div>
            <span class="hidden md:inline">${user.name}</span>
            <i class="fas fa-chevron-down text-sm"></i>
        </button>
        
        <div id="userDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
            <div class="py-1">
                ${user.role === 'admin' ? `
                    <a href="admin.html" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i class="fas fa-cog mr-3"></i>
                        Admin Dashboard
                    </a>
                ` : ''}
                <a href="#" onclick="openProfile()" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-user mr-3"></i>
                    My Profile
                </a>
                <a href="#" onclick="openBookings()" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-calendar-alt mr-3"></i>
                    My Bookings
                </a>
                <a href="#" onclick="openSettings()" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i class="fas fa-cogs mr-3"></i>
                    Settings
                </a>
                <div class="border-t border-gray-100"></div>
                <button onclick="logout()" class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    <i class="fas fa-sign-out-alt mr-3"></i>
                    Logout
                </button>
            </div>
        </div>
    `;
    
    // Replace login button with user menu
    loginButton.parentNode.replaceChild(userMenu, loginButton);
}

function updateHeaderForGuest(loginButton) {
    // Ensure login button works correctly
    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        openLoginModal();
    });
}

window.toggleUserMenu = function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

window.openProfile = function() {
    showNotification('Profile page coming soon', 'info');
}

window.openBookings = function() {
    showNotification('My Bookings page coming soon', 'info');
}

window.openSettings = function() {
    showNotification('Settings page coming soon', 'info');
}

function setupScrollEffects() {
    const header = document.querySelector('nav');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove shadow based on scroll position
        if (currentScroll > 10) {
            header.classList.add('shadow-lg');
            header.classList.remove('shadow-md');
        } else {
            header.classList.add('shadow-md');
            header.classList.remove('shadow-lg');
        }
        
        // Hide/show header on scroll (optional - commented out for better UX)
        /*
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down & past header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        */
        
        lastScroll = currentScroll;
    });
}

function updateNavigationState() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a[href]');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Handle hash links
        if (href.startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToSection(href.substring(1));
            });
        } else if (href === currentPath || href === `./${currentPath.split('/').pop()}`) {
            // Add active class to current page link
            link.classList.add('text-blue-600', 'font-semibold');
            link.classList.remove('text-gray-700');
        }
    });
}

// Notification system integration
function setupHeaderNotifications() {
    // Check for system notifications
    checkSystemNotifications();
    
    // Setup notification bell (if exists)
    const notificationBell = document.getElementById('notificationBell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            toggleNotificationPanel();
        });
    }
}

function checkSystemNotifications() {
    // Check for maintenance notifications
    const maintenanceNotice = localStorage.getItem('maintenanceNotice');
    if (maintenanceNotice) {
        const notice = JSON.parse(maintenanceNotice);
        if (new Date(notice.endDate) > new Date()) {
            showMaintenanceNotification(notice);
        }
    }
    
    // Check for user-specific notifications
    const currentUser = getCurrentUser();
    if (currentUser) {
        checkUserNotifications(currentUser.id);
    }
}

function showMaintenanceNotification(notice) {
    const maintenanceBar = document.createElement('div');
    maintenanceBar.className = 'bg-yellow-500 text-white px-4 py-2 text-center text-sm';
    maintenanceBar.innerHTML = `
        <i class="fas fa-exclamation-triangle mr-2"></i>
        ${notice.message}
        <button onclick="this.parentNode.remove()" class="ml-4 text-yellow-200 hover:text-white">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.insertBefore(maintenanceBar, document.body.firstChild);
    
    // Adjust body padding to account for notification bar
    document.body.style.paddingTop = (document.body.style.paddingTop || 0) + 40 + 'px';
}

function checkUserNotifications(userId) {
    // Mock notification check
    const notifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (unreadCount > 0) {
        updateNotificationBadge(unreadCount);
    }
}

function updateNotificationBadge(count) {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    }
}

// Search functionality
function setupHeaderSearch() {
    const searchInput = document.getElementById('headerSearch');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performHeaderSearch(query);
        }, 300);
    });
    
    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults?.contains(e.target)) {
            hideSearchResults();
        }
    });
}

function performHeaderSearch(query) {
    // Search through courts
    const results = courts.filter(court => 
        court.name.toLowerCase().includes(query.toLowerCase()) ||
        court.sport.toLowerCase().includes(query.toLowerCase()) ||
        court.location.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="p-4 text-gray-500">No courts found</div>';
    } else {
        searchResults.innerHTML = results.map(court => `
            <a href="courts/${court.id}.html" class="flex items-center p-3 hover:bg-gray-50 border-b">
                <div class="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                    <i class="fas fa-${getSportIcon(court.sport)} text-gray-600"></i>
                </div>
                <div>
                    <div class="font-semibold text-gray-900">${court.name}</div>
                    <div class="text-sm text-gray-600">${court.sport} • ${court.location}</div>
                </div>
            </a>
        `).join('');
    }
    
    searchResults.classList.remove('hidden');
}

function hideSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.classList.add('hidden');
    }
}

function getSportIcon(sport) {
    const icons = {
        'football': 'futbol',
        'basketball': 'basketball-ball',
        'tennis': 'table-tennis',
        'volleyball': 'volleyball-ball',
        'multi-sport': 'running'
    };
    return icons[sport.toLowerCase()] || 'circle';
}

// Language switcher
function setupLanguageSwitcher() {
    const languageSwitcher = document.getElementById('languageSwitcher');
    if (!languageSwitcher) return;
    
    languageSwitcher.addEventListener('change', function() {
        const selectedLanguage = this.value;
        switchLanguage(selectedLanguage);
    });
}

function switchLanguage(language) {
    // Store language preference
    localStorage.setItem('preferredLanguage', language);
    
    // In a real app, this would reload the page with new language
    showNotification(`Language changed to ${language}`, 'success');
}

// Initialize header when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    setupHeaderNotifications();
    setupHeaderSearch();
    setupLanguageSwitcher();
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    // Close user dropdown
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown && !e.target.closest('.relative')) {
        userDropdown.classList.add('hidden');
    }
});

// Export for global use
window.headerUtils = {
    updateNavigationState,
    toggleUserMenu,
    setupScrollEffects,
    updateNotificationBadge
};
