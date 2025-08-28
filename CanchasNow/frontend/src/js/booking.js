// Booking system for CanchasYa platform

// Booking management functions
function initializeBookingSystem() {
    setupBookingForm();
    setupTimeSlots();
    setupPricingCalculator();
    loadAvailableSlots();
}

function setupBookingForm() {
    const bookingForms = document.querySelectorAll('form[onsubmit*="handleBooking"]');
    
    bookingForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            processBooking(this);
        });
    });
}

function processBooking(form) {
    if (!requireAuth()) return;
    
    const formData = new FormData(form);
    const bookingData = {
        courtId: getCurrentCourtId(),
        date: formData.get('date') || document.getElementById('bookingDate')?.value,
        time: getSelectedTimeSlot(),
        duration: formData.get('duration') || 1,
        additionalServices: getSelectedServices(),
        specialRequests: formData.get('requests') || '',
        userId: getCurrentUser().id,
        timestamp: new Date().toISOString()
    };
    
    if (!validateBookingData(bookingData)) {
        return;
    }
    
    // Check availability
    if (!isSlotAvailable(bookingData.courtId, bookingData.date, bookingData.time)) {
        showNotification('Selected time slot is no longer available', 'error');
        return;
    }
    
    // Calculate total price
    const pricing = calculateBookingPrice(bookingData);
    bookingData.pricing = pricing;
    
    // Show booking confirmation
    showBookingConfirmation(bookingData);
}

function validateBookingData(data) {
    if (!data.date) {
        showNotification('Please select a date', 'error');
        return false;
    }
    
    if (!data.time) {
        showNotification('Please select a time slot', 'error');
        return false;
    }
    
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Cannot book for past dates', 'error');
        return false;
    }
    
    // Check if booking is too far in advance (e.g., 3 months)
    const maxAdvanceDate = new Date();
    maxAdvanceDate.setMonth(maxAdvanceDate.getMonth() + 3);
    
    if (selectedDate > maxAdvanceDate) {
        showNotification('Cannot book more than 3 months in advance', 'error');
        return false;
    }
    
    return true;
}

function getCurrentCourtId() {
    // Extract court ID from URL or page data
    const path = window.location.pathname;
    if (path.includes('/courts/')) {
        return path.split('/courts/')[1].replace('.html', '');
    }
    return null;
}

function getSelectedTimeSlot() {
    const selectedSlot = document.querySelector('.time-slot.bg-blue-600, .time-slot.bg-green-600, .time-slot.bg-yellow-600, .time-slot.bg-orange-600, .time-slot.bg-red-600, .time-slot.bg-purple-600');
    return selectedSlot ? selectedSlot.textContent.trim().split('\n')[0] : null;
}

function getSelectedServices() {
    const services = [];
    const serviceCheckboxes = document.querySelectorAll('.service-checkbox:checked');
    
    serviceCheckboxes.forEach(checkbox => {
        services.push({
            name: checkbox.dataset.serviceName,
            price: parseFloat(checkbox.dataset.servicePrice)
        });
    });
    
    return services;
}

function calculateBookingPrice(bookingData) {
    const courtId = bookingData.courtId;
    const court = courts.find(c => c.id === courtId);
    
    if (!court) {
        throw new Error('Court not found');
    }
    
    let basePrice = court.pricing.weekday;
    
    // Check if it's weekend
    const bookingDate = new Date(bookingData.date);
    const isWeekend = bookingDate.getDay() === 0 || bookingDate.getDay() === 6;
    
    if (isWeekend && court.pricing.weekend) {
        basePrice = court.pricing.weekend;
    }
    
    // Check for peak hours
    const hour = parseInt(bookingData.time.split(':')[0]);
    if (court.pricing.peakHours && hour >= court.pricing.peakHours.start && hour <= court.pricing.peakHours.end) {
        basePrice = court.pricing.peakHours.rate;
    }
    
    const subtotal = basePrice * bookingData.duration;
    
    // Add services
    const servicesTotal = bookingData.additionalServices.reduce((total, service) => {
        return total + service.price;
    }, 0);
    
    // Calculate taxes (10% IVA)
    const tax = (subtotal + servicesTotal) * 0.10;
    const total = subtotal + servicesTotal + tax;
    
    return {
        basePrice,
        subtotal,
        services: servicesTotal,
        tax,
        total: Math.round(total * 100) / 100
    };
}

function isSlotAvailable(courtId, date, time) {
    // Check against existing bookings
    const existingBookings = getBookingsForCourt(courtId, date);
    return !existingBookings.some(booking => 
        booking.time === time && booking.status !== 'cancelled'
    );
}

function getBookingsForCourt(courtId, date) {
    // Get bookings from local storage or mock data
    const allBookings = JSON.parse(localStorage.getItem('courtBookings') || '[]');
    return allBookings.filter(booking => 
        booking.courtId === courtId && booking.date === date
    );
}

function showBookingConfirmation(bookingData) {
    const modal = createBookingConfirmationModal(bookingData);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }, 100);
}

