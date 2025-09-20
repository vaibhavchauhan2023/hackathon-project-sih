// AI & Future City JavaScript - Interactive Technology Learning

// Game State
let futureState = {
    currentLevel: 7,
    totalXP: 1400,
    tokens: 200,
    conceptsLearned: {
        'machine-learning': ['what-is-ai', 'pattern-recognition'],
        'robotics': ['how-robots-move', 'robot-sensors'],
        'future-tech': ['internet-of-things']
    },
    currentConcepts: {
        'machine-learning': 'training-ai',
        'robotics': 'programming-robots',
        'future-tech': 'clean-energy'
    },
    zonesExplored: ['ai-center'],
    currentZone: 'robot-lab',
    availableZones: ['tech-hub', 'space-station', 'smart-home', 'innovation-center'],
    robotsBuilt: [],
    codeProjects: [],
    innovations: [],
    achievements: []
};

// Load saved progress
function loadFutureProgress() {
    const savedProgress = localStorage.getItem('terraFutureProgress');
    if (savedProgress) {
        futureState = { ...futureState, ...JSON.parse(savedProgress) };
    }
    updateProgressDisplay();
}

// Save progress
function saveFutureProgress() {
    localStorage.setItem('terraFutureProgress', JSON.stringify(futureState));
}

// Update progress display
function updateProgressDisplay() {
    const xpBar = document.querySelector('.xp-fill');
    if (xpBar) {
        const xpPercentage = (futureState.totalXP % 200) / 2; // Assuming 200 XP per level
        xpBar.style.width = `${xpPercentage}%`;
    }
    
    const tokenCount = document.querySelector('.token-count');
    if (tokenCount) {
        tokenCount.textContent = futureState.tokens;
    }
    
    const levelText = document.querySelector('.xp-text');
    if (levelText) {
        levelText.textContent = `Level ${futureState.currentLevel}`;
    }
}

// City Zone System
function initializeCityMap() {
    const zones = document.querySelectorAll('.city-zone');
    
    zones.forEach(zone => {
        zone.addEventListener('click', () => {
            const zoneType = zone.dataset.zone;
            handleZoneClick(zoneType, zone);
        });
    });
}

function handleZoneClick(zoneType, element) {
    if (element.classList.contains('locked')) {
        showNotification('Complete more concepts to unlock this zone! 🔒', 'warning');
        return;
    }
    
    const zoneInfo = getZoneInfo(zoneType);
    if (zoneInfo) {
        showZoneModal(zoneInfo);
    }
}

function getZoneInfo(zoneType) {
    const zones = {
        'ai-center': {
            name: 'AI Research Center',
            description: 'Discover the fundamentals of artificial intelligence and machine learning!',
            concepts: ['Neural Networks', 'Deep Learning', 'AI Ethics', 'Machine Vision'],
            activities: ['AI Pattern Game', 'Train Your Bot', 'Smart Assistant Builder']
        },
        'robot-lab': {
            name: 'Robot Building Lab',
            description: 'Design, build, and program robots with different capabilities!',
            concepts: ['Robot Mechanics', 'Sensor Integration', 'Programming Logic', 'Automation'],
            activities: ['Robot Designer', 'Sensor Simulator', 'Movement Programming']
        },
        'tech-hub': {
            name: 'Tech Innovation Hub',
            description: 'Explore cutting-edge technologies that will shape our future!',
            concepts: ['IoT Devices', 'Blockchain', 'Quantum Computing', 'AR/VR'],
            activities: ['Smart Home Simulator', 'Future Tech Quiz', 'Innovation Lab']
        },
        'space-station': {
            name: 'Space Exploration',
            description: 'Learn about space technology, rockets, and exploring other planets!',
            concepts: ['Rocket Science', 'Space Robotics', 'Mars Missions', 'Satellites'],
            activities: ['Mission Planner', 'Rocket Builder', 'Mars Rover Controller']
        }
    };
    
    return zones[zoneType];
}

