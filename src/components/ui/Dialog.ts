export class Dialog {
    private container: HTMLElement;
    private textElement: HTMLElement;
    private nameElement: HTMLElement;
    private isVisible: boolean;
    private currentText: string;
    private onComplete: (() => void) | null;

    constructor() {
        this.isVisible = false;
        this.currentText = '';
        this.onComplete = null;

        // Create dialog container
        this.container = document.createElement('div');
        this.container.id = 'dialog-box';
        this.container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 800px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 20px;
            border-radius: 10px;
            border: 3px solid #FFD700;
            font-family: 'Georgia', serif;
            font-size: 18px;
            display: none;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;

        // Create name element
        this.nameElement = document.createElement('div');
        this.nameElement.style.cssText = `
            font-weight: bold;
            color: #FFD700;
            margin-bottom: 10px;
            font-size: 20px;
        `;
        this.container.appendChild(this.nameElement);

        // Create text element
        this.textElement = document.createElement('div');
        this.textElement.style.cssText = `
            line-height: 1.6;
            min-height: 50px;
        `;
        this.container.appendChild(this.textElement);

        // Add continue indicator
        const continueIndicator = document.createElement('div');
        continueIndicator.textContent = '▼ Press SPACE to continue';
        continueIndicator.style.cssText = `
            text-align: right;
            font-size: 14px;
            color: #FFD700;
            margin-top: 10px;
            animation: blink 1.5s infinite;
        `;
        this.container.appendChild(continueIndicator);

        // Add to document
        document.body.appendChild(this.container);

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }

    public show(characterName: string, text: string, onComplete?: () => void): void {
        console.log('Dialog.show() called with:', characterName, text.substring(0, 30) + '...', 'callback:', !!onComplete);
        this.nameElement.textContent = characterName;
        this.textElement.textContent = text;
        this.currentText = text;
        this.onComplete = onComplete || null;
        this.container.style.display = 'block';
        this.isVisible = true;
    }

    public hide(): void {
        this.container.style.display = 'none';
        this.isVisible = false;
        if (this.onComplete) {
            const callback = this.onComplete;
            this.onComplete = null;
            callback();
        }
    }

    public isShowing(): boolean {
        return this.isVisible;
    }

    public advance(): void {
        console.log('Dialog.advance() called, isVisible:', this.isVisible, 'onComplete:', !!this.onComplete);
        if (this.isVisible && this.onComplete) {
            this.hide();
        }
    }
}