// Terra Educational Platform - Interactive JavaScript

// Game State Management
class TerraGameState {
    constructor() {
        this.user = {
            name: 'Explorer',
            level: 5,
            xp: 375, // 75% of level 5
            totalXP: 375,
            coins: 150,
            badges: ['first-steps', 'bright-mind', 'eco-hero'],
            avatar: {
                character: 'default',
                accessories: []
            },
            progress: {
                science: 60,
                math: 40,
                history: 25,
                lifeskills: 80,
                ai: 10,
                creative: 90
            }
        };
        
        this.sounds = {
            click: this.createSound('click'),
            achievement: this.createSound('achievement'),
            xpGain: this.createSound('xpGain'),
            levelUp: this.createSound('levelUp')
        };
        
        this.mascotMessages = [
            "Hi Explorer! Ready to start your adventure today? 🌟",
            "Great job on your learning progress! 🎉",
            "Let's explore a new world together! 🚀",
            "Don't forget to check your daily challenge! ⭐",
            "You're doing amazing! Keep up the great work! 💪",
            "Time for some fun learning activities! 🎨",
            "Have you earned any new badges today? 🏆"
        ];
        
        this.funFacts = [
            "Your brain has about 86 billion neurons - that's more than the number of stars in our galaxy! 🧠",
            "Octopuses have three hearts and blue blood! 🐙",
            "A group of flamingos is called a 'flamboyance'! 🦩",
            "Honey never spoils - archaeologists have found edible honey in Egyptian tombs! 🍯",
            "Butterflies taste with their feet! 🦋",
            "A day on Venus is longer than its year! 🪐",
            "Dolphins have names for each other! 🐬",
            "The human brain uses about 20% of the body's energy! ⚡"
        ];
        
        this.currentFactIndex = 0;
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateUI();
        this.startAnimations();
        this.initMascot();
    }
    
    // Sound System
    createSound(type) {
        // Placeholder for sound creation
        return {
            play: () => {
                // In a real implementation, this would play actual sounds
                console.log(`Playing ${type} sound`);
            }
        };
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }
    
    // Local Storage Management
    loadUserData() {
        const savedData = localStorage.getItem('terraUserData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.user = { ...this.user, ...data };
        }
    }
    
    saveUserData() {
        localStorage.setItem('terraUserData', JSON.stringify(this.user));
    }
    
    // XP and Level System
    addXP(amount) {
        this.user.xp += amount;
        this.user.totalXP += amount;
        this.playSound('xpGain');
        
        const requiredXP = this.getRequiredXPForLevel(this.user.level + 1);
        if (this.user.xp >= requiredXP) {
            this.levelUp();
        }
        
        this.updateXPBar();
        this.saveUserData();
        this.showXPGainAnimation(amount);
    }
    
    getRequiredXPForLevel(level) {
        return level * 100; // 100 XP per level
    }
    
    levelUp() {
        this.user.level++;
        this.user.xp = 0; // Reset XP for new level
        this.playSound('levelUp');
        this.showLevelUpAnimation();
        this.unlockNewContent();
    }
    
    unlockNewContent() {
        // Unlock AI World at level 6
        if (this.user.level === 6) {
            const aiCard = document.querySelector('.world-card.ai-world');
            if (aiCard) {
                aiCard.classList.remove('locked');
                const button = aiCard.querySelector('.btn-world');
                button.textContent = 'Enter World';
                button.classList.remove('locked');
                this.showNotification('🎉 AI & Future City is now unlocked!');
            }
        }
    }
    
    // UI Updates
    updateUI() {
        this.updateXPBar();
        this.updateProgressBars();
        this.updateBadges();
    }
    
    updateXPBar() {
        const xpBar = document.querySelector('.xp-fill');
        const xpText = document.querySelector('.xp-text');
        
        if (xpBar && xpText) {
            const requiredXP = this.getRequiredXPForLevel(this.user.level + 1);
            const progress = (this.user.xp / requiredXP) * 100;
            
            xpBar.style.width = `${Math.min(progress, 100)}%`;
            xpText.textContent = `Level ${this.user.level}`;
        }
    }
    
    updateProgressBars() {
        Object.keys(this.user.progress).forEach(world => {
            const progressFill = document.querySelector(`.${world}-world .progress-fill`);
            if (progressFill) {
                progressFill.style.width = `${this.user.progress[world]}%`;
            }
        });
    }
    
    updateBadges() {
        const badges = document.querySelectorAll('.badge');
        badges.forEach((badge, index) => {
            if (index < this.user.badges.length) {
                badge.classList.add('earned');
            }
        });
    }
    
