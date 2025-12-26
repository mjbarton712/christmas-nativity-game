import * as THREE from 'three';
import { EnhancedLighting } from '../components/3d/PostProcessing';
import type { Game } from '../game/Game';

export abstract class Scene {
    protected sceneName: string;
    protected isActive: boolean;
    protected game: Game;
    protected scene: THREE.Scene;
    protected camera: THREE.PerspectiveCamera;
    protected enhancedLighting: EnhancedLighting;
    protected ambientLight: THREE.AmbientLight;
    protected directionalLight: THREE.DirectionalLight;

    constructor(name: string, game: Game) {
        this.sceneName = name;
        this.isActive = false;
        this.game = game;
        
        // Create Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e); // Darker, more atmospheric
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50); // Add atmospheric fog
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 1, 0);
        
        // Setup enhanced lighting
        this.enhancedLighting = new EnhancedLighting(this.scene);
        
        // Keep references for compatibility
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0);
        this.directionalLight = this.enhancedLighting.getMainLight();
    }

    public activate(): void {
        this.isActive = true;
        this.onActivate();
    }

    public deactivate(): void {
        this.isActive = false;
        this.onDeactivate();
    }

    protected onActivate(): void {
        // Override in derived classes
    }

    protected onDeactivate(): void {
        // Override in derived classes
    }

    public load(): void {
        this.onLoad();
    }

    public unload(): void {
        this.onUnload();
        // Clean up scene resources
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                if (object.material instanceof THREE.Material) {
                    object.material.dispose();
                }
            }
        });
    }

    protected onLoad(): void {
        // Override in derived classes
    }

    protected onUnload(): void {
        // Override in derived classes
    }

    public update(deltaTime: number): void {
        if (this.isActive) {
            this.enhancedLighting.update(deltaTime);
            this.onUpdate(deltaTime);
        }
    }

    protected onUpdate(deltaTime: number): void {
        // Override in derived classes
    }

    public render(renderer: THREE.WebGLRenderer): void {
        if (this.isActive) {
            renderer.render(this.scene, this.camera);
            this.onRender();
        }
    }

    protected onRender(): void {
        // Override in derived classes for post-render logic
    }

    public onResize(width: number, height: number): void {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public getName(): string {
        return this.sceneName;
    }
}