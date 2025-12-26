import * as THREE from 'three';
import { Scene } from './Scene';
import { Innkeeper } from '../characters/Innkeeper';
import { Dialog } from '../components/ui/Dialog';
import { HUD } from '../components/ui/HUD';
import type { Game } from '../game/Game';

export class InnkeeperScene extends Scene {
    private innkeeper: Innkeeper;
    private dialog: Dialog;
    private hud: HUD;
    private dialogueStep: number;
    private ground: THREE.Mesh;
    private inn: THREE.Group;

    constructor(game: Game) {
        super('Innkeeper', game);
        
        this.innkeeper = new Innkeeper(new THREE.Vector3(0, 0, 0));
        this.dialog = new Dialog();
        this.hud = new HUD();
        this.dialogueStep = 0;
        
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            side: THREE.DoubleSide 
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        
        // Create simple inn building
        this.inn = this.createInn();
    }

    private createInn(): THREE.Group {
        const group = new THREE.Group();
        
        // Building walls
        const wallGeometry = new THREE.BoxGeometry(4, 2, 3);
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xD2691E });
        const walls = new THREE.Mesh(wallGeometry, wallMaterial);
        walls.position.y = 1;
        walls.castShadow = true;
        group.add(walls);
        
        // Roof
        const roofGeometry = new THREE.ConeGeometry(3, 1.5, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 2.75;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
        
        group.position.set(-3, 0, -2);
        return group;
    }

    protected onLoad(): void {
        this.scene.add(this.ground);
        this.scene.add(this.inn);
        this.scene.add(this.innkeeper.getMesh());
        
        this.camera.position.set(0, 2, 6);
        this.camera.lookAt(0, 1, 0);
        
        this.hud.setTitle('The Innkeeper of Bethlehem');
        this.hud.setInstructions('Press SPACE to advance\nPress ESC for menu');
        this.hud.show();
        
        this.innkeeper.activate();
        this.advanceDialogue();
    }

    protected onUnload(): void {
        this.dialog.hide();
        this.hud.hide();
        this.innkeeper.deactivate();
    }

    private advanceDialogue(): void {
        const text = this.innkeeper.getNextDialogue();
        
        if (text) {
            this.dialog.show(this.innkeeper.name, text, () => {
                this.dialogueStep++;
                if (this.innkeeper.hasMoreDialogue()) {
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
        this.innkeeper.update(deltaTime);
        
        const input = this.game.getInputManager();
        if (input.isKeyPressed('Space')) {
            this.dialog.advance();
        }
        if (input.isKeyPressed('Escape')) {
            this.game.getSceneManager().switchScene('MainMenu');
        }
    }
}