// Life Skills Village JavaScript - Community-Based Life Learning

// Game State
let villageState = {
    currentLevel: 6,
    totalXP: 1200,
    coins: 120,
    skillsCompleted: {
        'personal-care': ['brushing-teeth', 'taking-bath'],
        'home-skills': ['cleaning-room'],
        'social-skills': ['good-manners']
    },
    currentSkills: {
        'personal-care': 'dressing-up',
        'home-skills': 'simple-cooking',
        'social-skills': 'communication'
    },
    buildingsUnlocked: ['home', 'school', 'market', 'hospital', 'park', 'community-hall'],
    currentBuilding: 'school',
    completedBuildings: ['home'],
    goodDeeds: [
        { deed: 'Helped carry groceries', reward: 20, completed: true },
        { deed: 'Cleaned park bench', reward: 15, completed: true },
        { deed: 'Reading to younger kids', reward: 25, completed: false }
    ],
    friends: ['Emma', 'Alex', 'Sofia', 'Ryan', 'Maya'],
    achievements: [],
    quizProgress: { currentQuestion: 1, totalQuestions: 5, score: 0 }
};

// Load saved progress
function loadVillageProgress() {
    const savedProgress = localStorage.getItem('terraVillageProgress');
    if (savedProgress) {
        villageState = { ...villageState, ...JSON.parse(savedProgress) };
    }
    updateProgressDisplay();
}

// Save progress
function saveVillageProgress() {
    localStorage.setItem('terraVillageProgress', JSON.stringify(villageState));
}

// Update progress display
function updateProgressDisplay() {
    const xpBar = document.querySelector('.xp-fill');
    if (xpBar) {
        const xpPercentage = (villageState.totalXP % 200) / 2; // Assuming 200 XP per level
        xpBar.style.width = `${xpPercentage}%`;
    }
    
    const coinCount = document.querySelector('.coin-count');
    if (coinCount) {
        coinCount.textContent = villageState.coins;
    }
    
    const levelText = document.querySelector('.xp-text');
    if (levelText) {
        levelText.textContent = `Level ${villageState.currentLevel}`;
    }
}

// Village Building System
function initializeVillageMap() {
    const buildings = document.querySelectorAll('.village-building');
    
    buildings.forEach(building => {
        building.addEventListener('click', () => {
            const buildingType = building.dataset.building;
            handleBuildingClick(buildingType, building);
        });
    });
}

function handleBuildingClick(buildingType, element) {
    if (element.classList.contains('locked')) {
        showNotification('Complete more skills to unlock this building! 🔒', 'warning');
        return;
    }
    
    const buildingInfo = getBuildingInfo(buildingType);
    if (buildingInfo) {
        showBuildingModal(buildingInfo);
    }
}

function getBuildingInfo(buildingType) {
    const buildings = {
        'home': {
            name: 'Home Sweet Home',
            description: 'Learn essential home skills like cooking, cleaning, and organization!',
            skills: ['Simple Cooking', 'Cleaning Room', 'Folding Clothes', 'Basic Organization'],
            activities: ['Cooking Challenge', 'Room Makeover', 'Chore Planning']
        },
        'school': {
            name: 'Learning Center',
            description: 'Develop study habits, communication skills, and social interactions!',
            skills: ['Study Habits', 'Note Taking', 'Time Management', 'Presentation Skills'],
            activities: ['Study Planner', 'Communication Practice', 'Group Projects']
        },
        'market': {
            name: 'Community Market',
            description: 'Learn about money, budgeting, and smart shopping decisions!',
            skills: ['Money Management', 'Smart Shopping', 'Budgeting', 'Comparison Shopping'],
            activities: ['Shopping Simulation', 'Budget Challenge', 'Price Comparison']
        },
        'hospital': {
            name: 'Health Center',
            description: 'Understand health, hygiene, and basic first aid skills!',
            skills: ['Personal Hygiene', 'Basic First Aid', 'Healthy Habits', 'Emergency Response'],
            activities: ['Health Check', 'First Aid Quiz', 'Hygiene Routine']
        },
        'park': {
            name: 'Friendship Park',
            description: 'Build social skills, make friends, and learn teamwork!',
            skills: ['Making Friends', 'Teamwork', 'Conflict Resolution', 'Empathy'],
            activities: ['Friend Finder', 'Team Games', 'Emotion Recognition']
        },
        'community-hall': {
            name: 'Community Hall',
            description: 'Learn about community service, leadership, and helping others!',
            skills: ['Community Service', 'Leadership', 'Helping Others', 'Volunteering'],
            activities: ['Service Projects', 'Leadership Tasks', 'Volunteer Matching']
        }
    };
    
    return buildings[buildingType];
}

