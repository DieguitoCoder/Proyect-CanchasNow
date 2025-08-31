// Bookings data and management system for CanchasYa platform

// Sample booking data structure (this would typically come from a database)
let mockBookings = [
    {
        id: 'BKG1705321200001',
        courtId: 'La del Pibe',
        userId: 6,
        date: '2025-01-20',
        time: '18:00',
        duration: 2,
        status: 'confirmed',
        pricing: {
            basePrice: 25,
            subtotal: 50,
            services: 15,
            tax: 6.5,
            total: 71.5
        },
        additionalServices: [
            { name: 'Ball Rental', price: 5 },
            { name: 'Referee Service', price: 25 }
        ],
        playerInfo: {
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+57 300 111 2233'
        },
        paymentInfo: {
            method: 'visa',
            status: 'paid',
            transactionId: 'TXN_123456789'
        },
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T10:30:00Z',
        specialRequests: 'Need extra balls for training session'
    },
    {
        id: 'BKG1705321200002',
        courtId: 'La Patiada',
        userId: 7,
        date: '2025-01-21',
        time: '19:00',
        duration: 1,
        status: 'confirmed',
        pricing: {
            basePrice: 30,
            subtotal: 30,
            services: 10,
            tax: 4,
            total: 44
        },
        additionalServices: [
            { name: 'Equipment Rental', price: 10 }
        ],
        playerInfo: {
            name: 'Maria Garcia',
            email: 'maria.garcia@email.com',
            phone: '+57 301 222 3344'
        },
        paymentInfo: {
            method: 'nequi',
            status: 'paid',
            transactionId: 'NEQ_987654321'
        },
        createdAt: '2025-01-15T11:15:00Z',
        updatedAt: '2025-01-15T11:15:00Z',
        specialRequests: 'Tennis court preferred'
    },
    {
        id: 'BKG1705321200003',
        courtId: 'La Tiburona',
        userId: 6,
        date: '2025-01-22',
        time: '20:00',
        duration: 1,
        status: 'pending',
        pricing: {
            basePrice: 40,
            subtotal: 40,
            services: 20,
            tax: 6,
            total: 66
        },
        additionalServices: [
            { name: 'Video Recording', price: 20 }
        ],
        playerInfo: {
            name: 'Carlos Rodriguez',
            email: 'carlos.rodriguez@email.com',
            phone: '+57 302 333 4455'
        },
        paymentInfo: {
            method: 'efecty',
            status: 'pending',
            transactionId: 'EFE_456789123'
        },
        createdAt: '2025-01-15T14:20:00Z',
        updatedAt: '2025-01-15T14:20:00Z',
        specialRequests: 'Peak hour booking for team practice'
    }
];

