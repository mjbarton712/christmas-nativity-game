import * as THREE from 'three';
import { Scene } from './Scene';
import { Mary } from '../characters/Mary';
import { Joseph } from '../characters/Joseph';
import { Dialog } from '../components/ui/Dialog';
import { HUD } from '../components/ui/HUD';
import { Quiz, QUIZ_QUESTIONS } from '../components/ui/Quiz';
import { SparkleParticles } from '../components/3d/ParticleSystem';
import { ProgressManager } from '../utils/ProgressManager';
import type { Game } from '../game/Game';
import gsap from 'gsap';

export class MaryJosephScene extends Scene {
    private mary: Mary;
    private joseph: Joseph;
    private dialog: Dialog;
    private hud: HUD;
    private quiz: Quiz;
    private particles: SparkleParticles;
    private progressManager: ProgressManager;
    private currentSpeaker: Mary | Joseph;
    private dialogueStep: number;
    private ground: THREE.Mesh;
    private currentQuestionIndex: number;

    constructor(game: Game) {
        super('MaryJoseph', game);
        
        this.mary = new Mary(new THREE.Vector3(-1.5, 0, 0));
        this.joseph = new Joseph(new THREE.Vector3(1.5, 0, 0));
        this.dialog = new Dialog();
        this.hud = new HUD();
        this.quiz = new Quiz();
        this.particles = new SparkleParticles();
        this.progressManager = new ProgressManager();
        this.currentSpeaker = this.mary;
        this.dialogueStep = 0;
        this.currentQuestionIndex = 0;
        
        // Create enhanced ground with better materials
        const groundGeometry = new THREE.PlaneGeometry(20, 20, 10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xD2B48C, // Tan desert
            side: THREE.DoubleSide,
            roughness: 0.9,
            metalness: 0.1
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        
        // Add particle system to scene
        this.particles.setPosition(0, 3, 0);
        this.scene.add(this.particles.getMesh());
    }

    protected onLoad(): void {
        // Add ground and characters to scene
        this.scene.add(this.ground);
        this.scene.add(this.mary.getMesh());
        this.scene.add(this.joseph.getMesh());
        
        // Animate camera entrance with GSAP
        this.camera.position.set(0, 5, 15);
        gsap.to(this.camera.position, {
            y: 3,
            z: 8,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                this.camera.lookAt(0, 1, 0);
            }
        });
        
        // Animate characters entrance
        this.mary.getMesh().position.y = -5;
        this.joseph.getMesh().position.y = -5;
        gsap.to(this.mary.getMesh().position, { y: 0, duration: 1.5, delay: 0.5, ease: 'bounce.out' });
        gsap.to(this.joseph.getMesh().position, { y: 0, duration: 1.5, delay: 0.7, ease: 'bounce.out' });
        
        // Setup HUD
        this.hud.setTitle('Mary & Joseph');
        this.hud.setInstructions('Press SPACE to advance dialogue\\nPress ESC to return to menu');
        this.hud.show();
        
        // Activate characters
        this.mary.activate();
        this.joseph.activate();
        
        // Start dialogue
        setTimeout(() => this.advanceDialogue(), 2500);
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
                    // Mark story as completed
                    this.progressManager.completeStory('MaryJoseph');
                    
                    // Show quiz after dialogue completes
                    setTimeout(() => {
                        this.dialog.hide();
                        this.showQuiz();
                    }, 1000);
                }
            });
        }
    }

    private showQuiz(): void {
        const questions = QUIZ_QUESTIONS.MaryJoseph;
        if (this.currentQuestionIndex < questions.length) {
            const question = questions[this.currentQuestionIndex];
            this.quiz.show(question, (correct) => {
                if (correct) {
                    this.currentQuestionIndex++;
                    if (this.currentQuestionIndex < questions.length) {
                        // Show next question
                        setTimeout(() => {
                            this.quiz.hide();
                            setTimeout(() => this.showQuiz(), 500);
                        }, 1000);
                    } else {
                        // All questions answered correctly
                        this.progressManager.passQuiz('MaryJoseph');
                        setTimeout(() => {
                            this.quiz.hide();
                            this.returnToMenu();
                        }, 2000);
                    }
                } else {
                    // Wrong answer - try again
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
            y: 10,
            z: 15,
            duration: 1.5,
            ease: 'power2.in',
            onComplete: () => {
                this.game.getSceneManager().switchScene('MainMenu');
            }
        });
    }

    protected onUpdate(deltaTime: number): void {
        this.mary.update(deltaTime);
        this.joseph.update(deltaTime);
        this.particles.update(deltaTime);
        
        // Handle input
        const input = this.game.getInputManager();
        const spacePressed = input.isKeyPressed('Space');
        console.log('MaryJoseph update - Space pressed:', spacePressed);
        
        if (spacePressed && !this.quiz.isShowing()) {
            console.log('Calling dialog.advance()');
            this.dialog.advance();
        }
        if (input.isKeyPressed('Escape')) {
            this.quiz.hide();
            this.game.getSceneManager().switchScene('MainMenu');
        }
        
        // Gentle camera sway
        this.camera.position.x = Math.sin(Date.now() * 0.0003) * 0.3;
    }
}