function showBuildingModal(info) {
    const modal = createModal(`
        <div class="building-modal">
            <h2>${info.name}</h2>
            <p>${info.description}</p>
            
            <div class="building-content">
                <div class="skills-section">
                    <h3>Skills to Learn:</h3>
                    <ul class="skills-list">
                        ${info.skills.map(skill => `<li>📚 ${skill}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="activities-section">
                    <h3>Fun Activities:</h3>
                    <ul class="activities-list">
                        ${info.activities.map(activity => `<li>🎯 ${activity}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="enterBuilding('${info.name}')">Enter Building</button>
                <button class="btn btn-secondary" onclick="closeModal()">Maybe Later</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function enterBuilding(buildingName) {
    closeModal();
    addXP(10, `Visiting ${buildingName}`);
    showNotification(`Welcome to ${buildingName}! Let's start learning! 🏡`, 'success');
}

// Skills System
function initializeSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        if (!item.classList.contains('locked')) {
            item.addEventListener('click', () => {
                const skillName = item.querySelector('.skill-name').textContent;
                const skillCategory = item.closest('.skill-category').querySelector('.category-header h3').textContent;
                handleSkillClick(skillName, skillCategory, item);
            });
        }
    });
}

function handleSkillClick(skillName, category, element) {
    if (element.classList.contains('completed')) {
        showSkillReview(skillName, category);
    } else if (element.classList.contains('current')) {
        startSkillPractice(skillName, category);
    } else if (element.classList.contains('available')) {
        startSkillLearning(skillName, category);
    }
}

function startSkillLearning(skillName, category) {
    const skillLessons = {
        'Nail Care': {
            steps: [
                "Wash your hands with soap and warm water",
                "Use a nail clipper to trim nails straight across",
                "File nails gently in one direction",
                "Clean under nails with a soft brush",
                "Apply moisturizer to hands and nails"
            ],
            tips: ["Keep nails short and clean", "Don't bite your nails", "Use a nail file, not scissors"]
        },
        'Folding Clothes': {
            steps: [
                "Lay the shirt flat on a clean surface",
                "Fold one side to the middle",
                "Fold the sleeve back",
                "Repeat with the other side",
                "Fold the bottom up to create a neat rectangle"
            ],
            tips: ["Smooth out wrinkles as you fold", "Make crisp creases", "Stack similar items together"]
        },
        'Making Friends': {
            steps: [
                "Smile and make eye contact",
                "Introduce yourself politely",
                "Ask questions about their interests",
                "Listen actively to their responses",
                "Suggest activities to do together"
            ],
            tips: ["Be yourself", "Show genuine interest", "Be kind and respectful"]
        }
    };
    
    const lesson = skillLessons[skillName];
    if (lesson) {
        showSkillLearningModal(skillName, lesson);
    }
}

