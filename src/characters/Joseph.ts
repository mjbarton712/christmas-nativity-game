import * as THREE from 'three';
import { Character } from './Character';

export class Joseph extends Character {
    constructor(position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
        const dialogue = [
            "I am Joseph, a carpenter from Nazareth.",
            "When I learned Mary was with child, I was troubled.",
            "But an angel came to me in a dream, saying 'Do not be afraid to take Mary as your wife.'",
            "The angel told me the child would save His people from their sins.",
            "I vowed to protect Mary and the child with all my strength.",
            "Finding no room at the inn was difficult, but God provided a stable for us."
        ];
        
        super('Joseph', 'Protector and earthly father of Jesus', position, dialogue);
    }

    protected createMesh(): void {
        const group = new THREE.Group();
        
        // Body (robe)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            flatShading: true 
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFDBAC,
            flatShading: true 
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.4;
        head.castShadow = true;
        group.add(head);
        
        // Beard
        const beardGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const beardMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4A4A4A,
            flatShading: true 
        });
        const beard = new THREE.Mesh(beardGeometry, beardMaterial);
        beard.position.set(0, 1.25, 0.15);
        beard.scale.set(1, 0.8, 0.7);
        beard.castShadow = true;
        group.add(beard);
        
        // Staff
        const staffGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.8);
        const staffMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x654321,
            flatShading: true 
        });
        const staff = new THREE.Mesh(staffGeometry, staffMaterial);
        staff.position.set(0.5, 0.9, 0);
        staff.castShadow = true;
        group.add(staff);
        
        group.position.copy(this.position);
        this.mesh = group;
    }

    protected onUpdate(deltaTime: number): void {
        this.mesh.position.y = this.position.y + Math.sin(Date.now() * 0.002) * 0.02;
    }
}