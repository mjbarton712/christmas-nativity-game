export class HUD {
    private container: HTMLElement;
    private titleElement: HTMLElement;
    private instructionsElement: HTMLElement;

    constructor() {
        // Create HUD container
        this.container = document.createElement('div');
        this.container.id = 'hud';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            color: white;
            font-family: 'Georgia', serif;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            z-index: 100;
        `;

        // Create title element
        this.titleElement = document.createElement('div');
        this.titleElement.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            color: #FFD700;
            margin-bottom: 10px;
        `;
        this.container.appendChild(this.titleElement);

        // Create instructions element
        this.instructionsElement = document.createElement('div');
        this.instructionsElement.style.cssText = `
            font-size: 14px;
            background: rgba(0, 0, 0, 0.5);
            padding: 10px;
            border-radius: 5px;
            max-width: 300px;
            margin-top: 30px;
        `;
        this.container.appendChild(this.instructionsElement);

        // Add responsive styling
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                #hud {
                    top: 10px;
                    left: 10px;
                }
                #hud > div:first-child {
                    font-size: 18px !important;
                }
                #hud > div:last-child {
                    font-size: 12px !important;
                    max-width: 200px !important;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(this.container);
    }

    public setTitle(title: string): void {
        this.titleElement.textContent = title;
    }

    public setInstructions(instructions: string): void {
        // Replace keyboard references with universal controls
        const mobileInstructions = instructions
            .replace('Press SPACE', 'SPACE/TAP')
            .replace('Press ESC', 'ESC');
        this.instructionsElement.textContent = mobileInstructions + '\nPress F for fullscreen';
    }

    public show(): void {
        this.container.style.display = 'block';
    }

    public hide(): void {
        this.container.style.display = 'none';
    }
}