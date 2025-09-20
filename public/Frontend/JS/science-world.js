// Science World Interactive JavaScript

class ScienceWorld {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.totalQuestions = 5;
        this.userAnswers = [];
        
        this.questions = [
            {
                question: "What do plants need to grow? 🌱",
                options: [
                    "Only water",
                    "Sunlight, water, and air",
                    "Only sunlight", 
                    "Only soil"
                ],
                correct: 1,
                explanation: "Plants need sunlight for energy, water for nutrients, and air (carbon dioxide) for photosynthesis!"
            },
            {
                question: "What happens to water when it evaporates? 💧",
                options: [
                    "It disappears forever",
                    "It becomes ice",
                    "It turns into water vapor",
                    "It becomes heavier"
                ],
                correct: 2,
                explanation: "When water evaporates, it turns into invisible water vapor that rises into the air!"
            },
            {
                question: "Which planet is closest to the Sun? ☀️",
                options: [
                    "Earth",
                    "Venus", 
                    "Mercury",
                    "Mars"
                ],
                correct: 2,
                explanation: "Mercury is the closest planet to the Sun and has extreme temperatures!"
            },
            {
                question: "What do we call animals that eat only plants? 🐰",
                options: [
                    "Carnivores",
                    "Herbivores",
                    "Omnivores",
                    "Predators"
                ],
                correct: 1,
                explanation: "Herbivores are animals that eat only plants, like rabbits, deer, and elephants!"
            },
            {
                question: "What is the center of our solar system? 🌟",
                options: [
                    "Earth",
                    "The Moon",
                    "The Sun",
                    "Jupiter"
                ],
                correct: 2,
                explanation: "The Sun is a star at the center of our solar system, and all planets orbit around it!"
            }
        ];
        
