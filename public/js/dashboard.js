// Dashboard JavaScript for AI Business Assistant

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing dashboard...');
    initializeDashboard();
    initializeNavigation();
    initializeAI();
    initializeCharts();
    initializeForms();
    
    // Handle OAuth callback messages
    handleOAuthCallback();
    
    console.log('Dashboard initialization complete');
});

// Handle OAuth callback messages from URL parameters
function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const integration = urlParams.get('integration');
    const service = urlParams.get('service');
    
    if (integration === 'connected' && service) {
        const serviceMap = {
            'google': ['gmail', 'google-calendar'],
            'slack': ['slack'],
            'microsoft': ['microsoft-teams', 'outlook'],
            'salesforce': ['salesforce'],
            'hubspot': ['hubspot'],
            'zapier': ['zapier'],
            'trello': ['trello'],
            'asana': ['asana'],
            'notion': ['notion'],
            'github': ['github']
        };
        
        const integrationIds = serviceMap[service] || [];
        integrationIds.forEach(integrationId => {
            updateIntegrationStatus(integrationId, 'connected');
        });
        
        showNotification(`${service.charAt(0).toUpperCase() + service.slice(1)} connected successfully!`, 'success');
        
        // Clean up URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    } else if (integration === 'error' && service) {
        showNotification(`Failed to connect to ${service}. Please try again.`, 'error');
        
        // Clean up URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
}

// Initialize dashboard
function initializeDashboard() {
    console.log('🤖 AI Business Assistant Dashboard initialized');
    
    // Load dashboard data
    loadDashboardData();
    
    // Set up real-time updates
    setInterval(updateDashboardStats, 30000); // Update every 30 seconds
    
    // Initialize all button functionality
    initializeButtonHandlers();
}

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation clicked:', this.getAttribute('href'));
            
            // Remove active class from all items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            console.log('Target section:', targetId, targetSection);
            
            if (targetSection) {
                targetSection.classList.add('active');
                console.log('Section activated:', targetId);
                
                // Re-initialize integration buttons if integrations section is shown
                if (targetId === 'integrations') {
                    console.log('Initializing integration buttons...');
                    initializeIntegrationButtons();
                }
            }
        });
    });
}

// AI Chat functionality
function initializeAI() {
    // Create AI chat interface
    createAIChatInterface();
    
    // Set up chat event listeners
    setupChatEventListeners();
}

function createAIChatInterface() {
    // Check if chat interface already exists
    if (document.getElementById('ai-chat-interface')) return;
    
    // Create chat button
    const chatButton = document.createElement('button');
    chatButton.id = 'ai-chat-button';
    chatButton.className = 'ai-chat-button';
    chatButton.innerHTML = '🤖 AI Assistant';
    
    // Create chat interface
    const chatInterface = document.createElement('div');
    chatInterface.id = 'ai-chat-interface';
    chatInterface.className = 'ai-chat-interface';
    chatInterface.innerHTML = `
        <div class="chat-header">
            <h3>AI Business Assistant</h3>
            <button class="chat-close">&times;</button>
        </div>
        <div class="chat-messages" id="chat-messages">
            <div class="message ai-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>Hello! I'm your AI Business Assistant. I can help you with:</p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>📧 Email automation and responses</li>
                        <li>📅 Smart scheduling and calendar management</li>
                        <li>📊 Business analytics and insights</li>
                        <li>🔗 Integration setup and management</li>
                        <li>⚡ Process optimization</li>
                    </ul>
                    <p>What would you like to work on today?</p>
                </div>
            </div>
        </div>
        <div class="chat-quick-actions" id="chat-quick-actions">
            <button class="quick-action-btn" data-action="email">📧 Email Help</button>
            <button class="quick-action-btn" data-action="schedule">📅 Schedule Meeting</button>
            <button class="quick-action-btn" data-action="analytics">📊 View Analytics</button>
            <button class="quick-action-btn" data-action="integrations">🔗 Integrations</button>
        </div>
        <div class="chat-input-container">
            <input type="text" id="chat-input" placeholder="Ask me anything about your business..." />
            <button id="chat-send">Send</button>
        </div>
    `;
    
    // Add styles
    const chatStyles = `
        .ai-chat-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            font-weight: 600;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .ai-chat-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        
        .ai-chat-interface {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: none;
            flex-direction: column;
            z-index: 1001;
            overflow: hidden;
        }
        
        .ai-chat-interface.show {
            display: flex;
        }
        
        .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-header h3 {
            margin: 0;
            font-size: 16px;
        }
        
        .chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8fafc;
        }
        
        .message {
            display: flex;
            margin-bottom: 15px;
            align-items: flex-start;
        }
        
        .message-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            flex-shrink: 0;
        }
        
        .user-message .message-avatar {
            background: #10b981;
        }
        
        .message-content {
            background: white;
            padding: 12px 15px;
            border-radius: 15px;
            max-width: 80%;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .user-message .message-content {
            background: #10b981;
            color: white;
        }
        
        .user-message {
            flex-direction: row-reverse;
        }
        
        .user-message .message-avatar {
            margin-right: 0;
            margin-left: 10px;
        }
        
        .chat-quick-actions {
            padding: 10px 15px;
            background: #f8fafc;
            border-top: 1px solid #e5e7eb;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .quick-action-btn {
            background: white;
            border: 1px solid #d1d5db;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #374151;
        }
        
        .quick-action-btn:hover {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
        
        .chat-input-container {
            padding: 15px 20px;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 10px;
        }
        
        #chat-input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
        }
        
        #chat-input:focus {
            border-color: #667eea;
        }
        
        #chat-send {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
        }
        
        #chat-send:hover {
            opacity: 0.9;
        }
        
        .typing-dots {
            animation: typing 1.5s infinite;
        }
        
        @keyframes typing {
            0%, 20% { opacity: 0; }
            50% { opacity: 1; }
            80%, 100% { opacity: 0; }
        }
    `;
    
    // Add styles to head
    const style = document.createElement('style');
    style.textContent = chatStyles;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(chatButton);
    document.body.appendChild(chatInterface);
}

