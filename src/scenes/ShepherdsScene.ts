import * as THREE from 'three';
import { Scene } from './Scene';
import { Shepherds } from '../characters/Shepherds';
import { Dialog } from '../components/ui/Dialog';
import { HUD } from '../components/ui/HUD';
import { Quiz, QUIZ_QUESTIONS } from '../components/ui/Quiz';
import { AngelGlowParticles } from '../components/3d/ParticleSystem';
import { ProgressManager } from '../utils/ProgressManager';
import type { Game } from '../game/Game';
import gsap from 'gsap';

export class ShepherdsScene extends Scene {
    private shepherds: Shepherds;
    private dialog: Dialog;
    private hud: HUD;
    private quiz: Quiz;
    private angelParticles: AngelGlowParticles;
    private progressManager: ProgressManager;
    private dialogueStep: number;
    private currentQuestionIndex: number;
    private ground: THREE.Mesh;
    private angelLight: THREE.PointLight;

    constructor(game: Game) {
        super('Shepherds', game);
        
        this.shepherds = new Shepherds(new THREE.Vector3(0, 0, 0));
        this.dialog = new Dialog();
        this.hud = new HUD();
        this.quiz = new Quiz();
        this.angelParticles = new AngelGlowParticles();
        this.progressManager = new ProgressManager();
        this.dialogueStep = 0;
        this.currentQuestionIndex = 0;
        
        // Create ground (field) with better materials
        const groundGeometry = new THREE.PlaneGeometry(25, 25, 10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a4d1a,
            side: THREE.DoubleSide,
            roughness: 0.9,
            metalness: 0.0
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        
        // Create angelic light
        this.angelLight = new THREE.PointLight(0xFFFFAA, 5, 25);
        this.angelLight.position.set(0, 8, 0);
        this.angelLight.castShadow = true;
        
        // Add particle system for angel glow
        this.angelParticles.setPosition(0, 8, 0);
        this.scene.add(this.angelParticles.getMesh());
    }

    protected onLoad(): void {
        // Change scene to night sky
        this.scene.background = new THREE.Color(0x000033);
        this.enhancedLighting.setNightMode(true);
        
        this.scene.add(this.ground);
        this.scene.add(this.shepherds.getMesh());
        this.scene.add(this.angelLight);
        
        // Enhanced stars with better materials
        const starsGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        const starColors = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = Math.random() * 50 + 20;
            const z = (Math.random() - 0.5) * 100;
            starVertices.push(x, y, z);
            
            const brightness = 0.7 + Math.random() * 0.3;
            starColors.push(brightness, brightness, brightness);
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
        const starsMaterial = new THREE.PointsMaterial({ 
            size: 0.4, 
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
        
        // Animate camera entrance
        this.camera.position.set(0, 8, 15);
        gsap.to(this.camera.position, {
            y: 3,
            z: 8,
            duration: 2.5,
            ease: 'power2.out',
            onUpdate: () => {
                this.camera.lookAt(0, 1, 0);
            }
        });
        
        // Animate shepherds entrance
        this.shepherds.getMesh().scale.set(0, 0, 0);
        gsap.to(this.shepherds.getMesh().scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.5,
            delay: 1,
            ease: 'back.out(1.7)'
        });
        
        this.hud.setTitle('The Shepherds');
        this.hud.setInstructions('Press SPACE to advance\\nPress ESC for menu');
        this.hud.show();
        
        this.shepherds.activate();
        setTimeout(() => this.advanceDialogue(), 3000);
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
                    // Mark story as completed
                    this.progressManager.completeStory('Shepherds');
                    
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
        const questions = QUIZ_QUESTIONS.Shepherds;
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
                        this.progressManager.passQuiz('Shepherds');
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
        this.shepherds.update(deltaTime);
        this.angelParticles.update(deltaTime);
        
        // Pulsing angel light with more dramatic effect
        this.angelLight.intensity = 4 + Math.sin(Date.now() * 0.003) * 2;
        
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