        this.experiments = [
            {
                name: "Virtual Volcano",
                type: "volcano",
                difficulty: "easy",
                description: "Create a safe volcanic eruption using baking soda and vinegar!"
            },
            {
                name: "Rainbow in a Jar",
                type: "rainbow", 
                difficulty: "medium",
                description: "Layer different colored liquids to create a beautiful rainbow!"
            },
            {
                name: "Magnetic Magic",
                type: "magnet",
                difficulty: "easy",
                description: "Discover what objects are attracted to magnets!"
            },
            {
                name: "Crystal Garden",
                type: "crystals",
                difficulty: "hard",
                description: "Grow your own crystals and learn about molecular structures!"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.setupMascot();
        this.loadProgress();
    }
    
    setupEventListeners() {
        // Quiz functionality
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAnswer(e));
        });
        
        const nextBtn = document.getElementById('nextQuestion');
        const skipBtn = document.getElementById('skipQuestion');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipQuestion());
        }
        
        // Lesson node interactions
        const lessonNodes = document.querySelectorAll('.lesson-node');
        lessonNodes.forEach(node => {
            node.addEventListener('click', (e) => this.handleLessonClick(e));
        });
        
        // Experiment cards
        const experimentBtns = document.querySelectorAll('.btn-experiment');
        experimentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.startExperiment(e));
        });
        
        // Achievement badges
        const badges = document.querySelectorAll('.achievement-badge');
        badges.forEach(badge => {
            badge.addEventListener('click', (e) => this.showBadgeDetails(e));
        });
        
        // Mascot interaction
        const mascot = document.querySelector('.science-character');
        if (mascot) {
            mascot.addEventListener('click', () => this.interactWithMascot());
        }
        
        // Smooth scrolling for navigation
        this.setupSmoothScrolling();
    }
    
    selectAnswer(event) {
        const button = event.currentTarget;
        const answerIndex = parseInt(button.dataset.answer.charCodeAt(0) - 97); // Convert 'a','b','c','d' to 0,1,2,3
        
        // Remove previous selections
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked button
        button.classList.add('selected');
        
        // Store answer
        this.userAnswers[this.currentQuestion] = answerIndex;
        
        // Enable next button
        const nextBtn = document.getElementById('nextQuestion');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
        
        // Play sound effect
        this.playSound('click');
    }
    
    nextQuestion() {
        const currentQ = this.questions[this.currentQuestion];
        const userAnswer = this.userAnswers[this.currentQuestion];
        const isCorrect = userAnswer === currentQ.correct;
        
        // Show correct answer
        this.showAnswerFeedback(isCorrect, currentQ.correct, currentQ.explanation);
        
        // Update score
        if (isCorrect) {
            this.score++;
            this.addXP(20);
        } else {
            this.addXP(5); // Participation points
        }
        
        setTimeout(() => {
            if (this.currentQuestion < this.totalQuestions - 1) {
                this.currentQuestion++;
                this.loadQuestion();
            } else {
                this.showQuizResults();
            }
        }, 3000);
    }
    
    skipQuestion() {
        this.userAnswers[this.currentQuestion] = -1; // Mark as skipped
        this.addXP(2); // Small participation reward
        
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.currentQuestion++;
            this.loadQuestion();
        } else {
            this.showQuizResults();
        }
    }
    
    showAnswerFeedback(isCorrect, correctIndex, explanation) {
        const buttons = document.querySelectorAll('.answer-btn');
        
        buttons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === correctIndex) {
                btn.classList.add('correct');
            } else if (btn.classList.contains('selected') && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // Show explanation
        const feedback = document.createElement('div');
        feedback.className = 'answer-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <div class="feedback-icon">${isCorrect ? '🎉' : '🤔'}</div>
                <h4>${isCorrect ? 'Great job!' : 'Good try!'}</h4>
                <p>${explanation}</p>
            </div>
        `;
        
        feedback.style.cssText = `
            background: ${isCorrect ? 'var(--pastel-green)' : 'var(--pastel-orange)'};
            border: 2px solid ${isCorrect ? 'var(--primary-green)' : 'var(--primary-orange)'};
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            animation: slideInUp 0.5s ease-out;
        `;
        
        const questionContent = document.querySelector('.question-content');
        questionContent.appendChild(feedback);
        
        this.playSound(isCorrect ? 'correct' : 'incorrect');
    }
    
    loadQuestion() {
        const currentQ = this.questions[this.currentQuestion];
        
        // Update progress
        const progressFill = document.querySelector('.quiz-progress-fill');
        const progressText = document.querySelector('.quiz-progress span');
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.totalQuestions}`;
        }
        
        // Update question
        const questionEl = document.querySelector('.question-content h4');
        if (questionEl) {
            questionEl.textContent = currentQ.question;
        }
        
        // Update options
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach((btn, index) => {
            const optionText = btn.querySelector('.option-text');
            if (optionText) {
                optionText.textContent = currentQ.options[index];
            }
            
            // Reset button states
            btn.classList.remove('selected', 'correct', 'incorrect');
            btn.disabled = false;
        });
        
        // Reset next button
        const nextBtn = document.getElementById('nextQuestion');
        if (nextBtn) {
            nextBtn.disabled = true;
        }
        
        // Remove previous feedback
        const existingFeedback = document.querySelector('.answer-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
    }
    
    showQuizResults() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        let message = '';
        let badge = '';
        
        if (percentage >= 80) {
            message = 'Outstanding! You\'re a Science Star! 🌟';
            badge = 'Science Star';
            this.addXP(50);
        } else if (percentage >= 60) {
            message = 'Great job! You\'re learning well! 👏';
            badge = 'Science Student';
            this.addXP(30);
        } else {
            message = 'Good effort! Keep learning and trying! 🌱';
            badge = 'Science Explorer';
            this.addXP(20);
        }
        
        const resultsModal = this.createModal('Quiz Complete! 🎉', `
            <div class="quiz-results">
                <div class="results-score">
                    <div class="score-circle">
                        <span class="score-number">${percentage}%</span>
                    </div>
                    <h3>${message}</h3>
                    <p>You got ${this.score} out of ${this.totalQuestions} questions correct!</p>
                </div>
                <div class="results-badge">
                    <div class="earned-badge">
                        <div class="badge-icon">🏆</div>
                        <h4>New Badge Earned!</h4>
                        <p>${badge}</p>
                    </div>
                </div>
                <div class="results-actions">
                    <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Continue Learning</button>
                </div>
            </div>
        `);
        
        this.playSound('levelUp');
    }
    
    handleLessonClick(event) {
        const node = event.currentTarget;
        const lessonId = node.dataset.lesson;
        const nodeType = node.classList.contains('completed') ? 'completed' : 
                        node.classList.contains('current') ? 'current' :
                        node.classList.contains('available') ? 'available' : 'locked';
        
        if (nodeType === 'locked') {
            this.showNotification('🔒 This lesson is locked. Complete previous lessons to unlock!', 'info');
            return;
        }
        
        if (nodeType === 'completed') {
            this.showLessonReview(lessonId);
        } else if (nodeType === 'current') {
            this.continuelesson(lessonId);
        } else if (nodeType === 'available') {
            this.startNewLesson(lessonId);
        }
        
        this.playSound('click');
    }
    
    startNewLesson(lessonId) {
        const lessons = {
            '3': {
                title: 'Solar System Exploration',
                description: 'Blast off on an amazing journey through our solar system! Learn about planets, moons, and stars.',
                preview: 'In this lesson, you\'ll discover the eight planets, learn fun facts about each one, and take a virtual space journey!'
            }
        };
        
        const lesson = lessons[lessonId];
        if (lesson) {
            this.createModal(`🚀 ${lesson.title}`, `
                <div class="lesson-preview">
                    <p>${lesson.description}</p>
                    <div class="preview-content">
                        <p>${lesson.preview}</p>
                        <div class="lesson-rewards">
                            <h4>You'll earn:</h4>
                            <ul>
                                <li>🌟 50 XP points</li>
                                <li>🏆 Space Explorer badge</li>
                                <li>🪙 25 science coins</li>
                            </ul>
                        </div>
                    </div>
                    <div class="lesson-actions">
                        <button class="btn btn-primary btn-large">Start Lesson</button>
                        <button class="btn btn-secondary">Save for Later</button>
                    </div>
                </div>
            `);
        }
    }
    
    startExperiment(event) {
        const button = event.currentTarget;
        
        if (button.classList.contains('locked')) {
            this.showNotification('🔒 This experiment is locked. Reach Level 6 to unlock!', 'info');
            return;
        }
        
        const card = button.closest('.experiment-card');
        const experimentType = card.classList[1]; // Get the second class name
        
        this.launchExperiment(experimentType);
        this.playSound('click');
    }
    
    launchExperiment(type) {
        const experiments = {
            volcano: {
                title: 'Virtual Volcano Experiment 🌋',
                content: `
                    <div class="experiment-simulator">
                        <h3>Let's make a volcano erupt!</h3>
                        <div class="experiment-visual">
                            <div class="volcano-container">
                                <div class="volcano" id="volcano">
                                    <div class="lava" id="lava"></div>
                                </div>
                            </div>
                        </div>
                        <div class="experiment-controls">
                            <p>Add ingredients step by step:</p>
                            <button class="btn btn-experiment-step" onclick="scienceWorld.addIngredient('bakingSoda')">Add Baking Soda</button>
                            <button class="btn btn-experiment-step" onclick="scienceWorld.addIngredient('vinegar')">Add Vinegar</button>
                            <button class="btn btn-experiment-step" onclick="scienceWorld.addIngredient('soap')">Add Dish Soap</button>
                            <button class="btn btn-primary" onclick="scienceWorld.startEruption()">Start Eruption! 🌋</button>
                        </div>
                        <div class="experiment-explanation">
                            <h4>What's happening?</h4>
                            <p>When baking soda (base) mixes with vinegar (acid), it creates carbon dioxide gas bubbles that push the mixture up like a real volcano!</p>
                        </div>
                    </div>
                `
            },
            rainbow: {
                title: 'Rainbow in a Jar 🌈',
                content: `
                    <div class="experiment-simulator">
                        <h3>Create a beautiful rainbow!</h3>
                        <div class="rainbow-jar">
                            <div class="jar-layers" id="rainbowJar">
                                <!-- Layers will be added here -->
                            </div>
                        </div>
                        <div class="experiment-controls">
                            <p>Add liquids in order of density:</p>
                            <button class="btn btn-experiment-step" onclick="scienceWorld.addLayer('honey', '#DAA520')">Add Honey</button>
                            <button class="btn btn-experiment-step" onclick="scienceWorld.addLayer('syrup', '#8B4513')">Add Corn Syrup</button>
                            <button class="btn btn-experiment-step" onclick="scienceWorld.addLayer('soap', '#90EE90')">Add Dish Soap</button>
                            <button class="btn btn-experiment-step" onclick="scienceWorld.addLayer('water', '#87CEEB')">Add Colored Water</button>
                            <button class="btn btn-experiment-step" onclick="scienceWorld.addLayer('oil', '#FFD700')">Add Oil</button>
                        </div>
                        <div class="experiment-explanation">
                            <h4>Science Behind It:</h4>
                            <p>Liquids with different densities stack on top of each other, creating beautiful layers just like a rainbow!</p>
                        </div>
                    </div>
                `
            }
        };
        
        const experiment = experiments[type];
        if (experiment) {
            this.createModal(experiment.title, experiment.content);
        }
    }
    
    // Experiment interactions
    addIngredient(ingredient) {
        const volcano = document.getElementById('volcano');
        if (volcano) {
            volcano.classList.add(`has-${ingredient}`);
            this.showNotification(`Added ${ingredient.replace(/([A-Z])/g, ' $1').toLowerCase()}! 🧪`, 'success');
        }
    }
    
    startEruption() {
        const lava = document.getElementById('lava');
        if (lava) {
            lava.style.animation = 'erupt 3s ease-out';
            this.showNotification('🌋 ERUPTION! Amazing work, scientist! +25 XP', 'success');
            this.addXP(25);
            this.playSound('achievement');
        }
    }
    
    addLayer(liquid, color) {
        const jar = document.getElementById('rainbowJar');
        if (jar) {
            const layer = document.createElement('div');
            layer.className = 'rainbow-layer';
            layer.style.backgroundColor = color;
            layer.style.height = '20px';
            layer.style.animation = 'pourIn 1s ease-out';
            jar.appendChild(layer);
            
            this.showNotification(`Added ${liquid}! Beautiful! ✨`, 'success');
            
            // Check if rainbow is complete
            if (jar.children.length === 5) {
                setTimeout(() => {
                    this.showNotification('🌈 Rainbow complete! You earned the Rainbow Master badge! +30 XP', 'success');
                    this.addXP(30);
                    this.playSound('achievement');
                }, 1000);
            }
        }
    }
    
    showBadgeDetails(event) {
        const badge = event.currentTarget;
        const badgeName = badge.querySelector('h4').textContent;
        const badgeDescription = badge.querySelector('p').textContent;
        const isEarned = badge.classList.contains('earned');
        const isLocked = badge.classList.contains('locked');
        const isMystery = badge.classList.contains('mystery');
        
        let content = `
            <div class="badge-details">
                <div class="badge-display">
                    <div class="large-badge-icon">${badge.querySelector('.badge-icon').textContent}</div>
                    <h3>${badgeName}</h3>
                    <p>${badgeDescription}</p>
                </div>
        `;
        
        if (isEarned) {
            const dateEarned = badge.querySelector('.badge-date').textContent;
            content += `
                <div class="badge-status earned">
                    <h4>🎉 Congratulations!</h4>
                    <p>You earned this badge!</p>
                    <small>${dateEarned}</small>
                </div>
            `;
        } else if (isLocked) {
            const requirement = badge.querySelector('.badge-requirement').textContent;
            content += `
                <div class="badge-status locked">
                    <h4>🔒 Locked</h4>
                    <p>Requirement: ${requirement}</p>
                </div>
            `;
        } else if (isMystery) {
            content += `
                <div class="badge-status mystery">
                    <h4>❓ Mystery Badge</h4>
                    <p>Keep exploring Science World to discover this special badge!</p>
                    <p><em>Hint: Try completing all experiments in one session!</em></p>
                </div>
            `;
        }
        
        content += '</div>';
        
        this.createModal('Badge Details', content);
        this.playSound('click');
    }
    
    // Mascot interactions
    setupMascot() {
        const mascotMessages = [
            "Great job on your plant studies! Ready to explore the water cycle? 💧",
            "Science is everywhere! Let's discover something amazing together! 🔬",
            "Did you know that a butterfly's wings have tiny scales? Cool, right? 🦋",
            "Ready for a fun experiment? Science is the best adventure! 🧪",
            "You're becoming such a great scientist! Keep up the curiosity! 🌟"
        ];
        
        let currentMessage = 0;
        
        setInterval(() => {
            this.updateMascotMessage(mascotMessages[currentMessage]);
            currentMessage = (currentMessage + 1) % mascotMessages.length;
        }, 8000);
    }
    
    updateMascotMessage(message) {
        const mascotText = document.querySelector('.mascot-text');
        if (mascotText) {
            mascotText.style.opacity = '0';
            setTimeout(() => {
                mascotText.textContent = message;
                mascotText.style.opacity = '1';
            }, 300);
        }
    }
    
    interactWithMascot() {
        const responses = [
            "Hi there, future scientist! What would you like to explore today? 🔬",
            "Science fact: Did you know that honey never spoils? Cool, right? 🍯",
            "You're doing amazing! Science is all about asking questions! 🤔",
            "Ready to learn something new? I love your curiosity! ✨",
            "Great work exploring Science World! Keep being awesome! 🌟"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.updateMascotMessage(randomResponse);
        this.addXP(2);
        this.playSound('click');
    }
    
    // Utility functions
    setupAnimations() {
        // Animate progress ring
        const progressRing = document.querySelector('.progress-ring-circle');
        if (progressRing) {
            const circumference = 2 * Math.PI * 36; // radius = 36
            const progress = 60; // 60% complete
            const offset = circumference - (progress / 100) * circumference;
            
            progressRing.style.strokeDasharray = circumference;
            progressRing.style.strokeDashoffset = offset;
        }
        
        // Animate lesson path on scroll
        this.setupScrollAnimations();
    }
    
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
                }
            });
        }, { threshold: 0.1 });
        
        // Observe various elements
        document.querySelectorAll('.lesson-node, .experiment-card, .achievement-badge').forEach(el => {
            observer.observe(el);
        });
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
    
    addXP(amount) {
        // This would connect to the main Terra game state
        if (window.terraGame) {
            window.terraGame.addXP(amount);
        } else {
            this.showNotification(`+${amount} XP earned! 🌟`, 'success');
        }
    }
    
    playSound(type) {
        // Placeholder for sound system
        console.log(`Playing ${type} sound`);
    }
    
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay science-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="close-modal">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
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
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 40px rgba(0,0,0,0.2);
            animation: slideInUp 0.3s ease-out;
        `;
        
        const header = modal.querySelector('.modal-header');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 30px;
            border-bottom: 2px solid var(--primary-blue);
            background: linear-gradient(135deg, var(--pastel-blue), white);
        `;
        
        const body = modal.querySelector('.modal-body');
        body.style.padding = '20px 30px';
        
        document.body.appendChild(modal);
        
        // Close functionality
        const closeBtn = modal.querySelector('.close-modal');
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => modal.remove(), 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 5px 10px;
            border-radius: 50%;
            transition: background 0.3s ease;
        `;
        
        return modal;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `science-notification ${type}`;
        notification.textContent = message;
        
        const colors = {
            info: 'var(--primary-blue)',
            success: 'var(--primary-green)',
            warning: 'var(--primary-orange)',
            error: '#f44336'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            color: ${colors[type]};
            padding: 15px 20px;
            border-radius: 15px;
            border-left: 4px solid ${colors[type]};
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 1500;
            max-width: 300px;
            font-weight: 600;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    loadProgress() {
        // Load user progress from localStorage or API
        const savedProgress = localStorage.getItem('scienceWorldProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            // Apply saved progress to UI
            console.log('Loaded progress:', progress);
        }
    }
    
    saveProgress() {
        const progress = {
            currentLesson: 2,
            completedLessons: [1],
            experimentsCompleted: ['volcano'],
            badges: ['plant-expert', 'water-detective'],
            totalXP: 245
        };
        
        localStorage.setItem('scienceWorldProgress', JSON.stringify(progress));
    }
}

// Additional CSS for Science World features
const scienceStyle = document.createElement('style');
scienceStyle.textContent = `
    .experiment-simulator {
        text-align: center;
        padding: 20px;
    }
    
    .volcano-container {
        margin: 20px 0;
        height: 200px;
        display: flex;
        align-items: end;
        justify-content: center;
    }
    
    .volcano {
        width: 100px;
        height: 80px;
        background: linear-gradient(to top, #8B4513, #A0522D);
        clip-path: polygon(30% 100%, 0% 0%, 100% 0%, 70% 100%);
        position: relative;
        overflow: hidden;
    }
    
    .lava {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 0;
        background: linear-gradient(to top, #FF4500, #FF6347, #FFD700);
        border-radius: 10px 10px 0 0;
    }
    
    @keyframes erupt {
        0% { height: 0; }
        50% { height: 150px; }
        100% { height: 0; }
    }
    
    .rainbow-jar {
        margin: 20px auto;
        width: 200px;
        height: 300px;
        background: rgba(255, 255, 255, 0.1);
        border: 3px solid #ddd;
        border-radius: 0 0 20px 20px;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column-reverse;
    }
    
    .jar-layers {
        display: flex;
        flex-direction: column-reverse;
        height: 100%;
    }
    
    .rainbow-layer {
        flex: 1;
        margin: 1px;
        border-radius: 2px;
    }
    
    @keyframes pourIn {
        0% { opacity: 0; transform: scaleY(0); }
        100% { opacity: 1; transform: scaleY(1); }
    }
    
    .btn-experiment-step {
        background: linear-gradient(135deg, var(--primary-green), var(--primary-blue));
        color: white;
        margin: 5px;
        padding: 10px 15px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .btn-experiment-step:hover {
        transform: scale(1.05);
    }
    
    .quiz-results {
        text-align: center;
        padding: 20px;
    }
    
    .score-circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple));
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px auto;
        color: white;
        font-size: 2rem;
        font-weight: bold;
    }
    
    .earned-badge {
        background: var(--pastel-yellow);
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
        border: 2px solid var(--primary-yellow);
    }
    
    .results-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
    }
    
    .badge-details {
        text-align: center;
        padding: 20px;
    }
    
    .large-badge-icon {
        font-size: 4rem;
        margin: 20px 0;
    }
    
    .badge-status {
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
    }
    
    .badge-status.earned {
        background: var(--pastel-green);
        border: 2px solid var(--primary-green);
    }
    
    .badge-status.locked {
        background: #f5f5f5;
        border: 2px solid #ccc;
    }
    
    .badge-status.mystery {
        background: linear-gradient(135deg, var(--pastel-purple), var(--pastel-blue));
        border: 2px solid var(--primary-purple);
    }
`;

document.head.appendChild(scienceStyle);

// Initialize Science World when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('science-body')) {
        window.scienceWorld = new ScienceWorld();
        console.log('Science World initialized');
    }
});
