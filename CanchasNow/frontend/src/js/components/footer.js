// Footer component functionality for CanchasYa platform

function initializeFooter() {
    setupFooterLinks();
    setupNewsletterSubscription();
    setupSocialMediaLinks();
    updateFooterYear();
    setupFooterAnimations();
}

function setupFooterLinks() {
    const footerLinks = document.querySelectorAll('footer a[href="#"]');
    
    footerLinks.forEach(link => {
        const linkText = link.textContent.trim().toLowerCase();
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleFooterLinkClick(linkText);
        });
    });
}

function handleFooterLinkClick(linkText) {
    switch (linkText) {
        case 'help center':
            openHelpCenter();
            break;
        case 'terms of service':
            openTermsOfService();
            break;
        case 'privacy policy':
            openPrivacyPolicy();
            break;
        case 'refund policy':
            openRefundPolicy();
            break;
        case 'contact us':
            openContactForm();
            break;
        case 'about us':
            openAboutPage();
            break;
        case 'careers':
            openCareersPage();
            break;
        case 'blog':
            openBlog();
            break;
        default:
            showNotification('Page coming soon', 'info');
    }
}

function openHelpCenter() {
    const modal = createHelpCenterModal();
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }, 100);
}

function createHelpCenterModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
    modal.id = 'helpCenterModal';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 modal-enter">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Help Center</h2>
                <button onclick="closeHelpCenter()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
                    <div class="space-y-3">
                        <div class="border rounded-lg">
                            <button onclick="toggleFAQ(1)" class="w-full text-left p-4 font-semibold text-gray-900 hover:bg-gray-50">
                                How do I book a court?
                                <i class="fas fa-chevron-down float-right mt-1"></i>
                            </button>
                            <div id="faq1" class="hidden p-4 border-t bg-gray-50 text-gray-700">
                                To book a court, browse available courts on our homepage, select your preferred court, 
                                choose a date and time, then complete the booking process. You'll need to create an account 
                                and provide payment information.
                            </div>
                        </div>
                        
                        <div class="border rounded-lg">
                            <button onclick="toggleFAQ(2)" class="w-full text-left p-4 font-semibold text-gray-900 hover:bg-gray-50">
                                What payment methods do you accept?
                                <i class="fas fa-chevron-down float-right mt-1"></i>
                            </button>
                            <div id="faq2" class="hidden p-4 border-t bg-gray-50 text-gray-700">
                                We accept Visa, MasterCard, Nequi, and Efecty payments. All transactions are secure 
                                and processed through encrypted channels.
                            </div>
                        </div>
                        
                        <div class="border rounded-lg">
                            <button onclick="toggleFAQ(3)" class="w-full text-left p-4 font-semibold text-gray-900 hover:bg-gray-50">
                                Can I cancel my booking?
                                <i class="fas fa-chevron-down float-right mt-1"></i>
                            </button>
                            <div id="faq3" class="hidden p-4 border-t bg-gray-50 text-gray-700">
                                Yes, you can cancel your booking up to 24 hours before the scheduled time for a full refund. 
                                Cancellations within 24 hours may incur a cancellation fee.
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Contact Support</h3>
                    <div class="bg-blue-50 rounded-lg p-4">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-headset text-blue-600 text-2xl"></i>
                            <div>
                                <div class="font-semibold text-gray-900">24/7 Customer Support</div>
                                <div class="text-gray-600">Phone: +57 300 123 4567</div>
                                <div class="text-gray-600">Email: support@canchasya.com</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end mt-6">
                <button onclick="closeHelpCenter()" 
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    Close
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

window.toggleFAQ = function(faqNumber) {
    const faqContent = document.getElementById(`faq${faqNumber}`);
    if (faqContent) {
        faqContent.classList.toggle('hidden');
    }
}

window.closeHelpCenter = function() {
    const modal = document.getElementById('helpCenterModal');
    if (modal) {
        modal.remove();
    }
}

function openTermsOfService() {
    const modal = createLegalModal('Terms of Service', getTermsOfServiceContent());
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }, 100);
}

function openPrivacyPolicy() {
    const modal = createLegalModal('Privacy Policy', getPrivacyPolicyContent());
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }, 100);
}

function openRefundPolicy() {
    const modal = createLegalModal('Refund Policy', getRefundPolicyContent());
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }, 100);
}

function createLegalModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
    modal.id = 'legalModal';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 modal-enter max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">${title}</h2>
                <button onclick="closeLegalModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="prose max-w-none">
                ${content}
            </div>
            
            <div class="flex justify-end mt-6 border-t pt-6">
                <button onclick="closeLegalModal()" 
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    Close
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

window.closeLegalModal = function() {
    const modal = document.getElementById('legalModal');
    if (modal) {
        modal.remove();
    }
}

function getTermsOfServiceContent() {
    return `
        <h3>1. Acceptance of Terms</h3>
        <p>By using CanchasYa's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
        
        <h3>2. Service Description</h3>
        <p>CanchasYa provides an online platform for booking sports courts in Barranquilla, Colombia. We connect users with court owners and facilitate reservations.</p>
        
        <h3>3. User Responsibilities</h3>
        <ul>
            <li>Provide accurate information when making bookings</li>
            <li>Arrive on time for your reservations</li>
            <li>Treat facilities and equipment with respect</li>
            <li>Follow all facility rules and regulations</li>
        </ul>
        
        <h3>4. Booking and Payment</h3>
        <p>All bookings must be paid in advance. Prices are displayed in USD and may vary by court, date, and time. Payment processing fees may apply.</p>
        
        <h3>5. Cancellation Policy</h3>
        <p>Bookings may be cancelled up to 24 hours in advance for a full refund. Cancellations within 24 hours are subject to our cancellation policy.</p>
        
        <h3>6. Limitation of Liability</h3>
        <p>CanchasYa is not liable for any injuries or damages that occur during the use of booked facilities. Users participate at their own risk.</p>
    `;
}

