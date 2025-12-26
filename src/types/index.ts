export type CharacterType = 'WiseMen' | 'Shepherds' | 'Mary' | 'Joseph' | 'Innkeeper';

export interface Character {
    name: string;
    type: CharacterType;
    dialogue: string[];
    position: { x: number; y: number; z: number };
}

export interface Scene {
    title: string;
    description: string;
    characters: Character[];
}

export interface GameConfig {
    title: string;
    version: string;
    initialScene: string;
}