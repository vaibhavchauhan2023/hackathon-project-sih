// Parent Dashboard JavaScript

class ParentDashboard {
    constructor() {
        this.currentTipIndex = 0;
        this.tips = document.querySelectorAll('.tip-card');
        this.totalTips = this.tips.length;
        this.settings = {
            screenTime: {
                dailyLimit: 60,
                breakReminders: true,
                quietHoursStart: '20:00',
                quietHoursEnd: '07:00'
            },
            goals: {
                weeklyScience: 5,
                dailyMath: 30,
                readingTime: 20
            },
            safety: {
                contentFilter: 'moderate',
                anonymousAnalytics: false,
                emailReports: true
            },
            notifications: {
                dailySummary: true,
                weeklyReport: true,
                achievements: false,
                goalAlerts: true,
                contentUpdates: false
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupTipsCarousel();
        this.setupSettingsHandlers();
        this.setupAnimations();
        this.loadSettings();
    }
    
    // Tips Carousel Management
    setupTipsCarousel() {
        const prevBtn = document.querySelector('.tip-prev');
        const nextBtn = document.querySelector('.tip-next');
        const indicator = document.querySelector('.tip-indicator');
        
        if (prevBtn && nextBtn && indicator) {
            prevBtn.addEventListener('click', () => this.showPrevTip());
            nextBtn.addEventListener('click', () => this.showNextTip());
            
            // Auto-advance tips every 10 seconds
            this.tipInterval = setInterval(() => {
                this.showNextTip();
            }, 10000);
            
            // Update initial indicator
            this.updateTipIndicator();
        }
    }
    
    showNextTip() {
        this.currentTipIndex = (this.currentTipIndex + 1) % this.totalTips;
        this.updateTipDisplay();
    }
    
    showPrevTip() {
        this.currentTipIndex = this.currentTipIndex === 0 ? this.totalTips - 1 : this.currentTipIndex - 1;
        this.updateTipDisplay();
    }
    
    updateTipDisplay() {
        this.tips.forEach((tip, index) => {
            tip.classList.toggle('active', index === this.currentTipIndex);
        });
        this.updateTipIndicator();
        
        // Reset auto-advance timer
        clearInterval(this.tipInterval);
        this.tipInterval = setInterval(() => {
            this.showNextTip();
        }, 10000);
    }
    
    updateTipIndicator() {
        const indicator = document.querySelector('.tip-indicator');
        if (indicator) {
            indicator.textContent = `${this.currentTipIndex + 1} / ${this.totalTips}`;
        }
    }
    
    // Settings Management
    setupSettingsHandlers() {
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveAllSettings());
        }
        
        // Add change listeners to form elements
        this.addSettingsListeners();
    }
    