// Booking management functions
const bookingManager = {
    
    // Get all bookings
    getAllBookings: function() {
        return [...mockBookings];
    },

    // Get booking by ID
    getBookingById: function(bookingId) {
        return mockBookings.find(booking => booking.id === bookingId);
    },

    // Get bookings for a specific court
    getBookingsForCourt: function(courtId, date = null) {
        let courtBookings = mockBookings.filter(booking => booking.courtId === courtId);
        
        if (date) {
            courtBookings = courtBookings.filter(booking => booking.date === date);
        }
        
        return courtBookings;
    },

    // Get bookings for a specific user
    getBookingsForUser: function(userId) {
        return mockBookings.filter(booking => booking.userId === userId);
    },

    // Get bookings by date range
    getBookingsByDateRange: function(startDate, endDate) {
        return mockBookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return bookingDate >= start && bookingDate <= end;
        });
    },

    // Get bookings by status
    getBookingsByStatus: function(status) {
        return mockBookings.filter(booking => booking.status === status);
    },

    // Create new booking
    createBooking: function(bookingData) {
        const newBooking = {
            id: this.generateBookingId(),
            ...bookingData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        mockBookings.push(newBooking);
        this.saveToStorage();
        return newBooking;
    },

    // Update existing booking
    updateBooking: function(bookingId, updateData) {
        const bookingIndex = mockBookings.findIndex(booking => booking.id === bookingId);
        
        if (bookingIndex === -1) {
            throw new Error('Booking not found');
        }
        
        mockBookings[bookingIndex] = {
            ...mockBookings[bookingIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        this.saveToStorage();
        return mockBookings[bookingIndex];
    },

    // Cancel booking
    cancelBooking: function(bookingId, reason = '') {
        return this.updateBooking(bookingId, { 
            status: 'cancelled', 
            cancellationReason: reason,
            cancelledAt: new Date().toISOString()
        });
    },

    // Confirm booking
    confirmBooking: function(bookingId) {
        return this.updateBooking(bookingId, { 
            status: 'confirmed',
            confirmedAt: new Date().toISOString()
        });
    },

    // Complete booking
    completeBooking: function(bookingId) {
        return this.updateBooking(bookingId, { 
            status: 'completed',
            completedAt: new Date().toISOString()
        });
    },

    // Delete booking
    deleteBooking: function(bookingId) {
        const bookingIndex = mockBookings.findIndex(booking => booking.id === bookingId);
        
        if (bookingIndex === -1) {
            throw new Error('Booking not found');
        }
        
        const deletedBooking = mockBookings.splice(bookingIndex, 1)[0];
        this.saveToStorage();
        return deletedBooking;
    },

    // Generate unique booking ID
    generateBookingId: function() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `BKG${timestamp}${random}`;
    },

    // Check if time slot is available
    isTimeSlotAvailable: function(courtId, date, time) {
        const existingBookings = this.getBookingsForCourt(courtId, date);
        return !existingBookings.some(booking => 
            booking.time === time && booking.status !== 'cancelled'
        );
    },

    // Get available time slots for a court on a specific date
    getAvailableTimeSlots: function(courtId, date, startHour = 6, endHour = 22) {
        const existingBookings = this.getBookingsForCourt(courtId, date);
        const availableSlots = [];
        
        for (let hour = startHour; hour < endHour; hour++) {
            const timeString = hour.toString().padStart(2, '0') + ':00';
            const isBooked = existingBookings.some(booking => 
                booking.time === timeString && booking.status !== 'cancelled'
            );
            
            if (!isBooked && !this.isTimeSlotInPast(date, timeString)) {
                availableSlots.push(timeString);
            }
        }
        
        return availableSlots;
    },

    // Check if time slot is in the past
    isTimeSlotInPast: function(date, time) {
        const now = new Date();
        const slotDateTime = new Date(`${date}T${time}:00`);
        return slotDateTime < now;
    },

    // Get booking statistics
    getBookingStatistics: function() {
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().toISOString().substring(0, 7);
        
        return {
            total: mockBookings.length,
            today: mockBookings.filter(booking => booking.date === today).length,
            thisMonth: mockBookings.filter(booking => booking.date.startsWith(thisMonth)).length,
            byStatus: {
                confirmed: mockBookings.filter(booking => booking.status === 'confirmed').length,
                pending: mockBookings.filter(booking => booking.status === 'pending').length,
                cancelled: mockBookings.filter(booking => booking.status === 'cancelled').length,
                completed: mockBookings.filter(booking => booking.status === 'completed').length
            },
            totalRevenue: mockBookings
                .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
                .reduce((sum, booking) => sum + (booking.pricing?.total || 0), 0),
            averageBookingValue: mockBookings
                .filter(booking => booking.pricing?.total)
                .reduce((sum, booking, index, arr) => sum + booking.pricing.total / arr.length, 0)
        };
    },

    // Get popular time slots
    getPopularTimeSlots: function() {
        const timeSlotCounts = {};
        
        mockBookings.forEach(booking => {
            const timeSlot = booking.time;
            timeSlotCounts[timeSlot] = (timeSlotCounts[timeSlot] || 0) + 1;
        });
        
        return Object.entries(timeSlotCounts)
            .sort(([,a], [,b]) => b - a)
            .map(([time, count]) => ({ time, count }));
    },

    // Save bookings to localStorage (in a real app, this would be database operations)
    saveToStorage: function() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('courtBookings', JSON.stringify(mockBookings));
        }
    },

    // Load bookings from localStorage
    loadFromStorage: function() {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem('courtBookings');
            if (stored) {
                try {
                    mockBookings = JSON.parse(stored);
                } catch (e) {
                    console.error('Error loading bookings from storage:', e);
                }
            }
        }
    },

    // Validate booking data
    validateBooking: function(bookingData) {
        const errors = [];
        
        if (!bookingData.courtId) errors.push('Court ID is required');
        if (!bookingData.userId) errors.push('User ID is required');
        if (!bookingData.date) errors.push('Date is required');
        if (!bookingData.time) errors.push('Time is required');
        if (!bookingData.duration || bookingData.duration < 1) errors.push('Duration must be at least 1 hour');
        
        // Check if date is not in the past
        const bookingDate = new Date(bookingData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (bookingDate < today) {
            errors.push('Cannot book for past dates');
        }
        
        // Check if time slot is available
        if (!this.isTimeSlotAvailable(bookingData.courtId, bookingData.date, bookingData.time)) {
            errors.push('Time slot is not available');
        }
        
        return errors;
    },

    // Calculate booking pricing
    calculateBookingPricing: function(courtId, date, duration, additionalServices = []) {
        const court = courts?.find(c => c.id === courtId);
        if (!court) throw new Error('Court not found');
        
        const bookingDate = new Date(date);
        const isWeekend = bookingDate.getDay() === 0 || bookingDate.getDay() === 6;
        
        let basePrice = isWeekend ? court.pricing.weekend : court.pricing.weekday;
        const subtotal = basePrice * duration;
        
        const servicesTotal = additionalServices.reduce((sum, service) => sum + service.price, 0);
        const tax = (subtotal + servicesTotal) * 0.10; // 10% tax
        const total = subtotal + servicesTotal + tax;
        
        return {
            basePrice,
            subtotal: Math.round(subtotal * 100) / 100,
            services: Math.round(servicesTotal * 100) / 100,
            tax: Math.round(tax * 100) / 100,
            total: Math.round(total * 100) / 100
        };
    }
};

// Initialize bookings from storage when the module loads
bookingManager.loadFromStorage();

// Global functions for backwards compatibility
function getBookingsForCourt(courtId, date) {
    return bookingManager.getBookingsForCourt(courtId, date);
}

function generateBookingId() {
    return bookingManager.generateBookingId();
}

function isSlotAvailable(courtId, date, time) {
    return bookingManager.isTimeSlotAvailable(courtId, date, time);
}

function isTimeSlotInPast(date, time) {
    return bookingManager.isTimeSlotInPast(date, time);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        bookings: mockBookings,
        bookingManager,
        getBookingsForCourt,
        generateBookingId,
        isSlotAvailable,
        isTimeSlotInPast
    };
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.bookings = mockBookings;
    window.bookingManager = bookingManager;
    window.getBookingsForCourt = getBookingsForCourt;
    window.generateBookingId = generateBookingId;
    window.isSlotAvailable = isSlotAvailable;
    window.isTimeSlotInPast = isTimeSlotInPast;
}
