// Payment system for CanchasYa platform

const paymentMethods = {
    nequi: {
        name: 'Nequi',
        icon: 'fab fa-cc-visa', // Using generic icon
        color: 'purple',
        processing: true
    },
    visa: {
        name: 'Visa',
        icon: 'fab fa-cc-visa',
        color: 'blue',
        processing: true
    },
    mastercard: {
        name: 'MasterCard',
        icon: 'fab fa-cc-mastercard',
        color: 'red',
        processing: true
    },
    efecty: {
        name: 'Efecty',
        icon: 'fas fa-money-bill-wave',
        color: 'green',
        processing: false
    }
};

function initializePaymentModal(bookingData) {
    const modal = createPaymentModal(bookingData);
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }, 100);

    setupPaymentHandlers(bookingData);
}

function createPaymentModal(bookingData) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
    modal.id = 'paymentModal';

    const court = courts.find(c => c.id === bookingData.courtId);

    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-lg w-full mx-4 modal-enter">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Payment</h2>
                <button onclick="closePaymentModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <!-- Booking Summary -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 class="font-semibold text-gray-900 mb-2">Booking Summary</h3>
                <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                        <span>Court:</span>
                        <span>${court.name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Date & Time:</span>
                        <span>${formatDate(bookingData.date)} at ${bookingData.time}</span>
                    </div>
                    <div class="flex justify-between font-bold border-t pt-1 mt-2">
                        <span>Total:</span>
                        <span>$${bookingData.pricing.total}</span>
                    </div>
                </div>
            </div>
            
            <!-- Payment Methods -->
            <div class="mb-6">
                <h3 class="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                <div class="grid grid-cols-2 gap-3">
                    ${Object.entries(paymentMethods).map(([key, method]) => `
                        <div class="payment-method-card border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-${method.color}-300 transition-all duration-200"
                             data-method="${key}"
                             onclick="selectPaymentMethod('${key}')">
                            <div class="flex items-center space-x-3">
                                <i class="${method.icon} text-${method.color}-600 text-2xl"></i>
                                <div>
                                    <div class="font-semibold text-gray-900">${method.name}</div>
                                    <div class="text-xs text-gray-500">
                                        ${method.processing ? 'Instant processing' : 'Manual verification'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Payment Form -->
            <div id="paymentForm" class="hidden">
                <!-- Dynamic payment form will be inserted here -->
            </div>
            
            <div class="flex space-x-3">
                <button onclick="closePaymentModal()" 
                        class="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition duration-300">
                    Cancel
                </button>
                <button id="processPaymentBtn" onclick="processPayment()" 
                        class="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled>
                    Process Payment
                </button>
            </div>
        </div>
    `;

    return modal;
}

let selectedPaymentMethod = null;
let currentBookingData = null;

function setupPaymentHandlers(bookingData) {
    currentBookingData = bookingData;

    // Setup form validation
    setupPaymentFormValidation();
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;

    // Update UI
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('border-blue-500', 'bg-blue-50');
    });

    const selectedCard = document.querySelector(`[data-method="${method}"]`);
    selectedCard.classList.add('border-blue-500', 'bg-blue-50');

    // Show payment form
    showPaymentForm(method);

    // Enable payment button
    document.getElementById('processPaymentBtn').disabled = false;
}

