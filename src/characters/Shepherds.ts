import * as THREE from 'three';
import { Character } from './Character';

export class Shepherds extends Character {
    constructor(position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
        const dialogue = [
            "We are shepherds, watching our flocks by night.",
            "The fields were quiet until the sky suddenly filled with light!",
            "An angel appeared and said, 'Do not be afraid. I bring you good news of great joy.'",
            "The angel told us a Savior had been born in Bethlehem - Christ the Lord!",
            "Then a great company of angels appeared, praising God.",
            "We ran to Bethlehem and found the baby, just as the angel said.",
            "We spread the word about this amazing child!"
        ];
        
        super('Shepherds', 'The first to hear of Jesus\' birth', position, dialogue);
    }

    protected createMesh(): void {
        const group = new THREE.Group();
        
        // Create 3 shepherds in a small group
        for (let i = 0; i < 3; i++) {
            const shepherdGroup = new THREE.Group();
            
            // Body (simple robe)
            const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.0, 8);
            const bodyMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x696969,
                flatShading: true 
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.5;
            body.castShadow = true;
            shepherdGroup.add(body);
            
            // Head
            const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
            const headMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xFFDBAC,
                flatShading: true 
            });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 1.15;
            head.castShadow = true;
            shepherdGroup.add(head);
            
            // Shepherd's crook
            const crookGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.3);
            const crookMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x8B4513,
                flatShading: true 
            });
            const crook = new THREE.Mesh(crookGeometry, crookMaterial);
            crook.position.set(0.3, 0.65, 0);
            crook.castShadow = true;
            shepherdGroup.add(crook);
            
            // Position shepherds in a semi-circle
            const angle = (i - 1) * 0.6;
            shepherdGroup.position.set(
                Math.sin(angle) * 0.8,
                0,
                Math.cos(angle) * 0.8
            );
            
            group.add(shepherdGroup);
        }
        
        // Add a small sheep
        const sheepBody = new THREE.SphereGeometry(0.2, 8, 8);
        const sheepMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,
            flatShading: true 
        });
        const sheep = new THREE.Mesh(sheepBody, sheepMaterial);
        sheep.position.set(1.2, 0.2, 0);
        sheep.scale.set(1, 0.8, 1.2);
        sheep.castShadow = true;
        group.add(sheep);
        
        group.position.copy(this.position);
        this.mesh = group;
    }

    protected onUpdate(deltaTime: number): void {
        // Gentle rotation of the group
        this.mesh.rotation.y = Math.sin(Date.now() * 0.0005) * 0.3;
    }
}