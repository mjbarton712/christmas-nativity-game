export class InputManager {
    private keys: Map<string, boolean>;
    private keysPressed: Map<string, boolean>;
    private keysReleased: Map<string, boolean>;
    private mouseX: number;
    private mouseY: number;
    private mouseDown: boolean;
    private mouseClicked: boolean;

    constructor() {
        this.keys = new Map();
        this.keysPressed = new Map();
        this.keysReleased = new Map();
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        this.mouseClicked = false;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Keyboard events
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (!this.keys.get(e.code)) {
                this.keysPressed.set(e.code, true);
            }
            this.keys.set(e.code, true);
            console.log('Key pressed:', e.code); // Debug logging
        });

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys.set(e.code, false);
            this.keysReleased.set(e.code, true);
        });

        // Mouse events
        window.addEventListener('mousemove', (e: MouseEvent) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        window.addEventListener('mousedown', () => {
            if (!this.mouseDown) {
                this.mouseClicked = true;
            }
            this.mouseDown = true;
        });

        window.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });
    }

    public update(): void {
        // Clear one-frame states
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mouseClicked = false;
    }

    public isKeyDown(keyCode: string): boolean {
        return this.keys.get(keyCode) || false;
    }

    public isKeyPressed(keyCode: string): boolean {
        return this.keysPressed.get(keyCode) || false;
    }

    public isKeyReleased(keyCode: string): boolean {
        return this.keysReleased.get(keyCode) || false;
    }

    public getMousePosition(): { x: number; y: number } {
        return { x: this.mouseX, y: this.mouseY };
    }

    public isMouseDown(): boolean {
        return this.mouseDown;
    }

    public isMouseClicked(): boolean {
        return this.mouseClicked;
    }
}