function showZoneModal(info) {
    const modal = createModal(`
        <div class="zone-modal">
            <h2>${info.name}</h2>
            <p>${info.description}</p>
            
            <div class="zone-content">
                <div class="concepts-section">
                    <h3>Learn About:</h3>
                    <ul class="concepts-list">
                        ${info.concepts.map(concept => `<li>🧠 ${concept}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="zone-activities-section">
                    <h3>Interactive Activities:</h3>
                    <ul class="zone-activities-list">
                        ${info.activities.map(activity => `<li>🎮 ${activity}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="enterZone('${info.name}')">Enter Zone</button>
                <button class="btn btn-secondary" onclick="closeModal()">Explore Later</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function enterZone(zoneName) {
    closeModal();
    addXP(15, `Exploring ${zoneName}`);
    addTokens(10);
    showNotification(`Welcome to ${zoneName}! Ready to learn about the future? 🚀`, 'success');
}

// AI Labs System
function initializeAILabs() {
    const conceptItems = document.querySelectorAll('.concept-item');
    
    conceptItems.forEach(item => {
        if (!item.classList.contains('locked')) {
            item.addEventListener('click', () => {
                const conceptName = item.querySelector('.concept-name').textContent;
                const labCategory = item.closest('.lab-category').querySelector('.lab-header h3').textContent;
                handleConceptClick(conceptName, labCategory, item);
            });
        }
    });
}

function handleConceptClick(conceptName, category, element) {
    if (element.classList.contains('completed')) {
        showConceptReview(conceptName, category);
    } else if (element.classList.contains('current')) {
        startConceptLearning(conceptName, category);
    } else if (element.classList.contains('available')) {
        startNewConcept(conceptName, category);
    }
}

function startConceptLearning(conceptName, category) {
    const conceptLessons = {
        'Training AI': {
            introduction: "Training AI is like teaching a computer to recognize patterns! We show it lots of examples so it can learn to make smart decisions.",
            steps: [
                "Collect lots of data (like pictures of cats and dogs)",
                "Show the AI the data with correct answers",
                "Let the AI practice making guesses",
                "Give feedback when it's right or wrong",
                "Repeat until the AI gets really good!"
            ],
            activity: () => startAITraining()
        },
        'Programming Robots': {
            introduction: "Programming robots means giving them instructions! We use code to tell robots how to move, sense, and make decisions.",
            steps: [
                "Plan what you want the robot to do",
                "Break the task into simple steps",
                "Write code using programming blocks",
                "Test your program to see if it works",
                "Fix any problems and improve!"
            ],
            activity: () => startRobotProgramming()
        },
        'Clean Energy': {
            introduction: "Clean energy comes from sources that don't pollute our planet! Solar panels, wind turbines, and water power help us live sustainably.",
            steps: [
                "Learn about different clean energy sources",
                "Understand how solar panels work",
                "Explore wind power generation",
                "Discover how we can store energy",
                "Plan a sustainable energy system"
            ],
            activity: () => startEnergyPlanner()
        }
    };
    
    const lesson = conceptLessons[conceptName];
    if (lesson) {
        showConceptLearningModal(conceptName, lesson);
    }
}

function showConceptLearningModal(conceptName, lesson) {
    const modal = createModal(`
        <div class="concept-learning-modal">
            <h2>Learning: ${conceptName}</h2>
            
            <div class="lesson-intro">
                <p>${lesson.introduction}</p>
            </div>
            
            <div class="lesson-steps">
                <h3>How it works:</h3>
                <ol class="concept-steps">
                    ${lesson.steps.map((step, index) => 
                        `<li class="concept-step" data-step="${index + 1}">
                            <span class="step-number">${index + 1}</span>
                            <span class="step-text">${step}</span>
                        </li>`
                    ).join('')}
                </ol>
            </div>
            
            <div class="lesson-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">Ready to learn!</span>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="startInteractiveActivity('${conceptName}')">Try Interactive Activity</button>
                <button class="btn btn-secondary" onclick="closeModal()">Study More</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    animateConceptSteps();
}

function animateConceptSteps() {
    const steps = document.querySelectorAll('.concept-step');
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

function startInteractiveActivity(conceptName) {
    closeModal();
    
    const activities = {
        'Training AI': () => startAITraining(),
        'Programming Robots': () => startRobotProgramming(),
        'Clean Energy': () => startEnergyPlanner()
    };
    
    const activity = activities[conceptName];
    if (activity) {
        activity();
    }
}

// AI Training Activity
function startAITraining() {
    const modal = createModal(`
        <div class="ai-training-activity">
            <h2>Train an AI to Recognize Animals! 🤖</h2>
            
            <div class="training-area">
                <div class="training-panel">
                    <h3>Training Data</h3>
                    <div class="data-examples">
                        <div class="training-example cat" data-type="cat">
                            <span class="example-icon">🐱</span>
                            <span class="example-label">Cat</span>
                            <button class="use-example">Use for Training</button>
                        </div>
                        <div class="training-example dog" data-type="dog">
                            <span class="example-icon">🐕</span>
                            <span class="example-label">Dog</span>
                            <button class="use-example">Use for Training</button>
                        </div>
                        <div class="training-example bird" data-type="bird">
                            <span class="example-icon">🐦</span>
                            <span class="example-label">Bird</span>
                            <button class="use-example">Use for Training</button>
                        </div>
                        <div class="training-example fish" data-type="fish">
                            <span class="example-icon">🐟</span>
                            <span class="example-label">Fish</span>
                            <button class="use-example">Use for Training</button>
                        </div>
                    </div>
                </div>
                
                <div class="ai-brain-panel">
                    <h3>AI Brain</h3>
                    <div class="ai-brain-visual">
                        <div class="brain-neuron" id="neuron1"></div>
                        <div class="brain-neuron" id="neuron2"></div>
                        <div class="brain-neuron" id="neuron3"></div>
                        <div class="neural-connection"></div>
                        <div class="neural-connection"></div>
                    </div>
                    <div class="training-status">
                        <p id="trainingStatus">Ready to learn!</p>
                        <div class="training-progress">
                            <div class="training-bar" id="trainingBar"></div>
                        </div>
                    </div>
                </div>
                
                <div class="test-panel">
                    <h3>Test Your AI</h3>
                    <div class="test-area">
                        <div class="test-question" id="testQuestion">
                            <span class="test-icon">🐱</span>
                            <p>What animal is this?</p>
                        </div>
                        <div class="test-options">
                            <button class="test-option" data-answer="cat">Cat</button>
                            <button class="test-option" data-answer="dog">Dog</button>
                            <button class="test-option" data-answer="bird">Bird</button>
                            <button class="test-option" data-answer="fish">Fish</button>
                        </div>
                        <div class="test-result" id="testResult"></div>
                    </div>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="completeAITraining()">Finish Training</button>
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    initializeAITrainingGame();
}

function initializeAITrainingGame() {
    const useButtons = document.querySelectorAll('.use-example');
    const testOptions = document.querySelectorAll('.test-option');
    let trainingData = [];
    let aiAccuracy = 0;
    
    useButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const example = e.target.closest('.training-example');
            const animalType = example.dataset.type;
            
            trainingData.push(animalType);
            button.textContent = '✅ Added';
            button.disabled = true;
            
            // Update AI training
            updateAITraining(trainingData);
        });
    });
    
    testOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const answer = e.target.dataset.answer;
            const correctAnswer = 'cat'; // Current test is showing a cat
            
            const resultDiv = document.getElementById('testResult');
            if (answer === correctAnswer) {
                resultDiv.innerHTML = `<span class="correct">✅ Correct! The AI learned well!</span>`;
                aiAccuracy += 25;
            } else {
                resultDiv.innerHTML = `<span class="incorrect">❌ Not quite! The AI needs more training.</span>`;
            }
            
            // Disable options after answer
            testOptions.forEach(opt => opt.disabled = true);
        });
    });
}

function updateAITraining(trainingData) {
    const status = document.getElementById('trainingStatus');
    const progressBar = document.getElementById('trainingBar');
    const neurons = document.querySelectorAll('.brain-neuron');
    
    const progress = Math.min(trainingData.length / 4 * 100, 100);
    progressBar.style.width = `${progress}%`;
    
    if (trainingData.length === 1) {
        status.textContent = "AI is starting to learn...";
    } else if (trainingData.length === 2) {
        status.textContent = "AI is recognizing patterns!";
    } else if (trainingData.length === 3) {
        status.textContent = "AI is getting smarter!";
    } else if (trainingData.length >= 4) {
        status.textContent = "AI is ready for testing!";
    }
    
    // Animate neurons
    neurons.forEach((neuron, index) => {
        setTimeout(() => {
            neuron.classList.add('active');
        }, index * 200);
    });
}

function completeAITraining() {
    closeModal();
    addXP(75, 'Completing AI Training');
    addTokens(50);
    showNotification('Congratulations! You successfully trained an AI! The future is bright! 🤖✨', 'success');
    updateConceptProgress('Training AI', 'machine-learning');
}

// Robot Programming Activity
function startRobotProgramming() {
    // Use the existing coding playground
    const codingSection = document.querySelector('.coding-section');
    if (codingSection) {
        codingSection.scrollIntoView({ behavior: 'smooth' });
        showNotification('Use the coding playground below to program your robot! 🤖', 'info');
    }
}

// Visual Programming System
function initializeVisualProgramming() {
    const codeBlocks = document.querySelectorAll('.code-block');
    const codeCanvas = document.getElementById('codeCanvas');
    let droppedBlocks = [];
    
    // Make code blocks draggable
    codeBlocks.forEach(block => {
        block.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', block.outerHTML);
            e.dataTransfer.setData('block-type', block.className);
        });
    });
    
    // Make canvas droppable
    codeCanvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        codeCanvas.classList.add('drag-over');
    });
    
    codeCanvas.addEventListener('dragleave', () => {
        codeCanvas.classList.remove('drag-over');
    });
    
    codeCanvas.addEventListener('drop', (e) => {
        e.preventDefault();
        codeCanvas.classList.remove('drag-over');
        
        const blockHTML = e.dataTransfer.getData('text/plain');
        const blockType = e.dataTransfer.getData('block-type');
        
        // Create new block in canvas
        const newBlock = document.createElement('div');
        newBlock.innerHTML = blockHTML;
        const blockElement = newBlock.firstElementChild;
        blockElement.classList.add('dropped-block');
        blockElement.draggable = false;
        
        // Clear instruction if first block
        if (droppedBlocks.length === 0) {
            codeCanvas.innerHTML = '';
        }
        
        codeCanvas.appendChild(blockElement);
        droppedBlocks.push(blockType);
        
        updateRobotStatus(`Added: ${blockElement.textContent}`);
    });
}

function runCode() {
    const droppedBlocks = document.querySelectorAll('.dropped-block');
    const robotAvatar = document.getElementById('robotAvatar');
    const statusElement = document.getElementById('robotStatus');
    
    if (droppedBlocks.length === 0) {
        updateRobotStatus('No code to run! Add some blocks first.');
        return;
    }
    
    updateRobotStatus('Running code...');
    
    // Simulate robot movement based on blocks
    let delay = 0;
    droppedBlocks.forEach((block, index) => {
        setTimeout(() => {
            const blockText = block.textContent.toLowerCase();
            
            if (blockText.includes('move forward')) {
                animateRobot(robotAvatar, 'forward');
                updateRobotStatus('🤖 Moving forward...');
            } else if (blockText.includes('turn right')) {
                animateRobot(robotAvatar, 'turn');
                updateRobotStatus('🤖 Turning right...');
            } else if (blockText.includes('repeat')) {
                updateRobotStatus('🤖 Repeating actions...');
            }
            
            // Final status
            if (index === droppedBlocks.length - 1) {
                setTimeout(() => {
                    updateRobotStatus('✅ Code execution complete!');
                    addXP(30, 'Running robot code');
                    addTokens(15);
                }, 1000);
            }
        }, delay);
        
        delay += 2000; // 2 second delay between actions
    });
}

function animateRobot(robotElement, action) {
    if (action === 'forward') {
        robotElement.style.transform = 'translateX(20px)';
        setTimeout(() => {
            robotElement.style.transform = 'translateX(0px)';
        }, 1000);
    } else if (action === 'turn') {
        robotElement.style.transform = 'rotate(90deg)';
        setTimeout(() => {
            robotElement.style.transform = 'rotate(0deg)';
        }, 1000);
    }
}

function clearCode() {
    const codeCanvas = document.getElementById('codeCanvas');
    codeCanvas.innerHTML = `
        <div class="canvas-instruction">
            <p>Drag blocks here to program your robot! 🤖</p>
        </div>
    `;
    updateRobotStatus('Code cleared. Ready for new program!');
}

function saveCode() {
    const droppedBlocks = document.querySelectorAll('.dropped-block');
    if (droppedBlocks.length > 0) {
        futureState.codeProjects.push({
            name: `Robot Program ${futureState.codeProjects.length + 1}`,
            blocks: Array.from(droppedBlocks).map(block => block.textContent),
            timestamp: new Date().toISOString()
        });
        
        saveFutureProgress();
        addTokens(20);
        updateRobotStatus('✅ Code saved successfully!');
        showNotification('Your robot program has been saved! 💾', 'success');
    } else {
        updateRobotStatus('No code to save!');
    }
}

function updateRobotStatus(message) {
    const statusElement = document.getElementById('robotStatus');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

// Activities System
function initializeActivities() {
    const activityButtons = document.querySelectorAll('.btn-activity');
    
    activityButtons.forEach(button => {
        if (!button.classList.contains('locked')) {
            button.addEventListener('click', (e) => {
                const activityCard = e.target.closest('.activity-card');
                const activityTitle = activityCard.querySelector('h3').textContent;
                startFutureActivity(activityTitle);
            });
        }
    });
}

function startFutureActivity(activityTitle) {
    const activities = {
        'Build Your Robot': () => startRobotBuilder(),
        'Train an AI': () => startAITraining(),
        'Design Future City': () => startCityDesigner(),
        'Space Mission Planner': () => startSpaceMission()
    };
    
    const activity = activities[activityTitle];
    if (activity) {
        activity();
    }
}

function startRobotBuilder() {
    const modal = createModal(`
        <div class="robot-builder">
            <h2>Build Your Robot! 🤖</h2>
            
            <div class="builder-area">
                <div class="parts-panel">
                    <h3>Robot Parts</h3>
                    <div class="parts-grid">
                        <div class="robot-part" data-part="head">
                            <span class="part-icon">🤖</span>
                            <span class="part-name">Smart Head</span>
                            <span class="part-cost">20 tokens</span>
                            <button class="add-part">Add Part</button>
                        </div>
                        <div class="robot-part" data-part="wheels">
                            <span class="part-icon">⚙️</span>
                            <span class="part-name">Wheels</span>
                            <span class="part-cost">15 tokens</span>
                            <button class="add-part">Add Part</button>
                        </div>
                        <div class="robot-part" data-part="arms">
                            <span class="part-icon">🦾</span>
                            <span class="part-name">Robot Arms</span>
                            <span class="part-cost">25 tokens</span>
                            <button class="add-part">Add Part</button>
                        </div>
                        <div class="robot-part" data-part="sensors">
                            <span class="part-icon">👁️</span>
                            <span class="part-name">Sensors</span>
                            <span class="part-cost">18 tokens</span>
                            <button class="add-part">Add Part</button>
                        </div>
                    </div>
                </div>
                
                <div class="robot-preview">
                    <h3>Your Robot</h3>
                    <div class="robot-display" id="robotDisplay">
                        <div class="robot-base">🤖</div>
                        <p class="robot-name">My Robot</p>
                    </div>
                    <div class="robot-abilities" id="robotAbilities">
                        <p>Add parts to see abilities!</p>
                    </div>
                </div>
                
                <div class="robot-stats">
                    <h3>Robot Stats</h3>
                    <div class="stat-bar">
                        <span>Intelligence:</span>
                        <div class="stat-fill" id="intelligenceStat"></div>
                    </div>
                    <div class="stat-bar">
                        <span>Mobility:</span>
                        <div class="stat-fill" id="mobilityStat"></div>
                    </div>
                    <div class="stat-bar">
                        <span>Utility:</span>
                        <div class="stat-fill" id="utilityStat"></div>
                    </div>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="completeRobotBuild()">Complete Robot</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    initializeRobotBuilder();
}

function initializeRobotBuilder() {
    const addPartButtons = document.querySelectorAll('.add-part');
    let robotParts = [];
    let totalCost = 0;
    
    addPartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const partElement = e.target.closest('.robot-part');
            const partType = partElement.dataset.part;
            const partCost = parseInt(partElement.querySelector('.part-cost').textContent);
            
            if (futureState.tokens >= partCost) {
                robotParts.push(partType);
                futureState.tokens -= partCost;
                totalCost += partCost;
                
                updateProgressDisplay();
                updateRobotPreview(robotParts);
                
                button.textContent = '✅ Added';
                button.disabled = true;
                button.style.background = '#4CAF50';
            } else {
                showNotification('Not enough tokens! Complete more activities to earn tokens! ⚡', 'warning');
            }
        });
    });
}

function updateRobotPreview(parts) {
    const display = document.getElementById('robotDisplay');
    const abilities = document.getElementById('robotAbilities');
    const intelligenceStat = document.getElementById('intelligenceStat');
    const mobilityStat = document.getElementById('mobilityStat');
    const utilityStat = document.getElementById('utilityStat');
    
    let robotEmoji = '🤖';
    let abilityList = [];
    let intelligence = 0, mobility = 0, utility = 0;
    
    parts.forEach(part => {
        switch (part) {
            case 'head':
                abilityList.push('🧠 Smart thinking');
                intelligence += 30;
                break;
            case 'wheels':
                abilityList.push('🚀 Fast movement');
                mobility += 40;
                break;
            case 'arms':
                abilityList.push('🦾 Can grab things');
                utility += 35;
                break;
            case 'sensors':
                abilityList.push('👁️ See obstacles');
                intelligence += 25;
                utility += 20;
                break;
        }
    });
    
    display.querySelector('.robot-base').textContent = robotEmoji;
    
    if (abilityList.length > 0) {
        abilities.innerHTML = '<h4>Abilities:</h4>' + abilityList.map(ability => `<p>${ability}</p>`).join('');
    }
    
    // Update stats
    intelligenceStat.style.width = `${Math.min(intelligence, 100)}%`;
    mobilityStat.style.width = `${Math.min(mobility, 100)}%`;
    utilityStat.style.width = `${Math.min(utility, 100)}%`;
}

function completeRobotBuild() {
    const robotParts = document.querySelectorAll('.add-part:disabled').length;
    
    if (robotParts > 0) {
        const robotName = `Future Bot ${futureState.robotsBuilt.length + 1}`;
        futureState.robotsBuilt.push({
            name: robotName,
            parts: robotParts,
            timestamp: new Date().toISOString()
        });
        
        saveFutureProgress();
        closeModal();
        
        addXP(100, 'Building a robot');
        addTokens(30);
        showNotification(`Congratulations! ${robotName} is ready to help make the future better! 🤖✨`, 'success');
    } else {
        showNotification('Add at least one part to complete your robot! 🔧', 'warning');
    }
}

// Innovations System
function initializeInnovations() {
    const exploreButton = document.querySelector('.btn-explore');
    
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            showInnovationDetails();
        });
    }
}