    addSettingsListeners() {
        // Screen Time Settings
        const timeSelect = document.querySelector('.time-select');
        if (timeSelect) {
            timeSelect.addEventListener('change', (e) => {
                this.settings.screenTime.dailyLimit = parseInt(e.target.value);
                this.showSettingsChangeIndicator();
            });
        }
        
        // Break reminders checkbox
        const breakReminders = document.querySelector('input[type=\"checkbox\"]');
        if (breakReminders) {
            breakReminders.addEventListener('change', (e) => {
                this.settings.screenTime.breakReminders = e.target.checked;
                this.showSettingsChangeIndicator();
            });
        }
        
        // Quiet hours
        const quietHourInputs = document.querySelectorAll('input[type=\"time\"]');
        quietHourInputs.forEach((input, index) => {
            input.addEventListener('change', (e) => {
                if (index === 0) {
                    this.settings.screenTime.quietHoursStart = e.target.value;
                } else {
                    this.settings.screenTime.quietHoursEnd = e.target.value;
                }
                this.showSettingsChangeIndicator();
            });
        });
        
        // Learning Goals
        const goalInputs = document.querySelectorAll('.goal-setting input[type=\"number\"]');
        goalInputs.forEach((input, index) => {
            input.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                switch(index) {
                    case 0: this.settings.goals.weeklyScience = value; break;
                    case 1: this.settings.goals.dailyMath = value; break;
                    case 2: this.settings.goals.readingTime = value; break;
                }
                this.showSettingsChangeIndicator();
            });
        });
        
        // Safety Settings
        const contentFilter = document.querySelector('.safety-setting select');
        if (contentFilter) {
            contentFilter.addEventListener('change', (e) => {
                this.settings.safety.contentFilter = e.target.value;
                this.showSettingsChangeIndicator();
            });
        }
        
        // Data sharing checkboxes
        const dataCheckboxes = document.querySelectorAll('.safety-setting input[type=\"checkbox\"]');
        dataCheckboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', (e) => {
                if (index === 0) {
                    this.settings.safety.anonymousAnalytics = e.target.checked;
                } else {
                    this.settings.safety.emailReports = e.target.checked;
                }
                this.showSettingsChangeIndicator();
            });
        });
        
        // Notification settings
        const notificationCheckboxes = document.querySelectorAll('.notification-setting input[type=\"checkbox\"]');
        notificationCheckboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', (e) => {
                const notifications = Object.keys(this.settings.notifications);
                if (notifications[index]) {
                    this.settings.notifications[notifications[index]] = e.target.checked;
                }
                this.showSettingsChangeIndicator();
            });
        });
    }
    
    showSettingsChangeIndicator() {
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn && !saveBtn.classList.contains('unsaved-changes')) {
            saveBtn.classList.add('unsaved-changes');
            saveBtn.textContent = '💾 Save Changes*';
            saveBtn.style.background = 'linear-gradient(135deg, #FF6B35, #E91E63)';
        }
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('terraParentSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            this.updateFormValues();
        }
    }
    
    updateFormValues() {
        // Update form elements with current settings
        const timeSelect = document.querySelector('.time-select');
        if (timeSelect) {
            timeSelect.value = this.settings.screenTime.dailyLimit;
        }
        
        // Update other form elements similarly...
        // This is a simplified version - in a real app, you'd update all form elements
    }
    
    saveAllSettings() {
        try {
            localStorage.setItem('terraParentSettings', JSON.stringify(this.settings));
            
            this.showSaveConfirmation();
            
            const saveBtn = document.getElementById('saveSettings');
            if (saveBtn) {
                saveBtn.classList.remove('unsaved-changes');
                saveBtn.textContent = '💾 Save All Settings';
                saveBtn.style.background = '';
            }
            
            // Send settings to server (simulated)
            this.syncSettingsToServer();
            
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showErrorMessage('Failed to save settings. Please try again.');
        }
    }
    
    showSaveConfirmation() {
        const notification = document.createElement('div');
        notification.className = 'parent-notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <div>
                    <strong>Settings Saved!</strong>
                    <p>Your parental controls have been updated successfully.</p>
                </div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 350px;
            border-left: 4px solid #7ED321;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 4000);
    }
    
    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'parent-notification error';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">❌</span>
                <div>
                    <strong>Error</strong>
                    <p>${message}</p>
                </div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 350px;
            border-left: 4px solid #E91E63;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }
    
    syncSettingsToServer() {
        // Simulate API call to sync settings
        setTimeout(() => {
            console.log('Settings synced to server:', this.settings);
            
            // Show sync confirmation
            const syncIndicator = document.createElement('div');
            syncIndicator.innerHTML = '☁️ Synced';
            syncIndicator.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: var(--primary-green);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                z-index: 999;
                animation: fadeInUp 0.5s ease-out;
            `;
            
            document.body.appendChild(syncIndicator);
            
            setTimeout(() => {
                syncIndicator.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => {
                    syncIndicator.remove();
                }, 500);
            }, 2000);
        }, 1000);
    }
    
    // Animations and Visual Effects
    setupAnimations() {
        this.observeElements();
        this.animateProgressBars();
        this.animateCharts();
    }
    
    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe cards for animation
        document.querySelectorAll('.stat-card, .progress-card, .report-card, .control-card, .support-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar-parent .progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.style.width;
                    bar.style.width = '0%';
                    
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 500);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    animateCharts() {
        const chartBars = document.querySelectorAll('.analytics-chart .bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const chartContainer = entry.target.closest('.analytics-chart');
                    const bars = chartContainer.querySelectorAll('.bar');
                    
                    bars.forEach((bar, index) => {
                        const height = bar.style.height;
                        bar.style.height = '0%';
                        
                        setTimeout(() => {
                            bar.style.height = height;
                        }, index * 100 + 500);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        const charts = document.querySelectorAll('.analytics-chart');
        charts.forEach(chart => {
            observer.observe(chart);
        });
    }
    
    // Support Functions
    setupSupportHandlers() {
        const supportButtons = document.querySelectorAll('.help-options .btn');
        
        supportButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = e.target.textContent;
                
                if (buttonText.includes('Live Chat')) {
                    this.openLiveChat();
                } else if (buttonText.includes('Email')) {
                    this.openEmailSupport();
                } else if (buttonText.includes('FAQ')) {
                    this.showFAQ();
                } else if (buttonText.includes('Video')) {
                    this.showVideoTutorials();
                }
            });
        });
    }
    
    openLiveChat() {
        // Simulate opening live chat
        this.showModal('Live Chat Support', `
            <div class="chat-placeholder">
                <div class="chat-message bot">
                    <strong>Terra Support:</strong> Hi! How can I help you with your child's learning journey today?
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="Type your message..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
                    <button class="btn btn-primary" style="margin-top: 10px;">Send Message</button>
                </div>
                <p><em>This is a demo. In the real app, this would connect to live support.</em></p>
            </div>
        `);
    }
    
    openEmailSupport() {
        window.location.href = 'mailto:support@terralearning.com?subject=Parent Dashboard Support';
    }
    
    showFAQ() {
        this.showModal('Frequently Asked Questions', `
            <div class="faq-list">
                <div class="faq-item">
                    <h4>How do I set screen time limits?</h4>
                    <p>Use the Screen Time Management section to set daily limits and quiet hours for your child's learning sessions.</p>
                </div>
                <div class="faq-item">
                    <h4>Can I track my child's progress across subjects?</h4>
                    <p>Yes! The Progress Overview section shows detailed analytics for each learning world your child explores.</p>
                </div>
                <div class="faq-item">
                    <h4>How do I adjust content filtering?</h4>
                    <p>Go to Safety & Privacy settings to choose the appropriate content filtering level for your child's age.</p>
                </div>
                <div class="faq-item">
                    <h4>What notifications can I receive?</h4>
                    <p>You can choose to receive daily summaries, weekly reports, achievement notifications, and more in the Notifications section.</p>
                </div>
            </div>
        `);
    }
    
    showVideoTutorials() {
        this.showModal('Video Tutorials', `
            <div class="video-tutorials">
                <div class="video-item">
                    <h4>📹 Getting Started with Terra</h4>
                    <p>Learn the basics of setting up your child's account and navigating the parent dashboard.</p>
                    <button class="btn btn-secondary">Watch Tutorial</button>
                </div>
                <div class="video-item">
                    <h4>📹 Setting Parental Controls</h4>
                    <p>Comprehensive guide to managing screen time, content filters, and learning goals.</p>
                    <button class="btn btn-secondary">Watch Tutorial</button>
                </div>
                <div class="video-item">
                    <h4>📹 Understanding Progress Reports</h4>
                    <p>Learn how to read and interpret your child's learning analytics and achievements.</p>
                    <button class="btn btn-secondary">Watch Tutorial</button>
                </div>
                <p><em>Video tutorials would be embedded here in the full application.</em></p>
            </div>
        `);
    }
    
    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'parent-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 40px rgba(0,0,0,0.2);
            animation: slideInUp 0.3s ease-out;
        `;
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-family: 'Fredoka One', cursive; color: #2E3A4B;">${title}</h2>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button>
            </div>
            ${content}
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modalContent.querySelector('.close-modal');
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

// Additional CSS for parent dashboard features
const parentStyle = document.createElement('style');
parentStyle.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    .chat-message {
        background: #f5f5f5;
        padding: 15px;
        border-radius: 15px;
        margin-bottom: 15px;
    }
    
    .chat-message.bot {
        background: #E3F2FD;
    }
    
    .faq-item {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .faq-item h4 {
        color: var(--text-primary);
        margin-bottom: 10px;
    }
    
    .video-item {
        background: #f8f9ff;
        padding: 20px;
        border-radius: 15px;
        margin-bottom: 15px;
        text-align: left;
    }
    
    .video-item h4 {
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .notification-content {
        display: flex;
        align-items: flex-start;
        gap: 15px;
    }
    
    .notification-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
    }
`;

document.head.appendChild(parentStyle);

// Initialize Parent Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('parent-body')) {
        window.parentDashboard = new ParentDashboard();
        
        // Setup support handlers
        window.parentDashboard.setupSupportHandlers();
        
        console.log('Parent Dashboard initialized');
    }
});
