// Court card component for CanchasYa platform

function createCourtCard(court) {
    const card = document.createElement('div');
    card.className = 'court-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2';
    card.dataset.sportType = court.sport.toLowerCase();
    card.dataset.courtId = court.id;

    // Usar el id tal cual para la ruta del banner, apuntando a la carpeta real
    card.innerHTML = `
        <div class="relative">
            <img src="../../${court.images.banner}" 
                 alt="${court.name}" 
                 class="w-full h-48 object-cover"
                 onerror="this.src='../../assets/icons/logo.svg'; this.className='w-full h-48 object-contain bg-gray-100 p-8'">
            
            <div class="absolute top-3 left-3">
                <span class="sport-type px-3 py-1 text-xs font-semibold text-white rounded-full ${getSportBadgeColor(court.sport)}">
                    ${court.sport}
                </span>
            </div>
            
            <div class="absolute top-3 right-3">
                <button onclick="toggleFavorite('${court.id}')" 
                        class="favorite-btn w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
                        data-court-id="${court.id}">
                    <i class="fas fa-heart text-gray-400 favorite-icon" data-court-id="${court.id}"></i>
                </button>
            </div>
            
            <div class="absolute bottom-3 right-3">
                <div class="rating-display flex items-center bg-white bg-opacity-90 rounded-full px-2 py-1">
                    <i class="fas fa-star text-yellow-400 text-sm mr-1"></i>
                    <span class="text-sm font-semibold">${court.rating}</span>
                </div>
            </div>
        </div>
        
        <div class="p-6">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    ${court.name}
                </h3>
                <div class="availability-status">
                    ${getAvailabilityBadge(court.id)}
                </div>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                ${court.description}
            </p>
            
            <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                    <span class="truncate">${court.address}</span>
                </div>
                
                <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-clock mr-2 text-green-600"></i>
                    <span>${court.hours.open} - ${court.hours.close}</span>
                </div>
                
                <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-phone mr-2 text-purple-600"></i>
                    <span>${court.phone}</span>
                </div>
            </div>
            
            <div class="flex items-center justify-between mb-4">
                <div class="pricing-info">
                    <div class="text-sm text-gray-500">Starting from</div>
                    <div class="text-xl font-bold text-green-600">
                        $${Math.min(court.pricing.weekday, court.pricing.weekend)}
                        <span class="text-sm font-normal text-gray-500">/hour</span>
                    </div>
                </div>
                
                <div class="flex items-center space-x-1">
                    ${generateRatingStars(court.rating)}
                    <span class="text-sm text-gray-500 ml-1">(${court.reviews || 0})</span>
                </div>
            </div>
            
            <div class="features-list mb-4">
                <div class="flex flex-wrap gap-1">
                    ${court.features.slice(0, 3).map(feature => `
                        <span class="feature-tag px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            ${feature}
                        </span>
                    `).join('')}
                    ${court.features.length > 3 ? `
                        <span class="feature-tag px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +${court.features.length - 3} more
                        </span>
                    ` : ''}
                </div>
            </div>
            
            <div class="flex space-x-2">
                <button onclick="viewCourtDetails('${court.id}')" 
                        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-semibold">
                    View Details
                </button>
                <button onclick="quickBook('${court.id}')" 
                        class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 text-sm font-semibold">
                    Quick Book
                </button>
            </div>
        </div>
    `;

    // Add animations
    card.addEventListener('mouseenter', function () {
        this.classList.add('shadow-2xl');
    });

    card.addEventListener('mouseleave', function () {
        this.classList.remove('shadow-2xl');
    });

    // Update favorite status
    updateFavoriteStatus(court.id);

    return card;
}

function getSportBadgeColor(sport) {
    const colors = {
        'Football': 'bg-green-600',
        'Tennis': 'bg-red-600',
        'Basketball': 'bg-orange-600',
        'Multi-Sport': 'bg-purple-600',
        'Soccer': 'bg-yellow-600',
        'Volleyball': 'bg-blue-600'
    };
    return colors[sport] || 'bg-gray-600';
}