function showInnovationDetails() {
    const modal = createModal(`
        <div class="innovation-details">
            <h2>Artificial Intelligence Deep Dive! 🧠</h2>
            
            <div class="innovation-content">
                <div class="ai-explanation">
                    <h3>What makes AI amazing?</h3>
                    <div class="ai-features">
                        <div class="feature-item">
                            <span class="feature-icon">🧠</span>
                            <div class="feature-text">
                                <h4>Learning</h4>
                                <p>AI can learn from examples and get better over time!</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🔍</span>
                            <div class="feature-text">
                                <h4>Pattern Recognition</h4>
                                <p>AI can spot patterns humans might miss!</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">⚡</span>
                            <div class="feature-text">
                                <h4>Fast Processing</h4>
                                <p>AI can analyze huge amounts of data quickly!</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="ai-examples">
                    <h3>AI in Action:</h3>
                    <div class="example-grid">
                        <div class="example-card">
                            <span class="example-emoji">🗣️</span>
                            <h4>Voice Assistants</h4>
                            <p>Understand what you say and help with questions!</p>
                        </div>
                        <div class="example-card">
                            <span class="example-emoji">🎮</span>
                            <h4>Smart Games</h4>
                            <p>Create challenging opponents that adapt to your skill!</p>
                        </div>
                        <div class="example-card">
                            <span class="example-emoji">🏥</span>
                            <h4>Medical AI</h4>
                            <p>Help doctors diagnose diseases faster and more accurately!</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="startAIQuiz()">Take AI Quiz</button>
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function startAIQuiz() {
    closeModal();
    
    const quiz = {
        questions: [
            {
                question: "What does AI stand for?",
                options: ["Artificial Intelligence", "Automatic Information", "Advanced Internet", "Amazing Inventions"],
                correct: 0
            },
            {
                question: "How does AI learn?",
                options: ["By reading books", "From examples and data", "By watching TV", "By sleeping"],
                correct: 1
            },
            {
                question: "Which of these uses AI?",
                options: ["A regular calculator", "Voice assistants like Alexa", "A paper book", "A wooden chair"],
                correct: 1
            }
        ],
        currentQuestion: 0,
        score: 0
    };
    
    showAIQuizQuestion(quiz);
}

function showAIQuizQuestion(quiz) {
    const q = quiz.questions[quiz.currentQuestion];
    
    const modal = createModal(`
        <div class="ai-quiz">
            <h2>AI Knowledge Quiz 🧠</h2>
            
            <div class="quiz-progress">
                <span>Question ${quiz.currentQuestion + 1} of ${quiz.questions.length}</span>
                <div class="quiz-progress-bar">
                    <div class="quiz-progress-fill" style="width: ${((quiz.currentQuestion + 1) / quiz.questions.length) * 100}%"></div>
                </div>
            </div>
            
            <div class="quiz-question">
                <h3>${q.question}</h3>
                <div class="quiz-options">
                    ${q.options.map((option, index) => 
                        `<button class="quiz-option" data-answer="${index}">${option}</button>`
                    ).join('')}
                </div>
            </div>
            
            <div class="quiz-mascot">
                <div class="mascot-character">
                    <span class="mascot-icon">🤖</span>
                </div>
                <div class="mascot-message">
                    <p>Think carefully about what you've learned!</p>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    
    // Add click handlers for quiz options
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            const selectedAnswer = parseInt(e.target.dataset.answer);
            handleAIQuizAnswer(quiz, selectedAnswer, e.target);
        });
    });
}

