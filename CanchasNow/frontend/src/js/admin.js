// Admin dashboard functionality for CanchasYa platform

let currentAdminUser = null;
let currentCourtData = null;

// Initialize admin dashboard
function initializeAdminDashboard() {
    currentAdminUser = getCurrentUser();
    if (!currentAdminUser || currentAdminUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    setupAdminName();
    loadCourtData();
    setupAdminHandlers();
    updateDashboardStats();
    loadRecentBookings();

    // Botón logout
    const logoutBtn = document.querySelector('button[onclick="logout()"]');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        };
    }

    // Botón Save Changes
    const saveBtn = document.getElementById('saveCourtBtn');
    if (saveBtn) {
        saveBtn.onclick = function(e) {
            e.preventDefault();
            saveCourtInfo();
        };
    }

    // Botón Toggle Status
    const toggleStatusBtn = document.getElementById('toggleCourtStatus');
    if (toggleStatusBtn) {
        toggleStatusBtn.onclick = function() {
            toggleCourtStatus();
        };
    }

    // Botón View All Bookings
    const viewBookingsBtn = document.querySelector('button[onclick="viewBookings()"]');
    if (viewBookingsBtn) {
        viewBookingsBtn.onclick = function() {
            window.location.href = 'owner-admin.html'; // Redirige a la vista de reservas del dueño
        };
    }

    // Botón Manage Gallery
    const manageGalleryBtn = document.querySelector('button[onclick="manageGallery()"]');
    if (manageGalleryBtn) {
        manageGalleryBtn.onclick = function() {
            window.location.href = 'gallery.html'; // Redirige a la gestión de galería
        };
    }

    // Botón Generate Report
    const generateReportBtn = document.querySelector('button[onclick="generateReport()"]');
    if (generateReportBtn) {
        generateReportBtn.onclick = function() {
            window.location.href = 'report.html'; // Redirige a la vista de reportes
        };
    }
}
// Alternar estado de la cancha (Open/Closed)
function toggleCourtStatus() {
    const statusSpan = document.getElementById('courtStatus');
    if (!statusSpan) return;
    if (statusSpan.textContent === 'Open') {
        statusSpan.textContent = 'Closed';
        statusSpan.classList.remove('bg-green-600');
        statusSpan.classList.add('bg-red-600');
    } else {
        statusSpan.textContent = 'Open';
        statusSpan.classList.remove('bg-red-600');
        statusSpan.classList.add('bg-green-600');
    }
    // Aquí podrías hacer una petición al backend para guardar el estado
}

function setupAdminName() {
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement && currentAdminUser) {
        adminNameElement.textContent = currentAdminUser.name;
    }
}

function loadCourtData() {
    // Permitir edición de cualquier cancha si hay editCourtId en sessionStorage (botón Edit Court)
    let editCourtId = sessionStorage.getItem('editCourtId');
    if (editCourtId) {
        currentCourtData = courts.find(court => court.id === editCourtId);
        // Limpiar el id para evitar confusiones en futuras ediciones
        sessionStorage.removeItem('editCourtId');
    } else if (currentAdminUser.courtId) {
        currentCourtData = courts.find(court => court.id === currentAdminUser.courtId);
    } else {
        showNotification('No court assigned to this admin account', 'error');
        return;
    }
    if (!currentCourtData) {
        showNotification('Court data not found', 'error');
        return;
    }
    populateCourtForm();
}

function populateCourtForm() {
    if (!currentCourtData) return;
    
    // Populate basic information
    const courtNameField = document.getElementById('courtName');
    const sportTypeField = document.getElementById('sportType');
    const courtDescriptionField = document.getElementById('courtDescription');
    const courtAddressField = document.getElementById('courtAddress');
    const courtPhoneField = document.getElementById('courtPhone');
    
    if (courtNameField) courtNameField.value = currentCourtData.name;
    if (sportTypeField) sportTypeField.value = currentCourtData.sport;
    if (courtDescriptionField) courtDescriptionField.value = currentCourtData.description;
    if (courtAddressField) courtAddressField.value = currentCourtData.address;
    if (courtPhoneField) courtPhoneField.value = currentCourtData.phone;
    
    // Populate pricing information
    const weekdayPriceField = document.getElementById('weekdayPrice');
    const weekendPriceField = document.getElementById('weekendPrice');
    const openingTimeField = document.getElementById('openingTime');
    const closingTimeField = document.getElementById('closingTime');
    
    if (weekdayPriceField && currentCourtData.pricing) {
        weekdayPriceField.value = currentCourtData.pricing.weekday || '';
    }
    if (weekendPriceField && currentCourtData.pricing) {
        weekendPriceField.value = currentCourtData.pricing.weekend || '';
    }
    if (openingTimeField && currentCourtData.hours) {
        openingTimeField.value = currentCourtData.hours.open || '';
    }
    if (closingTimeField && currentCourtData.hours) {
        closingTimeField.value = currentCourtData.hours.close || '';
    }
}

