export class InputManager {
    private keys: Map<string, boolean>;
    private keysPressed: Map<string, boolean>;
    private keysReleased: Map<string, boolean>;
    private mouseX: number;
    private mouseY: number;
    private mouseDown: boolean;
    private mouseClicked: boolean;
    private touchStart: { x: number; y: number } | null;
    private touchTapped: boolean;
    private touchSwipe: { direction: string; distance: number } | null;

    constructor() {
        this.keys = new Map();
        this.keysPressed = new Map();
        this.keysReleased = new Map();
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        this.mouseClicked = false;
        this.touchStart = null;
        this.touchTapped = false;
        this.touchSwipe = null;

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

        // Touch events
        window.addEventListener('touchstart', (e: TouchEvent) => {
            const touch = e.touches[0];
            this.touchStart = { x: touch.clientX, y: touch.clientY };
            this.mouseX = touch.clientX;
            this.mouseY = touch.clientY;
            e.preventDefault();
        }, { passive: false });

        window.addEventListener('touchmove', (e: TouchEvent) => {
            const touch = e.touches[0];
            this.mouseX = touch.clientX;
            this.mouseY = touch.clientY;
        });

        window.addEventListener('touchend', (e: TouchEvent) => {
            if (this.touchStart && e.changedTouches[0]) {
                const touch = e.changedTouches[0];
                const deltaX = touch.clientX - this.touchStart.x;
                const deltaY = touch.clientY - this.touchStart.y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                // If movement is small, it's a tap
                if (distance < 30) {
                    this.touchTapped = true;
                    // Simulate space key press for taps
                    this.keysPressed.set('Space', true);
                    console.log('Touch tap detected - simulating Space key');
                } else {
                    // Detect swipe direction
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        this.touchSwipe = {
                            direction: deltaX > 0 ? 'right' : 'left',
                            distance
                        };
                    } else {
                        this.touchSwipe = {
                            direction: deltaY > 0 ? 'down' : 'up',
                            distance
                        };
                    }
                }
            }
            this.touchStart = null;
            e.preventDefault();
        }, { passive: false });
    }

    public update(): void {
        // Clear one-frame states
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mouseClicked = false;
        this.touchTapped = false;
        this.touchSwipe = null;
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

    public isTouchTapped(): boolean {
        return this.touchTapped;
    }

    public getTouchSwipe(): { direction: string; distance: number } | null {
        return this.touchSwipe;
    }

    public isTouchActive(): boolean {
        return this.touchStart !== null;
    }
}