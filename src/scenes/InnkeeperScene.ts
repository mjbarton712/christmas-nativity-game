import * as THREE from 'three';
import { Scene } from './Scene';
import { Innkeeper } from '../characters/Innkeeper';
import { Dialog } from '../components/ui/Dialog';
import { HUD } from '../components/ui/HUD';
import { Quiz, QUIZ_QUESTIONS } from '../components/ui/Quiz';
import { SparkleParticles } from '../components/3d/ParticleSystem';
import { ProgressManager } from '../utils/ProgressManager';
import type { Game } from '../game/Game';
import gsap from 'gsap';

export class InnkeeperScene extends Scene {
    private innkeeper: Innkeeper;
    private dialog: Dialog;
    private hud: HUD;
    private quiz: Quiz;
    private particles: SparkleParticles;
    private progressManager: ProgressManager;
    private dialogueStep: number;
    private currentQuestionIndex: number;
    private ground: THREE.Mesh;
    private inn: THREE.Group;

    constructor(game: Game) {
        super('Innkeeper', game);
        
        this.innkeeper = new Innkeeper(new THREE.Vector3(0, 0, 0));
        this.dialog = new Dialog();
        this.hud = new HUD();
        this.quiz = new Quiz();
        this.particles = new SparkleParticles();
        this.progressManager = ProgressManager.getInstance();
        this.dialogueStep = 0;
        this.currentQuestionIndex = 0;
        
        // Add particles
        this.particles.setPosition(0, 3, 0);
        this.scene.add(this.particles.getMesh());
        
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
        
        // Animate camera entrance
        this.camera.position.set(0, 5, 12);
        gsap.to(this.camera.position, {
            y: 2,
            z: 6,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                this.camera.lookAt(0, 1, 0);
            }
        });
        
        // Animate innkeeper entrance
        this.innkeeper.getMesh().position.y = -3;
        gsap.to(this.innkeeper.getMesh().position, { y: 0, duration: 1.5, delay: 0.5, ease: 'bounce.out' });
        
        this.hud.setTitle('The Innkeeper of Bethlehem');
        this.hud.setInstructions('Press SPACE to advance\nPress ESC for menu');
        this.hud.show();
        
        this.innkeeper.activate();
        setTimeout(() => this.advanceDialogue(), 2500);
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
                    this.progressManager.completeStory('Innkeeper');
                    setTimeout(() => {
                        this.dialog.hide();
                        this.showQuiz();
                    }, 1000);
                }
            });
        }
    }

    private showQuiz(): void {
        const questions = QUIZ_QUESTIONS.Innkeeper;
        if (this.currentQuestionIndex < questions.length) {
            const question = questions[this.currentQuestionIndex];
            this.quiz.show(question, (correct) => {
                if (correct) {
                    this.currentQuestionIndex++;
                    if (this.currentQuestionIndex < questions.length) {
                        setTimeout(() => {
                            this.quiz.hide();
                            setTimeout(() => this.showQuiz(), 500);
                        }, 1000);
                    } else {
                        this.progressManager.passQuiz('Innkeeper');
                        setTimeout(() => {
                            this.quiz.hide();
                            this.returnToMenu();
                        }, 2000);
                    }
                } else {
                    setTimeout(() => {
                        this.quiz.hide();
                        setTimeout(() => this.showQuiz(), 500);
                    }, 2000);
                }
            });
        }
    }

    private returnToMenu(): void {
        gsap.to(this.camera.position, {
            y: 8,
            z: 12,
            duration: 1.5,
            ease: 'power2.in',
            onComplete: () => {
                this.game.getSceneManager().switchScene('MainMenu');
            }
        });
    }

    protected onUpdate(deltaTime: number): void {
        this.innkeeper.update(deltaTime);
        this.particles.update(deltaTime);
        
        const input = this.game.getInputManager();
        if (input.isKeyPressed('Space') && !this.quiz.isShowing()) {
            this.dialog.advance();
        }
        if (input.isKeyPressed('Escape')) {
            this.quiz.hide();
            this.game.getSceneManager().switchScene('MainMenu');
        }
    }
}