function getPrivacyPolicyContent() {
    return `
        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support.</p>
        
        <h3>2. How We Use Your Information</h3>
        <ul>
            <li>To process and manage your bookings</li>
            <li>To communicate with you about your reservations</li>
            <li>To improve our services and user experience</li>
            <li>To comply with legal obligations</li>
        </ul>
        
        <h3>3. Information Sharing</h3>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h3>4. Data Security</h3>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h3>5. Your Rights</h3>
        <p>You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.</p>
        
        <h3>6. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@canchasya.com.</p>
    `;
}

function getRefundPolicyContent() {
    return `
        <h3>1. Full Refunds</h3>
        <p>Full refunds are available for cancellations made at least 24 hours before the scheduled booking time.</p>
        
        <h3>2. Partial Refunds</h3>
        <p>Cancellations made between 2-24 hours before the booking time may be eligible for a 50% refund, subject to the individual court's policy.</p>
        
        <h3>3. No Refunds</h3>
        <p>No refunds are available for:</p>
        <ul>
            <li>Cancellations made less than 2 hours before the booking time</li>
            <li>No-shows</li>
            <li>Partial use of booked time</li>
        </ul>
        
        <h3>4. Weather Cancellations</h3>
        <p>For outdoor courts, bookings cancelled due to severe weather conditions may be eligible for a full refund or rescheduling option.</p>
        
        <h3>5. Processing Time</h3>
        <p>Approved refunds will be processed within 5-7 business days and credited back to the original payment method.</p>
        
        <h3>6. Disputes</h3>
        <p>If you have any concerns about a refund decision, please contact our support team at support@canchasya.com.</p>
    `;
}

function openContactForm() {
    const modal = createContactFormModal();
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }, 100);
}

function createContactFormModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
    modal.id = 'contactModal';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-lg w-full mx-4 modal-enter">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Contact Us</h2>
                <button onclick="closeContactModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <form onsubmit="submitContactForm(event)">
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input type="text" id="contactName" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" id="contactEmail" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                        <select id="contactSubject" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="">Select a subject</option>
                            <option value="booking">Booking Issue</option>
                            <option value="payment">Payment Problem</option>
                            <option value="technical">Technical Support</option>
                            <option value="general">General Inquiry</option>
                            <option value="feedback">Feedback</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Message</label>
                        <textarea id="contactMessage" rows="5" required
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                  placeholder="Please describe your question or concern..."></textarea>
                    </div>
                </div>
                
                <div class="flex space-x-3 mt-6">
                    <button type="button" onclick="closeContactModal()" 
                            class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-300">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    `;
    
    return modal;
}

window.closeContactModal = function() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.remove();
    }
}

window.submitContactForm = function(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value,
        timestamp: new Date().toISOString()
    };
    
    // Save to local storage for admin review
    const contacts = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    contacts.push(formData);
    localStorage.setItem('contactSubmissions', JSON.stringify(contacts));
    
    showNotification('Message sent successfully! We will respond within 24 hours.', 'success');
    closeContactModal();
}

function openAboutPage() {
    showNotification('About page coming soon', 'info');
}

function openCareersPage() {
    showNotification('Careers page coming soon', 'info');
}

function openBlog() {
    showNotification('Blog coming soon', 'info');
}

function setupNewsletterSubscription() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        subscribeToNewsletter(email);
    });
}

function subscribeToNewsletter(email) {
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Save subscription
    const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
    
    if (subscriptions.includes(email)) {
        showNotification('You are already subscribed to our newsletter', 'info');
        return;
    }
    
    subscriptions.push(email);
    localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
    
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    
    // Clear form
    const emailInput = document.querySelector('#newsletterForm input[type="email"]');
    if (emailInput) {
        emailInput.value = '';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setupSocialMediaLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.dataset.platform;
            handleSocialMediaClick(platform);
        });
    });
}

function handleSocialMediaClick(platform) {
    const socialUrls = {
        facebook: 'https://facebook.com/canchasya',
        twitter: 'https://twitter.com/canchasya',
        instagram: 'https://instagram.com/canchasya',
        youtube: 'https://youtube.com/canchasya',
        linkedin: 'https://linkedin.com/company/canchasya'
    };
    
    const url = socialUrls[platform];
    if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        showNotification(`${platform} page coming soon`, 'info');
    }
}

function updateFooterYear() {
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function setupFooterAnimations() {
    // Add hover effects to footer sections
    const footerSections = document.querySelectorAll('footer .footer-section');
    
    footerSections.forEach(section => {
        const links = section.querySelectorAll('a, button');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.classList.add('transform', 'translate-x-2');
            });
            
            link.addEventListener('mouseleave', function() {
                this.classList.remove('transform', 'translate-x-2');
            });
        });
    });
}

// Initialize footer when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeFooter();
});

// Export for global use
window.footerUtils = {
    openHelpCenter,
    openTermsOfService,
    openPrivacyPolicy,
    openContactForm,
    subscribeToNewsletter
};