function getAvailabilityBadge(courtId) {
    // Mock availability check based on current time and court bookings
    const now = new Date();
    const currentHour = now.getHours();

    // Simple availability logic
    if (currentHour < 6 || currentHour > 22) {
        return '<span class="status-closed">Closed</span>';
    } else if (isCourtAvailableNow(courtId)) {
        return '<span class="status-available">Available</span>';
    } else {
        return '<span class="status-booked">Busy</span>';
    }
}

function isCourtAvailableNow(courtId) {
    // Check current bookings for the court
    const today = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    const currentTime = currentHour.toString().padStart(2, '0') + ':00';

    const todayBookings = getBookingsForCourt(courtId, today);
    return !todayBookings.some(booking =>
        booking.time === currentTime && booking.status === 'confirmed'
    );
}

function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHtml = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star text-yellow-400 text-sm"></i>';
    }

    // Half star
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt text-yellow-400 text-sm"></i>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star text-gray-300 text-sm"></i>';
    }

    return starsHtml;
}

function toggleFavorite(courtId) {
    if (!requireAuth()) return;

    const currentUser = getCurrentUser();
    const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.id}`) || '[]');
    const favoriteBtn = document.querySelector(`.favorite-btn[data-court-id="${courtId}"]`);
    const favoriteIcon = document.querySelector(`.favorite-icon[data-court-id="${courtId}"]`);

    if (favorites.includes(courtId)) {
        // Remove from favorites
        const index = favorites.indexOf(courtId);
        favorites.splice(index, 1);
        favoriteIcon.classList.remove('text-red-500');
        favoriteIcon.classList.add('text-gray-400');
        showNotification('Removed from favorites', 'success');
    } else {
        // Add to favorites
        favorites.push(courtId);
        favoriteIcon.classList.remove('text-gray-400');
        favoriteIcon.classList.add('text-red-500');
        showNotification('Added to favorites', 'success');
    }

    localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
}

function updateFavoriteStatus(courtId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.id}`) || '[]');
    const favoriteIcon = document.querySelector(`.favorite-icon[data-court-id="${courtId}"]`);

    if (favoriteIcon && favorites.includes(courtId)) {
        favoriteIcon.classList.remove('text-gray-400');
        favoriteIcon.classList.add('text-red-500');
    }
}

function viewCourtDetails(courtId) {
    // Redirigir correctamente desde views/website/index.html
    window.location.href = `../../courts/${courtId}.html`;
}

function quickBook(courtId) {
    window.location.href = 'login.html';
}

