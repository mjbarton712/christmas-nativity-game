export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option
    explanation?: string;
}

export class Quiz {
    private container: HTMLElement;
    private questionElement: HTMLElement;
    private optionsContainer: HTMLElement;
    private feedbackElement: HTMLElement;
    private currentQuestion: QuizQuestion | null;
    private onAnswerCallback: ((correct: boolean) => void) | null;
    private isVisible: boolean;
    private answered: boolean;

    constructor() {
        this.isVisible = false;
        this.currentQuestion = null;
        this.onAnswerCallback = null;
        this.answered = false;

        // Create quiz container
        this.container = document.createElement('div');
        this.container.id = 'quiz-container';
        this.container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 600px;
            background: linear-gradient(135deg, rgba(30, 30, 60, 0.95), rgba(50, 30, 60, 0.95));
            color: white;
            padding: 30px;
            border-radius: 15px;
            border: 3px solid #FFD700;
            font-family: 'Georgia', serif;
            display: none;
            z-index: 2000;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
            max-height: 90vh;
            overflow-y: auto;
        `;

        // Create title
        const title = document.createElement('div');
        title.textContent = '📖 Test Your Knowledge';
        title.style.cssText = `
            font-size: 28px;
            font-weight: bold;
            color: #FFD700;
            text-align: center;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        `;
        this.container.appendChild(title);

        // Create question element
        this.questionElement = document.createElement('div');
        this.questionElement.style.cssText = `
            font-size: 20px;
            line-height: 1.6;
            margin-bottom: 25px;
            min-height: 60px;
            color: #FFFFFF;
        `;
        this.container.appendChild(this.questionElement);

        // Create options container
        this.optionsContainer = document.createElement('div');
        this.optionsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
        `;
        this.container.appendChild(this.optionsContainer);

        // Create feedback element
        this.feedbackElement = document.createElement('div');
        this.feedbackElement.style.cssText = `
            font-size: 18px;
            line-height: 1.5;
            padding: 15px;
            border-radius: 8px;
            min-height: 50px;
            display: none;
            margin-top: 15px;
        `;
        this.container.appendChild(this.feedbackElement);

        // Add responsive styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                #quiz-container {
                    width: 95% !important;
                    padding: 20px !important;
                    max-height: 85vh !important;
                }
                #quiz-container > div:first-child {
                    font-size: 22px !important;
                }
                #quiz-container button {
                    padding: 12px 15px !important;
                    font-size: 14px !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Add to document
        document.body.appendChild(this.container);
    }

    public show(question: QuizQuestion, onAnswer: (correct: boolean) => void): void {
        this.currentQuestion = question;
        this.onAnswerCallback = onAnswer;
        this.answered = false;

        this.questionElement.textContent = question.question;
        this.feedbackElement.style.display = 'none';
        this.feedbackElement.textContent = '';

        // Clear and create options
        this.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.style.cssText = `
                padding: 15px 20px;
                font-size: 16px;
                font-family: 'Georgia', serif;
                background: linear-gradient(135deg, rgba(70, 70, 130, 0.8), rgba(100, 70, 130, 0.8));
                color: white;
                border: 2px solid #9370DB;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            `;

            button.addEventListener('mouseenter', () => {
                if (!this.answered) {
                    button.style.background = 'linear-gradient(135deg, rgba(100, 100, 180, 0.9), rgba(140, 100, 180, 0.9))';
                    button.style.transform = 'translateX(5px)';
                    button.style.borderColor = '#FFD700';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (!this.answered) {
                    button.style.background = 'linear-gradient(135deg, rgba(70, 70, 130, 0.8), rgba(100, 70, 130, 0.8))';
                    button.style.transform = 'translateX(0)';
                    button.style.borderColor = '#9370DB';
                }
            });

            button.addEventListener('click', () => {
                if (!this.answered) {
                    this.handleAnswer(index, button);
                }
            });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (!this.answered) {
                    this.handleAnswer(index, button);
                }
            }, { passive: false });

            this.optionsContainer.appendChild(button);
        });

        this.container.style.display = 'block';
        this.isVisible = true;

        // Add entrance animation
        this.container.style.opacity = '0';
        this.container.style.transform = 'translate(-50%, -45%)';
        setTimeout(() => {
            this.container.style.transition = 'all 0.3s ease';
            this.container.style.opacity = '1';
            this.container.style.transform = 'translate(-50%, -50%)';
        }, 10);
    }

    private handleAnswer(selectedIndex: number, button: HTMLButtonElement): void {
        if (!this.currentQuestion || this.answered) return;

        this.answered = true;
        const correct = selectedIndex === this.currentQuestion.correctAnswer;

        // Disable all buttons
        const buttons = this.optionsContainer.querySelectorAll('button');
        buttons.forEach((btn, idx) => {
            btn.style.cursor = 'not-allowed';
            
            if (idx === this.currentQuestion!.correctAnswer) {
                // Highlight correct answer
                btn.style.background = 'linear-gradient(135deg, rgba(50, 150, 50, 0.9), rgba(70, 180, 70, 0.9))';
                btn.style.borderColor = '#90EE90';
            } else if (idx === selectedIndex && !correct) {
                // Highlight wrong answer
                btn.style.background = 'linear-gradient(135deg, rgba(150, 50, 50, 0.9), rgba(180, 70, 70, 0.9))';
                btn.style.borderColor = '#FF6B6B';
            } else {
                btn.style.opacity = '0.5';
            }
        });

        // Show feedback
        this.feedbackElement.style.display = 'block';
        if (correct) {
            this.feedbackElement.style.background = 'rgba(50, 150, 50, 0.3)';
            this.feedbackElement.style.border = '2px solid #90EE90';
            this.feedbackElement.innerHTML = `
                <div style="font-weight: bold; color: #90EE90; margin-bottom: 8px;">✓ Correct!</div>
                ${this.currentQuestion.explanation ? `<div>${this.currentQuestion.explanation}</div>` : ''}
            `;
        } else {
            this.feedbackElement.style.background = 'rgba(150, 50, 50, 0.3)';
            this.feedbackElement.style.border = '2px solid #FF6B6B';
            this.feedbackElement.innerHTML = `
                <div style="font-weight: bold; color: #FF6B6B; margin-bottom: 8px;">✗ Incorrect</div>
                ${this.currentQuestion.explanation ? `<div>${this.currentQuestion.explanation}</div>` : ''}
            `;
        }

        // Call callback after showing feedback
        setTimeout(() => {
            if (this.onAnswerCallback) {
                this.onAnswerCallback(correct);
            }
        }, 3000);
    }

    public hide(): void {
        this.container.style.transition = 'all 0.3s ease';
        this.container.style.opacity = '0';
        this.container.style.transform = 'translate(-50%, -55%)';
        
        setTimeout(() => {
            this.container.style.display = 'none';
            this.isVisible = false;
        }, 300);
    }

    public isShowing(): boolean {
        return this.isVisible;
    }
}

