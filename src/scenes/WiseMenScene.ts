import * as THREE from 'three';
import { Scene } from './Scene';
import { WiseMen } from '../characters/WiseMen';
import { Dialog } from '../components/ui/Dialog';
import { HUD } from '../components/ui/HUD';
import { Quiz, QUIZ_QUESTIONS } from '../components/ui/Quiz';
import { SparkleParticles } from '../components/3d/ParticleSystem';
import { ProgressManager } from '../utils/ProgressManager';
import type { Game } from '../game/Game';
import gsap from 'gsap';

export class WiseMenScene extends Scene {
    private wiseMen: WiseMen;
    private dialog: Dialog;
    private hud: HUD;
    private quiz: Quiz;
    private starParticles: SparkleParticles;
    private progressManager: ProgressManager;
    private dialogueStep: number;
    private currentQuestionIndex: number;
    private ground: THREE.Mesh;
    private star: THREE.Mesh;
    private starLight: THREE.PointLight;

    constructor(game: Game) {
        super('WiseMen', game);
        
        this.wiseMen = new WiseMen(new THREE.Vector3(0, 0, 0));
        this.dialog = new Dialog();
        this.hud = new HUD();
        this.quiz = new Quiz();
        this.starParticles = new SparkleParticles();
        this.progressManager = ProgressManager.getInstance();
        this.dialogueStep = 0;
        this.currentQuestionIndex = 0;
        
        this.starLight = new THREE.PointLight(0xFFD700, 3, 25);
        
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
        
        // Set starLight position
        this.starLight.position.copy(star.position);
        this.scene.add(this.starLight);
        
        // Add particles around star
        this.starParticles.setPosition(0, 8, -5);
        this.scene.add(this.starParticles.getMesh());
        
        return star;
    }

    protected onLoad(): void {
        // Night sky
        this.scene.background = new THREE.Color(0x001133);
        this.enhancedLighting.setNightMode(true);
        
        this.scene.add(this.ground);
        this.scene.add(this.wiseMen.getMesh());
        this.scene.add(this.star);
        
        // Animate camera entrance
        this.camera.position.set(0, 8, 18);
        gsap.to(this.camera.position, {
            y: 4,
            z: 10,
            duration: 2.5,
            ease: 'power2.out',
            onUpdate: () => {
                this.camera.lookAt(0, 1, 0);
            }
        });
        
        // Animate wise men entrance
        this.wiseMen.getMesh().scale.set(0, 0, 0);
        gsap.to(this.wiseMen.getMesh().scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.5,
            delay: 1,
            ease: 'back.out(1.7)'
        });
        
        // Animate star
        this.star.scale.set(0, 0, 0);
        gsap.to(this.star.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 2,
            delay: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
        
        this.hud.setTitle('The Wise Men from the East');
        this.hud.setInstructions('Press SPACE to advance\nPress ESC for menu');
        this.hud.show();
        
        this.wiseMen.activate();
        setTimeout(() => this.advanceDialogue(), 3000);
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
                    this.progressManager.completeStory('WiseMen');
                    setTimeout(() => {
                        this.dialog.hide();
                        this.showQuiz();
                    }, 1000);
                }
            });
        }
    }

    private showQuiz(): void {
        const questions = QUIZ_QUESTIONS.WiseMen;
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
                        this.progressManager.passQuiz('WiseMen');
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
            z: 18,
            duration: 1.5,
            ease: 'power2.in',
            onComplete: () => {
                this.game.getSceneManager().switchScene('MainMenu');
            }
        });
    }

    protected onUpdate(deltaTime: number): void {
        this.wiseMen.update(deltaTime);
        this.starParticles.update(deltaTime);
        
        // Rotate and pulse the star
        this.star.rotation.z += 0.005;
        this.starLight.intensity = 2 + Math.sin(Date.now() * 0.002) * 1;
        
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