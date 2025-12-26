import * as THREE from 'three';
import { Character } from './Character';

export class Mary extends Character {
    constructor(position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
        const dialogue = [
            "I am Mary, chosen to bear God's son.",
            "An angel appeared to me, bringing news that changed my life forever.",
            "Though I was afraid, I trusted in the Lord's plan.",
            "I said, 'I am the Lord's servant. May it be as you have said.'",
            "The journey to Bethlehem was long and difficult, but I knew this child was special.",
            "When Jesus was born, my heart was filled with joy and wonder."
        ];
        
        super('Mary', 'The blessed mother of Jesus', position, dialogue);
    }

    protected createMesh(): void {
        // Create a simple representation of Mary with basic shapes
        const group = new THREE.Group();
        
        // Body (dress) - cone shape with enhanced materials
        const bodyGeometry = new THREE.ConeGeometry(0.4, 1.2, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x6495ED, // Cornflower blue
            metalness: 0.1,
            roughness: 0.7,
            emissive: 0x1a3a6e,
            emissiveIntensity: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFDBAC, // Skin tone
            metalness: 0.0,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.4;
        head.castShadow = true;
        head.receiveShadow = true;
        group.add(head);
        
        // Veil
        const veilGeometry = new THREE.ConeGeometry(0.25, 0.25, 16);
        const veilMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x87CEEB, // Sky blue
            metalness: 0.2,
            roughness: 0.5,
            transparent: true,
            opacity: 0.9
        });
        const veil = new THREE.Mesh(veilGeometry, veilMaterial);
        veil.position.y = 1.65;
        veil.castShadow = true;
        veil.receiveShadow = true;
        group.add(veil);
        
        // Add a gentle halo effect
        // const haloGeometry = new THREE.TorusGeometry(0.25, 0.02, 8, 32);
        // const haloMaterial = new THREE.MeshStandardMaterial({
        //     color: 0xFFD700,
        //     emissive: 0xFFD700,
        //     emissiveIntensity: 0.5,
        //     transparent: true,
        //     opacity: 0.6
        // });
        // const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        // halo.position.y = 1.75;
        // halo.rotation.x = Math.PI / 2;
        // group.add(halo);
        
        group.position.copy(this.position);
        this.mesh = group;
    }

    protected onUpdate(deltaTime: number): void {
        // Gentle swaying animation
        this.mesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
}