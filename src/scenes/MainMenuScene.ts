import * as THREE from 'three';
import { Scene } from './Scene';
import { Menu } from '../components/ui/Menu';
import type { Game } from '../game/Game';

export class MainMenuScene extends Scene {
    private menu: Menu;
    private stars: THREE.Points;

    constructor(game: Game) {
        super('MainMenu', game);
        this.menu = new Menu();
        
        // Create starfield
        this.stars = this.createStarfield();
        this.scene.add(this.stars);
    }

    private createStarfield(): THREE.Points {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            vertices.push(x, y, z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ 
            color: 0xFFFFFF, 
            size: 2,
            transparent: true,
            opacity: 0.8
        });
        
        return new THREE.Points(geometry, material);
    }

    protected onLoad(): void {
        this.menu.clearMenuItems();
        this.menu.setTitle('✨ Christmas Nativity Story ✨');
        this.menu.addMenuItem('Mary & Joseph', () => {
            this.game.getSceneManager().switchScene('MaryJoseph');
        });
        this.menu.addMenuItem('The Innkeeper', () => {
            this.game.getSceneManager().switchScene('Innkeeper');
        });
        this.menu.addMenuItem('The Shepherds', () => {
            this.game.getSceneManager().switchScene('Shepherds');
        });
        this.menu.addMenuItem('The Wise Men', () => {
            this.game.getSceneManager().switchScene('WiseMen');
        });
        this.menu.show();
    }

    protected onUnload(): void {
        this.menu.hide();
    }

    protected onUpdate(deltaTime: number): void {
        // Rotate starfield
        this.stars.rotation.y += 0.0002;
    }
}