function createQuickBookModal(courtId) {
    const court = courts.find(c => c.id === courtId);
    if (!court) return null;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
    modal.id = 'quickBookModal';

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 modal-enter">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Quick Book</h2>
                <button onclick="closeQuickBookModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="mb-4">
                <h3 class="font-semibold text-gray-900 mb-2">${court.name}</h3>
                <p class="text-gray-600 text-sm">${court.address}</p>
            </div>
            
            <form onsubmit="processQuickBook(event, '${courtId}')">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Select Date</label>
                        <select id="quickBookDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="${today}">Today (${formatDate(today)})</option>
                            <option value="${tomorrowStr}">Tomorrow (${formatDate(tomorrowStr)})</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Preferred Time</label>
                        <select id="quickBookTime" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="">Select time</option>
                            ${generateTimeOptions()}
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Duration</label>
                        <select id="quickBookDuration" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="1">1 hour</option>
                            <option value="2">2 hours</option>
                            <option value="3">3 hours</option>
                        </select>
                    </div>
                    
                    <div class="bg-blue-50 rounded-lg p-3">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-700">Estimated cost:</span>
                            <span class="font-bold text-blue-600" id="quickBookEstimate">$${court.pricing.weekday}</span>
                        </div>
                    </div>
                </div>
                
                <div class="flex space-x-3 mt-6">
                    <button type="button" onclick="closeQuickBookModal()" 
                            class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-300">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                        Continue Booking
                    </button>
                </div>
            </form>
        </div>
    `;

    return modal;
}

function generateTimeOptions() {
    const options = [];
    for (let hour = 6; hour <= 22; hour++) {
        const timeString = hour.toString().padStart(2, '0') + ':00';
        options.push(`<option value="${timeString}">${timeString}</option>`);
    }
    return options.join('');
}

window.closeQuickBookModal = function () {
    const modal = document.getElementById('quickBookModal');
    if (modal) {
        modal.remove();
    }
}

window.processQuickBook = function (event, courtId) {
    event.preventDefault();

    const date = document.getElementById('quickBookDate').value;
    const time = document.getElementById('quickBookTime').value;
    const duration = parseInt(document.getElementById('quickBookDuration').value);

    if (!time) {
        showNotification('Please select a time', 'error');
        return;
    }

    // Check availability
    if (!isSlotAvailable(courtId, date, time)) {
        showNotification('Selected time slot is not available', 'error');
        return;
    }

    // Close modal and redirect to detailed booking
    closeQuickBookModal();

    // Store quick book data and redirect
    sessionStorage.setItem('quickBookData', JSON.stringify({
        courtId,
        date,
        time,
        duration
    }));

    window.location.href = `courts/${courtId}.html`;
}

// Court card filtering and sorting
function filterCourtCards(filters) {
    const courtCards = document.querySelectorAll('.court-card');

    courtCards.forEach(card => {
        let shouldShow = true;

        // Filter by sport
        if (filters.sport && filters.sport !== 'all') {
            const cardSport = card.dataset.sportType;
            if (cardSport !== filters.sport.toLowerCase()) {
                shouldShow = false;
            }
        }

        // Filter by price range
        if (filters.maxPrice) {
            const cardPrice = extractPriceFromCard(card);
            if (cardPrice > filters.maxPrice) {
                shouldShow = false;
            }
        }

        // Filter by rating
        if (filters.minRating) {
            const cardRating = extractRatingFromCard(card);
            if (cardRating < filters.minRating) {
                shouldShow = false;
            }
        }

        // Filter by availability
        if (filters.availableOnly) {
            const availabilityBadge = card.querySelector('.status-available');
            if (!availabilityBadge) {
                shouldShow = false;
            }
        }

        // Show/hide card
        if (shouldShow) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

function sortCourtCards(sortBy) {
    const container = document.getElementById('courts-grid');
    const cards = Array.from(container.querySelectorAll('.court-card'));

    cards.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                const nameA = a.querySelector('h3').textContent;
                const nameB = b.querySelector('h3').textContent;
                return nameA.localeCompare(nameB);

            case 'price-low':
                const priceA = extractPriceFromCard(a);
                const priceB = extractPriceFromCard(b);
                return priceA - priceB;

            case 'price-high':
                const priceA2 = extractPriceFromCard(a);
                const priceB2 = extractPriceFromCard(b);
                return priceB2 - priceA2;

            case 'rating':
                const ratingA = extractRatingFromCard(a);
                const ratingB = extractRatingFromCard(b);
                return ratingB - ratingA;

            default:
                return 0;
        }
    });

    // Re-append sorted cards
    cards.forEach(card => container.appendChild(card));
}

function extractPriceFromCard(card) {
    const priceElement = card.querySelector('.text-green-600');
    const priceText = priceElement.textContent.replace(/[^0-9.]/g, '');
    return parseFloat(priceText) || 0;
}

function extractRatingFromCard(card) {
    const ratingElement = card.querySelector('.rating-display span');
    return parseFloat(ratingElement.textContent) || 0;
}

// Initialize court card functionality
function initializeCourtCards() {
    // Update favorite statuses for all visible cards
    const currentUser = getCurrentUser();
    if (currentUser) {
        const courtCards = document.querySelectorAll('.court-card');
        courtCards.forEach(card => {
            const courtId = card.dataset.courtId;
            updateFavoriteStatus(courtId);
        });
    }

    // Setup card animations
    setupCourtCardAnimations();
}

function setupCourtCardAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.court-card').forEach(card => {
        observer.observe(card);
    });
}

// Export for global use
window.courtCardUtils = {
    createCourtCard,
    toggleFavorite,
    viewCourtDetails,
    quickBook,
    filterCourtCards,
    sortCourtCards
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initializeCourtCards);