function showSkillLearningModal(skillName, lesson) {
    const modal = createModal(`
        <div class="skill-learning-modal">
            <h2>Learning: ${skillName}</h2>
            
            <div class="lesson-content">
                <div class="steps-section">
                    <h3>Step-by-Step Guide:</h3>
                    <ol class="skill-steps">
                        ${lesson.steps.map((step, index) => 
                            `<li class="skill-step" data-step="${index + 1}">
                                <span class="step-number">${index + 1}</span>
                                <span class="step-text">${step}</span>
                            </li>`
                        ).join('')}
                    </ol>
                </div>
                
                <div class="tips-section">
                    <h3>Helpful Tips:</h3>
                    <ul class="skill-tips">
                        ${lesson.tips.map(tip => `<li>💡 ${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="lesson-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">0% Complete</span>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="startSkillPractice('${skillName}')">Start Practice</button>
                <button class="btn btn-secondary" onclick="closeModal()">Study More</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    animateSkillSteps();
}

function animateSkillSteps() {
    const steps = document.querySelectorAll('.skill-step');
    const progressBar = document.querySelector('.lesson-progress .progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active');
            const progress = ((index + 1) / steps.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}% Complete`;
        }, index * 1000);
    });
}

function startSkillPractice(skillName, category) {
    closeModal();
    
    const practiceActivities = {
        'Simple Cooking': () => startCookingChallenge(),
        'Communication': () => startCommunicationPractice(),
        'Dressing Up': () => startDressingChallenge(),
        'Making Friends': () => startFriendshipActivity()
    };
    
    const activity = practiceActivities[skillName];
    if (activity) {
        activity();
    } else {
        // Generic skill practice
        showGenericSkillPractice(skillName);
    }
}

function startCookingChallenge() {
    const modal = createModal(`
        <div class="cooking-challenge">
            <h2>Cooking Challenge: Healthy Sandwich 🥪</h2>
            
            <div class="cooking-area">
                <div class="ingredients-panel">
                    <h3>Available Ingredients:</h3>
                    <div class="ingredients-grid">
                        <div class="ingredient" data-ingredient="bread">🍞 Whole wheat bread</div>
                        <div class="ingredient" data-ingredient="lettuce">🥬 Fresh lettuce</div>
                        <div class="ingredient" data-ingredient="tomato">🍅 Sliced tomato</div>
                        <div class="ingredient" data-ingredient="cheese">🧀 Cheese slice</div>
                        <div class="ingredient" data-ingredient="turkey">🦃 Turkey slice</div>
                        <div class="ingredient" data-ingredient="mayo">🥄 Mayonnaise</div>
                    </div>
                </div>
                
                <div class="cooking-workspace">
                    <h3>Your Sandwich:</h3>
                    <div class="sandwich-builder" id="sandwichBuilder">
                        <div class="sandwich-layer base">🍞 Bread (bottom)</div>
                    </div>
                    <button class="btn btn-secondary" onclick="addBreadTop()">🍞 Add Top Bread</button>
                </div>
            </div>
            
            <div class="cooking-tips">
                <h3>Cooking Tips:</h3>
                <ul>
                    <li>🧼 Always wash your hands first</li>
                    <li>🥬 Wash vegetables before using</li>
                    <li>🔪 Ask an adult to help with cutting</li>
                    <li>🧽 Clean up as you go</li>
                </ul>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="completeCookingChallenge()">Finish Sandwich</button>
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    initializeCookingGame();
}

function initializeCookingGame() {
    const ingredients = document.querySelectorAll('.ingredient');
    const sandwichBuilder = document.getElementById('sandwichBuilder');
    
    ingredients.forEach(ingredient => {
        ingredient.addEventListener('click', (e) => {
            const ingredientType = e.target.dataset.ingredient;
            const ingredientName = e.target.textContent;
            
            if (ingredientType !== 'bread') {
                const layer = document.createElement('div');
                layer.className = 'sandwich-layer';
                layer.textContent = ingredientName;
                sandwichBuilder.appendChild(layer);
                
                e.target.style.opacity = '0.5';
                e.target.style.pointerEvents = 'none';
            }
        });
    });
}

function addBreadTop() {
    const sandwichBuilder = document.getElementById('sandwichBuilder');
    const topBread = document.createElement('div');
    topBread.className = 'sandwich-layer top';
    topBread.textContent = '🍞 Bread (top)';
    sandwichBuilder.appendChild(topBread);
    
    const button = event.target;
    button.style.display = 'none';
}

function completeCookingChallenge() {
    const sandwichLayers = document.querySelectorAll('.sandwich-layer');
    if (sandwichLayers.length >= 3) {
        closeModal();
        addXP(50, 'Completing Cooking Challenge');
        addCoins(25);
        showNotification('Great job! You made a delicious and healthy sandwich! 🥪✨', 'success');
        
        // Update skill progress
        updateSkillProgress('Simple Cooking', 'home-skills');
    } else {
        showNotification('Add more ingredients to make your sandwich complete! 🥪', 'warning');
    }
}

function startCommunicationPractice() {
    const scenarios = [
        {
            situation: "You want to ask a classmate to be your partner for a project",
            options: [
                { text: "Just grab their arm and say 'You're my partner!'", correct: false },
                { text: "Politely ask 'Would you like to work together on this project?'", correct: true },
                { text: "Write a note and throw it at them", correct: false }
            ]
        },
        {
            situation: "Someone accidentally bumps into you in the hallway",
            options: [
                { text: "Get angry and shout at them", correct: false },
                { text: "Say 'That's okay, no problem!' with a smile", correct: true },
                { text: "Ignore them completely", correct: false }
            ]
        }
    ];
    
    showCommunicationScenario(scenarios[0], 0, scenarios);
}

function showCommunicationScenario(scenario, index, allScenarios) {
    const modal = createModal(`
        <div class="communication-practice">
            <h2>Communication Practice 💬</h2>
            
            <div class="scenario-area">
                <h3>Scenario ${index + 1}:</h3>
                <p class="scenario-text">${scenario.situation}</p>
                
                <div class="response-options">
                    <h4>How would you respond?</h4>
                    ${scenario.options.map((option, optIndex) => 
                        `<button class="communication-option" data-correct="${option.correct}" onclick="selectCommunicationOption(${optIndex}, ${option.correct}, ${index}, ${JSON.stringify(allScenarios).replace(/"/g, '&quot;')})">
                            ${option.text}
                        </button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="practice-progress">
                <span>Scenario ${index + 1} of ${allScenarios.length}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((index + 1) / allScenarios.length) * 100}%"></div>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function selectCommunicationOption(optionIndex, isCorrect, scenarioIndex, allScenarios) {
    const scenarios = JSON.parse(allScenarios.replace(/&quot;/g, '"'));
    
    if (isCorrect) {
        showNotification('Excellent choice! That\'s a great way to communicate! 👏', 'success');
        addXP(20, 'Good communication choice');
    } else {
        showNotification('That might not be the best approach. Try to be more polite and considerate! 😊', 'info');
    }
    
    setTimeout(() => {
        closeModal();
        
        if (scenarioIndex + 1 < scenarios.length) {
            showCommunicationScenario(scenarios[scenarioIndex + 1], scenarioIndex + 1, scenarios);
        } else {
            addXP(30, 'Completing Communication Practice');
            updateSkillProgress('Communication', 'social-skills');
            showNotification('Great job! You\'ve completed communication practice! 🎉', 'success');
        }
    }, 2000);
}

