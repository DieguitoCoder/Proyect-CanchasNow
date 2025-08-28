// Utility helper functions for CanchasYa platform

// Date and Time Utilities
const DateTimeUtils = {
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatTime: function(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    },

    formatDateTime: function(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    isToday: function(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },

    isTomorrow: function(dateString) {
        const date = new Date(dateString);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date.toDateString() === tomorrow.toDateString();
    },

    daysFromToday: function(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    addDays: function(dateString, days) {
        const date = new Date(dateString);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    },

    getWeekDays: function(startDate) {
        const days = [];
        const start = new Date(startDate);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            days.push(date.toISOString().split('T')[0]);
        }
        
        return days;
    },

    isWeekend: function(dateString) {
        const date = new Date(dateString);
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    },

    getTimeDifference: function(startTime, endTime) {
        const start = new Date(`2000-01-01 ${startTime}`);
        const end = new Date(`2000-01-01 ${endTime}`);
        const diffMs = end - start;
        return Math.round(diffMs / (1000 * 60 * 60)); // Hours
    }
};

// String Utilities
const StringUtils = {
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    titleCase: function(str) {
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    },

    slugify: function(str) {
        return str.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    truncate: function(str, length, suffix = '...') {
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },

    stripHtml: function(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    },

    formatPhone: function(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 11 && cleaned[0] === '1') {
            return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
        }
        return phone;
    },

    generateRandomString: function(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// Number Utilities
const NumberUtils = {
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    formatNumber: function(number) {
        return new Intl.NumberFormat('en-US').format(number);
    },

    clamp: function(number, min, max) {
        return Math.min(Math.max(number, min), max);
    },

    roundToDecimal: function(number, decimals = 2) {
        return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },

    randomBetween: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    calculatePercentage: function(part, total) {
        if (total === 0) return 0;
        return Math.round((part / total) * 100);
    }
};

// Array Utilities
const ArrayUtils = {
    groupBy: function(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    },

    sortBy: function(array, key, direction = 'asc') {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (direction === 'desc') {
                return bVal > aVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
        });
    },

    unique: function(array) {
        return [...new Set(array)];
    },

    uniqueBy: function(array, key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    },

    chunk: function(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },

    shuffle: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};

// DOM Utilities
const DOMUtils = {
    createElement: function(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    getElement: function(selector) {
        return document.querySelector(selector);
    },

    getElements: function(selector) {
        return document.querySelectorAll(selector);
    },

    addClass: function(element, className) {
        if (element) element.classList.add(className);
    },

    removeClass: function(element, className) {
        if (element) element.classList.remove(className);
    },

    toggleClass: function(element, className) {
        if (element) element.classList.toggle(className);
    },

    hasClass: function(element, className) {
        return element ? element.classList.contains(className) : false;
    },

    show: function(element) {
        if (element) element.style.display = 'block';
    },

    hide: function(element) {
        if (element) element.style.display = 'none';
    },

    fadeIn: function(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let opacity = 0;
        const timer = setInterval(() => {
            opacity += 50 / duration;
            element.style.opacity = opacity;
            if (opacity >= 1) {
                clearInterval(timer);
                element.style.opacity = '1';
            }
        }, 50);
    },

    fadeOut: function(element, duration = 300) {
        if (!element) return;
        
        let opacity = 1;
        const timer = setInterval(() => {
            opacity -= 50 / duration;
            element.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(timer);
                element.style.display = 'none';
            }
        }, 50);
    }
};

// Validation Utilities
const ValidationUtils = {
    isEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isPhone: function(phone) {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    },

    isURL: function(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    isDate: function(date) {
        return date instanceof Date && !isNaN(date);
    },

    isPasswordStrong: function(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongRegex.test(password);
    },

    isEmpty: function(value) {
        return value === null || value === undefined || value === '' || 
               (Array.isArray(value) && value.length === 0) ||
               (typeof value === 'object' && Object.keys(value).length === 0);
    },

    isNumber: function(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }
};

// Storage Utilities
const StorageUtils = {
    set: function(key, value, expiry = null) {
        const item = {
            value: value,
            expiry: expiry ? Date.now() + expiry : null
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    get: function(key, defaultValue = null) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return defaultValue;

        try {
            const item = JSON.parse(itemStr);
            
            // Check if item has expired
            if (item.expiry && Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return defaultValue;
            }
            
            return item.value;
        } catch (e) {
            return defaultValue;
        }
    },

    remove: function(key) {
        localStorage.removeItem(key);
    },

    clear: function() {
        localStorage.clear();
    },

    getSize: function() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }
};

// API Utilities
const APIUtils = {
    request: async function(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    get: function(url, params = {}) {
        const urlParams = new URLSearchParams(params);
        const fullUrl = urlParams.toString() ? `${url}?${urlParams}` : url;
        return this.request(fullUrl, { method: 'GET' });
    },

    post: function(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    put: function(url, data = {}) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete: function(url) {
        return this.request(url, { method: 'DELETE' });
    }
};

// Event Utilities
const EventUtils = {
    debounce: function(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    once: function(func) {
        let called = false;
        return function(...args) {
            if (!called) {
                called = true;
                return func.apply(this, args);
            }
        };
    }
};

// Browser Utilities
const BrowserUtils = {
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isTablet: function() {
        return /iPad|Android/i.test(navigator.userAgent) && !this.isMobile();
    },

    isDesktop: function() {
        return !this.isMobile() && !this.isTablet();
    },

    getViewportSize: function() {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        };
    },

    scrollTo: function(element, offset = 0) {
        if (element) {
            const top = element.offsetTop - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    },

    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    },

    download: function(data, filename, type = 'text/plain') {
        const blob = new Blob([data], { type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};

// Export all utilities for global use
window.helpers = {
    DateTimeUtils,
    StringUtils,
    NumberUtils,
    ArrayUtils,
    DOMUtils,
    ValidationUtils,
    StorageUtils,
    APIUtils,
    EventUtils,
    BrowserUtils
};

// Make individual utilities available globally for convenience
window.formatDate = DateTimeUtils.formatDate;
window.formatTime = DateTimeUtils.formatTime;
window.formatCurrency = NumberUtils.formatCurrency;
window.isValidEmail = ValidationUtils.isEmail;
window.debounce = EventUtils.debounce;
window.throttle = EventUtils.throttle;
