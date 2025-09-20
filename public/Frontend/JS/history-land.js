// History Land JavaScript - Interactive Indian History Learning

// Game State
let historyState = {
    currentLevel: 5,
    totalXP: 850,
    treasures: 85,
    completedPeriods: ['ancient'],
    currentPeriod: 'medieval',
    storylineProgress: {
        'indus-valley': { chapter: 1, choices: [] },
        'medieval-kingdoms': { chapter: 0, choices: [] },
        'mughal-empire': { chapter: 0, choices: [] }
    },
    heroesUnlocked: ['gandhi', 'nehru'],
    achievements: [],
    culturalKnowledge: 0
};

// Load saved progress
function loadHistoryProgress() {
    const savedProgress = localStorage.getItem('terraHistoryProgress');
    if (savedProgress) {
        historyState = { ...historyState, ...JSON.parse(savedProgress) };
    }
    updateProgressDisplay();
}

// Save progress
function saveHistoryProgress() {
    localStorage.setItem('terraHistoryProgress', JSON.stringify(historyState));
}

// Update progress display
function updateProgressDisplay() {
    const xpBar = document.querySelector('.xp-fill');
    if (xpBar) {
        const xpPercentage = (historyState.totalXP % 200) / 2; // Assuming 200 XP per level
        xpBar.style.width = `${xpPercentage}%`;
    }
    
    const treasureCount = document.querySelector('.treasure-count');
    if (treasureCount) {
        treasureCount.textContent = historyState.treasures;
    }
    
    const levelText = document.querySelector('.xp-text');
    if (levelText) {
        levelText.textContent = `Level ${historyState.currentLevel}`;
    }
}

// Timeline interactions
function initializeTimeline() {
    const periods = document.querySelectorAll('.timeline-period');
    
    periods.forEach(period => {
        period.addEventListener('click', () => {
            const periodType = period.dataset.period;
            handlePeriodClick(periodType, period);
        });
    });
}

function handlePeriodClick(periodType, element) {
    if (element.classList.contains('locked')) {
        showNotification('Complete previous periods to unlock this era! 🔒', 'warning');
        return;
    }
    
    if (element.classList.contains('completed')) {
        showHistoryModal(periodType);
    } else if (element.classList.contains('current') || element.classList.contains('available')) {
        startPeriodLearning(periodType);
    }
}

function startPeriodLearning(periodType) {
    const periodInfo = {
        'ancient': {
            title: 'Ancient India',
            description: 'Explore the magnificent Indus Valley Civilization and Vedic period!',
            activities: ['Harappa Discovery Game', 'Vedic Quiz', 'Ancient Arts Craft']
        },
        'medieval': {
            title: 'Medieval India',
            description: 'Discover great kingdoms, magnificent temples, and rich culture!',
            activities: ['Kingdom Building Game', 'Temple Architecture Tour', 'Medieval Arts']
        },
        'mughal': {
            title: 'Mughal Era',
            description: 'Learn about the great Mughal emperors and their legacy!',
            activities: ['Emperor Timeline', 'Taj Mahal Builder', 'Mughal Art Gallery']
        }
    };
    
    const info = periodInfo[periodType];
    if (info) {
        showPeriodModal(info);
    }
}