function showPaymentForm(method) {
    const paymentForm = document.getElementById('paymentForm');
    const methodConfig = paymentMethods[method];

    let formHtml = '';

    switch (method) {
        case 'nequi':
            formHtml = createNequiForm();
            break;
        case 'visa':
        case 'mastercard':
            formHtml = createCreditCardForm(method);
            break;
        case 'efecty':
            formHtml = createEfectyForm();
            break;
    }

    paymentForm.innerHTML = formHtml;
    paymentForm.classList.remove('hidden');

    // Focus on first input
    const firstInput = paymentForm.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function createNequiForm() {
    return `
        <div class="border border-purple-200 rounded-lg p-4 mb-4">
            <div class="flex items-center mb-4">
                <i class="fab fa-cc-visa text-purple-600 text-2xl mr-3"></i>
                <h4 class="font-semibold text-gray-900">Nequi Payment</h4>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                    <input type="tel" id="nequiPhone" placeholder="300 123 4567" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500">
                </div>
                
                <div class="bg-purple-50 rounded-lg p-3">
                    <div class="flex items-start">
                        <i class="fas fa-info-circle text-purple-600 mr-2 mt-1"></i>
                        <div class="text-sm text-purple-700">
                            <p>You will receive a push notification on your Nequi app to authorize this payment.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createCreditCardForm(type) {
    const cardName = type === 'visa' ? 'Visa' : 'MasterCard';
    const color = type === 'visa' ? 'blue' : 'red';

    return `
        <div class="border border-${color}-200 rounded-lg p-4 mb-4">
            <div class="flex items-center mb-4">
                <i class="fab fa-cc-${type} text-${color}-600 text-2xl mr-3"></i>
                <h4 class="font-semibold text-gray-900">${cardName} Payment</h4>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Card Number</label>
                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-${color}-500"
                           oninput="formatCardNumber(this)">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Expiry Date</label>
                        <input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-${color}-500"
                               oninput="formatExpiryDate(this)">
                    </div>
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">CVV</label>
                        <input type="text" id="cvv" placeholder="123" maxlength="4" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-${color}-500"
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                </div>
                
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Cardholder Name</label>
                    <input type="text" id="cardholderName" placeholder="John Doe" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-${color}-500">
                </div>
                
                <div class="bg-${color}-50 rounded-lg p-3">
                    <div class="flex items-start">
                        <i class="fas fa-shield-alt text-${color}-600 mr-2 mt-1"></i>
                        <div class="text-sm text-${color}-700">
                            <p>Your payment information is secure and encrypted with industry-standard SSL technology.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createEfectyForm() {
    return `
        <div class="border border-green-200 rounded-lg p-4 mb-4">
            <div class="flex items-center mb-4">
                <i class="fas fa-money-bill-wave text-green-600 text-2xl mr-3"></i>
                <h4 class="font-semibold text-gray-900">Efecty Payment</h4>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                    <input type="text" id="efectyName" placeholder="Your full name" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
                </div>
                
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">ID Number</label>
                    <input type="text" id="efectyId" placeholder="Identity document number" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
                </div>
                
                <div class="bg-green-50 rounded-lg p-3">
                    <div class="flex items-start">
                        <i class="fas fa-info-circle text-green-600 mr-2 mt-1"></i>
                        <div class="text-sm text-green-700">
                            <p><strong>Payment Instructions:</strong></p>
                            <ol class="list-decimal list-inside mt-1 space-y-1">
                                <li>Visit any Efecty location</li>
                                <li>Provide the payment code we'll send you</li>
                                <li>Pay the exact amount in cash</li>
                                <li>Your booking will be confirmed within 2 hours</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupPaymentFormValidation() {
    // Real-time validation will be added here
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value;
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

function processPayment() {
    if (!selectedPaymentMethod || !currentBookingData) {
        showNotification('Please select a payment method', 'error');
        return;
    }

    // Validate payment form
    if (!validatePaymentForm()) {
        return;
    }

    // Show processing state
    const processBtn = document.getElementById('processPaymentBtn');
    const originalText = processBtn.textContent;
    processBtn.disabled = true;
    processBtn.innerHTML = '<div class="spinner"></div> Processing...';

    // Simulate payment processing
    setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate for demo

        if (success) {
            completePayment();
        } else {
            showPaymentError();
            processBtn.disabled = false;
            processBtn.textContent = originalText;
        }
    }, 3000);
}

function validatePaymentForm() {
    switch (selectedPaymentMethod) {
        case 'nequi':
            return validateNequiForm();
        case 'visa':
        case 'mastercard':
            return validateCreditCardForm();
        case 'efecty':
            return validateEfectyForm();
        default:
            return false;
    }
}

function validateNequiForm() {
    const phone = document.getElementById('nequiPhone').value;
    if (!phone || phone.length < 10) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    return true;
}

function validateCreditCardForm() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardholderName = document.getElementById('cardholderName').value;

    if (!cardNumber || cardNumber.length < 13) {
        showNotification('Please enter a valid card number', 'error');
        return false;
    }

    if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
        showNotification('Please enter a valid expiry date (MM/YY)', 'error');
        return false;
    }

    if (!cvv || cvv.length < 3) {
        showNotification('Please enter a valid CVV', 'error');
        return false;
    }

    if (!cardholderName || cardholderName.length < 2) {
        showNotification('Please enter the cardholder name', 'error');
        return false;
    }

    return true;
}

function validateEfectyForm() {
    const name = document.getElementById('efectyName').value;
    const id = document.getElementById('efectyId').value;

    if (!name || name.length < 3) {
        showNotification('Please enter your full name', 'error');
        return false;
    }

    if (!id || id.length < 7) {
        showNotification('Please enter a valid ID number', 'error');
        return false;
    }

    return true;
}

function completePayment() {
    // Update booking status
    updateBookingStatus(currentBookingData.id || generateBookingId(), 'confirmed');

    // Generate payment receipt
    const paymentData = {
        bookingId: currentBookingData.id || generateBookingId(),
        amount: currentBookingData.pricing.total,
        method: selectedPaymentMethod,
        timestamp: new Date().toISOString(),
        status: 'completed'
    };

    savePaymentRecord(paymentData);

    // Close payment modal
    closePaymentModal();

    // Show success message
    showPaymentSuccess(paymentData);
}

function showPaymentError() {
    showNotification('Payment failed. Please try again or use a different payment method.', 'error');
}

function showPaymentSuccess(paymentData) {
    const court = courts.find(c => c.id === currentBookingData.courtId);

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.id = 'paymentSuccessModal';

    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 modal-enter">
            <div class="text-center">
                <div class="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-check text-green-600 text-3xl"></i>
                </div>
                
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p class="text-gray-600 mb-6">Your court booking has been confirmed.</p>
                
                <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <h3 class="font-semibold text-gray-900 mb-2">Booking Details</h3>
                    <div class="space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span>Booking ID:</span>
                            <span class="font-mono">${paymentData.bookingId}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Court:</span>
                            <span>${court.name}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Date & Time:</span>
                            <span>${formatDate(currentBookingData.date)} at ${currentBookingData.time}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Amount Paid:</span>
                            <span>$${paymentData.amount}</span>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <button onclick="downloadReceipt('${paymentData.bookingId}')" 
                            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                        Download Receipt
                    </button>
                    <button onclick="closePaymentSuccessModal()" 
                            class="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-300">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.remove();
    }
    selectedPaymentMethod = null;
    currentBookingData = null;
}

function closePaymentSuccessModal() {
    const modal = document.getElementById('paymentSuccessModal');
    if (modal) {
        modal.remove();
    }

    // Redirect to booking confirmation page or home
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

function updateBookingStatus(bookingId, status) {
    const bookings = JSON.parse(localStorage.getItem('courtBookings') || '[]');
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);

    if (bookingIndex !== -1) {
        bookings[bookingIndex].status = status;
        bookings[bookingIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('courtBookings', JSON.stringify(bookings));
    }
}

function savePaymentRecord(paymentData) {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    payments.push(paymentData);
    localStorage.setItem('payments', JSON.stringify(payments));
}

function downloadReceipt(bookingId) {
    // Generate and download PDF receipt (mock implementation)
    showNotification('Receipt downloaded successfully', 'success');
}

// Export for global use
window.payments = {
    initializePaymentModal,
    selectPaymentMethod,
    processPayment,
    closePaymentModal
};