function setupChatEventListeners() {
    const chatButton = document.getElementById('ai-chat-button');
    const chatInterface = document.getElementById('ai-chat-interface');
    const chatClose = document.querySelector('.chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    
    // Toggle chat interface
    chatButton.addEventListener('click', () => {
        chatInterface.classList.toggle('show');
        if (chatInterface.classList.contains('show')) {
            chatInput.focus();
        }
    });
    
    // Close chat
    chatClose.addEventListener('click', () => {
        chatInterface.classList.remove('show');
    });
    
    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessageToChat(message, 'user');
        chatInput.value = '';
        
        // Send to AI
        sendToAI(message);
    }
    
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Quick action buttons
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'user' ? '👤' : '🤖';
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendToAI(message) {
    let typingIndicator;
    let typingInterval;
    try {
        // Show typing indicator
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai-message typing';
        typingIndicator.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>AI is thinking<span class="typing-dots">...</span></p>
            </div>
        `;
        document.getElementById('chat-messages').appendChild(typingIndicator);
        
        // Animate typing dots
        const dots = typingIndicator.querySelector('.typing-dots');
        let dotCount = 0;
        typingInterval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            dots.textContent = '.'.repeat(dotCount);
        }, 500);
        
        // Send to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversationHistory: getConversationHistory()
            })
        });
        
        const data = await response.json();
        
        // Clear typing animation and remove indicator
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }
        if (typingIndicator) {
            typingIndicator.remove();
            typingIndicator = null;
        }
        
        // Add AI response
        addMessageToChat(data.response, 'ai');
        
    } catch (error) {
        console.error('Error sending message to AI:', error);
        
        // Clear typing animation and remove indicator
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }
        if (typingIndicator && typingIndicator.parentNode) {
            typingIndicator.remove();
            typingIndicator = null;
        } else {
            const existingIndicator = document.querySelector('.typing');
            if (existingIndicator) {
                existingIndicator.remove();
            }
        }
        
        // Add error message
        addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
    }
}

function getConversationHistory() {
    const messages = document.querySelectorAll('.message:not(.typing)');
    const history = [];
    
    messages.forEach(message => {
        const content = message.querySelector('.message-content p').textContent;
        const sender = message.classList.contains('user-message') ? 'user' : 'assistant';
        history.push({ role: sender, content: content });
    });
    
    return history.slice(-10); // Keep last 10 messages
}

function handleQuickAction(action) {
    const messages = {
        email: "I can help you with email automation! I can create auto-response rules, suggest email templates, and help you categorize incoming emails. What specific email challenge are you facing?",
        schedule: "Let's work on your scheduling! I can help you find optimal meeting times, set up automatic confirmations, and manage your calendar preferences. What type of meeting would you like to schedule?",
        analytics: "I'll show you your business analytics! I can help you understand your productivity metrics, email performance, and time-saving insights. What specific data would you like to see?",
        integrations: "I can help you set up integrations! I can guide you through connecting Gmail, Google Calendar, Slack, and other business tools. Which integration would you like to work on?"
    };
    
    const message = messages[action] || "I'm here to help! What would you like to know?";
    addMessageToChat(message, 'ai');
    
    // Scroll to bottom
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Dashboard data loading
async function loadDashboardData() {
    try {
        // Load stats
        const statsResponse = await fetch('/api/analytics/dashboard');
        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            const analytics = statsData.analytics || {};
            const overview = analytics.overview || {};
            updateStatsDisplay({
                emailsProcessed: overview.emailsProcessed ?? statsData.emailsProcessed,
                hoursSaved: overview.hoursSaved ?? statsData.hoursSaved,
                meetingsScheduled: overview.meetingsScheduled ?? statsData.meetingsScheduled,
                automationRate: overview.automationRate !== undefined
                    ? `${overview.automationRate}%`
                    : statsData.automationRate
            });
        } else {
            updateStatsDisplay(getMockStats());
        }
        
        // Load recent activity
        const activityResponse = await fetch('/api/analytics/activity');
        if (activityResponse.ok) {
            const activityData = await activityResponse.json();
            updateActivityDisplay(activityData.activity || getMockActivity());
        } else {
            updateActivityDisplay(getMockActivity());
        }
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Use mock data if API fails
        updateStatsDisplay(getMockStats());
        updateActivityDisplay(getMockActivity());
    }
}

function updateStatsDisplay(stats) {
    const statCards = document.querySelectorAll('.stat-card');
    
    if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-number').textContent = stats.emailsProcessed || '247';
        statCards[1].querySelector('.stat-number').textContent = stats.hoursSaved || '8.5';
        statCards[2].querySelector('.stat-number').textContent = stats.meetingsScheduled || '23';
        statCards[3].querySelector('.stat-number').textContent = stats.automationRate || '94%';
    }
}

function updateActivityDisplay(activity) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    const items = Array.isArray(activity) ? activity : getMockActivity();
    
    items.forEach(item => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">${item.icon}</div>
            <div class="activity-content">
                <div class="activity-title">${item.title}</div>
                <div class="activity-time">${item.time}</div>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

function getMockStats() {
    return {
        emailsProcessed: 247,
        hoursSaved: 8.5,
        meetingsScheduled: 23,
        automationRate: '94%'
    };
}

function getMockActivity() {
    return [
        {
            icon: '📧',
            title: 'Email auto-responded to customer inquiry',
            time: '2 minutes ago'
        },
        {
            icon: '📅',
            title: 'Meeting scheduled with Sarah Johnson',
            time: '15 minutes ago'
        },
        {
            icon: '📊',
            title: 'Weekly analytics report generated',
            time: '1 hour ago'
        },
        {
            icon: '🔗',
            title: 'Google Calendar integration updated',
            time: '2 hours ago'
        }
    ];
}

// Chart functionality
function initializeCharts() {
    // Simple chart animations
    animateChartBars();
}

function animateChartBars() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.transform = 'scaleY(1)';
        }, index * 100);
    });
}

// Form handling
function initializeForms() {
    // Settings form
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
    }
    
    // Email rule form
    const emailRuleForm = document.querySelector('.email-rule-form');
    if (emailRuleForm) {
        emailRuleForm.addEventListener('submit', handleEmailRuleSubmit);
    }
}

function handleSettingsSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Settings saved successfully!', 'success');
    }, 500);
}

function handleEmailRuleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Email rule created successfully!', 'success');
        e.target.reset();
    }, 500);
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
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
                z-index: 10000;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                transform: translateX(100%);
                transition: transform 0.3s ease-in-out;
                max-width: 400px;
            }
            
            .notification-success {
                background: #10b981;
                color: white;
            }
            
            .notification-error {
                background: #ef4444;
                color: white;
            }
            
            .notification-info {
                background: #3b82f6;
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Real-time updates
function updateDashboardStats() {
    // Simulate real-time data updates
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent);
        if (!isNaN(currentValue)) {
            const newValue = currentValue + Math.floor(Math.random() * 3);
            stat.textContent = newValue;
        }
    });
}

// Initialize all button handlers
function initializeButtonHandlers() {
    console.log('Initializing button handlers...');
    // Email automation buttons
    const addRuleBtn = document.querySelector('.btn[data-action="add-rule"]');
    if (addRuleBtn) {
        addRuleBtn.addEventListener('click', () => {
            showEmailRuleModal();
        });
    }
    
    const viewAnalyticsBtn = document.querySelector('.btn[data-action="view-analytics"]');
    if (viewAnalyticsBtn) {
        viewAnalyticsBtn.addEventListener('click', () => {
            showEmailAnalytics();
        });
    }
    
    // Scheduling buttons
    const scheduleMeetingBtn = document.querySelector('.btn[data-action="schedule-meeting"]');
    if (scheduleMeetingBtn) {
        scheduleMeetingBtn.addEventListener('click', () => {
            showScheduleMeetingModal();
        });
    }
    
    const preferencesBtn = document.querySelector('.btn[data-action="preferences"]');
    if (preferencesBtn) {
        preferencesBtn.addEventListener('click', () => {
            showPreferencesModal();
        });
    }
    
    // Calendar navigation
    const prevMonthBtn = document.querySelector('.nav-btn:first-child');
    const nextMonthBtn = document.querySelector('.nav-btn:last-child');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            navigateCalendar(-1);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            navigateCalendar(1);
        });
    }
    
    // Initialize integration buttons
    initializeIntegrationButtons();
    
    // Settings buttons
    const saveChangesBtn = document.querySelector('.btn[data-action="save-changes"]');
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', () => {
            saveAccountSettings();
        });
    }
    
    const savePreferencesBtn = document.querySelector('.btn[data-action="save-preferences"]');
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', () => {
            saveAutomationPreferences();
        });
    }
    
    // User dropdown
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = userMenu.querySelector('.user-dropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    });
    
    // Dropdown items
    const profileBtn = document.querySelector('.dropdown-item[data-action="profile"]');
    const settingsBtn = document.querySelector('.dropdown-item[data-action="settings"]');
    const logoutBtn = document.querySelector('.dropdown-item[data-action="logout"]');
    
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            showProfileModal();
        });
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            navigateToSection('settings');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            handleLogout();
        });
    }
}

// Email automation functions
function showEmailRuleModal() {
    const modal = createModal('Add Email Rule', `
        <form id="email-rule-form">
            <div class="form-group">
                <label for="rule-name">Rule Name</label>
                <input type="text" id="rule-name" name="ruleName" required>
            </div>
            <div class="form-group">
                <label for="trigger-keywords">Trigger Keywords</label>
                <input type="text" id="trigger-keywords" name="triggerKeywords" placeholder="pricing, support, demo">
            </div>
            <div class="form-group">
                <label for="response-template">Response Template</label>
                <textarea id="response-template" name="responseTemplate" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="autoSend" checked>
                    <span>Auto-send responses</span>
                </label>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Rule</button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('email-rule-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const ruleData = Object.fromEntries(formData);
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Email rule created successfully!', 'success');
            closeModal();
            // Refresh email rules section
            loadEmailRules();
        }, 1000);
    });
}

