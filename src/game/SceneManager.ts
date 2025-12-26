import * as THREE from 'three';
import type { Game } from './Game';
import type { Scene } from '../scenes/Scene';

export class SceneManager {
    private currentScene: Scene | null = null;
    private game: Game;
    private scenes: Map<string, Scene>;

    constructor(game: Game) {
        this.game = game;
        this.scenes = new Map();
    }

    public registerScene(name: string, scene: Scene): void {
        this.scenes.set(name, scene);
    }

    public switchScene(sceneName: string): void {
        const newScene = this.scenes.get(sceneName);
        
        if (!newScene) {
            console.error(`Scene "${sceneName}" not found!`);
            return;
        }

        if (this.currentScene) {
            this.currentScene.deactivate();
            this.currentScene.unload();
        }
        
        this.currentScene = newScene;
        this.currentScene.load();
        this.currentScene.activate();
    }

    public getCurrentScene(): Scene | null {
        return this.currentScene;
    }

    public update(deltaTime: number): void {
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    public render(renderer: THREE.WebGLRenderer): void {
        if (this.currentScene) {
            this.currentScene.render(renderer);
        }
    }

    public onResize(width: number, height: number): void {
        if (this.currentScene) {
            this.currentScene.onResize(width, height);
        }
    }
}