function handleAIQuizAnswer(quiz, selectedAnswer, selectedButton) {
    const options = document.querySelectorAll('.quiz-option');
    const correctAnswer = quiz.questions[quiz.currentQuestion].correct;
    
    // Disable all options
    options.forEach(option => {
        option.disabled = true;
        if (parseInt(option.dataset.answer) === correctAnswer) {
            option.style.background = '#4CAF50';
            option.style.color = 'white';
        } else if (option === selectedButton && selectedAnswer !== correctAnswer) {
            option.style.background = '#F44336';
            option.style.color = 'white';
        }
    });
    
    if (selectedAnswer === correctAnswer) {
        quiz.score++;
        showNotification('Correct! Great job! 🎉', 'success');
    } else {
        showNotification('Not quite right, but keep learning! 📚', 'info');
    }
    
    setTimeout(() => {
        quiz.currentQuestion++;
        if (quiz.currentQuestion < quiz.questions.length) {
            showAIQuizQuestion(quiz);
        } else {
            completeAIQuiz(quiz);
        }
    }, 2000);
}

function completeAIQuiz(quiz) {
    const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
    let message = '';
    let xpReward = 0;
    
    if (percentage >= 80) {
        message = `Amazing! You scored ${quiz.score}/${quiz.questions.length}! You're an AI expert! 🌟`;
        xpReward = 100;
    } else if (percentage >= 60) {
        message = `Good job! You scored ${quiz.score}/${quiz.questions.length}! Keep exploring AI! 👏`;
        xpReward = 75;
    } else {
        message = `You scored ${quiz.score}/${quiz.questions.length}. Keep learning about AI! 📚`;
        xpReward = 50;
    }
    
    closeModal();
    addXP(xpReward, 'Completing AI Quiz');
    addTokens(Math.floor(xpReward / 5));
    showNotification(message, 'success');
}

