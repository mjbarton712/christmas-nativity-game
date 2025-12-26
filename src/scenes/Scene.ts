import * as THREE from 'three';
import type { Game } from '../game/Game';

export abstract class Scene {
    protected sceneName: string;
    protected isActive: boolean;
    protected game: Game;
    protected scene: THREE.Scene;
    protected camera: THREE.PerspectiveCamera;
    protected ambientLight: THREE.AmbientLight;
    protected directionalLight: THREE.DirectionalLight;

    constructor(name: string, game: Game) {
        this.sceneName = name;
        this.isActive = false;
        this.game = game;
        
        // Create Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 1, 0);
        
        // Setup lighting
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambientLight);
        
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(5, 10, 7);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.camera.near = 0.1;
        this.directionalLight.shadow.camera.far = 50;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(this.directionalLight);
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