function showPeriodModal(info) {
    const modal = createModal(`
        <div class="period-modal">
            <h2>${info.title}</h2>
            <p>${info.description}</p>
            <div class="activities-list">
                <h3>Learning Activities:</h3>
                <ul>
                    ${info.activities.map(activity => `<li>${activity}</li>`).join('')}
                </ul>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="startLearningSession('${info.title}')">Start Learning</button>
                <button class="btn btn-secondary" onclick="closeModal()">Maybe Later</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Hero interactions
function initializeHeroes() {
    const heroCards = document.querySelectorAll('.hero-card');
    
    heroCards.forEach(card => {
        const btn = card.querySelector('.btn-hero');
        if (btn && !btn.classList.contains('locked')) {
            btn.addEventListener('click', () => {
                const heroName = card.querySelector('.hero-name').textContent;
                showHeroStory(heroName);
            });
        }
    });
}

function showHeroStory(heroName) {
    const heroStories = {
        'Mahatma Gandhi': {
            story: "Meet the Father of our Nation! Gandhi Ji believed in truth (Satyagraha) and non-violence (Ahimsa). He led India to freedom through peaceful protests and inspired the whole world!",
            facts: ["Led the Salt March", "Practiced spinning cotton", "Fasted for peace", "Inspired civil rights globally"],
            quote: "Be the change you wish to see in the world."
        },
        'Jawaharlal Nehru': {
            story: "Chacha Nehru, our first Prime Minister, was a great leader who loved children! He built modern India with schools, hospitals, and industries. Children's Day is celebrated on his birthday!",
            facts: ["First Prime Minister", "Built IITs and dams", "Loved children deeply", "Wrote letters from prison"],
            quote: "Children are like buds in a garden and should be carefully and lovingly nurtured."
        }
    };
    
    const hero = heroStories[heroName];
    if (hero) {
        showHeroModal(heroName, hero);
        addXP(20, `Learning about ${heroName}`);
    }
}

function showHeroModal(name, hero) {
    const modal = createModal(`
        <div class="hero-modal">
            <h2>${name}</h2>
            <div class="hero-story">
                <p>${hero.story}</p>
                <div class="hero-quote">
                    <blockquote>"${hero.quote}"</blockquote>
                </div>
                <div class="hero-facts">
                    <h4>Amazing Facts:</h4>
                    <ul>
                        ${hero.facts.map(fact => `<li>✨ ${fact}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="startHeroQuiz('${name}')">Take Quiz</button>
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Interactive Story System
function initializeStories() {
    const choiceButtons = document.querySelectorAll('.choice-btn');
    
    choiceButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const choice = e.target.dataset.choice;
            handleStoryChoice(choice);
        });
    });
}

function handleStoryChoice(choice) {
    const storyResponses = {
        'city': {
            text: "Great choice! The Indus Valley had amazing planned cities with straight roads, proper drainage, and even public baths! These cities were more advanced than many places in the world at that time.",
            nextChoices: [
                { id: 'roads', text: '🛣️ Tell me about the roads!' },
                { id: 'drainage', text: '🚰 How did the drainage work?' },
                { id: 'baths', text: '🏊‍♀️ What about the public baths?' }
            ]
        },
        'culture': {
            text: "Wonderful! The Indus people were skilled craftsmen who made beautiful pottery, jewelry, and toys! They had a standard system of weights and measures, showing how organized they were.",
            nextChoices: [
                { id: 'pottery', text: '🏺 Show me their pottery!' },
                { id: 'jewelry', text: '💍 What jewelry did they make?' },
                { id: 'toys', text: '🎎 Tell me about their toys!' }
            ]
        },
        'mystery': {
            text: "Ah, the greatest mystery! The Indus Valley script has never been fully decoded. We found over 4000 inscriptions, but we still don't know what they say! What would you like to discover?",
            nextChoices: [
                { id: 'script', text: '📝 More about the script!' },
                { id: 'disappear', text: '❓ Why did they disappear?' },
                { id: 'discover', text: '🔍 How were they discovered?' }
            ]
        }
    };
    
    const response = storyResponses[choice];
    if (response) {
        updateStoryContent(response);
        historyState.storylineProgress['indus-valley'].choices.push(choice);
        addXP(15, 'Making story choices');
        playSound('story-choice');
    }
}

function updateStoryContent(response) {
    const storyText = document.querySelector('.story-text p');
    const choiceButtons = document.querySelector('.choice-buttons');
    
    if (storyText && choiceButtons) {
        storyText.textContent = response.text;
        
        choiceButtons.innerHTML = response.nextChoices
            .map(choice => `<button class="choice-btn" data-choice="${choice.id}">${choice.text}</button>`)
            .join('');
        
        // Re-attach event listeners
        const newButtons = choiceButtons.querySelectorAll('.choice-btn');
        newButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.target.dataset.choice;
                handleStoryChoice(choice);
            });
        });
        
        // Update progress
        updateStoryProgress();
    }
}

function updateStoryProgress() {
    const progressFill = document.querySelector('.story-progress-fill');
    const progressText = document.querySelector('.story-progress span');
    
    const currentChoices = historyState.storylineProgress['indus-valley'].choices.length;
    const progressPercent = Math.min((currentChoices / 10) * 100, 100);
    const currentChapter = Math.floor(currentChoices / 2) + 1;
    
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
    
    if (progressText) {
        progressText.textContent = `Chapter ${currentChapter} of 5`;
    }
}

// Games System
function initializeGames() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const btn = card.querySelector('.btn-game');
        if (btn && !btn.classList.contains('locked')) {
            btn.addEventListener('click', () => {
                const gameTitle = card.querySelector('h3').textContent;
                startHistoryGame(gameTitle);
            });
        }
    });
}

function startHistoryGame(gameTitle) {
    const games = {
        'Timeline Puzzle': () => startTimelinePuzzle(),
        'Monument Match': () => startMonumentMatch(),
        'Culture Creator': () => startCultureCreator(),
        'Freedom Fighter Quiz': () => startFreedomQuiz()
    };
    
    const gameFunction = games[gameTitle];
    if (gameFunction) {
        gameFunction();
    }
}

function startTimelinePuzzle() {
    const events = [
        { event: 'Indus Valley Civilization', period: '3300 BCE', order: 1 },
        { event: 'Vedic Period begins', period: '1500 BCE', order: 2 },
        { event: 'Mauryan Empire founded', period: '321 BCE', order: 3 },
        { event: 'Gupta Empire begins', period: '320 CE', order: 4 },
        { event: 'Medieval period starts', period: '550 CE', order: 5 }
    ];
    
    // Shuffle events
    const shuffledEvents = [...events].sort(() => Math.random() - 0.5);
    
    const modal = createModal(`
        <div class="timeline-game">
            <h2>Timeline Puzzle 🧩</h2>
            <p>Drag and arrange these historical events in the correct chronological order!</p>
            <div class="puzzle-container">
                <div class="events-to-sort">
                    ${shuffledEvents.map(event => 
                        `<div class="event-card" draggable="true" data-order="${event.order}">
                            <div class="event-title">${event.event}</div>
                            <div class="event-period">${event.period}</div>
                        </div>`
                    ).join('')}
                </div>
                <div class="drop-zone">
                    <p>Drop events here in correct order →</p>
                </div>
            </div>
            <div class="game-buttons">
                <button class="btn btn-primary" onclick="checkTimelineOrder()">Check Answer</button>
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    initializeDragAndDrop();
}

function startMonumentMatch() {
    const monuments = [
        { name: 'Taj Mahal', builder: 'Shah Jahan', period: 'Mughal Era', image: '🕌' },
        { name: 'Red Fort', builder: 'Shah Jahan', period: 'Mughal Era', image: '🏰' },
        { name: 'Qutub Minar', builder: 'Qutub-ud-din Aibak', period: 'Delhi Sultanate', image: '🗼' },
        { name: 'Ajanta Caves', builder: 'Buddhist Monks', period: 'Ancient India', image: '🏛️' }
    ];
    
    const shuffledBuilders = [...monuments.map(m => m.builder)].sort(() => Math.random() - 0.5);
    
    const modal = createModal(`
        <div class="monument-game">
            <h2>Monument Match 🏯</h2>
            <p>Match the monuments with their builders!</p>
            <div class="match-container">
                <div class="monuments-column">
                    <h3>Monuments</h3>
                    ${monuments.map(monument => 
                        `<div class="monument-item" data-builder="${monument.builder}">
                            <span class="monument-icon">${monument.image}</span>
                            <div class="monument-info">
                                <div class="monument-name">${monument.name}</div>
                                <div class="monument-period">${monument.period}</div>
                            </div>
                        </div>`
                    ).join('')}
                </div>
                <div class="builders-column">
                    <h3>Builders</h3>
                    ${shuffledBuilders.map(builder => 
                        `<div class="builder-item" data-builder="${builder}">
                            ${builder}
                        </div>`
                    ).join('')}
                </div>
            </div>
            <div class="game-buttons">
                <button class="btn btn-primary" onclick="checkMonumentMatches()">Check Matches</button>
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    initializeMonumentMatching();
}

function startCultureCreator() {
    const modal = createModal(`
        <div class="culture-creator">
            <h2>Culture Creator 🎨</h2>
            <p>Create your own Indian festival celebration!</p>
            <div class="creation-area">
                <div class="festival-builder">
                    <div class="builder-section">
                        <h3>Choose Festival Elements:</h3>
                        <div class="element-grid">
                            <div class="element-item" data-element="diwali-lights">🪔 Diwali Lights</div>
                            <div class="element-item" data-element="holi-colors">🎨 Holi Colors</div>
                            <div class="element-item" data-element="music">🎵 Traditional Music</div>
                            <div class="element-item" data-element="dance">💃 Classical Dance</div>
                            <div class="element-item" data-element="food">🍛 Festival Food</div>
                            <div class="element-item" data-element="decorations">✨ Decorations</div>
                        </div>
                    </div>
                    <div class="preview-section">
                        <h3>Your Festival:</h3>
                        <div class="festival-preview" id="festivalPreview">
                            <p>Click elements to add them to your festival!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="game-buttons">
                <button class="btn btn-primary" onclick="saveFestival()">Save Festival</button>
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    initializeCultureCreator();
}

// Culture Carousel
function initializeCultureCarousel() {
    const cultureData = [
        {
            icon: '🎪',
            title: 'Festivals of India',
            description: 'India celebrates colorful festivals throughout the year! From Diwali\'s lights to Holi\'s colors, each festival has a beautiful story.',
            examples: ['🪔 Diwali', '🎨 Holi', '🎪 Durga Puja']
        },
        {
            icon: '🎭',
            title: 'Classical Arts',
            description: 'India has magnificent classical dance forms like Bharatanatyam, Kathak, and music traditions that are thousands of years old!',
            examples: ['💃 Bharatanatyam', '🎶 Carnatic Music', '🎪 Kathakali']
        },
        {
            icon: '🏛️',
            title: 'Architecture',
            description: 'From ancient temples to Mughal monuments, India\'s architecture tells stories of different eras and cultures!',
            examples: ['🕌 Taj Mahal', '🏛️ Temples', '🏰 Forts']
        },
        {
            icon: '📚',
            title: 'Literature & Philosophy',
            description: 'India gave the world ancient texts like Vedas, epics like Ramayana and Mahabharata, and great philosophical traditions!',
            examples: ['📖 Ramayana', '📚 Vedas', '🧘‍♂️ Yoga Philosophy']
        }
    ];
    
    let currentCultureIndex = 0;
    
    function showCultureItem(index) {
        const item = cultureData[index];
        const cultureItem = document.querySelector('.culture-item');
        
        if (cultureItem && item) {
            cultureItem.innerHTML = `
                <div class="culture-visual">
                    <div class="culture-icon">${item.icon}</div>
                    <h3>${item.title}</h3>
                </div>
                <div class="culture-description">
                    <p>${item.description}</p>
                    <div class="culture-examples">
                        ${item.examples.map(example => `<span class="example">${example}</span>`).join('')}
                    </div>
                </div>
            `;
            
            const indicator = document.querySelector('.culture-indicator');
            if (indicator) {
                indicator.textContent = `${index + 1} / ${cultureData.length}`;
            }
        }
    }
    
    const prevBtn = document.querySelector('.culture-prev');
    const nextBtn = document.querySelector('.culture-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentCultureIndex = (currentCultureIndex - 1 + cultureData.length) % cultureData.length;
            showCultureItem(currentCultureIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentCultureIndex = (currentCultureIndex + 1) % cultureData.length;
            showCultureItem(currentCultureIndex);
        });
    }
    
    // Initialize with first item
    showCultureItem(0);
}

// Mascot interactions
function initializeHistoryMascot() {
    const mascot = document.getElementById('historyMascot');
    const messages = [
        "Namaste! Ready to explore India's amazing history? 🙏",
        "Did you know the Indus Valley people had the world's first drainage system? 🏛️",
        "Gandhi Ji showed the world that truth and non-violence can defeat any enemy! 🕊️",
        "India has over 5000 years of recorded history! That's incredible! 📜",
        "The number zero was invented in India! Mathematics owes us a lot! 🔢",
        "Ancient Indian texts like Vedas are older than most civilizations! 📚"
    ];
    
    let messageIndex = 0;
    
    function showMascotMessage() {
        const bubble = mascot.querySelector('.mascot-text');
        if (bubble) {
            bubble.textContent = messages[messageIndex];
            messageIndex = (messageIndex + 1) % messages.length;
        }
    }
    
    if (mascot) {
        mascot.addEventListener('click', showMascotMessage);
        
        // Show random messages periodically
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every 10 seconds
                showMascotMessage();
            }
        }, 10000);
    }
}

