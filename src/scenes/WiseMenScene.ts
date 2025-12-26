import * as THREE from 'three';
import { Scene } from './Scene';
import { WiseMen } from '../characters/WiseMen';
import { Dialog } from '../components/ui/Dialog';
import { HUD } from '../components/ui/HUD';
import type { Game } from '../game/Game';

export class WiseMenScene extends Scene {
    private wiseMen: WiseMen;
    private dialog: Dialog;
    private hud: HUD;
    private dialogueStep: number;
    private ground: THREE.Mesh;
    private star: THREE.Mesh;

    constructor(game: Game) {
        super('WiseMen', game);
        
        this.wiseMen = new WiseMen(new THREE.Vector3(0, 0, 0));
        this.dialog = new Dialog();
        this.hud = new HUD();
        this.dialogueStep = 0;
        
        // Create desert ground
        const groundGeometry = new THREE.PlaneGeometry(30, 30);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xE6C89C,
            side: THREE.DoubleSide 
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        
        // Create the Star of Bethlehem
        this.star = this.createStar();
    }

    private createStar(): THREE.Mesh {
        const starShape = new THREE.Shape();
        const outerRadius = 0.5;
        const innerRadius = 0.2;
        const points = 5;
        
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) starShape.moveTo(x, y);
            else starShape.lineTo(x, y);
        }
        starShape.closePath();
        
        const geometry = new THREE.ExtrudeGeometry(starShape, { depth: 0.1, bevelEnabled: false });
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            emissive: 0xFFD700,
            emissiveIntensity: 1
        });
        const star = new THREE.Mesh(geometry, material);
        star.position.set(0, 8, -5);
        
        // Add point light to star
        const starLight = new THREE.PointLight(0xFFD700, 2, 20);
        starLight.position.copy(star.position);
        this.scene.add(starLight);
        
        return star;
    }

    protected onLoad(): void {
        // Night sky
        this.scene.background = new THREE.Color(0x001133);
        
        this.scene.add(this.ground);
        this.scene.add(this.wiseMen.getMesh());
        this.scene.add(this.star);
        
        this.camera.position.set(0, 4, 10);
        this.camera.lookAt(0, 1, 0);
        
        this.hud.setTitle('The Wise Men from the East');
        this.hud.setInstructions('Press SPACE to advance\nPress ESC for menu');
        this.hud.show();
        
        this.wiseMen.activate();
        this.advanceDialogue();
    }

    protected onUnload(): void {
        this.dialog.hide();
        this.hud.hide();
        this.wiseMen.deactivate();
    }

    private advanceDialogue(): void {
        const text = this.wiseMen.getNextDialogue();
        
        if (text) {
            this.dialog.show(this.wiseMen.name, text, () => {
                this.dialogueStep++;
                if (this.wiseMen.hasMoreDialogue()) {
                    this.advanceDialogue();
                } else {
                    setTimeout(() => {
                        this.game.getSceneManager().switchScene('MainMenu');
                    }, 2000);
                }
            });
        }
    }

    protected onUpdate(deltaTime: number): void {
        this.wiseMen.update(deltaTime);
        
        // Rotate and pulse the star
        this.star.rotation.z += 0.01;
        this.star.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.1);
        
        const input = this.game.getInputManager();
        if (input.isKeyPressed('Space')) {
            this.dialog.advance();
        }
        if (input.isKeyPressed('Escape')) {
            this.game.getSceneManager().switchScene('MainMenu');
        }
    }
}