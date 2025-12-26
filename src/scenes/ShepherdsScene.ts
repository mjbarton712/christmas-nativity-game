import * as THREE from 'three';
import { Scene } from './Scene';
import { Shepherds } from '../characters/Shepherds';
import { Dialog } from '../components/ui/Dialog';
import { HUD } from '../components/ui/HUD';
import type { Game } from '../game/Game';

export class ShepherdsScene extends Scene {
    private shepherds: Shepherds;
    private dialog: Dialog;
    private hud: HUD;
    private dialogueStep: number;
    private ground: THREE.Mesh;
    private angelLight: THREE.PointLight;

    constructor(game: Game) {
        super('Shepherds', game);
        
        this.shepherds = new Shepherds(new THREE.Vector3(0, 0, 0));
        this.dialog = new Dialog();
        this.hud = new HUD();
        this.dialogueStep = 0;
        
        // Create ground (field)
        const groundGeometry = new THREE.PlaneGeometry(25, 25);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x228B22,
            side: THREE.DoubleSide 
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        
        // Create angelic light
        this.angelLight = new THREE.PointLight(0xFFFFFF, 3, 20);
        this.angelLight.position.set(0, 8, 0);
        this.angelLight.castShadow = true;
    }

    protected onLoad(): void {
        // Change scene to night sky
        this.scene.background = new THREE.Color(0x000033);
        
        this.scene.add(this.ground);
        this.scene.add(this.shepherds.getMesh());
        this.scene.add(this.angelLight);
        
        // Add stars
        const starsGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 500; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = Math.random() * 50 + 20;
            const z = (Math.random() - 0.5) * 100;
            starVertices.push(x, y, z);
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.3 });
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
        
        this.camera.position.set(0, 3, 8);
        this.camera.lookAt(0, 1, 0);
        
        this.hud.setTitle('The Shepherds');
        this.hud.setInstructions('Press SPACE to advance\nPress ESC for menu');
        this.hud.show();
        
        this.shepherds.activate();
        this.advanceDialogue();
    }

    protected onUnload(): void {
        this.dialog.hide();
        this.hud.hide();
        this.shepherds.deactivate();
    }

    private advanceDialogue(): void {
        const text = this.shepherds.getNextDialogue();
        
        if (text) {
            this.dialog.show(this.shepherds.name, text, () => {
                this.dialogueStep++;
                if (this.shepherds.hasMoreDialogue()) {
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
        this.shepherds.update(deltaTime);
        
        // Pulsing angel light
        this.angelLight.intensity = 2 + Math.sin(Date.now() * 0.003) * 1;
        
        const input = this.game.getInputManager();
        if (input.isKeyPressed('Space')) {
            this.dialog.advance();
        }
        if (input.isKeyPressed('Escape')) {
            this.game.getSceneManager().switchScene('MainMenu');
        }
    }
}