function setupAdminHandlers() {
    // Save court info handler
    const saveButton = document.querySelector('button[onclick="saveCourtInfo()"]');
    if (saveButton) {
        saveButton.addEventListener('click', saveCourtInfo);
    }
    
    // Quick action handlers
    setupQuickActions();
    
    // Form validation
    setupFormValidation();
}

function setupQuickActions() {
    // View court page
    window.viewCourtPage = function() {
        if (currentCourtData) {
            window.open(`courts/${currentCourtData.id}.html`, '_blank');
        }
    };
    
    // Manage gallery
    window.manageGallery = function() {
        openGalleryManager();
    };
    
    // View bookings
    window.viewBookings = function() {
        openBookingsManager();
    };
    
    // Generate report
    window.generateReport = function() {
        generateCourtReport();
    };
}

import { request } from "../api.js";

async function saveCourtInfo() {
    if (!currentCourtData) return;
    const formData = collectFormData();
    if (!validateCourtData(formData)) {
        return;
    }

    // Guardar los valores originales para comparar
    const original = {
        name: currentCourtData.name,
        sport: currentCourtData.sport,
        description: currentCourtData.description,
        address: currentCourtData.address,
        phone: currentCourtData.phone,
        weekday: currentCourtData.pricing?.weekday,
        weekend: currentCourtData.pricing?.weekend,
        open: currentCourtData.hours?.open,
        close: currentCourtData.hours?.close
    };

    // Actualizar en backend
    try {
        // Mapear los datos al formato esperado por el backend
        const payload = {
            name: formData.name,
            description: formData.description,
            address: formData.address,
            price_per_hour: formData.pricing.weekday, // O ajustar según lógica de precios
            image_url: currentCourtData.images?.banner || "",
            type_id: 1 // Ajustar si tienes tipos dinámicos
        };
        await request(`/fields/${currentCourtData.id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        });
        // Actualizar localmente
        updateCourtData(formData);
        showNotification('Court information updated successfully', 'success');
        updateDashboardStats();

        // Resaltar campos modificados
        const highlight = (id) => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('ring-2', 'ring-yellow-400');
                setTimeout(() => {
                    el.classList.remove('ring-2', 'ring-yellow-400');
                }, 3000);
            }
        };
        if (formData.name !== original.name) highlight('courtName');
        if (formData.sport !== original.sport) highlight('sportType');
        if (formData.description !== original.description) highlight('courtDescription');
        if (formData.address !== original.address) highlight('courtAddress');
        if (formData.phone !== original.phone) highlight('courtPhone');
        if (formData.pricing.weekday !== original.weekday) highlight('weekdayPrice');
        if (formData.pricing.weekend !== original.weekend) highlight('weekendPrice');
        if (formData.hours.open !== original.open) highlight('openingTime');
        if (formData.hours.close !== original.close) highlight('closingTime');
        // Redirigir a index.html tras guardar cambios
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    } catch (err) {
        showNotification('Error updating court: ' + err.message, 'error');
    }
}

function collectFormData() {
    return {
        name: document.getElementById('courtName')?.value,
        sport: document.getElementById('sportType')?.value,
        description: document.getElementById('courtDescription')?.value,
        address: document.getElementById('courtAddress')?.value,
        phone: document.getElementById('courtPhone')?.value,
        pricing: {
            weekday: parseFloat(document.getElementById('weekdayPrice')?.value) || 0,
            weekend: parseFloat(document.getElementById('weekendPrice')?.value) || 0
        },
        hours: {
            open: document.getElementById('openingTime')?.value,
            close: document.getElementById('closingTime')?.value
        }
    };
}

function validateCourtData(data) {
    if (!data.name || data.name.length < 3) {
        showNotification('Court name must be at least 3 characters', 'error');
        return false;
    }
    
    if (!data.description || data.description.length < 10) {
        showNotification('Description must be at least 10 characters', 'error');
        return false;
    }
    
    if (!data.address || data.address.length < 10) {
        showNotification('Please provide a complete address', 'error');
        return false;
    }
    
    if (!data.phone || data.phone.length < 10) {
        showNotification('Please provide a valid phone number', 'error');
        return false;
    }
    
    if (data.pricing.weekday <= 0 || data.pricing.weekend <= 0) {
        showNotification('Pricing must be greater than 0', 'error');
        return false;
    }
    
    if (!data.hours.open || !data.hours.close) {
        showNotification('Please specify opening and closing hours', 'error');
        return false;
    }
    
    return true;
}

function updateCourtData(formData) {
    // Update current court data
    Object.assign(currentCourtData, formData);
    
    // Update in courts array
    const courtIndex = courts.findIndex(court => court.id === currentCourtData.id);
    if (courtIndex !== -1) {
        courts[courtIndex] = currentCourtData;
    }
    
    // Save to localStorage for persistence
    localStorage.setItem('courts', JSON.stringify(courts));
    
    // Update last modified timestamp
    currentCourtData.lastModified = new Date().toISOString();
}

function updateDashboardStats() {
    if (!currentCourtData) return;
    
    const today = new Date().toISOString().split('T')[0];
    const courtBookings = getBookingsForCourt(currentCourtData.id, today);
    
    // Update today's bookings
    const todayBookingsElement = document.getElementById('todayBookings');
    if (todayBookingsElement) {
        todayBookingsElement.textContent = courtBookings.length;
    }
    
    // Calculate revenue
    const todayRevenue = courtBookings.reduce((total, booking) => {
        return total + (booking.pricing?.total || 0);
    }, 0);
    
    const revenueElement = document.getElementById('revenue');
    if (revenueElement) {
        revenueElement.textContent = `$${todayRevenue.toFixed(2)}`;
    }
    
    // Calculate available hours
    const totalHours = calculateTotalHours();
    const bookedHours = courtBookings.length;
    const availableHours = totalHours - bookedHours;
    
    const availableHoursElement = document.getElementById('availableHours');
    if (availableHoursElement) {
        availableHoursElement.textContent = Math.max(0, availableHours);
    }
    
    // Update rating (mock calculation)
    const ratingElement = document.getElementById('rating');
    if (ratingElement) {
        const rating = calculateCourtRating();
        ratingElement.textContent = rating.toFixed(1);
    }
}

function calculateTotalHours() {
    if (!currentCourtData.hours) return 16; // Default 16 hours
    
    const openTime = parseInt(currentCourtData.hours.open.split(':')[0]);
    const closeTime = parseInt(currentCourtData.hours.close.split(':')[0]);
    
    return closeTime - openTime;
}

function calculateCourtRating() {
    // Mock rating calculation based on recent bookings and reviews
    const baseRating = 4.0;
    const bookings = getAllBookingsForCourt(currentCourtData.id);
    const recentBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return bookingDate >= thirtyDaysAgo;
    });
    
    const popularityBonus = Math.min(recentBookings.length * 0.01, 0.9);
    return Math.min(baseRating + popularityBonus, 5.0);
}

function loadRecentBookings() {
    const recentBookingsContainer = document.getElementById('recentBookings');
    if (!recentBookingsContainer || !currentCourtData) return;
    
    const allBookings = getAllBookingsForCourt(currentCourtData.id);
    const recentBookings = allBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    if (recentBookings.length === 0) {
        recentBookingsContainer.innerHTML = '<p class="text-gray-500 text-sm">No recent bookings</p>';
        return;
    }
    
    recentBookingsContainer.innerHTML = recentBookings.map(booking => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
                <div class="font-semibold text-gray-900">${formatDate(booking.date)}</div>
                <div class="text-sm text-gray-600">${booking.time} - $${booking.pricing?.total || 0}</div>
            </div>
            <div class="status-${booking.status}">${booking.status}</div>
        </div>
    `).join('');
}

function getAllBookingsForCourt(courtId) {
    const allBookings = JSON.parse(localStorage.getItem('courtBookings') || '[]');
    return allBookings.filter(booking => booking.courtId === courtId);
}

function openGalleryManager() {
    const modal = createGalleryManagerModal();
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }, 100);
}

function createGalleryManagerModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
    modal.id = 'galleryManagerModal';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 modal-enter">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Manage Gallery</h2>
                <button onclick="closeGalleryManager()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold mb-4">Current Images</h3>
                    <div class="space-y-3">
                        <div class="border rounded-lg p-4 flex items-center justify-between">
                            <div class="flex items-center">
                                <img src="assets/courts/${currentCourtData.id}/banner.svg" alt="Banner" class="w-16 h-16 object-cover rounded">
                                <div class="ml-3">
                                    <div class="font-semibold">Banner Image</div>
                                    <div class="text-sm text-gray-600">1200x400px</div>
                                </div>
                            </div>
                            <button class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        
                        <div class="border rounded-lg p-4 flex items-center justify-between">
                            <div class="flex items-center">
                                <img src="assets/courts/${currentCourtData.id}/gallery-1.svg" alt="Gallery 1" class="w-16 h-16 object-cover rounded">
                                <div class="ml-3">
                                    <div class="font-semibold">Gallery Image 1</div>
                                    <div class="text-sm text-gray-600">800x600px</div>
                                </div>
                            </div>
                            <button class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Upload New Images</h3>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <i class="fas fa-cloud-upload-alt text-gray-400 text-4xl mb-4"></i>
                        <p class="text-gray-600 mb-4">Drag and drop images here or click to select</p>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                            Select Files
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
                <button onclick="closeGalleryManager()" 
                        class="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition duration-300">
                    Cancel
                </button>
                <button class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300">
                    Save Changes
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

