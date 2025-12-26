export class Menu {
    private container: HTMLElement;
    private titleElement: HTMLElement;
    private onStartCallback: (() => void) | null;
    private selectedIndex: number;
    private menuItems: { text: string; callback: () => void }[];

    constructor() {
        this.onStartCallback = null;
        this.selectedIndex = 0;
        this.menuItems = [];

        // Create menu container
        this.container = document.createElement('div');
        this.container.id = 'main-menu';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Georgia', serif;
        `;

        // Create title element once
        this.titleElement = document.createElement('h1');
        this.titleElement.style.cssText = `
            color: #FFD700;
            font-size: 48px;
            margin-bottom: 50px;
            text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
            animation: glow 2s ease-in-out infinite;
            text-align: center;
            width: 100%;
            padding: 0 20px;
        `;
        this.container.appendChild(this.titleElement);

        // Add glow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glow {
                0%, 100% { text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700; }
                50% { text-shadow: 0 0 20px #FFD700, 0 0 30px #FFD700, 0 0 40px #FFA500; }
            }
            @media (max-width: 768px) {
                #main-menu h1 {
                    font-size: 32px !important;
                    margin-bottom: 30px !important;
                }
                #main-menu .menu-item {
                    font-size: 18px !important;
                    padding: 12px 30px !important;
                    min-width: 200px !important;
                    margin: 8px !important;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(this.container);
    }

    public setTitle(title: string): void {
        this.titleElement.textContent = title;
    }

    public addMenuItem(text: string, callback: () => void): void {
        this.menuItems.push({ text, callback });
        this.renderMenuItems();
    }

    public clearMenuItems(): void {
        this.menuItems = [];
        const oldItems = this.container.querySelectorAll('.menu-item');
        oldItems.forEach(item => item.remove());
    }

    private renderMenuItems(): void {
        // Remove old menu items
        const oldItems = this.container.querySelectorAll('.menu-item');
        oldItems.forEach(item => item.remove());

        // Create menu items
        this.menuItems.forEach((item, index) => {
            const button = document.createElement('button');
            button.className = 'menu-item';
            button.textContent = item.text;
            button.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 2px solid #FFD700;
                padding: 15px 40px;
                margin: 10px;
                font-size: 24px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Georgia', serif;
                min-width: 250px;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(255, 215, 0, 0.3)';
                button.style.transform = 'scale(1.1)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(255, 255, 255, 0.2)';
                button.style.transform = 'scale(1)';
            });

            button.addEventListener('click', () => {
                item.callback();
            });

            button.addEventListener('touchstart', () => {
                button.style.background = 'rgba(255, 215, 0, 0.3)';
                button.style.transform = 'scale(1.1)';
            }, { passive: true });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.style.background = 'rgba(255, 255, 255, 0.2)';
                button.style.transform = 'scale(1)';
                item.callback();
            }, { passive: false });

            this.container.appendChild(button);
        });
    }

    public show(): void {
        this.container.style.display = 'flex';
    }

    public hide(): void {
        this.container.style.display = 'none';
    }
}