    // Event Listeners
    setupEventListeners() {
        // Main action buttons
        const startQuestBtn = document.getElementById('startQuest');
        const playExploreBtn = document.getElementById('playExplore');
        
        if (startQuestBtn) {
            startQuestBtn.addEventListener('click', (e) => {
                this.handleButtonClick(e);
                this.startLearningQuest();
            });
        }
        
        if (playExploreBtn) {
            playExploreBtn.addEventListener('click', (e) => {
                this.handleButtonClick(e);
                this.startPlayExplore();
            });
        }
        
        // World cards
        const worldCards = document.querySelectorAll('.world-card');
        worldCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!card.classList.contains('locked')) {
                    this.handleButtonClick(e);
                    this.enterWorld(card.dataset.world);
                }
            });
        });
        
        // Challenge button
        const challengeBtn = document.querySelector('.btn-challenge');
        if (challengeBtn) {
            challengeBtn.addEventListener('click', (e) => {
                this.handleButtonClick(e);
                this.acceptDailyChallenge();
            });
        }
        
        // Fun facts
        const nextFactBtn = document.getElementById('nextFact');
        if (nextFactBtn) {
            nextFactBtn.addEventListener('click', (e) => {
                this.handleButtonClick(e);
                this.showNextFact();
            });
        }
        
        // Help button
        const helpBtn = document.getElementById('helpBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', (e) => {
                this.handleButtonClick(e);
                this.showHelp();
            });
        }
        
        // Mascot interaction
        const mascot = document.querySelector('.mascot-character');
        if (mascot) {
            mascot.addEventListener('click', (e) => {
                this.handleButtonClick(e);
                this.interactWithMascot();
            });
        }
        
        // Navigation
        this.setupSmoothScrolling();
    }
    
    handleButtonClick(event) {
        this.playSound('click');
        this.addClickAnimation(event.target);
    }
    
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Actions
    startLearningQuest() {
        this.showNotification('🎒 Starting your learning quest! Choose a world to explore.');
        this.scrollToSection('missions');
        this.addXP(5);
    }
    
    startPlayExplore() {
        this.showNotification('🎲 Time to play and explore! Let\\'s have some fun learning.');
        this.scrollToSection('achievements');
        this.addXP(3);
    }
    
    enterWorld(worldName) {
        const worldNames = {
            science: 'Science World',
            math: 'Math Galaxy',
            history: 'History Land',
            lifeskills: 'Life Skills Village',
            ai: 'AI & Future City',
            creative: 'Creative Corner'
        };
        
        this.showNotification(`🚀 Entering ${worldNames[worldName]}! Get ready for adventure!`);
        this.addXP(10);
        
        // Simulate entering world (in real app, this would navigate to the world page)
        setTimeout(() => {
            this.showWorldPreview(worldName);
        }, 1000);
    }
    
    acceptDailyChallenge() {
        this.showNotification('🌟 Challenge accepted! You\\'re helping Terra clean the virtual park!');
        this.addXP(25);
        
        // Start challenge simulation
        setTimeout(() => {
            this.completeChallenge();
        }, 3000);
    }
    
    completeChallenge() {
        this.addXP(50);
        this.earnBadge('eco-warrior');
        this.showNotification('🎉 Challenge completed! You earned 50 XP and the Eco Warrior badge!');
    }
    
    earnBadge(badgeId) {
        if (!this.user.badges.includes(badgeId)) {
            this.user.badges.push(badgeId);
            this.playSound('achievement');
            this.saveUserData();
        }
    }
    
    showNextFact() {
        this.currentFactIndex = (this.currentFactIndex + 1) % this.funFacts.length;
        const factText = document.querySelector('.fact-text');
        if (factText) {
            factText.style.opacity = '0';
            setTimeout(() => {
                factText.textContent = this.funFacts[this.currentFactIndex];
                factText.style.opacity = '1';
            }, 300);
        }
        this.addXP(2);
    }
    
    showHelp() {
        this.showModal('Help & Support', `
            <div class="help-content">
                <h3>🎮 How to Play</h3>
                <ul>
                    <li>🌟 Complete challenges to earn XP and level up</li>
                    <li>🏆 Collect badges by finishing activities</li>
                    <li>🚀 Explore different learning worlds</li>
                    <li>📚 Take on daily challenges for bonus rewards</li>
                </ul>
                <h3>🆘 Need More Help?</h3>
                <p>Ask your parent or teacher to visit the Parents Corner for more support!</p>
            </div>
        `);
    }
    
    // Mascot System
    initMascot() {
        this.currentMascotMessage = 0;
        this.rotateMascotMessages();
    }
    
    rotateMascotMessages() {
        setInterval(() => {
            this.updateMascotMessage();
        }, 10000); // Change message every 10 seconds
    }
    
    updateMascotMessage() {
        const mascotText = document.querySelector('.mascot-text');
        if (mascotText) {
            this.currentMascotMessage = (this.currentMascotMessage + 1) % this.mascotMessages.length;
            mascotText.style.opacity = '0';
            setTimeout(() => {
                mascotText.textContent = this.mascotMessages[this.currentMascotMessage];
                mascotText.style.opacity = '1';
            }, 500);
        }
    }
    
    interactWithMascot() {
        const responses = [
            "Great to see you! 😊",
            "Ready for more learning? 📚",
            "You're doing fantastic! ⭐",
            "Let's explore together! 🚀",
            "Keep up the amazing work! 💪"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.updateMascotMessageTemporary(randomResponse);
        this.addXP(1);
    }
    
    updateMascotMessageTemporary(message) {
        const mascotText = document.querySelector('.mascot-text');
        if (mascotText) {
            const originalMessage = mascotText.textContent;
            mascotText.textContent = message;
            
            setTimeout(() => {
                mascotText.textContent = originalMessage;
            }, 3000);
        }
    }
    
    // Animations and Effects
    startAnimations() {
        this.animateFloatingIcons();
        this.animateProgressBars();
    }
    
    animateFloatingIcons() {
        const icons = document.querySelectorAll('.floating-icon');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.animationDelay = `${index * 0.5}s`;
            }, index * 100);
        });
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }
    
    addClickAnimation(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }
    
    showXPGainAnimation(amount) {
        const xpBar = document.querySelector('.xp-bar');
        if (xpBar) {
            const animation = document.createElement('div');
            animation.className = 'xp-gain-animation';
            animation.textContent = `+${amount} XP`;
            animation.style.cssText = `
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                color: #F5A623;
                font-weight: bold;
                font-size: 14px;
                pointer-events: none;
                animation: xpGain 2s ease-out forwards;
                z-index: 1001;
            `;
            
            xpBar.style.position = 'relative';
            xpBar.appendChild(animation);
            
            setTimeout(() => {
                animation.remove();
            }, 2000);
        }
    }
    
    showLevelUpAnimation() {
        this.showNotification(`🎉 Level Up! You are now Level ${this.user.level}!`, 'success');
        
        // Add confetti effect
        this.createConfetti();
    }
    
    createConfetti() {
        const colors = ['#F5A623', '#7ED321', '#4A90E2', '#E91E63', '#9013FE'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    animation: confettiFall ${2 + Math.random() * 2}s ease-out forwards;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 4000);
            }, i * 50);
        }
    }
    
    // Utility Functions
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
            font-weight: 600;
            color: #2E3A4B;
            border-left: 4px solid #4A90E2;
            animation: slideInRight 0.5s ease-out;
        `;
        
        if (type === 'success') {
            notification.style.borderLeftColor = '#7ED321';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
    
    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
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
            max-width: 500px;
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
    
    showWorldPreview(worldName) {
        const worldContent = {
            science: `
                <div class="world-preview">
                    <h3>🌍 Welcome to Science World!</h3>
                    <p>Explore the wonders of our universe, conduct virtual experiments, and learn about the environment!</p>
                    <div class="preview-activities">
                        <div class="activity">🚀 Space Mission</div>
                        <div class="activity">🧪 Lab Experiments</div>
                        <div class="activity">🌱 Eco Adventures</div>
                    </div>
                    <p><em>This is a preview. In the full version, you would enter the interactive Science World!</em></p>
                </div>
            `,
            math: `
                <div class="world-preview">
                    <h3>➗ Welcome to Math Galaxy!</h3>
                    <p>Embark on mathematical adventures, solve puzzles, and discover the magic of numbers!</p>
                    <div class="preview-activities">
                        <div class="activity">🔢 Number Puzzles</div>
                        <div class="activity">📐 Geometry Games</div>
                        <div class="activity">💰 Money Math</div>
                    </div>
                    <p><em>This is a preview. In the full version, you would enter the interactive Math Galaxy!</em></p>
                </div>
            `,
            // Add more world previews...
        };
        
        this.showModal('World Preview', worldContent[worldName] || '<p>Coming soon!</p>');
    }
}

// CSS Animations (injected dynamically)
const style = document.createElement('style');
style.textContent = `
    @keyframes xpGain {
        0% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-40px); }
    }
    
    @keyframes confettiFall {
        0% { transform: translateY(-10px) rotate(0deg); }
        100% { transform: translateY(100vh) rotate(360deg); }
    }
    
    @keyframes slideInRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
    
    @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    @keyframes slideInUp {
        0% { transform: translateY(50px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    
    .world-preview {
        text-align: center;
    }
    
    .preview-activities {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin: 20px 0;
        flex-wrap: wrap;
    }
    
    .activity {
        background: #F5F7FA;
        padding: 10px 15px;
        border-radius: 15px;
        font-weight: 600;
        color: #2E3A4B;
    }
    
    .help-content ul {
        text-align: left;
        margin: 15px 0;
    }
    
    .help-content li {
        margin: 8px 0;
        padding-left: 10px;
    }
`;

document.head.appendChild(style);

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.terraGame = new TerraGameState();
    
    // Add loading animation completion
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Add some fun Easter eggs
document.addEventListener('keydown', (e) => {
    // Konami Code Easter Egg
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    if (!window.konamiProgress) window.konamiProgress = 0;
    
    if (e.code === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            window.terraGame.addXP(100);
            window.terraGame.showNotification('🎮 Konami Code activated! +100 XP bonus!', 'success');
            window.konamiProgress = 0;
        }
    } else {
        window.konamiProgress = 0;
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TerraGameState;
}
