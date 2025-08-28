// Booking table component for CanchasYa platform

function createBookingTable(courtId, date) {
    const court = courts.find(c => c.id === courtId);
    if (!court) return null;
    
    const table = document.createElement('div');
    table.className = 'booking-table bg-white rounded-lg shadow-lg overflow-hidden';
    table.id = 'bookingTable';
    
    const openHour = parseInt(court.hours.open.split(':')[0]);
    const closeHour = parseInt(court.hours.close.split(':')[0]);
    
    table.innerHTML = `
        <div class="booking-table-header bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-xl font-bold">${court.name} - Availability</h3>
                    <p class="text-blue-100">${formatDate(date)}</p>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                        <span class="text-sm">Available</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                        <span class="text-sm">Booked</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                        <span class="text-sm">Maintenance</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="booking-table-controls p-4 bg-gray-50 border-b">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <button onclick="changeBookingDate('prev')" class="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition duration-200">
                        <i class="fas fa-chevron-left mr-2"></i>
                        Previous Day
                    </button>
                    <input type="date" id="bookingTableDate" value="${date}" onchange="updateBookingTable()" 
                           class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                    <button onclick="changeBookingDate('next')" class="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition duration-200">
                        Next Day
                        <i class="fas fa-chevron-right ml-2"></i>
                    </button>
                </div>
                
                <div class="flex items-center space-x-2">
                    <select id="viewMode" onchange="changeViewMode()" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                        <option value="hourly">Hourly View</option>
                        <option value="daily">Daily Overview</option>
                        <option value="weekly">Weekly View</option>
                    </select>
                    <button onclick="refreshBookingTable()" class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="booking-table-content">
            <div id="hourlyView" class="p-6">
                ${generateHourlyTimeSlots(courtId, date, openHour, closeHour)}
            </div>
        </div>
        
        <div class="booking-table-footer p-4 bg-gray-50 border-t">
            <div class="flex items-center justify-between text-sm text-gray-600">
                <div>
                    <span class="font-semibold">${getAvailableSlots(courtId, date)}</span> slots available
                </div>
                <div>
                    Base rate: <span class="font-semibold text-green-600">$${court.pricing.weekday}/hour</span>
                </div>
            </div>
        </div>
    `;
    
    return table;
}

