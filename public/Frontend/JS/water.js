/**
 * WaterCycleGame Class
 * Encapsulates all logic for the water cycle interactive mission.
 */
class WaterCycleGame {
    #gameState = {
        currentStage: 1,
        totalStages: 4,
        xpPerStage: 5,
        baseXp: 60,
    };
    #elements = {};
    #dropletsInCloud = 0;

    constructor() {
        this.#queryElements();
        this.init();
    }

    #queryElements() {
        this.#elements.stages = document.querySelectorAll('.stage-card');
        this.#elements.xpProgress = document.getElementById('xp-progress');
        this.#elements.dingSound = document.getElementById('ding-sound');
        this.#elements.modal = document.getElementById('mission-complete-modal');
        this.#elements.startBtn = document.getElementById('start-adventure-btn');
    }
    
    init() {
        this.#setupIntersectionObserver();
        this.#addEventListeners();
        this.#updateUI();
    }
    
    #setupIntersectionObserver() {
        const observerOptions = { root: null, threshold: 0.3 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        this.#elements.stages.forEach(stage => observer.observe(stage));
    }

    #addEventListeners() {
        this.#elements.startBtn.addEventListener('click', () => {
            document.getElementById('stage-1').scrollIntoView({ behavior: 'smooth' });
        });
        
        document.getElementById('evaporation-btn').addEventListener('click', () => this.#completeStage(1));
        
        this.#setupDragAndDropListeners();
        
        document.querySelectorAll('.choice-card').forEach(card => {
            card.addEventListener('click', (e) => this.#handlePrecipitationChoice(e.currentTarget));
        });
        
        document.querySelectorAll('.btn-quiz').forEach(button => {
            button.addEventListener('click', (e) => this.#handleQuizAnswer(e.currentTarget));
        });
    }

    #setupDragAndDropListeners() {
        const droplets = document.querySelectorAll('#stage-2 .droplet');
        const cloudOutline = document.getElementById('cloud-outline');
        let draggedItem = null;

        droplets.forEach(droplet => {
            droplet.addEventListener('dragstart', (e) => {
                if (this.#gameState.currentStage !== 2) return e.preventDefault();
                draggedItem = e.target;
                setTimeout(() => e.target.classList.add('dragging'), 0);
            });
            droplet.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
                draggedItem = null;
            });
        });

        cloudOutline.addEventListener('dragover', (e) => {
            if (this.#gameState.currentStage !== 2) return;
            e.preventDefault();
            cloudOutline.classList.add('hover');
        });

        cloudOutline.addEventListener('dragleave', () => {
            cloudOutline.classList.remove('hover');
        });

        cloudOutline.addEventListener('drop', (e) => {
            if (this.#gameState.currentStage !== 2 || !draggedItem) return;
            e.preventDefault();
            cloudOutline.classList.remove('hover');
            
            // Hide the dropped item instead of appending it, to keep the box clean
            draggedItem.style.display = 'none'; 
            this.#dropletsInCloud++;

            // --- THIS IS THE MODIFIED PART ---
            if (this.#dropletsInCloud === droplets.length) {
                cloudOutline.classList.add('is-formed');
                
                // 1. Clear the box and add the cloud emoji
                cloudOutline.innerHTML = '☁️';
                
                // 2. Style the emoji to be large and centered
                cloudOutline.style.fontSize = '5rem';
                cloudOutline.style.lineHeight = '120px'; // Centers emoji vertically
                
                // 3. Complete the stage after a short delay
                setTimeout(() => this.#completeStage(2), 1200);
            }
            // --- END OF MODIFIED PART ---

            draggedItem = null;
        });
    }

    #handlePrecipitationChoice(selectedCard) {
        if (this.#gameState.currentStage !== 3) return;
        document.querySelectorAll('.choice-card').forEach(c => {
            c.classList.remove('selected');
            c.disabled = true;
        });
        selectedCard.classList.add('selected');
        this.#completeStage(3);
    }
    
    #handleQuizAnswer(selectedButton) {
        if (this.#gameState.currentStage !== 4) return;
        const quizOptions = document.querySelectorAll('.btn-quiz');
        quizOptions.forEach(btn => btn.disabled = true);
        
        const isCorrect = selectedButton.dataset.correct === 'true';
        selectedButton.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        if (isCorrect) {
            this.#completeStage(4);
        } else {
            const correctButton = document.querySelector('.btn-quiz[data-correct="true"]');
            correctButton.classList.add('correct');
        }
    }

    #completeStage(stageNumber) {
        if (stageNumber !== this.#gameState.currentStage) return;
        this.#elements.dingSound.play();
        this.#gameState.currentStage++;
        
        const newXp = this.#gameState.baseXp + (stageNumber * this.#gameState.xpPerStage);
        this.#elements.xpProgress.style.width = `${newXp}%`;
        
        setTimeout(() => {
            this.#updateUI();
            if (this.#gameState.currentStage > this.#gameState.totalStages) {
                this.#showMissionComplete();
            } else {
                const nextStage = document.getElementById(`stage-${this.#gameState.currentStage}`);
                if (nextStage) nextStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 800);
    }

    #updateUI() {
        this.#elements.stages.forEach(stage => {
            const stageNum = parseInt(stage.dataset.stage);
            stage.classList.remove('active', 'completed');
            if (stageNum < this.#gameState.currentStage) {
                stage.classList.add('completed');
            } else if (stageNum === this.#gameState.currentStage) {
                stage.classList.add('active');
            }
        });
    }
    
    #showMissionComplete() {
        this.#elements.modal.classList.add('visible');
        this.#createConfetti();
    }
    
    #createConfetti() {
        const modalContent = document.querySelector('.modal-content');
        if (!modalContent) return;
        const colors = ['--c-primary', '--c-secondary', '--c-accent', '--c-warning', '--c-danger'];
        for (let i = 0; i < 100; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.backgroundColor = `var(${colors[Math.floor(Math.random() * colors.length)]})`;
            const animDuration = 2 + Math.random() * 3;
            const animDelay = Math.random() * 2;
            piece.style.animation = `fall ${animDuration}s ${animDelay}s linear forwards`;
            modalContent.appendChild(piece);
            setTimeout(() => piece.remove(), (animDuration + animDelay) * 1000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WaterCycleGame();
});