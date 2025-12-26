import * as THREE from 'three';
import { Scene } from './Scene';
import { Mary } from '../characters/Mary';
import { Joseph } from '../characters/Joseph';
import { Dialog } from '../components/ui/Dialog';
import { HUD } from '../components/ui/HUD';
import type { Game } from '../game/Game';

export class MaryJosephScene extends Scene {
    private mary: Mary;
    private joseph: Joseph;
    private dialog: Dialog;
    private hud: HUD;
    private currentSpeaker: Mary | Joseph;
    private dialogueStep: number;
    private ground: THREE.Mesh;

    constructor(game: Game) {
        super('MaryJoseph', game);
        
        this.mary = new Mary(new THREE.Vector3(-1.5, 0, 0));
        this.joseph = new Joseph(new THREE.Vector3(1.5, 0, 0));
        this.dialog = new Dialog();
        this.hud = new HUD();
        this.currentSpeaker = this.mary;
        this.dialogueStep = 0;
        
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xD2B48C, // Tan desert
            side: THREE.DoubleSide 
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
    }

    protected onLoad(): void {
        // Add ground and characters to scene
        this.scene.add(this.ground);
        this.scene.add(this.mary.getMesh());
        this.scene.add(this.joseph.getMesh());
        
        // Position camera for better view
        this.camera.position.set(0, 3, 8);
        this.camera.lookAt(0, 1, 0);
        
        // Setup HUD
        this.hud.setTitle('Mary & Joseph');
        this.hud.setInstructions('Press SPACE to advance dialogue\\nPress ESC to return to menu');
        this.hud.show();
        
        // Activate characters
        this.mary.activate();
        this.joseph.activate();
        
        // Start dialogue
        this.advanceDialogue();
    }

    protected onUnload(): void {
        this.dialog.hide();
        this.hud.hide();
        this.mary.deactivate();
        this.joseph.deactivate();
    }

    private advanceDialogue(): void {
        console.log('advanceDialogue() called, step:', this.dialogueStep);
        // Alternate between Mary and Joseph
        const speaker = this.dialogueStep % 2 === 0 ? this.mary : this.joseph;
        const text = speaker.getNextDialogue();
        
        console.log('Speaker:', speaker.name, 'Text:', text ? text.substring(0, 30) : 'null');
        
        if (text) {
            this.dialog.show(speaker.name, text, () => {
                console.log('Dialogue callback executed');
                this.dialogueStep++;
                if (this.mary.hasMoreDialogue() || this.joseph.hasMoreDialogue()) {
                    this.advanceDialogue();
                } else {
                    // Return to menu after all dialogue
                    setTimeout(() => {
                        this.game.getSceneManager().switchScene('MainMenu');
                    }, 2000);
                }
            });
        }
    }

    protected onUpdate(deltaTime: number): void {
        this.mary.update(deltaTime);
        this.joseph.update(deltaTime);
        
        // Handle input
        const input = this.game.getInputManager();
        const spacePressed = input.isKeyPressed('Space');
        console.log('MaryJoseph update - Space pressed:', spacePressed);
        
        if (spacePressed) {
            console.log('Calling dialog.advance()');
            this.dialog.advance();
        }
        if (input.isKeyPressed('Escape')) {
            this.game.getSceneManager().switchScene('MainMenu');
        }
        
        // Gentle camera sway
        this.camera.position.x = Math.sin(Date.now() * 0.0003) * 0.5;
    }
}