// Community System
function initializeCommunity() {
    const helpButtons = document.querySelectorAll('.btn-help');
    const addDeedButton = document.querySelector('.good-deeds .btn-secondary');
    
    helpButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const helpItem = e.target.closest('.help-item');
            const helpTitle = helpItem.querySelector('h4').textContent;
            handleHelpRequest(helpTitle, button);
        });
    });
    
    if (addDeedButton) {
        addDeedButton.addEventListener('click', showAddGoodDeedModal);
    }
}

function handleHelpRequest(requestTitle, button) {
    const helpResponses = {
        'Mrs. Johnson needs help': {
            message: "Thank you for helping Mrs. Johnson! You carried her groceries and made her day brighter! 🛒✨",
            reward: 30,
            deed: "Helped Mrs. Johnson with groceries"
        },
        "Mr. Smith's garden": {
            message: "The plants are so happy you helped water them! Mr. Smith says you're a wonderful helper! 🌱💚",
            reward: 25,
            deed: "Helped water community garden"
        },
        'Pet Care Needed': {
            message: "The dogs loved their walk with you! They're wagging their tails with joy! 🐕❤️",
            reward: 35,
            deed: "Walked community dogs"
        }
    };
    
    const response = helpResponses[requestTitle];
    if (response) {
        button.textContent = '✅ Helping!';
        button.disabled = true;
        button.style.background = '#4CAF50';
        
        addXP(response.reward, 'Helping community member');
        addCoins(Math.floor(response.reward / 2));
        
        // Add to good deeds
        villageState.goodDeeds.push({
            deed: response.deed,
            reward: Math.floor(response.reward / 2),
            completed: true
        });
        
        saveVillageProgress();
        showNotification(response.message, 'success');
        updateGoodDeedsDisplay();
    }
}

