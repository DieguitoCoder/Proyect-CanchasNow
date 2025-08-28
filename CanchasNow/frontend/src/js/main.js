// Main application initialization and global functions
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadCourts();
    setupEventListeners();
    checkAuthStatus();
});

// Initialize the application
function initializeApp() {
    console.log('CanchasYa Platform Initialized');
    
    // Add loading animation to body
    document.body.classList.add('fade-in');
    
    // Initialize tooltips and other UI elements
    initializeUIComponents();
    
    // Set up smooth scrolling for navigation links
    setupSmoothScrolling();
}

// Setup smooth scrolling for navigation
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Load and display courts
function loadCourts() {
    const courtsGrid = document.getElementById('courts-grid');
    if (!courtsGrid) return;
    
    // Clear existing content
    courtsGrid.innerHTML = '';
    
    // Load courts data
    courts.forEach((court, index) => {
        setTimeout(() => {
            const courtCard = createCourtCard(court);
            courtsGrid.appendChild(courtCard);
            courtCard.classList.add('slide-up');
        }, index * 100); // Staggered animation
    });
}

// Initialize UI components
function initializeUIComponents() {
    // Initialize mobile menu
    setupMobileMenu();
    
    // Initialize search functionality
    setupSearch();
    
    // Initialize filters
    setupFilters();
    
    // Setup notification system
    setupNotifications();
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('[onclick="toggleMobileMenu()"]');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('court-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterCourts(searchTerm);
    });
}

// Filter courts based on search term
function filterCourts(searchTerm) {
    const courtCards = document.querySelectorAll('.court-card');
    
    courtCards.forEach(card => {
        const courtName = card.querySelector('h3').textContent.toLowerCase();
        const courtType = card.querySelector('.court-type').textContent.toLowerCase();
        
        if (courtName.includes(searchTerm) || courtType.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

// Setup filters
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            applyFilter(filterType);
        });
    });
}

// Apply filter to courts
function applyFilter(filterType) {
    const courtCards = document.querySelectorAll('.court-card');
    
    courtCards.forEach(card => {
        if (filterType === 'all') {
            card.style.display = 'block';
        } else {
            const cardType = card.dataset.sportType;
            if (cardType === filterType) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Setup notification system
function setupNotifications() {
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        // Allow manual close
        notification.addEventListener('click', () => {
            notification.remove();
        });
    };
}

// Setup global event listeners
function setupEventListeners() {
    // Handle form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmission);
    });
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Handle scroll events
    window.addEventListener('scroll', handleScroll);
}

// Handle form submissions
function handleFormSubmission(e) {
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="spinner"></div> Processing...';
        
        // Re-enable button after 3 seconds (for demo purposes)
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = submitButton.dataset.originalText || 'Submit';
        }, 3000);
    }
}

// Handle window resize
function handleResize() {
    // Adjust mobile menu on resize
    const mobileMenu = document.getElementById('mobile-menu');
    if (window.innerWidth >= 768 && mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}

// Handle scroll events
function handleScroll() {
    // Add scroll effects
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.parallax');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
    
    // Show/hide back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        if (scrolled > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.querySelector('.bg-white').classList.add('modal-enter');
        
        // Focus on first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.querySelector('.bg-white').classList.add('modal-exit');
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modal.querySelector('.bg-white').classList.remove('modal-enter', 'modal-exit');
        }, 300);
    }
}

// Check authentication status
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    const loginButton = document.querySelector('button[onclick="openLoginModal()"]');
    
    if (currentUser && loginButton) {
        loginButton.textContent = `Welcome, ${currentUser.name}`;
        loginButton.onclick = null;
        loginButton.classList.add('cursor-default');
        
        // Add logout functionality
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.className = 'ml-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300';
        logoutBtn.onclick = logout;
        loginButton.parentNode.appendChild(logoutBtn);
    }
}

// Animation utilities
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Intersection Observer for scroll animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', setupScrollAnimations);

// Export functions for global use
window.CanchasYa = {
    scrollToSection,
    toggleMobileMenu,
    openLoginModal,
    closeLoginModal,
    showNotification: window.showNotification,
    animateCounter
};
