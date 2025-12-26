import * as THREE from 'three';
import { SceneManager } from './SceneManager';
import { InputManager } from './InputManager';

export class Game {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private sceneManager: SceneManager;
    private inputManager: InputManager;
    private isRunning: boolean;
    private clock: THREE.Clock;
    private lastTime: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.clock = new THREE.Clock();
        this.lastTime = 0;
        
        // Setup Three.js renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        // Initialize managers
        this.sceneManager = new SceneManager(this);
        this.inputManager = new InputManager();
        this.isRunning = false;

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    public getInputManager(): InputManager {
        return this.inputManager;
    }

    public getSceneManager(): SceneManager {
        return this.sceneManager;
    }

    private onWindowResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.renderer.setSize(width, height);
        this.sceneManager.onResize(width, height);
    }

    public start(): void {
        this.isRunning = true;
        this.clock.start();
        this.gameLoop();
    }

    private gameLoop(): void {
        if (!this.isRunning) return;

        const currentTime = this.clock.getElapsedTime();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    private update(deltaTime: number): void {
        this.sceneManager.update(deltaTime);
        
        // Check for fullscreen toggle
        if (this.inputManager.isKeyPressed('KeyF')) {
            this.toggleFullscreen();
        }
        
        this.inputManager.update();
    }

    private toggleFullscreen(): void {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    private render(): void {
        this.sceneManager.render(this.renderer);
    }

    public stop(): void {
        this.isRunning = false;
    }
}