// Pre-defined quiz questions for each scene
export const QUIZ_QUESTIONS = {
    MaryJoseph: [
        {
            question: "How did Mary respond when the angel told her she would bear God's son?",
            options: [
                "She ran away in fear",
                "She said 'I am the Lord's servant'",
                "She didn't believe the angel",
                "She asked for a sign"
            ],
            correctAnswer: 1,
            explanation: "Mary humbly accepted God's plan, saying 'I am the Lord's servant. May it be as you have said.'"
        },
        {
            question: "Why did Mary and Joseph travel to Bethlehem?",
            options: [
                "To visit family",
                "For the Roman census",
                "To escape King Herod",
                "To find work"
            ],
            correctAnswer: 1,
            explanation: "Caesar Augustus ordered a census, requiring everyone to return to their hometown to register."
        }
    ],
    Innkeeper: [
        {
            question: "Why did the innkeeper offer Mary and Joseph the stable?",
            options: [
                "He wanted to charge them more money",
                "He had no rooms available in the inn",
                "It was the best room available",
                "They requested it specifically"
            ],
            correctAnswer: 1,
            explanation: "The inn was full due to the census, but the innkeeper showed kindness by offering the stable."
        }
    ],
    Shepherds: [
        {
            question: "What were the shepherds doing when the angel appeared?",
            options: [
                "Sleeping in their homes",
                "Celebrating a festival",
                "Watching their flocks by night",
                "Trading in the marketplace"
            ],
            correctAnswer: 2,
            explanation: "The shepherds were watching their flocks at night when the angel brought the good news."
        },
        {
            question: "What did the angels say to the shepherds?",
            options: [
                "'Run away quickly!'",
                "'Bring gifts for the king'",
                "'Do not be afraid. I bring good news of great joy'",
                "'The king wants to see you'"
            ],
            correctAnswer: 2,
            explanation: "The angel said 'Do not be afraid. I bring you good news of great joy that will be for all people.'"
        }
    ],
    WiseMen: [
        {
            question: "What did the Wise Men follow to find Jesus?",
            options: [
                "A map",
                "A star",
                "Roman roads",
                "Angels"
            ],
            correctAnswer: 1,
            explanation: "The Wise Men followed a bright star that led them from the East to where Jesus was born."
        },
        {
            question: "What gifts did the Wise Men bring to Jesus?",
            options: [
                "Food, water, and shelter",
                "Gold, frankincense, and myrrh",
                "Sheep, goats, and cattle",
                "Clothes, blankets, and toys"
            ],
            correctAnswer: 1,
            explanation: "The Wise Men brought gold (for a king), frankincense (for deity), and myrrh (for sacrifice)."
        }
    ]
};
