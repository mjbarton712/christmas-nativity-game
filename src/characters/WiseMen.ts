import * as THREE from 'three';
import { Character } from './Character';

export class WiseMen extends Character {
    constructor(position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
        const dialogue = [
            "We are the Magi, wise men from the East.",
            "We studied the stars and saw a new star appear - brighter than all others.",
            "We knew this star signaled the birth of a great king.",
            "We traveled far, following the star to Jerusalem.",
            "King Herod asked us to find the child and report back.",
            "But the star led us to Bethlehem, to a humble place.",
            "We found the child with Mary and bowed down to worship Him.",
            "We presented our gifts: gold, frankincense, and myrrh.",
            "God warned us in a dream not to return to Herod, so we went home another way."
        ];
        
        super('Wise Men', 'The Magi who followed the star', position, dialogue);
    }

    protected createMesh(): void {
        const group = new THREE.Group();
        
        // Create 3 wise men with different colored robes
        const colors = [0x4B0082, 0x800020, 0x006400]; // Purple, burgundy, dark green
        
        for (let i = 0; i < 3; i++) {
            const wiseManGroup = new THREE.Group();
            
            // Body (ornate robe)
            const bodyGeometry = new THREE.CylinderGeometry(0.35, 0.45, 1.3, 8);
            const bodyMaterial = new THREE.MeshStandardMaterial({ 
                color: colors[i],
                flatShading: true 
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.65;
            body.castShadow = true;
            wiseManGroup.add(body);
            
            // Head
            const headGeometry = new THREE.SphereGeometry(0.18, 8, 8);
            const headMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xFFDBAC,
                flatShading: true 
            });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 1.4;
            head.castShadow = true;
            wiseManGroup.add(head);
            
            // Crown
            const crownGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.15, 8);
            const crownMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xFFD700,
                flatShading: true 
            });
            const crown = new THREE.Mesh(crownGeometry, crownMaterial);
            crown.position.y = 1.58;
            crown.castShadow = true;
            wiseManGroup.add(crown);
            
            // Gift box
            const giftGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const giftColors = [0xFFD700, 0xFFFFFF, 0x8B4513]; // Gold, white, brown
            const giftMaterial = new THREE.MeshStandardMaterial({ 
                color: giftColors[i],
                flatShading: true 
            });
            const gift = new THREE.Mesh(giftGeometry, giftMaterial);
            gift.position.set(0.35, 0.9, 0.2);
            gift.castShadow = true;
            wiseManGroup.add(gift);
            
            // Position wise men in a line
            wiseManGroup.position.set((i - 1) * 1.0, 0, 0);
            
            group.add(wiseManGroup);
        }
        
        group.position.copy(this.position);
        this.mesh = group;
    }

    protected onUpdate(deltaTime: number): void {
        // Regal, slow bobbing motion
        this.mesh.position.y = this.position.y + Math.sin(Date.now() * 0.001) * 0.03;
    }
}