function showEmailAnalytics() {
    const modal = createModal('Email Analytics', `
        <div class="analytics-content">
            <div class="metric-card">
                <h3>Response Rate</h3>
                <div class="metric-value">94.2%</div>
                <div class="metric-change positive">+3.1% this week</div>
            </div>
            <div class="metric-card">
                <h3>Average Response Time</h3>
                <div class="metric-value">2.3 minutes</div>
                <div class="metric-change positive">-45% improvement</div>
            </div>
            <div class="metric-card">
                <h3>Emails Processed</h3>
                <div class="metric-value">1,247</div>
                <div class="metric-change positive">+12% this month</div>
            </div>
            <div class="chart-placeholder">
                <h4>Email Volume Trend</h4>
                <div class="chart-bars">
                    <div class="bar" style="height: 60%"></div>
                    <div class="bar" style="height: 80%"></div>
                    <div class="bar" style="height: 45%"></div>
                    <div class="bar" style="height: 90%"></div>
                    <div class="bar" style="height: 70%"></div>
                    <div class="bar" style="height: 85%"></div>
                    <div class="bar" style="height: 95%"></div>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Scheduling functions
function showScheduleMeetingModal() {
    const modal = createModal('Schedule Meeting', `
        <form id="schedule-meeting-form">
            <div class="form-group">
                <label for="meeting-title">Meeting Title</label>
                <input type="text" id="meeting-title" name="title" required>
            </div>
            <div class="form-group">
                <label for="meeting-date">Date</label>
                <input type="date" id="meeting-date" name="date" required>
            </div>
            <div class="form-group">
                <label for="meeting-time">Time</label>
                <input type="time" id="meeting-time" name="time" required>
            </div>
            <div class="form-group">
                <label for="meeting-duration">Duration</label>
                <select id="meeting-duration" name="duration">
                    <option value="30">30 minutes</option>
                    <option value="60" selected>1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                </select>
            </div>
            <div class="form-group">
                <label for="meeting-participants">Participants (emails)</label>
                <input type="text" id="meeting-participants" name="participants" placeholder="email1@example.com, email2@example.com">
            </div>
            <div class="form-group">
                <label for="meeting-description">Description</label>
                <textarea id="meeting-description" name="description" rows="3"></textarea>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Schedule Meeting</button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('schedule-meeting-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const meetingData = Object.fromEntries(formData);
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Meeting scheduled successfully!', 'success');
            closeModal();
            // Refresh calendar
            loadUpcomingMeetings();
        }, 1000);
    });
}

