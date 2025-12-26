export class Loader {
    private models: { [key: string]: any } = {};
    private textures: { [key: string]: any } = {};
    private audio: { [key: string]: any } = {};

    constructor() {}

    public loadModel(name: string, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // Simulate loading a model
            setTimeout(() => {
                this.models[name] = `Model data for ${name} loaded from ${path}`;
                resolve(this.models[name]);
            }, 1000);
        });
    }

    public loadTexture(name: string, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // Simulate loading a texture
            setTimeout(() => {
                this.textures[name] = `Texture data for ${name} loaded from ${path}`;
                resolve(this.textures[name]);
            }, 1000);
        });
    }

    public loadAudio(name: string, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // Simulate loading audio
            setTimeout(() => {
                this.audio[name] = `Audio data for ${name} loaded from ${path}`;
                resolve(this.audio[name]);
            }, 1000);
        });
    }

    public getModel(name: string): any {
        return this.models[name];
    }

    public getTexture(name: string): any {
        return this.textures[name];
    }

    public getAudio(name: string): any {
        return this.audio[name];
    }
}