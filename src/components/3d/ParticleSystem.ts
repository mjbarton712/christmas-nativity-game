import * as THREE from 'three';

export interface ParticleConfig {
    count?: number;
    color?: number;
    size?: number;
    sizeAttenuation?: boolean;
    transparent?: boolean;
    opacity?: number;
    speed?: number;
    spread?: number;
    lifetime?: number;
    emissionRate?: number;
}

export class ParticleSystem {
    private particles: THREE.Points;
    private particleCount: number;
    private velocities: Float32Array;
    private lifetimes: Float32Array;
    private maxLifetime: number;
    private emissionRate: number;
    private timeSinceLastEmission: number;
    private config: Required<ParticleConfig>;
    private particleIndex: number;

    constructor(config: ParticleConfig = {}) {
        this.config = {
            count: config.count ?? 100,
            color: config.color ?? 0xFFFFFF,
            size: config.size ?? 0.1,
            sizeAttenuation: config.sizeAttenuation ?? true,
            transparent: config.transparent ?? true,
            opacity: config.opacity ?? 0.6,
            speed: config.speed ?? 1.0,
            spread: config.spread ?? 1.0,
            lifetime: config.lifetime ?? 3.0,
            emissionRate: config.emissionRate ?? 10
        };

        this.particleCount = this.config.count;
        this.maxLifetime = this.config.lifetime;
        this.emissionRate = this.config.emissionRate;
        this.timeSinceLastEmission = 0;
        this.particleIndex = 0;

        this.velocities = new Float32Array(this.particleCount * 3);
        this.lifetimes = new Float32Array(this.particleCount);

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);

        // Initialize all particles as inactive
        for (let i = 0; i < this.particleCount; i++) {
            this.lifetimes[i] = -1;
            sizes[i] = this.config.size;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: this.config.size,
            color: this.config.color,
            transparent: this.config.transparent,
            opacity: this.config.opacity,
            sizeAttenuation: this.config.sizeAttenuation,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
    }

    public getMesh(): THREE.Points {
        return this.particles;
    }

    public setPosition(x: number, y: number, z: number): void {
        this.particles.position.set(x, y, z);
    }

    public emitParticle(position: THREE.Vector3, velocity?: THREE.Vector3): void {
        const positions = this.particles.geometry.attributes.position;
        const colors = this.particles.geometry.attributes.color;
        const i = this.particleIndex;

        // Set position
        positions.setXYZ(i, position.x, position.y, position.z);

        // Set velocity
        if (velocity) {
            this.velocities[i * 3] = velocity.x;
            this.velocities[i * 3 + 1] = velocity.y;
            this.velocities[i * 3 + 2] = velocity.z;
        } else {
            // Random velocity
            this.velocities[i * 3] = (Math.random() - 0.5) * this.config.spread;
            this.velocities[i * 3 + 1] = Math.random() * this.config.speed;
            this.velocities[i * 3 + 2] = (Math.random() - 0.5) * this.config.spread;
        }

        // Set color (with slight variation)
        const color = new THREE.Color(this.config.color);
        const variation = 0.2;
        color.r += (Math.random() - 0.5) * variation;
        color.g += (Math.random() - 0.5) * variation;
        color.b += (Math.random() - 0.5) * variation;
        colors.setXYZ(i, color.r, color.g, color.b);

        // Set lifetime
        this.lifetimes[i] = this.maxLifetime;

        this.particleIndex = (this.particleIndex + 1) % this.particleCount;
    }

    public update(deltaTime: number): void {
        const positions = this.particles.geometry.attributes.position;
        const sizes = this.particles.geometry.attributes.size;

        // Update emission
        this.timeSinceLastEmission += deltaTime;
        const emissionInterval = 1.0 / this.emissionRate;

        while (this.timeSinceLastEmission >= emissionInterval) {
            this.emitParticle(new THREE.Vector3(0, 0, 0));
            this.timeSinceLastEmission -= emissionInterval;
        }

        // Update existing particles
        for (let i = 0; i < this.particleCount; i++) {
            if (this.lifetimes[i] > 0) {
                // Update lifetime
                this.lifetimes[i] -= deltaTime;

                if (this.lifetimes[i] <= 0) {
                    // Particle died
                    positions.setXYZ(i, 0, -1000, 0); // Move far away
                    sizes.setX(i, 0);
                } else {
                    // Update position
                    const x = positions.getX(i);
                    const y = positions.getY(i);
                    const z = positions.getZ(i);

                    positions.setXYZ(
                        i,
                        x + this.velocities[i * 3] * deltaTime,
                        y + this.velocities[i * 3 + 1] * deltaTime,
                        z + this.velocities[i * 3 + 2] * deltaTime
                    );

                    // Update size and opacity based on lifetime
                    const lifeFraction = this.lifetimes[i] / this.maxLifetime;
                    const size = this.config.size * lifeFraction;
                    sizes.setX(i, size);
                }
            }
        }

        positions.needsUpdate = true;
        sizes.needsUpdate = true;
    }

    public dispose(): void {
        this.particles.geometry.dispose();
        (this.particles.material as THREE.Material).dispose();
    }
}

// Pre-configured particle systems
export class SparkleParticles extends ParticleSystem {
    constructor() {
        super({
            count: 150,
            color: 0xFFD700,
            size: 0.15,
            speed: 0.5,
            spread: 2.0,
            lifetime: 2.0,
            emissionRate: 20,
            opacity: 0.8
        });
    }
}

export class SnowParticles extends ParticleSystem {
    constructor() {
        super({
            count: 300,
            color: 0xFFFFFF,
            size: 0.08,
            speed: 0.3,
            spread: 5.0,
            lifetime: 10.0,
            emissionRate: 15,
            opacity: 0.7
        });
    }

    public update(deltaTime: number): void {
        super.update(deltaTime);
        
        // Add gentle swaying to snow
        const positions = this.getMesh().geometry.attributes.position;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            const sway = Math.sin(time + i * 0.1) * 0.02;
            positions.setX(i, x + sway);
        }
        positions.needsUpdate = true;
    }
}

export class AngelGlowParticles extends ParticleSystem {
    constructor() {
        super({
            count: 200,
            color: 0xFFFFAA,
            size: 0.2,
            speed: 0.2,
            spread: 0.5,
            lifetime: 3.0,
            emissionRate: 30,
            opacity: 0.5
        });
    }
}