function showPreferencesModal() {
    const modal = createModal('Scheduling Preferences', `
        <form id="preferences-form">
            <div class="form-group">
                <label for="work-hours-start">Work Hours Start</label>
                <input type="time" id="work-hours-start" name="workStart" value="09:00">
            </div>
            <div class="form-group">
                <label for="work-hours-end">Work Hours End</label>
                <input type="time" id="work-hours-end" name="workEnd" value="17:00">
            </div>
            <div class="form-group">
                <label for="meeting-buffer">Buffer Time (minutes)</label>
                <input type="number" id="meeting-buffer" name="bufferTime" value="15" min="0" max="60">
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="autoAccept" checked>
                    <span>Auto-accept meetings during work hours</span>
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="sendReminders" checked>
                    <span>Send email reminders</span>
                </label>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Preferences</button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
}

// Calendar functions
function navigateCalendar(direction) {
    const currentMonth = document.querySelector('.current-month');
    if (currentMonth) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + direction);
        currentMonth.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Refresh calendar data
        loadUpcomingMeetings();
    }
}

// Initialize integration buttons
function initializeIntegrationButtons() {
    console.log('Initializing integration buttons...');
    
    // Remove existing event listeners to avoid duplicates
    const existingBtns = document.querySelectorAll('.integration-connect-btn');
    existingBtns.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // Get fresh references to buttons
    const integrationBtns = document.querySelectorAll('.integration-connect-btn');
    console.log('Found integration buttons:', integrationBtns.length);
    
    if (integrationBtns.length === 0) {
        console.error('No integration buttons found!');
        alert('No integration buttons found! Check if integrations section is visible.');
        return;
    }
    
    integrationBtns.forEach(btn => {
        console.log('Adding click listener to button:', btn);
        btn.addEventListener('click', (e) => {
            console.log('Integration button clicked!');
            alert('Integration button clicked!');
            const card = e.target.closest('.integration-card');
            const integrationId = card.getAttribute('data-integration');
            const integrationName = card.querySelector('.integration-title').textContent;
            console.log('Integration ID:', integrationId, 'Name:', integrationName);
            handleIntegrationConnection(integrationId, integrationName);
        });
    });
    
    console.log('Integration buttons initialized successfully');
    alert('Integration buttons initialized successfully!');
}

// Integration functions
function handleIntegrationConnection(integrationId, integrationName) {
    console.log('handleIntegrationConnection called with:', integrationId, integrationName);
    showIntegrationModal(integrationId, integrationName);
}

function showIntegrationModal(integrationId, integrationName) {
    const integrationInfo = getIntegrationInfo(integrationId);
    
    const modal = createModal(`Connect ${integrationName}`, `
        <div class="integration-setup">
            <div class="integration-icon">${integrationInfo.icon}</div>
            <h3>Connect ${integrationName}</h3>
            <p>${integrationInfo.description}</p>
            
            <div class="integration-steps">
                <h4>Setup Steps:</h4>
                <ol>
                    ${integrationInfo.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            
            <div class="integration-benefits">
                <h4>What you'll get:</h4>
                <ul>
                    ${integrationInfo.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="authorizeIntegration('${integrationId}', '${integrationName}')">
                    <span class="btn-text">Connect ${integrationName}</span>
                    <span class="btn-loading" style="display: none;">Connecting...</span>
                </button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function getIntegrationInfo(integrationId) {
    const integrations = {
        'gmail': {
            icon: '📧',
            description: 'Connect your Gmail account to enable email automation, smart responses, and inbox management.',
            steps: [
                'Click "Connect Gmail" below',
                'Sign in to your Google account',
                'Grant permission to access Gmail',
                'Return to complete setup'
            ],
            benefits: [
                'Automated email responses',
                'Smart email categorization',
                'Inbox management tools',
                'Email analytics and insights'
            ]
        },
        'google-calendar': {
            icon: '📅',
            description: 'Sync your Google Calendar for intelligent scheduling and meeting management.',
            steps: [
                'Click "Connect Google Calendar" below',
                'Sign in to your Google account',
                'Grant calendar access permissions',
                'Return to complete setup'
            ],
            benefits: [
                'Smart meeting scheduling',
                'Calendar conflict detection',
                'Meeting reminders and notifications',
                'Time blocking and optimization'
            ]
        },
        'slack': {
            icon: '💬',
            description: 'Integrate with Slack to receive notifications and updates directly in your workspace.',
            steps: [
                'Click "Connect Slack" below',
                'Authorize the Slack app',
                'Choose your workspace',
                'Configure notification preferences'
            ],
            benefits: [
                'Real-time notifications',
                'Team collaboration features',
                'Automated status updates',
                'Custom Slack commands'
            ]
        },
        'salesforce': {
            icon: '📊',
            description: 'Connect Salesforce to sync customer data and automate CRM workflows.',
            steps: [
                'Click "Connect Salesforce" below',
                'Sign in to your Salesforce account',
                'Grant API access permissions',
                'Configure data sync settings'
            ],
            benefits: [
                'Customer data synchronization',
                'Automated lead management',
                'Sales pipeline tracking',
                'Custom field mapping'
            ]
        },
        'microsoft-teams': {
            icon: '👥',
            description: 'Integrate with Microsoft Teams for meetings, notifications, and collaboration.',
            steps: [
                'Click "Connect Microsoft Teams" below',
                'Sign in to your Microsoft account',
                'Grant Teams access permissions',
                'Configure integration settings'
            ],
            benefits: [
                'Meeting scheduling and management',
                'Team notifications',
                'File sharing integration',
                'Chat bot capabilities'
            ]
        },
        'outlook': {
            icon: '📮',
            description: 'Connect Outlook for email and calendar synchronization across platforms.',
            steps: [
                'Click "Connect Outlook" below',
                'Sign in to your Microsoft account',
                'Grant Outlook access permissions',
                'Sync your email and calendar'
            ],
            benefits: [
                'Email synchronization',
                'Calendar integration',
                'Contact management',
                'Cross-platform access'
            ]
        },
        'hubspot': {
            icon: '🎯',
            description: 'Sync with HubSpot to automate marketing workflows and lead management.',
            steps: [
                'Click "Connect HubSpot" below',
                'Sign in to your HubSpot account',
                'Grant API access permissions',
                'Configure automation rules'
            ],
            benefits: [
                'Lead scoring automation',
                'Email marketing integration',
                'Sales pipeline management',
                'Customer journey tracking'
            ]
        },
        'zapier': {
            icon: '⚡',
            description: 'Connect with Zapier to integrate with 5000+ apps and automate workflows.',
            steps: [
                'Click "Connect Zapier" below',
                'Sign in to your Zapier account',
                'Create automation workflows',
                'Test and activate integrations'
            ],
            benefits: [
                '5000+ app integrations',
                'Custom automation workflows',
                'Multi-step automations',
                'Real-time data sync'
            ]
        },
        'trello': {
            icon: '📋',
            description: 'Sync with Trello for project management and task tracking.',
            steps: [
                'Click "Connect Trello" below',
                'Sign in to your Trello account',
                'Grant board access permissions',
                'Configure project sync settings'
            ],
            benefits: [
                'Project task synchronization',
                'Board management tools',
                'Team collaboration features',
                'Progress tracking'
            ]
        },
        'asana': {
            icon: '✅',
            description: 'Integrate with Asana for advanced project management and team coordination.',
            steps: [
                'Click "Connect Asana" below',
                'Sign in to your Asana account',
                'Grant workspace access',
                'Configure project settings'
            ],
            benefits: [
                'Project management tools',
                'Team task assignment',
                'Progress tracking',
                'Deadline management'
            ]
        },
        'notion': {
            icon: '📝',
            description: 'Sync with Notion for knowledge management and document collaboration.',
            steps: [
                'Click "Connect Notion" below',
                'Sign in to your Notion account',
                'Grant workspace access',
                'Configure sync preferences'
            ],
            benefits: [
                'Document synchronization',
                'Knowledge base integration',
                'Team collaboration tools',
                'Content management'
            ]
        },
        'github': {
            icon: '🐙',
            description: 'Connect GitHub to track code commits and project development.',
            steps: [
                'Click "Connect GitHub" below',
                'Sign in to your GitHub account',
                'Grant repository access',
                'Configure tracking settings'
            ],
            benefits: [
                'Code commit tracking',
                'Project development insights',
                'Issue and PR management',
                'Team productivity metrics'
            ]
        }
    };
    
    return integrations[integrationId] || {
        icon: '🔗',
        description: 'Connect this service to enhance your workflow.',
        steps: ['Click connect below', 'Follow the authorization steps', 'Complete setup'],
        benefits: ['Enhanced functionality', 'Workflow automation', 'Data synchronization']
    };
}

function authorizeIntegration(integrationId, integrationName) {
    const button = document.querySelector('.btn-primary');
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    button.disabled = true;
    
    // Map integration IDs to OAuth service names
    const serviceMap = {
        'gmail': 'google',
        'google-calendar': 'google',
        'slack': 'slack',
        'microsoft-teams': 'microsoft',
        'outlook': 'microsoft',
        'salesforce': 'salesforce',
        'hubspot': 'hubspot',
        'zapier': 'zapier',
        'trello': 'trello',
        'asana': 'asana',
        'notion': 'notion',
        'github': 'github'
    };
    
    const serviceName = serviceMap[integrationId];
    
    if (serviceName) {
        // Real OAuth flow
        showNotification(`Redirecting to ${integrationName} for authorization...`, 'info');
        
        // Check if OAuth is configured first
        fetch(`/auth/${serviceName}`)
            .then(response => response.json())
            .then(data => {
                if (data.setupRequired) {
                    showNotification(`${integrationName} OAuth not configured. Please set up credentials first.`, 'warning');
                    showOAuthSetupModal(integrationName, data.setupGuide);
                    // Reset button state
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                    button.disabled = false;
                } else {
                    // Redirect to OAuth
                    window.location.href = `/auth/${serviceName}`;
                }
            })
            .catch(error => {
                console.error('OAuth check error:', error);
                showNotification(`Error connecting to ${integrationName}. Please try again.`, 'error');
                // Reset button state
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                button.disabled = false;
            });
    } else {
        // Fallback for unknown integrations
        showNotification(`Connecting to ${integrationName}...`, 'info');
        
        setTimeout(() => {
            showNotification(`${integrationName} connected successfully!`, 'success');
            closeModal();
            updateIntegrationStatus(integrationId, 'connected');
        }, 2000);
    }
}

function showOAuthSetupModal(integrationName, setupGuide) {
    const modal = createModal(`${integrationName} OAuth Setup Required`, `
        <div class="oauth-setup-content">
            <div class="setup-icon">🔧</div>
            <h3>${integrationName} OAuth Not Configured</h3>
            <p>To use ${integrationName}, you need to set up OAuth credentials.</p>
            
            <div class="setup-steps">
                <h4>Quick Setup Steps:</h4>
                <ol>
                    <li>Go to the ${integrationName} developer console</li>
                    <li>Create a new OAuth application</li>
                    <li>Set redirect URI to: <code>${window.location.origin}/auth/${integrationName.toLowerCase()}/callback</code></li>
                    <li>Copy the Client ID and Client Secret</li>
                    <li>Add them to your environment variables</li>
                    <li>Restart the server</li>
                </ol>
            </div>
            
            <div class="setup-links">
                <h4>Setup Guides:</h4>
                <ul>
                    <li><a href="${setupGuide}" target="_blank">${integrationName} OAuth Documentation</a></li>
                    <li><a href="https://example.com/oauth-setup-guide" target="_blank">General OAuth Setup Guide</a></li>
                </ul>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
                <a href="${setupGuide}" target="_blank" class="btn btn-primary">Open ${integrationName} Console</a>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function updateIntegrationStatus(integrationId, status) {
    const integrationCard = document.querySelector(`[data-integration="${integrationId}"]`);
    if (integrationCard) {
        const statusElement = integrationCard.querySelector('.integration-status');
        const button = integrationCard.querySelector('.btn');
        
        if (status === 'connected') {
            statusElement.textContent = 'Connected';
            statusElement.className = 'integration-status connected';
            button.textContent = 'Manage';
            button.className = 'btn btn-secondary';
            
            // Add connected visual indicator
            integrationCard.classList.add('connected');
        }
    }
}

// Settings functions
function saveAccountSettings() {
    const form = document.querySelector('.settings-form');
    if (form) {
        const formData = new FormData(form);
        const settings = Object.fromEntries(formData);
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Account settings saved successfully!', 'success');
        }, 500);
    }
}

function saveAutomationPreferences() {
    const checkboxes = document.querySelectorAll('.settings-form input[type="checkbox"]');
    const preferences = {};
    
    checkboxes.forEach(checkbox => {
        preferences[checkbox.name] = checkbox.checked;
    });
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Automation preferences saved!', 'success');
    }, 500);
}

// Profile functions
function showProfileModal() {
    const modal = createModal('Profile Settings', `
        <form id="profile-form">
            <div class="form-group">
                <label for="profile-name">Full Name</label>
                <input type="text" id="profile-name" name="name" value="John Doe">
            </div>
            <div class="form-group">
                <label for="profile-email">Email</label>
                <input type="email" id="profile-email" name="email" value="john@example.com">
            </div>
            <div class="form-group">
                <label for="profile-company">Company</label>
                <input type="text" id="profile-company" name="company" value="Acme Corp">
            </div>
            <div class="form-group">
                <label for="profile-phone">Phone</label>
                <input type="tel" id="profile-phone" name="phone" value="+1 (555) 123-4567">
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Profile</button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
}

// Navigation functions
function navigateToSection(sectionId) {
    // Remove active class from all sections and nav items
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to target section and nav item
    const targetSection = document.getElementById(sectionId);
    const targetNavItem = document.querySelector(`.nav-item[href="#${sectionId}"]`);
    
    if (targetSection) {
        targetSection.classList.add('active');
    }
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }
}

// Logout function
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Simulate logout API call
        fetch('/api/auth/logout', { method: 'POST' })
            .then(() => {
                showNotification('Logged out successfully', 'success');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            })
            .catch(() => {
                showNotification('Logout failed', 'error');
            });
    }
}

// Modal utility functions
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" id="modal-close-btn">&times;</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    // Add event listeners for closing the modal
    const closeBtn = modal.querySelector('#modal-close-btn');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', closeModal);
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
    
    // Add modal styles if not already added
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .modal {
                background: white;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h2 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-content {
                padding: 20px;
            }
            
            .form-group {
                margin-bottom: 1rem;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: #374151;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #d1d5db;
                border-radius: 0.375rem;
                font-size: 0.875rem;
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
            }
            
            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 1.5rem;
            }
            
            .analytics-content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .metric-card {
                background: #f8fafc;
                padding: 1rem;
                border-radius: 0.5rem;
                text-align: center;
            }
            
            .metric-card h3 {
                margin: 0 0 0.5rem 0;
                font-size: 0.875rem;
                color: #6b7280;
            }
            
            .metric-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #111827;
                margin-bottom: 0.25rem;
            }
            
            .metric-change {
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .metric-change.positive {
                color: #10b981;
            }
            
            .integration-setup {
                text-align: center;
            }
            
            .integration-setup .integration-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .integration-setup ol {
                text-align: left;
                margin: 1rem 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    return modal;
}

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

// Data loading functions
function loadEmailRules() {
    // Simulate loading email rules
    console.log('Loading email rules...');
}

function loadUpcomingMeetings() {
    // Load from Google Calendar if connected
    if (isGoogleConnected()) {
        loadGoogleCalendarEvents();
    } else {
        // Simulate loading meetings
        console.log('Loading upcoming meetings...');
    }
}

// Google services integration
function isGoogleConnected() {
    // Check if user is authenticated with Google
    return document.cookie.includes('connect.sid') && 
           window.location.pathname === '/dashboard';
}

async function loadGoogleCalendarEvents() {
    try {
        const response = await fetch('/api/google/calendar/events');
        if (response.ok) {
            const data = await response.json();
            displayGoogleCalendarEvents(data.items || []);
        } else {
            console.log('Google Calendar not connected');
        }
    } catch (error) {
        console.error('Error loading Google Calendar events:', error);
    }
}

function displayGoogleCalendarEvents(events) {
    const calendarContainer = document.querySelector('.calendar-widget .meetings-list');
    if (calendarContainer) {
        calendarContainer.innerHTML = events.map(event => `
            <div class="meeting-item">
                <div class="meeting-time">
                    ${formatEventTime(event.start?.dateTime || event.start?.date)}
                </div>
                <div class="meeting-details">
                    <h4>${event.summary || 'No Title'}</h4>
                    <p>${event.description || ''}</p>
                </div>
            </div>
        `).join('');
    }
}

function formatEventTime(dateTime) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function loadGmailMessages() {
    try {
        const response = await fetch('/api/google/gmail/messages');
        if (response.ok) {
            const data = await response.json();
            displayGmailMessages(data.messages || []);
        } else {
            console.log('Gmail not connected');
        }
    } catch (error) {
        console.error('Error loading Gmail messages:', error);
    }
}

function displayGmailMessages(messages) {
    // Update email stats or display recent messages
    console.log('Gmail messages loaded:', messages.length);
}

// Enhanced email rule creation with Gmail integration
function showEmailRuleModal() {
    const modal = createModal('Add Email Rule', `
        <form id="email-rule-form">
            <div class="form-group">
                <label for="rule-name">Rule Name</label>
                <input type="text" id="rule-name" name="ruleName" required>
            </div>
            <div class="form-group">
                <label for="trigger-keywords">Trigger Keywords</label>
                <input type="text" id="trigger-keywords" name="triggerKeywords" placeholder="pricing, support, demo">
            </div>
            <div class="form-group">
                <label for="response-template">Response Template</label>
                <textarea id="response-template" name="responseTemplate" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="autoSend" checked>
                    <span>Auto-send responses via Gmail</span>
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="useGmail" ${isGoogleConnected() ? 'checked' : 'disabled'}>
                    <span>Use Gmail integration ${isGoogleConnected() ? '(Connected)' : '(Not connected)'}</span>
                </label>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Rule</button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('email-rule-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const ruleData = Object.fromEntries(formData);
        
        // If using Gmail, test the integration
        if (ruleData.useGmail && isGoogleConnected()) {
            try {
                // Test Gmail connection
                const response = await fetch('/api/google/gmail/profile');
                if (!response.ok) {
                    showNotification('Gmail not properly connected. Please reconnect.', 'error');
                    return;
                }
            } catch (error) {
                showNotification('Gmail connection failed. Please reconnect.', 'error');
                return;
            }
        }
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Email rule created successfully!', 'success');
            closeModal();
            // Refresh email rules section
            loadEmailRules();
        }, 1000);
    });
}

// Enhanced meeting scheduling with Google Calendar
function showScheduleMeetingModal() {
    const modal = createModal('Schedule Meeting', `
        <form id="schedule-meeting-form">
            <div class="form-group">
                <label for="meeting-title">Meeting Title</label>
                <input type="text" id="meeting-title" name="title" required>
            </div>
            <div class="form-group">
                <label for="meeting-date">Date</label>
                <input type="date" id="meeting-date" name="date" required>
            </div>
            <div class="form-group">
                <label for="meeting-time">Time</label>
                <input type="time" id="meeting-time" name="time" required>
            </div>
            <div class="form-group">
                <label for="meeting-duration">Duration</label>
                <select id="meeting-duration" name="duration">
                    <option value="30">30 minutes</option>
                    <option value="60" selected>1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                </select>
            </div>
            <div class="form-group">
                <label for="meeting-participants">Participants (emails)</label>
                <input type="text" id="meeting-participants" name="participants" placeholder="email1@example.com, email2@example.com">
            </div>
            <div class="form-group">
                <label for="meeting-description">Description</label>
                <textarea id="meeting-description" name="description" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="useGoogleCalendar" ${isGoogleConnected() ? 'checked' : 'disabled'}>
                    <span>Add to Google Calendar ${isGoogleConnected() ? '(Connected)' : '(Not connected)'}</span>
                </label>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Schedule Meeting</button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('schedule-meeting-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const meetingData = Object.fromEntries(formData);
        
        // If using Google Calendar, create the event
        if (meetingData.useGoogleCalendar && isGoogleConnected()) {
            try {
                const startDateTime = new Date(`${meetingData.date}T${meetingData.time}`);
                const endDateTime = new Date(startDateTime.getTime() + parseInt(meetingData.duration) * 60000);
                
                const response = await fetch('/api/google/calendar/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        summary: meetingData.title,
                        start: startDateTime.toISOString(),
                        end: endDateTime.toISOString(),
                        description: meetingData.description,
                        attendees: meetingData.participants
                    })
                });
                
                if (response.ok) {
                    showNotification('Meeting scheduled in Google Calendar!', 'success');
                } else {
                    showNotification('Failed to create Google Calendar event', 'error');
                }
            } catch (error) {
                showNotification('Google Calendar integration failed', 'error');
            }
        }
        
        showNotification('Meeting scheduled successfully!', 'success');
        closeModal();
        // Refresh calendar
        loadUpcomingMeetings();
    });
}

// Export for external use
window.Dashboard = {
    showNotification,
    addMessageToChat,
    updateStatsDisplay,
    updateActivityDisplay,
    closeModal,
    navigateToSection
};