// Achievement System
function checkAchievements() {
    const achievements = {
        'first-story': {
            condition: () => historyState.storylineProgress['indus-valley'].choices.length >= 3,
            badge: 'Story Seeker',
            message: 'Completed your first interactive history story!',
            xp: 50
        },
        'hero-learner': {
            condition: () => historyState.heroesUnlocked.length >= 2,
            badge: 'Hero Learner',
            message: 'Learned about multiple freedom fighters!',
            xp: 75
        },
        'culture-explorer': {
            condition: () => historyState.culturalKnowledge >= 5,
            badge: 'Culture Explorer',
            message: 'Discovered amazing Indian cultural traditions!',
            xp: 60
        }
    };
    
    Object.keys(achievements).forEach(key => {
        const achievement = achievements[key];
        if (!historyState.achievements.includes(key) && achievement.condition()) {
            historyState.achievements.push(key);
            showAchievementNotification(achievement.badge, achievement.message);
            addXP(achievement.xp, `Earning ${achievement.badge} achievement`);
        }
    });
}

function showAchievementNotification(badge, message) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-info">
                <h4>Achievement Unlocked!</h4>
                <p><strong>${badge}</strong></p>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Utility Functions
function addXP(amount, reason) {
    historyState.totalXP += amount;
    historyState.treasures += Math.floor(amount / 10);
    
    // Check for level up
    const newLevel = Math.floor(historyState.totalXP / 200) + 1;
    if (newLevel > historyState.currentLevel) {
        historyState.currentLevel = newLevel;
        showLevelUpNotification(newLevel);
    }
    
    updateProgressDisplay();
    saveHistoryProgress();
    checkAchievements();
    
    showNotification(`+${amount} XP - ${reason}! 🎉`, 'success');
}

function showLevelUpNotification(level) {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
        <div class="level-up-content">
            <h2>Level Up! 🎉</h2>
            <p>You've reached Level ${level}!</p>
            <div class="level-rewards">
                <p>New content unlocked in History Land!</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            ${content}
        </div>
    `;
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function showHistoryModal(periodType) {
    // Implementation for showing detailed period information
    const modal = createModal(`
        <div class="history-period-modal">
            <h2>You've mastered ${periodType.charAt(0).toUpperCase() + periodType.slice(1)} India!</h2>
            <p>Great job completing this historical period. You can review the content anytime!</p>
            <button class="btn btn-primary" onclick="closeModal()">Continue Exploring</button>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function playSound(soundType) {
    // Placeholder for sound playing functionality
    console.log(`Playing sound: ${soundType}`);
}

// Smooth scrolling for navigation
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadHistoryProgress();
    initializeTimeline();
    initializeHeroes();
    initializeStories();
    initializeGames();
    initializeCultureCarousel();
    initializeHistoryMascot();
    initializeSmoothScrolling();
    
    console.log('History Land initialized successfully! 🏛️');
});
