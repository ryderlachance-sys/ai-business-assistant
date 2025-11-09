// Form handling for AI Business Assistant
document.addEventListener('DOMContentLoaded', function() {
    initializeFormHandlers();
});

function initializeFormHandlers() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Google OAuth buttons
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const googleRegisterBtn = document.getElementById('googleRegisterBtn');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleAuth);
    }
    
    if (googleRegisterBtn) {
        googleRegisterBtn.addEventListener('click', handleGoogleAuth);
    }
    
    // Demo video button
    const demoBtn = document.querySelector('a[href="#demo"]');
    if (demoBtn) {
        demoBtn.addEventListener('click', handleDemoClick);
    }
    
    // Pricing buttons
    const pricingBtns = document.querySelectorAll('a[href="/pricing"]');
    pricingBtns.forEach(btn => {
        btn.addEventListener('click', handlePricingClick);
    });
    
    // CTA buttons
    const ctaBtns = document.querySelectorAll('a[href="/register"]');
    ctaBtns.forEach(btn => {
        btn.addEventListener('click', handleCTAClick);
    });
}

// Login form handler
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading">⏳</span> Signing In...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } else {
            showNotification(result.message || 'Login failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Register form handler
async function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const registerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        company: formData.get('company')
    };
    
    // Validate password confirmation
    if (registerData.password !== formData.get('confirmPassword')) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading">⏳</span> Creating Account...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Account created successfully! Redirecting to dashboard...', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } else {
            showNotification(result.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Google OAuth handler
function handleGoogleAuth(e) {
    e.preventDefault();
    
    const isLogin = e.target.id === 'googleLoginBtn';
    const action = isLogin ? 'login' : 'register';
    
    showNotification(`Redirecting to Google for ${action}...`, 'info');
    
    // Check if Google OAuth is configured
    fetch('/auth/google')
        .then(response => response.json())
        .then(data => {
            if (data.setupRequired) {
                showNotification('Google OAuth not configured. Please use email login for now.', 'warning');
                // Optionally show setup instructions
                showGoogleSetupModal();
            } else {
                // Redirect to Google OAuth
                window.location.href = '/auth/google';
            }
        })
        .catch(error => {
            console.error('Error checking Google OAuth:', error);
            showNotification('Error connecting to Google. Please try again.', 'error');
        });
}

// Demo video handler
function handleDemoClick(e) {
    e.preventDefault();
    
    // Create demo modal
    const modal = createDemoModal();
    document.body.appendChild(modal);
    
    showNotification('Opening demo video...', 'info');
}

// Pricing page handler
function handlePricingClick(e) {
    e.preventDefault();
    
    // Track pricing click
    trackEvent('pricing_click', {
        source: e.target.textContent.trim(),
        page: window.location.pathname
    });
    
    // Navigate to pricing
    window.location.href = '/pricing';
}

// CTA button handler
function handleCTAClick(e) {
    e.preventDefault();
    
    // Track CTA click
    trackEvent('cta_click', {
        button_text: e.target.textContent.trim(),
        page: window.location.pathname
    });
    
    // Navigate to register
    window.location.href = '/register';
}

// Create demo modal
function createDemoModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal demo-modal">
            <div class="modal-header">
                <h2>AI Business Assistant Demo</h2>
                <button class="modal-close" id="modal-close-btn">&times;</button>
            </div>
            <div class="modal-content">
                <div class="demo-video">
                    <div class="video-placeholder">
                        <div class="play-button">▶️</div>
                        <p>Demo video would play here</p>
                        <p class="demo-description">
                            Watch how our AI Business Assistant can automate your email responses, 
                            manage your schedule, and boost your productivity by 10+ hours per week.
                        </p>
                    </div>
                </div>
                <div class="demo-features">
                    <h3>What you'll see in the demo:</h3>
                    <ul>
                        <li>📧 Smart email automation and responses</li>
                        <li>📅 Intelligent calendar management</li>
                        <li>📊 Real-time business analytics</li>
                        <li>🔗 Seamless integrations</li>
                        <li>🤖 AI-powered insights and recommendations</li>
                    </ul>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="close-modal-btn">Close</button>
                    <a href="/register" class="btn btn-primary">Start Free Trial</a>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for closing the modal
    const closeBtn = modal.querySelector('#modal-close-btn');
    const closeModalBtn = modal.querySelector('#close-modal-btn');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Add demo modal styles
    if (!document.querySelector('#demo-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'demo-modal-styles';
        style.textContent = `
            .demo-modal {
                max-width: 600px;
            }
            
            .demo-video {
                margin-bottom: 2rem;
            }
            
            .video-placeholder {
                background: #f8fafc;
                border: 2px dashed #d1d5db;
                border-radius: 10px;
                padding: 3rem;
                text-align: center;
                position: relative;
            }
            
            .play-button {
                font-size: 3rem;
                margin-bottom: 1rem;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            
            .play-button:hover {
                transform: scale(1.1);
            }
            
            .demo-description {
                color: #6b7280;
                margin-top: 1rem;
            }
            
            .demo-features ul {
                list-style: none;
                padding: 0;
            }
            
            .demo-features li {
                padding: 0.5rem 0;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .demo-features li:last-child {
                border-bottom: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    return modal;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-info {
                border-left: 4px solid #3b82f6;
            }
            
            .notification-warning {
                border-left: 4px solid #f59e0b;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 1rem;
                gap: 0.75rem;
            }
            
            .notification-icon {
                font-size: 1.25rem;
            }
            
            .notification-message {
                flex: 1;
                font-weight: 500;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    return icons[type] || 'ℹ️';
}

// Analytics tracking
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    
    // In a real app, this would send to analytics service
    // Example: Google Analytics, Mixpanel, etc.
}

// Close modal function
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        // Remove the modal with a fade out effect
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Google setup modal
function showGoogleSetupModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>Google OAuth Setup Required</h2>
                <button class="modal-close" id="modal-close-btn">&times;</button>
            </div>
            <div class="modal-content">
                <div class="google-setup-content">
                    <div class="setup-icon">🔧</div>
                    <h3>Google OAuth Not Configured</h3>
                    <p>To use Google Sign-In, you need to set up Google OAuth credentials.</p>
                    
                    <div class="setup-steps">
                        <h4>Quick Setup Steps:</h4>
                        <ol>
                            <li>Go to <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></li>
                            <li>Create a new project or select existing one</li>
                            <li>Enable Gmail API and Google Calendar API</li>
                            <li>Create OAuth 2.0 credentials</li>
                            <li>Set redirect URI to: <code>http://localhost:3002/auth/google/callback</code></li>
                            <li>Add credentials to your <code>config.env</code> file</li>
                            <li>Restart the server</li>
                        </ol>
                    </div>
                    
                    <div class="setup-note">
                        <p><strong>Note:</strong> For now, you can use email login instead of Google Sign-In.</p>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-secondary" id="close-modal-btn">Close</button>
                        <a href="https://console.cloud.google.com/" target="_blank" class="btn btn-primary">Open Google Console</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for closing the modal
    const closeBtn = modal.querySelector('#modal-close-btn');
    const closeModalBtn = modal.querySelector('#close-modal-btn');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    document.body.appendChild(modal);
    
    // Add setup modal styles
    if (!document.querySelector('#google-setup-styles')) {
        const style = document.createElement('style');
        style.id = 'google-setup-styles';
        style.textContent = `
            .google-setup-content {
                text-align: center;
            }
            
            .setup-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .setup-steps {
                text-align: left;
                background: #f8fafc;
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
            }
            
            .setup-steps ol {
                margin: 0.5rem 0;
                padding-left: 1.5rem;
            }
            
            .setup-steps li {
                margin: 0.5rem 0;
            }
            
            .setup-steps code {
                background: #e5e7eb;
                padding: 0.2rem 0.4rem;
                border-radius: 4px;
                font-family: monospace;
            }
            
            .setup-note {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 1rem;
                margin: 1rem 0;
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for external use
window.Forms = {
    showNotification,
    trackEvent,
    closeModal,
    showGoogleSetupModal
};