function generateHourlyTimeSlots(courtId, date, openHour, closeHour) {
    const existingBookings = getBookingsForCourt(courtId, date);
    const maintenanceSlots = getMaintenanceSlots(courtId, date);
    const court = courts.find(c => c.id === courtId);
    
    let slotsHtml = '<div class="grid gap-3">';
    
    for (let hour = openHour; hour < closeHour; hour++) {
        const timeString = hour.toString().padStart(2, '0') + ':00';
        const endTimeString = (hour + 1).toString().padStart(2, '0') + ':00';
        
        const isBooked = existingBookings.some(booking => 
            booking.time === timeString && booking.status !== 'cancelled'
        );
        
        const isMaintenance = maintenanceSlots.includes(timeString);
        const isPast = isTimeSlotInPast(date, timeString);
        
        let slotClass = 'time-slot-row p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200';
        let slotStatus = 'available';
        let price = getTimeSlotPrice(court, date, hour);
        let statusIcon = '<i class="fas fa-check-circle text-green-500"></i>';
        let statusText = 'Available';
        let clickHandler = `selectTimeSlot('${timeString}')`;
        
        if (isPast) {
            slotClass += ' bg-gray-100 cursor-not-allowed opacity-50';
            slotStatus = 'past';
            statusIcon = '<i class="fas fa-clock text-gray-400"></i>';
            statusText = 'Past';
            clickHandler = '';
        } else if (isMaintenance) {
            slotClass += ' bg-yellow-50 border-yellow-200 cursor-not-allowed';
            slotStatus = 'maintenance';
            statusIcon = '<i class="fas fa-tools text-yellow-600"></i>';
            statusText = 'Maintenance';
            clickHandler = '';
        } else if (isBooked) {
            slotClass += ' bg-red-50 border-red-200 cursor-not-allowed';
            slotStatus = 'booked';
            statusIcon = '<i class="fas fa-times-circle text-red-500"></i>';
            statusText = 'Booked';
            clickHandler = '';
        } else {
            slotClass += ' hover:bg-blue-50 hover:border-blue-300';
        }
        
        slotsHtml += `
            <div class="${slotClass}" onclick="${clickHandler}" data-time="${timeString}" data-status="${slotStatus}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        ${statusIcon}
                        <div>
                            <div class="font-semibold text-gray-900">
                                ${formatTime(timeString)} - ${formatTime(endTimeString)}
                            </div>
                            <div class="text-sm text-gray-600">${statusText}</div>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        ${isPeakHour(hour) ? `
                            <span class="peak-hour-badge px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                Peak Hour
                            </span>
                        ` : ''}
                        
                        <div class="text-right">
                            <div class="font-bold text-lg ${slotStatus === 'available' ? 'text-green-600' : 'text-gray-400'}">
                                $${price}
                            </div>
                            <div class="text-xs text-gray-500">per hour</div>
                        </div>
                        
                        ${slotStatus === 'available' ? `
                            <button class="book-slot-btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm">
                                Book Now
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    slotsHtml += '</div>';
    return slotsHtml;
}

function getTimeSlotPrice(court, date, hour) {
    const selectedDate = new Date(date);
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    
    let basePrice = isWeekend ? court.pricing.weekend : court.pricing.weekday;
    
    // Peak hour pricing
    if (isPeakHour(hour) && court.pricing.peakHours) {
        basePrice = court.pricing.peakHours.rate;
    }
    
    return basePrice;
}

function isPeakHour(hour) {
    // Peak hours typically 6-9 PM
    return hour >= 18 && hour <= 20;
}

function getAvailableSlots(courtId, date) {
    const court = courts.find(c => c.id === courtId);
    if (!court) return 0;
    
    const openHour = parseInt(court.hours.open.split(':')[0]);
    const closeHour = parseInt(court.hours.close.split(':')[0]);
    const totalSlots = closeHour - openHour;
    
    const existingBookings = getBookingsForCourt(courtId, date);
    const bookedSlots = existingBookings.filter(booking => booking.status !== 'cancelled').length;
    
    const maintenanceSlots = getMaintenanceSlots(courtId, date).length;
    const pastSlots = getPastSlots(date, openHour, closeHour);
    
    return totalSlots - bookedSlots - maintenanceSlots - pastSlots;
}

function getMaintenanceSlots(courtId, date) {
    // Mock maintenance schedule
    const maintenanceSchedule = JSON.parse(localStorage.getItem(`maintenance_${courtId}`) || '[]');
    return maintenanceSchedule.filter(slot => slot.date === date).map(slot => slot.time);
}

function getPastSlots(date, openHour, closeHour) {
    const selectedDate = new Date(date);
    const today = new Date();
    
    if (selectedDate.toDateString() !== today.toDateString()) {
        return selectedDate < today ? (closeHour - openHour) : 0;
    }
    
    const currentHour = today.getHours();
    return Math.max(0, Math.min(currentHour - openHour + 1, closeHour - openHour));
}

function selectTimeSlot(timeString) {
    // Remove previous selections
    document.querySelectorAll('.time-slot-row.selected').forEach(slot => {
        slot.classList.remove('selected', 'bg-blue-100', 'border-blue-500');
    });
    
    // Add selection to clicked slot
    const selectedSlot = document.querySelector(`[data-time="${timeString}"]`);
    if (selectedSlot && selectedSlot.dataset.status === 'available') {
        selectedSlot.classList.add('selected', 'bg-blue-100', 'border-blue-500');
        
        // Update selected time in booking form if it exists
        const timeInput = document.getElementById('selectedTime');
        if (timeInput) {
            timeInput.value = timeString;
        }
        
        // Trigger custom event for other components
        document.dispatchEvent(new CustomEvent('timeSlotSelected', {
            detail: { time: timeString }
        }));
        
        showNotification(`Selected ${formatTime(timeString)}`, 'success');
    }
}

window.changeBookingDate = function(direction) {
    const dateInput = document.getElementById('bookingTableDate');
    const currentDate = new Date(dateInput.value);
    
    if (direction === 'prev') {
        currentDate.setDate(currentDate.getDate() - 1);
    } else {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    dateInput.value = currentDate.toISOString().split('T')[0];
    updateBookingTable();
}

window.updateBookingTable = function() {
    const dateInput = document.getElementById('bookingTableDate');
    const courtId = getCurrentCourtId();
    
    if (!courtId || !dateInput) return;
    
    const newTable = createBookingTable(courtId, dateInput.value);
    const existingTable = document.getElementById('bookingTable');
    
    if (existingTable && newTable) {
        existingTable.replaceWith(newTable);
    }
}

window.changeViewMode = function() {
    const viewMode = document.getElementById('viewMode').value;
    
    switch (viewMode) {
        case 'daily':
            showDailyView();
            break;
        case 'weekly':
            showWeeklyView();
            break;
        default:
            showHourlyView();
    }
}

function showDailyView() {
    const content = document.querySelector('.booking-table-content');
    const courtId = getCurrentCourtId();
    const date = document.getElementById('bookingTableDate').value;
    
    content.innerHTML = generateDailyView(courtId, date);
}

function showWeeklyView() {
    const content = document.querySelector('.booking-table-content');
    const courtId = getCurrentCourtId();
    const date = document.getElementById('bookingTableDate').value;
    
    content.innerHTML = generateWeeklyView(courtId, date);
}

function showHourlyView() {
    updateBookingTable();
}

function generateDailyView(courtId, date) {
    const court = courts.find(c => c.id === courtId);
    const bookings = getBookingsForCourt(courtId, date);
    
    return `
        <div class="p-6">
            <h4 class="text-lg font-semibold mb-4">Daily Overview - ${formatDate(date)}</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-green-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-green-600">${getAvailableSlots(courtId, date)}</div>
                    <div class="text-green-700">Available Slots</div>
                </div>
                
                <div class="bg-red-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-red-600">${bookings.length}</div>
                    <div class="text-red-700">Booked Slots</div>
                </div>
                
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600">$${calculateDailyRevenue(bookings)}</div>
                    <div class="text-blue-700">Revenue</div>
                </div>
            </div>
            
            <div class="mt-6">
                <h5 class="font-semibold mb-3">Today's Bookings</h5>
                ${bookings.length > 0 ? `
                    <div class="space-y-2">
                        ${bookings.map(booking => `
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div class="font-semibold">${formatTime(booking.time)}</div>
                                    <div class="text-sm text-gray-600">Customer #${booking.userId}</div>
                                </div>
                                <div class="text-right">
                                    <div class="font-semibold text-green-600">$${booking.pricing?.total || 0}</div>
                                    <div class="text-sm ${getStatusColor(booking.status)}">${booking.status}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-gray-500">No bookings for this day</p>'}
            </div>
        </div>
    `;
}

function generateWeeklyView(courtId, startDate) {
    const dates = [];
    const start = new Date(startDate);
    
    // Get the start of the week (Sunday)
    start.setDate(start.getDate() - start.getDay());
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    
    return `
        <div class="p-6">
            <h4 class="text-lg font-semibold mb-4">Weekly View</h4>
            
            <div class="grid grid-cols-7 gap-2">
                ${dates.map(date => {
                    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNumber = new Date(date).getDate();
                    const bookings = getBookingsForCourt(courtId, date);
                    const available = getAvailableSlots(courtId, date);
                    
                    return `
                        <div class="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer" onclick="selectWeeklyDate('${date}')">
                            <div class="text-center">
                                <div class="font-semibold text-sm">${dayName}</div>
                                <div class="text-lg font-bold">${dayNumber}</div>
                                <div class="text-xs text-green-600">${available} available</div>
                                <div class="text-xs text-red-600">${bookings.length} booked</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="mt-6">
                <h5 class="font-semibold mb-3">Weekly Summary</h5>
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div class="text-xl font-bold text-blue-600">${dates.reduce((sum, date) => sum + getAvailableSlots(courtId, date), 0)}</div>
                            <div class="text-sm text-gray-600">Total Available</div>
                        </div>
                        <div>
                            <div class="text-xl font-bold text-red-600">${dates.reduce((sum, date) => sum + getBookingsForCourt(courtId, date).length, 0)}</div>
                            <div class="text-sm text-gray-600">Total Booked</div>
                        </div>
                        <div>
                            <div class="text-xl font-bold text-green-600">$${dates.reduce((sum, date) => sum + calculateDailyRevenue(getBookingsForCourt(courtId, date)), 0).toFixed(2)}</div>
                            <div class="text-sm text-gray-600">Weekly Revenue</div>
                        </div>
                        <div>
                            <div class="text-xl font-bold text-purple-600">${calculateOccupancyRate(courtId, dates)}%</div>
                            <div class="text-sm text-gray-600">Occupancy Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.selectWeeklyDate = function(date) {
    const dateInput = document.getElementById('bookingTableDate');
    if (dateInput) {
        dateInput.value = date;
        document.getElementById('viewMode').value = 'hourly';
        updateBookingTable();
    }
}

function calculateDailyRevenue(bookings) {
    return bookings.reduce((total, booking) => {
        return total + (booking.pricing?.total || 0);
    }, 0).toFixed(2);
}

function calculateOccupancyRate(courtId, dates) {
    const totalSlots = dates.reduce((sum, date) => {
        const court = courts.find(c => c.id === courtId);
        if (!court) return sum;
        
        const openHour = parseInt(court.hours.open.split(':')[0]);
        const closeHour = parseInt(court.hours.close.split(':')[0]);
        return sum + (closeHour - openHour);
    }, 0);
    
    const bookedSlots = dates.reduce((sum, date) => {
        return sum + getBookingsForCourt(courtId, date).length;
    }, 0);
    
    return totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;
}

function getStatusColor(status) {
    const colors = {
        'confirmed': 'text-green-600',
        'pending': 'text-yellow-600',
        'cancelled': 'text-red-600',
        'completed': 'text-blue-600'
    };
    return colors[status] || 'text-gray-600';
}

window.refreshBookingTable = function() {
    showNotification('Refreshing availability...', 'info');
    
    setTimeout(() => {
        updateBookingTable();
        showNotification('Availability updated', 'success');
    }, 1000);
}

// Export for global use
window.bookingTableUtils = {
    createBookingTable,
    selectTimeSlot,
    updateBookingTable,
    getAvailableSlots
};
