// Eco Wellness Login Form JavaScript
class EcoWellnessLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.harmony-button');
        this.successMessage = document.getElementById('successMessage');
        this.socialButtons = document.querySelectorAll('.earth-social');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupSocialButtons();
        this.setupWellnessEffects();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        
        // Add placeholder for label animations
        this.emailInput.setAttribute('placeholder', ' ');
        this.passwordInput.setAttribute('placeholder', ' ');
    }
    
    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            
            this.passwordToggle.classList.toggle('toggle-visible', type === 'text');
        });
    }
    
    setupSocialButtons() {
        this.socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const provider = button.querySelector('span').textContent.trim();
                this.handleSocialLogin(provider, button);
            });
        });
    }
    
    setupWellnessEffects() {
        // Add mindful focus effects
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', (e) => {
                this.triggerMindfulEffect(e.target.closest('.organic-field'));
            });
            
            input.addEventListener('blur', (e) => {
                this.resetMindfulEffect(e.target.closest('.organic-field'));
            });
        });
    }
    
    triggerMindfulEffect(field) {
        // Add gentle breathing effect to the field
        const fieldNature = field.querySelector('.field-nature');
        fieldNature.style.animation = 'gentleBreath 3s ease-in-out infinite';
    }
    
    resetMindfulEffect(field) {
        // Remove breathing effect
        const fieldNature = field.querySelector('.field-nature');
        fieldNature.style.animation = '';
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('email', 'Your email helps us connect with you mindfully');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError('email', 'Please share a valid email address');
            return false;
        }
        
        this.clearError('email');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', 'Your sanctuary needs a protective key');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('password', 'Please choose a stronger protection (6+ characters)');
            return false;
        }
        
        this.clearError('password');
        return true;
    }
    
    showError(field, message) {
        const organicField = document.getElementById(field).closest('.organic-field');
        const errorElement = document.getElementById(`${field}Error`);
        
        organicField.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    clearError(field) {
        const organicField = document.getElementById(field).closest('.organic-field');
        const errorElement = document.getElementById(`${field}Error`);
        
        organicField.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 300);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }
        
        this.setLoading(true);
        
        try {
            // Simulate mindful authentication process
            await new Promise(resolve => setTimeout(resolve, 2800));
            
            // Show harmony success
            this.showHarmonySuccess();
        } catch (error) {
            this.showError('password', 'Connection to sanctuary was interrupted. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }
    
    async handleSocialLogin(provider, button) {
        console.log(`Connecting with ${provider} mindfully...`);
        
        // Organic loading state
        const originalHTML = button.innerHTML;
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.7';
        
        const loadingHTML = `
            <div class="social-earth"></div>
            <div style="display: flex; gap: 4px;">
                <div style="width: 6px; height: 6px; background: #4caf50; border-radius: 50%; animation: organicGrow 1.5s ease-in-out infinite;"></div>
                <div style="width: 6px; height: 6px; background: #4caf50; border-radius: 50%; animation: organicGrow 1.5s ease-in-out infinite; animation-delay: 0.2s;"></div>
                <div style="width: 6px; height: 6px; background: #4caf50; border-radius: 50%; animation: organicGrow 1.5s ease-in-out infinite; animation-delay: 0.4s;"></div>
            </div>
            <span>Connecting...</span>
            <div class="social-glow"></div>
        `;
        
        button.innerHTML = loadingHTML;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2200));
            console.log(`Redirecting to ${provider} wellness connection...`);
            // window.location.href = `/auth/${provider.toLowerCase()}`;
        } catch (error) {
            console.error(`${provider} connection was interrupted: ${error.message}`);
        } finally {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
            button.innerHTML = originalHTML;
        }
    }
    
    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
        
        // Disable social buttons during mindful processing
        this.socialButtons.forEach(button => {
            button.style.pointerEvents = loading ? 'none' : 'auto';
            button.style.opacity = loading ? '0.6' : '1';
        });
    }
    
    showHarmonySuccess() {
        // Hide form with organic transition
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0';
        
        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelector('.natural-social').style.display = 'none';
            document.querySelector('.nurture-signup').style.display = 'none';
            document.querySelector('.balance-divider').style.display = 'none';
            
            // Show harmony success
            this.successMessage.classList.add('show');
            
        }, 300);
        
        // Redirect after harmony established
        setTimeout(() => {
            console.log('Welcome to your wellness sanctuary...');
            // window.location.href = '/wellness-dashboard';
        }, 3500);
    }
}

// Add gentle breathing animation to CSS dynamically
if (!document.querySelector('#wellness-keyframes')) {
    const style = document.createElement('style');
    style.id = 'wellness-keyframes';
    style.textContent = `
        @keyframes gentleBreath {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.01); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the wellness form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EcoWellnessLoginForm();
});