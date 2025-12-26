import * as THREE from 'three';

export abstract class Character {
    name: string;
    description: string;
    position: THREE.Vector3;
    mesh: THREE.Group;
    isActive: boolean;
    dialogue: string[];
    currentDialogueIndex: number;

    constructor(
        name: string, 
        description: string, 
        position: THREE.Vector3,
        dialogue: string[] = []
    ) {
        this.name = name;
        this.description = description;
        this.position = position;
        this.dialogue = dialogue;
        this.currentDialogueIndex = 0;
        this.isActive = false;
        this.mesh = new THREE.Group();
        this.createMesh();
    }

    protected abstract createMesh(): void;

    activate(): void {
        this.isActive = true;
        this.onActivate();
    }

    deactivate(): void {
        this.isActive = false;
        this.onDeactivate();
    }

    protected onActivate(): void {
        // Override in subclasses for specific behavior
    }

    protected onDeactivate(): void {
        // Override in subclasses for specific behavior
    }

    update(deltaTime: number): void {
        if (this.isActive) {
            this.onUpdate(deltaTime);
        }
    }

    protected onUpdate(deltaTime: number): void {
        // Override in subclasses for specific update logic
    }

    public getMesh(): THREE.Group {
        return this.mesh;
    }

    public getNextDialogue(): string | null {
        if (this.currentDialogueIndex < this.dialogue.length) {
            return this.dialogue[this.currentDialogueIndex++];
        }
        return null;
    }

    public resetDialogue(): void {
        this.currentDialogueIndex = 0;
    }

    public hasMoreDialogue(): boolean {
        return this.currentDialogueIndex < this.dialogue.length;
    }
}