import * as THREE from 'three';
import { EffectComposer } from 'postprocessing';
import { RenderPass } from 'postprocessing';
import { EffectPass } from 'postprocessing';
import { BloomEffect } from 'postprocessing';
import { GodRaysEffect } from 'postprocessing';
import { VignetteEffect } from 'postprocessing';

export class PostProcessingManager {
    private composer: EffectComposer;
    private bloomEffect: BloomEffect;
    private godRaysEffect: GodRaysEffect | null;
    private vignetteEffect: VignetteEffect;
    private sunLight: THREE.DirectionalLight | null;

    constructor(
        renderer: THREE.WebGLRenderer,
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera
    ) {
        this.composer = new EffectComposer(renderer);
        this.sunLight = null;
        this.godRaysEffect = null;

        // Add render pass
        const renderPass = new RenderPass(scene, camera);
        this.composer.addPass(renderPass);

        // Create bloom effect for magical glow
        this.bloomEffect = new BloomEffect({
            intensity: 1.2,
            luminanceThreshold: 0.15,
            luminanceSmoothing: 0.9,
            mipmapBlur: true
        });

        // Create vignette effect for cinematic look
        this.vignetteEffect = new VignetteEffect({
            darkness: 0.5,
            offset: 0.3
        });

        // Add effects pass
        const effectPass = new EffectPass(
            camera,
            this.bloomEffect,
            this.vignetteEffect
        );
        this.composer.addPass(effectPass);
    }

    public addGodRays(
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        sunPosition: THREE.Vector3
    ): void {
        // Create sun mesh for god rays
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            fog: false
        });
        const sunGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.copy(sunPosition);
        scene.add(sun);

        // Create god rays effect
        this.godRaysEffect = new GodRaysEffect(camera, sun, {
            density: 0.6,
            decay: 0.95,
            weight: 0.4,
            exposure: 0.6,
            samples: 60,
            clampMax: 1.0
        });

        // Add new pass with god rays
        const effectPass = new EffectPass(
            camera,
            this.bloomEffect,
            this.vignetteEffect,
            this.godRaysEffect
        );
        
        // Replace the last pass
        this.composer.removePass(this.composer.passes[this.composer.passes.length - 1]);
        this.composer.addPass(effectPass);
    }

    public setBloomIntensity(intensity: number): void {
        this.bloomEffect.intensity = intensity;
    }

    public setVignetteDarkness(darkness: number): void {
        this.vignetteEffect.uniforms.get('darkness')!.value = darkness;
    }

    public render(deltaTime: number): void {
        this.composer.render(deltaTime);
    }

    public setSize(width: number, height: number): void {
        this.composer.setSize(width, height);
    }

    public dispose(): void {
        this.composer.dispose();
    }
}

export class EnhancedLighting {
    private scene: THREE.Scene;
    private ambientLight: THREE.AmbientLight;
    private mainLight: THREE.DirectionalLight;
    private fillLight: THREE.DirectionalLight;
    private rimLight: THREE.PointLight;
    private time: number;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.time = 0;

        // Ambient light for base illumination
        this.ambientLight = new THREE.AmbientLight(0x404080, 0.4);
        this.scene.add(this.ambientLight);

        // Main directional light (sun/moon)
        this.mainLight = new THREE.DirectionalLight(0xFFFFE0, 1.2);
        this.mainLight.position.set(10, 15, 10);
        this.mainLight.castShadow = true;
        
        // Enhanced shadow settings
        this.mainLight.shadow.camera.left = -15;
        this.mainLight.shadow.camera.right = 15;
        this.mainLight.shadow.camera.top = 15;
        this.mainLight.shadow.camera.bottom = -15;
        this.mainLight.shadow.camera.near = 0.1;
        this.mainLight.shadow.camera.far = 50;
        this.mainLight.shadow.mapSize.width = 2048;
        this.mainLight.shadow.mapSize.height = 2048;
        this.mainLight.shadow.bias = -0.0001;
        this.mainLight.shadow.radius = 3; // Softer shadows
        
        this.scene.add(this.mainLight);

        // Fill light for softer shadows
        this.fillLight = new THREE.DirectionalLight(0x8080FF, 0.3);
        this.fillLight.position.set(-5, 5, -5);
        this.scene.add(this.fillLight);

        // Rim light for character highlights
        this.rimLight = new THREE.PointLight(0xFFD700, 0.8, 20);
        this.rimLight.position.set(0, 5, -5);
        this.scene.add(this.rimLight);
    }

    public update(deltaTime: number): void {
        this.time += deltaTime;
        
        // Gentle light animation
        this.mainLight.intensity = 1.2 + Math.sin(this.time * 0.5) * 0.1;
        this.rimLight.intensity = 0.8 + Math.sin(this.time * 0.8) * 0.2;
    }

    public setTimeOfDay(hour: number): void {
        // hour should be 0-24
        const normalized = hour / 24;
        
        if (hour < 6 || hour > 20) {
            // Night time - blue tint
            this.mainLight.color.setHex(0x8080FF);
            this.ambientLight.color.setHex(0x202040);
            this.mainLight.intensity = 0.3;
        } else if (hour >= 6 && hour < 8) {
            // Dawn - orange/pink
            this.mainLight.color.setHex(0xFFCC80);
            this.ambientLight.color.setHex(0x404060);
            this.mainLight.intensity = 0.8;
        } else if (hour >= 18 && hour <= 20) {
            // Dusk - orange/red
            this.mainLight.color.setHex(0xFF8844);
            this.ambientLight.color.setHex(0x604040);
            this.mainLight.intensity = 0.9;
        } else {
            // Day time - warm white
            this.mainLight.color.setHex(0xFFFFE0);
            this.ambientLight.color.setHex(0x606080);
            this.mainLight.intensity = 1.2;
        }
    }

    public setNightMode(isNight: boolean): void {
        if (isNight) {
            this.setTimeOfDay(22); // 10 PM
        } else {
            this.setTimeOfDay(14); // 2 PM
        }
    }

    public getMainLight(): THREE.DirectionalLight {
        return this.mainLight;
    }

    public dispose(): void {
        this.scene.remove(this.ambientLight);
        this.scene.remove(this.mainLight);
        this.scene.remove(this.fillLight);
        this.scene.remove(this.rimLight);
    }
}