// AI Mascot System
function initializeAIMascot() {
    const mascot = document.getElementById('aiMascot');
    const messages = [
        "Welcome to the future! AI is everywhere around us! 🤖",
        "Did you know AI can help doctors save lives? Amazing! 🏥",
        "Robots are getting smarter every day thanks to AI! 🧠",
        "The future will have flying cars and smart cities! 🚗✈️",
        "AI can help us solve climate change and protect our planet! 🌍",
        "Remember: AI should always be used to help people! ❤️"
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
            if (Math.random() < 0.3) { // 30% chance every 12 seconds
                showMascotMessage();
            }
        }, 12000);
    }
}

// Achievement System
function checkAchievements() {
    const achievements = {
        'ai-explorer': {
            condition: () => Object.values(futureState.conceptsLearned).flat().length >= 5,
            badge: 'AI Explorer',
            message: 'Learned 5 AI and tech concepts!',
            xp: 100
        },
        'robot-builder': {
            condition: () => futureState.robotsBuilt.length >= 1,
            badge: 'Robot Builder',
            message: 'Built your first robot!',
            xp: 150
        },
        'code-master': {
            condition: () => futureState.codeProjects.length >= 3,
            badge: 'Code Master',
            message: 'Created 3 robot programs!',
            xp: 125
        }
    };
    
    Object.keys(achievements).forEach(key => {
        const achievement = achievements[key];
        if (!futureState.achievements.includes(key) && achievement.condition()) {
            futureState.achievements.push(key);
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
    futureState.totalXP += amount;
    
    // Check for level up
    const newLevel = Math.floor(futureState.totalXP / 200) + 1;
    if (newLevel > futureState.currentLevel) {
        futureState.currentLevel = newLevel;
        showLevelUpNotification(newLevel);
    }
    
    updateProgressDisplay();
    saveFutureProgress();
    checkAchievements();
    
    showNotification(`+${amount} XP - ${reason}! 🎉`, 'success');
}

function addTokens(amount) {
    futureState.tokens += amount;
    updateProgressDisplay();
    saveFutureProgress();
    
    if (amount > 0) {
        showNotification(`+${amount} tokens earned! ⚡`, 'success');
    }
}

function updateConceptProgress(conceptName, category) {
    if (!futureState.conceptsLearned[category]) {
        futureState.conceptsLearned[category] = [];
    }
    
    const conceptKey = conceptName.toLowerCase().replace(/\s+/g, '-');
    if (!futureState.conceptsLearned[category].includes(conceptKey)) {
        futureState.conceptsLearned[category].push(conceptKey);
        delete futureState.currentConcepts[category];
        
        saveFutureProgress();
    }
}

function showLevelUpNotification(level) {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
        <div class="level-up-content">
            <h2>Level Up! 🚀</h2>
            <p>You've reached Level ${level}!</p>
            <div class="level-rewards">
                <p>New zones and technologies unlocked!</p>
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
    loadFutureProgress();
    initializeCityMap();
    initializeAILabs();
    initializeActivities();
    initializeInnovations();
    initializeVisualProgramming();
    initializeAIMascot();
    initializeSmoothScrolling();
    
    console.log('AI & Future City initialized successfully! 🚀');
});
