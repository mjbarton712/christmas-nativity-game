import * as THREE from 'three';
import { Character } from './Character';

export class Innkeeper extends Character {
    constructor(position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
        const dialogue = [
            "I am the innkeeper of Bethlehem.",
            "That night, so many travelers came seeking shelter.",
            "The census had brought countless people to register in their ancestral town.",
            "When Mary and Joseph arrived, I had no rooms left.",
            "I could see they were weary, and Mary was heavy with child.",
            "I offered them the stable - it wasn't much, but it was warm and dry.",
            "Little did I know that the King of Kings would be born under my roof that night."
        ];
        
        super('Innkeeper', 'The keeper of the Bethlehem inn', position, dialogue);
    }

    protected createMesh(): void {
        const group = new THREE.Group();
        
        // Body (tunic)
        const bodyGeometry = new THREE.CylinderGeometry(0.35, 0.4, 1.2, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B0000,
            flatShading: true 
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.22, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFDBAC,
            flatShading: true 
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.4;
        head.castShadow = true;
        group.add(head);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 6);
        const armMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B0000,
            flatShading: true 
        });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.4, 0.9, 0);
        leftArm.rotation.z = Math.PI / 4;
        leftArm.castShadow = true;
        group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.4, 0.9, 0);
        rightArm.rotation.z = -Math.PI / 4;
        rightArm.castShadow = true;
        group.add(rightArm);
        
        group.position.copy(this.position);
        this.mesh = group;
    }

    protected onUpdate(deltaTime: number): void {
        const time = Date.now() * 0.002;
        const leftArm = this.mesh.children[2] as THREE.Mesh;
        const rightArm = this.mesh.children[3] as THREE.Mesh;
        
        if (leftArm && rightArm) {
            leftArm.rotation.z = Math.PI / 4 + Math.sin(time) * 0.2;
            rightArm.rotation.z = -Math.PI / 4 - Math.sin(time) * 0.2;
        }
    }
}