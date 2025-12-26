import * as THREE from 'three';
import { Scene } from './Scene';
import { Menu } from '../components/ui/Menu';
import { ProgressManager, GameProgress } from '../utils/ProgressManager';
import type { Game } from '../game/Game';

export class MainMenuScene extends Scene {
    private menu: Menu;
    private stars: THREE.Points;
    private progressManager: ProgressManager;
    private progressDisplay: HTMLElement;

    constructor(game: Game) {
        super('MainMenu', game);
        this.menu = new Menu();
        this.progressManager = new ProgressManager();
        
        // Create starfield with more stars
        this.stars = this.createStarfield();
        this.scene.add(this.stars);
        
        // Create progress display
        this.progressDisplay = document.createElement('div');
        this.progressDisplay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #FFD700;
            padding: 15px 20px;
            border-radius: 10px;
            border: 2px solid #FFD700;
            font-family: 'Georgia', serif;
            font-size: 16px;
            z-index: 900;
            display: none;
        `;
        document.body.appendChild(this.progressDisplay);
    }

    private createStarfield(): THREE.Points {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            vertices.push(x, y, z);
            
            // Vary star colors slightly
            const brightness = 0.7 + Math.random() * 0.3;
            colors.push(brightness, brightness, brightness);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({ 
            size: 2,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        return new THREE.Points(geometry, material);
    }

    protected onLoad(): void {
        this.menu.clearMenuItems();
        this.menu.setTitle('✨ Christmas Nativity Story ✨');
        
        // Debug progress
        this.progressManager.debugProgress();
        
        // Update progress display
        const completion = this.progressManager.getCompletionPercentage();
        const score = this.progressManager.getTotalScore();
        this.progressDisplay.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">⭐ Progress</div>
            <div>${completion}% Complete</div>
            <div>Score: ${score}</div>
        `;
        this.progressDisplay.style.display = 'block';
        
        // Add menu items with lock/unlock status
        const addStoryMenuItem = (
            title: string,
            scene: string,
            storyKey: keyof GameProgress['stories']
        ) => {
            const unlocked = this.progressManager.isStoryUnlocked(storyKey);
            const completed = this.progressManager.hasPassedQuiz(storyKey);
            
            let displayTitle = title;
            if (completed) {
                displayTitle = `✓ ${title}`;
            } else if (!unlocked) {
                displayTitle = `🔒 ${title}`;
            }
            
            this.menu.addMenuItem(displayTitle, () => {
                if (unlocked) {
                    this.game.getSceneManager().switchScene(scene);
                }
            });
        };
        
        addStoryMenuItem('Mary & Joseph', 'MaryJoseph', 'MaryJoseph');
        addStoryMenuItem('The Innkeeper', 'Innkeeper', 'Innkeeper');
        addStoryMenuItem('The Shepherds', 'Shepherds', 'Shepherds');
        addStoryMenuItem('The Wise Men', 'WiseMen', 'WiseMen');
        
        this.menu.show();
    }

    protected onUnload(): void {
        this.menu.hide();
        this.progressDisplay.style.display = 'none';
    }

    protected onUpdate(deltaTime: number): void {
        // Rotate starfield with slight variation
        this.stars.rotation.y += 0.0002;
        this.stars.rotation.x += 0.0001;
    }
}