function closeGalleryManager() {
    const modal = document.getElementById('galleryManagerModal');
    if (modal) {
        modal.remove();
    }
}

function openBookingsManager() {
    const modal = createBookingsManagerModal();
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }, 100);
}

function createBookingsManagerModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
    modal.id = 'bookingsManagerModal';
    
    const allBookings = getAllBookingsForCourt(currentCourtData.id);
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-6xl w-full mx-4 modal-enter max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Manage Bookings</h2>
                <button onclick="closeBookingsManager()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="mb-4 flex space-x-4">
                <input type="date" id="bookingFilterDate" class="px-3 py-2 border border-gray-300 rounded-lg">
                <select id="bookingFilterStatus" class="px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button onclick="filterBookings()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    Filter
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="bookingsTableBody">
                        ${allBookings.map(booking => `
                            <tr>
                                <td class="font-mono text-sm">${booking.id}</td>
                                <td>${formatDate(booking.date)}</td>
                                <td>${booking.time}</td>
                                <td>Customer #${booking.userId}</td>
                                <td>$${booking.pricing?.total || 0}</td>
                                <td><span class="status-${booking.status}">${booking.status}</span></td>
                                <td>
                                    <div class="flex space-x-2">
                                        <button onclick="viewBookingDetails('${booking.id}')" 
                                                class="text-blue-600 hover:text-blue-800">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button onclick="editBooking('${booking.id}')" 
                                                class="text-green-600 hover:text-green-800">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="cancelBooking('${booking.id}')" 
                                                class="text-red-600 hover:text-red-800">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="flex justify-end mt-6">
                <button onclick="closeBookingsManager()" 
                        class="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition duration-300">
                    Close
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

function closeBookingsManager() {
    const modal = document.getElementById('bookingsManagerModal');
    if (modal) {
        modal.remove();
    }
}

function filterBookings() {
    // Implementation for filtering bookings
    showNotification('Bookings filtered', 'success');
}

function viewBookingDetails(bookingId) {
    showNotification(`Viewing details for booking ${bookingId}`, 'success');
}

function editBooking(bookingId) {
    showNotification(`Editing booking ${bookingId}`, 'success');
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        updateBookingStatus(bookingId, 'cancelled');
        showNotification('Booking cancelled successfully', 'success');
        closeBookingsManager();
        setTimeout(() => openBookingsManager(), 500);
    }
}

function generateCourtReport() {
    const reportData = {
        courtName: currentCourtData.name,
        reportDate: new Date().toISOString().split('T')[0],
        totalBookings: getAllBookingsForCourt(currentCourtData.id).length,
        revenue: calculateTotalRevenue(),
        occupancyRate: calculateOccupancyRate()
    };
    
    showNotification('Report generated successfully', 'success');
    
    // In a real app, this would generate and download a PDF
    console.log('Court Report:', reportData);
}

function calculateTotalRevenue() {
    const allBookings = getAllBookingsForCourt(currentCourtData.id);
    return allBookings.reduce((total, booking) => {
        return total + (booking.pricing?.total || 0);
    }, 0);
}

function calculateOccupancyRate() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentBookings = getAllBookingsForCourt(currentCourtData.id)
        .filter(booking => new Date(booking.date) >= thirtyDaysAgo);
    
    const totalHours = calculateTotalHours();
    const bookedHours = recentBookings.length;
    const availableHours = totalHours * 30; // 30 days
    
    return ((bookedHours / availableHours) * 100).toFixed(1);
}

function setupFormValidation() {
    const form = document.getElementById('courtForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    clearFieldError(event);
    
    switch (field.id) {
        case 'courtName':
            if (value.length < 3) {
                showFieldError(field, 'Name must be at least 3 characters');
            }
            break;
        case 'courtDescription':
            if (value.length < 10) {
                showFieldError(field, 'Description must be at least 10 characters');
            }
            break;
        case 'weekdayPrice':
        case 'weekendPrice':
            if (parseFloat(value) <= 0) {
                showFieldError(field, 'Price must be greater than 0');
            }
            break;
    }
}

function showFieldError(field, message) {
    field.classList.add('border-red-500');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error text-red-500 text-sm mt-1';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('border-red-500');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Initialize admin dashboard when DOM loads
document.addEventListener('DOMContentLoaded', initializeAdminDashboard);

// Export for global use
window.admin = {
    saveCourtInfo,
    viewCourtPage,
    manageGallery,
    viewBookings,
    generateReport,
    updateDashboardStats
};