function showAddGoodDeedModal() {
    const modal = createModal(`
        <div class="add-deed-modal">
            <h2>Add Your Good Deed! ⭐</h2>
            
            <div class="deed-form">
                <div class="form-group">
                    <label>What good deed did you do?</label>
                    <select id="deedSelect" class="deed-select">
                        <option value="">Choose a good deed...</option>
                        <option value="helped-sibling">Helped my sibling with homework</option>
                        <option value="cleaned-room">Cleaned my room without being asked</option>
                        <option value="shared-snack">Shared my snack with a friend</option>
                        <option value="picked-up-trash">Picked up trash in the park</option>
                        <option value="helped-parent">Helped parent with chores</option>
                        <option value="comforted-friend">Comforted a sad friend</option>
                        <option value="other">Something else...</option>
                    </select>
                </div>
                
                <div class="form-group" id="customDeedGroup" style="display: none;">
                    <label>Tell us about your good deed:</label>
                    <input type="text" id="customDeed" class="custom-deed-input" placeholder="Describe your good deed...">
                </div>
                
                <div class="deed-encouragement">
                    <p>Every good deed, no matter how small, makes the world a better place! 🌟</p>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="submitGoodDeed()">Add Good Deed</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    
    const deedSelect = document.getElementById('deedSelect');
    const customDeedGroup = document.getElementById('customDeedGroup');
    
    deedSelect.addEventListener('change', (e) => {
        if (e.target.value === 'other') {
            customDeedGroup.style.display = 'block';
        } else {
            customDeedGroup.style.display = 'none';
        }
    });
}

function submitGoodDeed() {
    const deedSelect = document.getElementById('deedSelect');
    const customDeed = document.getElementById('customDeed');
    
    let deedText = '';
    if (deedSelect.value === 'other') {
        deedText = customDeed.value;
    } else if (deedSelect.value) {
        const deedTexts = {
            'helped-sibling': 'Helped sibling with homework',
            'cleaned-room': 'Cleaned room without being asked',
            'shared-snack': 'Shared snack with a friend',
            'picked-up-trash': 'Picked up trash in the park',
            'helped-parent': 'Helped parent with chores',
            'comforted-friend': 'Comforted a sad friend'
        };
        deedText = deedTexts[deedSelect.value];
    }
    
    if (deedText) {
        const reward = Math.floor(Math.random() * 20) + 15; // 15-34 coins
        
        villageState.goodDeeds.push({
            deed: deedText,
            reward: reward,
            completed: true
        });
        
        addXP(reward * 2, 'Adding good deed');
        addCoins(reward);
        saveVillageProgress();
        
        closeModal();
        showNotification(`Amazing! You earned ${reward} coins for your good deed! Keep being awesome! 🌟`, 'success');
        updateGoodDeedsDisplay();
    } else {
        showNotification('Please select or describe your good deed! ✨', 'warning');
    }
}

function updateGoodDeedsDisplay() {
    const deedsProgress = document.querySelector('.deeds-progress');
    if (deedsProgress && villageState.goodDeeds.length > 0) {
        deedsProgress.innerHTML = villageState.goodDeeds.slice(-3).map(deed => `
            <div class="deed-item ${deed.completed ? 'completed' : 'in-progress'}">
                <span class="deed-icon">${deed.completed ? '✅' : '⏳'}</span>
                <span class="deed-text">${deed.deed}</span>
                <span class="deed-reward">+${deed.reward} coins</span>
            </div>
        `).join('');
    }
}

// Quiz System
function initializeQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const isCorrect = e.target.dataset.answer === 'correct';
            handleQuizAnswer(isCorrect, e.target);
        });
    });
}

function handleQuizAnswer(isCorrect, selectedOption) {
    const allOptions = document.querySelectorAll('.quiz-option');
    
    // Disable all options
    allOptions.forEach(option => {
        option.disabled = true;
        if (option.dataset.answer === 'correct') {
            option.style.background = '#4CAF50';
            option.style.color = 'white';
        } else if (option === selectedOption && !isCorrect) {
            option.style.background = '#F44336';
            option.style.color = 'white';
        }
    });
    
    if (isCorrect) {
        villageState.quizProgress.score++;
        showNotification('Correct! Great job! 🎉', 'success');
        addXP(20, 'Correct quiz answer');
    } else {
        showNotification('Not quite right, but keep learning! 📚', 'info');
    }
    
    setTimeout(() => {
        nextQuizQuestion();
    }, 2000);
}

function nextQuizQuestion() {
    villageState.quizProgress.currentQuestion++;
    
    if (villageState.quizProgress.currentQuestion <= villageState.quizProgress.totalQuestions) {
        loadNextQuestion();
    } else {
        completeQuiz();
    }
}

function loadNextQuestion() {
    const questions = [
        {
            question: "When should you wash your hands?",
            options: [
                { text: "Only when they look dirty", answer: "wrong" },
                { text: "Before eating and after using the bathroom", answer: "correct" },
                { text: "Once a week", answer: "wrong" },
                { text: "Only when someone tells you to", answer: "wrong" }
            ],
            mascotMessage: "Clean hands keep germs away! 🧼"
        },
        {
            question: "What's the best way to help a friend who is sad?",
            options: [
                { text: "Tell them to stop being sad", answer: "wrong" },
                { text: "Listen to them and offer a hug", answer: "correct" },
                { text: "Ignore them until they feel better", answer: "wrong" },
                { text: "Make fun of them to cheer them up", answer: "wrong" }
            ],
            mascotMessage: "Being a good friend means being caring and supportive! 🤗"
        },
        {
            question: "How much money should you save from your allowance?",
            options: [
                { text: "Spend it all right away", answer: "wrong" },
                { text: "Save at least some of it for later", answer: "correct" },
                { text: "Give it all to friends", answer: "wrong" },
                { text: "Hide it and forget about it", answer: "wrong" }
            ],
            mascotMessage: "Saving money helps you buy special things later! 💰"
        }
    ];
    
    const currentQ = villageState.quizProgress.currentQuestion;
    if (currentQ - 1 < questions.length) {
        const question = questions[currentQ - 1];
        updateQuizDisplay(question, currentQ);
    }
}

function updateQuizDisplay(question, questionNumber) {
    const questionArea = document.querySelector('.question-area h4');
    const quizOptions = document.querySelector('.quiz-options');
    const mascotText = document.querySelector('.quiz-mascot .mascot-bubble p');
    const progressFill = document.querySelector('.quiz-progress-fill');
    const progressText = document.querySelector('.quiz-progress span');
    
    if (questionArea) questionArea.textContent = question.question;
    if (mascotText) mascotText.textContent = question.mascotMessage;
    if (progressText) progressText.textContent = `Question ${questionNumber} of 5`;
    if (progressFill) progressFill.style.width = `${(questionNumber / 5) * 100}%`;
    
    if (quizOptions) {
        quizOptions.innerHTML = question.options.map(option => 
            `<button class="quiz-option" data-answer="${option.answer}">${option.text}</button>`
        ).join('');
        
        // Re-attach event listeners
        const newOptions = document.querySelectorAll('.quiz-option');
        newOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const isCorrect = e.target.dataset.answer === 'correct';
                handleQuizAnswer(isCorrect, e.target);
            });
        });
    }
}

function completeQuiz() {
    const score = villageState.quizProgress.score;
    const total = villageState.quizProgress.totalQuestions;
    const percentage = Math.round((score / total) * 100);
    
    let message = '';
    let xpReward = 0;
    
    if (percentage >= 80) {
        message = `Excellent! You got ${score} out of ${total} correct! You're a life skills superstar! 🌟`;
        xpReward = 100;
    } else if (percentage >= 60) {
        message = `Good job! You got ${score} out of ${total} correct! Keep practicing! 👏`;
        xpReward = 75;
    } else {
        message = `You got ${score} out of ${total} correct. Don't worry, keep learning and you'll improve! 📚`;
        xpReward = 50;
    }
    
    addXP(xpReward, 'Completing Life Skills Quiz');
    addCoins(Math.floor(xpReward / 5));
    
    // Reset quiz for next time
    villageState.quizProgress = { currentQuestion: 1, totalQuestions: 5, score: 0 };
    saveVillageProgress();
    
    showNotification(message, 'success');
}

