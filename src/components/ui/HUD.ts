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
        `;
        this.container.appendChild(this.instructionsElement);

        document.body.appendChild(this.container);
    }

    public setTitle(title: string): void {
        this.titleElement.textContent = title;
    }

    public setInstructions(instructions: string): void {
        this.instructionsElement.textContent = instructions + '\nPress F for fullscreen';
    }

    public show(): void {
        this.container.style.display = 'block';
    }

    public hide(): void {
        this.container.style.display = 'none';
    }
}