export class Animation {
    private animations: Map<string, any>;
    private currentAnimation: string | null;

    constructor() {
        this.animations = new Map();
        this.currentAnimation = null;
    }

    public loadAnimation(name: string, animationData: any): void {
        this.animations.set(name, animationData);
    }

    public playAnimation(name: string): void {
        if (this.animations.has(name)) {
            this.currentAnimation = name;
            // Logic to play the animation
        } else {
            console.warn(`Animation ${name} not found.`);
        }
    }

    public stopAnimation(): void {
        if (this.currentAnimation) {
            // Logic to stop the current animation
            this.currentAnimation = null;
        }
    }

    public update(deltaTime: number): void {
        if (this.currentAnimation) {
            // Logic to update the current animation based on deltaTime
        }
    }
}