// Activity System
function initializeActivities() {
    const activityButtons = document.querySelectorAll('.btn-activity');
    
    activityButtons.forEach(button => {
        if (!button.classList.contains('locked')) {
            button.addEventListener('click', (e) => {
                const activityCard = e.target.closest('.activity-card');
                const activityTitle = activityCard.querySelector('h3').textContent;
                startActivity(activityTitle);
            });
        }
    });
}

function startActivity(activityTitle) {
    const activities = {
        'Cooking Challenge': () => startCookingChallenge(),
        'Smart Shopping': () => startShoppingActivity(),
        'Communication Practice': () => startCommunicationPractice(),
        'Emergency Preparedness': () => startEmergencyActivity()
    };
    
    const activity = activities[activityTitle];
    if (activity) {
        activity();
    }
}

function startShoppingActivity() {
    const modal = createModal(`
        <div class="shopping-activity">
            <h2>Smart Shopping Challenge 🛒</h2>
            
            <div class="shopping-scenario">
                <div class="budget-info">
                    <h3>Your Budget: $20</h3>
                    <div class="money-remaining">
                        <span class="budget-amount" id="budgetAmount">$20.00</span>
                        <span class="budget-status">remaining</span>
                    </div>
                </div>
                
                <div class="shopping-list">
                    <h3>Shopping List:</h3>
                    <ul>
                        <li>🥛 Milk - needed</li>
                        <li>🍞 Bread - needed</li>
                        <li>🍌 Bananas - needed</li>
                        <li>🥕 Carrots - needed</li>
                    </ul>
                </div>
            </div>
            
            <div class="store-items">
                <h3>Store Items:</h3>
                <div class="items-grid">
                    <div class="store-item" data-item="milk" data-price="3.50">
                        <span class="item-icon">🥛</span>
                        <span class="item-name">Milk</span>
                        <span class="item-price">$3.50</span>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                    <div class="store-item" data-item="bread" data-price="2.25">
                        <span class="item-icon">🍞</span>
                        <span class="item-name">Bread</span>
                        <span class="item-price">$2.25</span>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                    <div class="store-item" data-item="bananas" data-price="1.99">
                        <span class="item-icon">🍌</span>
                        <span class="item-name">Bananas</span>
                        <span class="item-price">$1.99</span>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                    <div class="store-item" data-item="carrots" data-price="1.75">
                        <span class="item-icon">🥕</span>
                        <span class="item-name">Carrots</span>
                        <span class="item-price">$1.75</span>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                    <div class="store-item" data-item="cookies" data-price="4.99">
                        <span class="item-icon">🍪</span>
                        <span class="item-name">Cookies (want)</span>
                        <span class="item-price">$4.99</span>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                    <div class="store-item" data-item="candy" data-price="2.50">
                        <span class="item-icon">🍬</span>
                        <span class="item-name">Candy (want)</span>
                        <span class="item-price">$2.50</span>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                </div>
            </div>
            
            <div class="shopping-cart">
                <h3>Your Cart:</h3>
                <div id="cartItems" class="cart-items">
                    <p>Cart is empty</p>
                </div>
                <div class="cart-total">
                    Total: $<span id="cartTotal">0.00</span>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="completeShopping()">Checkout</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    initializeShoppingGame();
}

function initializeShoppingGame() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    let cart = [];
    let budget = 20.00;
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const storeItem = e.target.closest('.store-item');
            const itemName = storeItem.querySelector('.item-name').textContent;
            const itemPrice = parseFloat(storeItem.dataset.price);
            const itemIcon = storeItem.querySelector('.item-icon').textContent;
            
            if (budget >= itemPrice) {
                cart.push({ name: itemName, price: itemPrice, icon: itemIcon });
                budget -= itemPrice;
                updateShoppingDisplay(cart, budget);
                
                e.target.disabled = true;
                e.target.textContent = 'Added';
                e.target.style.background = '#4CAF50';
            } else {
                showNotification('Not enough money for this item! 💸', 'warning');
            }
        });
    });
}

function updateShoppingDisplay(cart, budget) {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const budgetAmount = document.getElementById('budgetAmount');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => 
            `<div class="cart-item">
                <span>${item.icon}</span>
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>`
        ).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = total.toFixed(2);
    budgetAmount.textContent = `$${budget.toFixed(2)}`;
    
    if (budget < 5) {
        budgetAmount.style.color = '#F44336';
    } else {
        budgetAmount.style.color = '#4CAF50';
    }
}

function completeShopping() {
    const cartItems = document.querySelectorAll('.cart-item');
    const requiredItems = ['Milk', 'Bread', 'Bananas', 'Carrots'];
    const cartItemNames = Array.from(cartItems).map(item => 
        item.textContent.split('$')[0].trim()
    );
    
    const hasAllRequired = requiredItems.every(required => 
        cartItemNames.some(cart => cart.includes(required))
    );
    
    if (hasAllRequired) {
        const total = parseFloat(document.getElementById('cartTotal').textContent);
        const saved = 20 - total;
        
        closeModal();
        addXP(75, 'Smart Shopping Challenge');
        addCoins(Math.floor(saved * 5));
        
        showNotification(`Excellent shopping! You got everything needed and saved $${saved.toFixed(2)}! 🛒✨`, 'success');
    } else {
        showNotification('You\'re missing some items from your shopping list! Check what you need! 📋', 'warning');
    }
}

// Achievement System
function checkAchievements() {
    const achievements = {
        'skill-master': {
            condition: () => Object.values(villageState.skillsCompleted).flat().length >= 5,
            badge: 'Skill Master',
            message: 'Mastered 5 essential life skills!',
            xp: 100
        },
        'community-helper': {
            condition: () => villageState.goodDeeds.filter(deed => deed.completed).length >= 5,
            badge: 'Community Helper',
            message: 'Completed 5 good deeds for the community!',
            xp: 150
        },
        'social-butterfly': {
            condition: () => villageState.friends.length >= 5,
            badge: 'Social Butterfly',
            message: 'Made 5 friends in the village!',
            xp: 75
        }
    };
    
    Object.keys(achievements).forEach(key => {
        const achievement = achievements[key];
        if (!villageState.achievements.includes(key) && achievement.condition()) {
            villageState.achievements.push(key);
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

// Village Mascot System
function initializeVillageMascot() {
    const mascot = document.getElementById('villageMascot');
    const messages = [
        "Welcome to our friendly village! Ready to learn some life skills? 🏡",
        "Remember, helping others makes our community stronger! 🤝",
        "Great job learning new skills! Practice makes perfect! 💪",
        "Don't forget to save some of your coins for special things! 💰",
        "Being kind and polite opens many doors in life! 😊",
        "Every small good deed makes a big difference! ✨"
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
            if (Math.random() < 0.25) { // 25% chance every 15 seconds
                showMascotMessage();
            }
        }, 15000);
    }
}

// Utility Functions
function addXP(amount, reason) {
    villageState.totalXP += amount;
    
    // Check for level up
    const newLevel = Math.floor(villageState.totalXP / 200) + 1;
    if (newLevel > villageState.currentLevel) {
        villageState.currentLevel = newLevel;
        showLevelUpNotification(newLevel);
    }
    
    updateProgressDisplay();
    saveVillageProgress();
    checkAchievements();
    
    showNotification(`+${amount} XP - ${reason}! 🎉`, 'success');
}

function addCoins(amount) {
    villageState.coins += amount;
    updateProgressDisplay();
    saveVillageProgress();
    
    if (amount > 0) {
        showNotification(`+${amount} coins earned! 🪙`, 'success');
    }
}

function updateSkillProgress(skillName, category) {
    if (!villageState.skillsCompleted[category]) {
        villageState.skillsCompleted[category] = [];
    }
    
    villageState.skillsCompleted[category].push(skillName.toLowerCase().replace(/\s+/g, '-'));
    delete villageState.currentSkills[category];
    
    saveVillageProgress();
}

function showLevelUpNotification(level) {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
        <div class="level-up-content">
            <h2>Level Up! 🎉</h2>
            <p>You've reached Level ${level}!</p>
            <div class="level-rewards">
                <p>New buildings and activities unlocked!</p>
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
    loadVillageProgress();
    initializeVillageMap();
    initializeSkills();
    initializeCommunity();
    initializeQuiz();
    initializeActivities();
    initializeVillageMascot();
    initializeSmoothScrolling();
    updateGoodDeedsDisplay();
    
    console.log('Life Skills Village initialized successfully! 🏡');
});