function createBookingConfirmationModal(bookingData) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
    modal.id = 'bookingConfirmationModal';
    
    const court = courts.find(c => c.id === bookingData.courtId);
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 modal-enter">
            <div class="text-center mb-6">
                <i class="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-900">Confirm Booking</h2>
            </div>
            
            <div class="space-y-4 mb-6">
                <div class="flex justify-between">
                    <span class="text-gray-600">Court:</span>
                    <span class="font-semibold">${court.name}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Date:</span>
                    <span class="font-semibold">${formatDate(bookingData.date)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Time:</span>
                    <span class="font-semibold">${bookingData.time}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Duration:</span>
                    <span class="font-semibold">${bookingData.duration} hour(s)</span>
                </div>
                ${bookingData.additionalServices.length > 0 ? `
                <div class="border-t pt-2">
                    <span class="text-gray-600">Additional Services:</span>
                    ${bookingData.additionalServices.map(service => `
                        <div class="flex justify-between text-sm">
                            <span>${service.name}</span>
                            <span>$${service.price}</span>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                <div class="border-t pt-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Subtotal:</span>
                        <span>$${bookingData.pricing.subtotal}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Services:</span>
                        <span>$${bookingData.pricing.services}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Tax (10%):</span>
                        <span>$${bookingData.pricing.tax}</span>
                    </div>
                    <div class="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>$${bookingData.pricing.total}</span>
                    </div>
                </div>
            </div>
            
            <div class="flex space-x-3">
                <button onclick="cancelBookingConfirmation()" 
                        class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-300">
                    Cancel
                </button>
                <button onclick="confirmBooking(${JSON.stringify(bookingData).replace(/"/g, '&quot;')})" 
                        class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300">
                    Confirm & Pay
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

function cancelBookingConfirmation() {
    const modal = document.getElementById('bookingConfirmationModal');
    if (modal) {
        modal.remove();
    }
}

function confirmBooking(bookingData) {
    // Save booking
    saveBooking(bookingData);
    
    // Close confirmation modal
    cancelBookingConfirmation();
    
    // Open payment modal
    openPaymentModal(bookingData);
}

function saveBooking(bookingData) {
    const bookings = JSON.parse(localStorage.getItem('courtBookings') || '[]');
    
    const booking = {
        id: generateBookingId(),
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    localStorage.setItem('courtBookings', JSON.stringify(bookings));
    
    return booking;
}

function generateBookingId() {
    return 'BKG' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase();
}

function openPaymentModal(bookingData) {
    // This will be handled by the payments.js module
    if (typeof initializePaymentModal === 'function') {
        initializePaymentModal(bookingData);
    }
}

// Time slot management
function generateTimeSlots(startHour = 6, endHour = 22, interval = 60) {
    const slots = [];
    
    for (let hour = startHour; hour <= endHour; hour++) {
        const timeString = hour.toString().padStart(2, '0') + ':00';
        slots.push({
            time: timeString,
            available: true,
            price: null // Will be calculated based on court and time
        });
    }
    
    return slots;
}

function loadAvailableSlots() {
    const dateInput = document.getElementById('bookingDate');
    const timeSlotsContainer = document.getElementById('timeSlots');
    
    if (!dateInput || !timeSlotsContainer) return;
    
    dateInput.addEventListener('change', function() {
        updateAvailableSlots(this.value);
    });
    
    // Load initial slots for today
    if (dateInput.value) {
        updateAvailableSlots(dateInput.value);
    }
}

function updateAvailableSlots(date) {
    const courtId = getCurrentCourtId();
    const existingBookings = getBookingsForCourt(courtId, date);
    const timeSlotsContainer = document.getElementById('timeSlots');
    
    if (!timeSlotsContainer) return;
    
    const slots = generateTimeSlots();
    
    timeSlotsContainer.innerHTML = slots.map(slot => {
        const isBooked = existingBookings.some(booking => 
            booking.time === slot.time && booking.status !== 'cancelled'
        );
        
        const isPast = isTimeSlotInPast(date, slot.time);
        const isDisabled = isBooked || isPast;
        
        return `
            <button type="button" 
                    onclick="${isDisabled ? '' : `selectTimeSlot('${slot.time}')`}"
                    class="time-slot px-3 py-2 border rounded-lg text-sm transition duration-200 ${
                        isDisabled 
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                    }"
                    ${isDisabled ? 'disabled' : ''}>
                ${slot.time}${isBooked ? '<br><span class="text-xs">Booked</span>' : ''}
            </button>
        `;
    }).join('');
}

function isTimeSlotInPast(date, time) {
    const now = new Date();
    const slotDateTime = new Date(`${date}T${time}:00`);
    return slotDateTime < now;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Initialize booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBookingSystem);

// Export for global use
window.booking = {
    processBooking,
    calculateBookingPrice,
    isSlotAvailable,
    generateTimeSlots,
    updateAvailableSlots,
    confirmBooking,
    cancelBookingConfirmation
};
