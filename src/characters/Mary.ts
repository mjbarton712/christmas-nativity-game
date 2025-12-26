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
        
        // Body (dress) - cone shape
        const bodyGeometry = new THREE.ConeGeometry(0.4, 1.2, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x6495ED, // Cornflower blue
            flatShading: true 
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFDBAC, // Skin tone
            flatShading: true 
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.4;
        head.castShadow = true;
        group.add(head);
        
        // Veil
        const veilGeometry = new THREE.ConeGeometry(0.25, 0.5, 8);
        const veilMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x87CEEB, // Sky blue
            flatShading: true 
        });
        const veil = new THREE.Mesh(veilGeometry, veilMaterial);
        veil.position.y = 1.65;
        veil.castShadow = true;
        group.add(veil);
        
        group.position.copy(this.position);
        this.mesh = group;
    }

    protected onUpdate(deltaTime: number): void {
        // Gentle swaying animation
        this.mesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
}