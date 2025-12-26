import { Game } from './game/Game';
import { MainMenuScene } from './scenes/MainMenuScene';
import { MaryJosephScene } from './scenes/MaryJosephScene';
import { InnkeeperScene } from './scenes/InnkeeperScene';
import { ShepherdsScene } from './scenes/ShepherdsScene';
import { WiseMenScene } from './scenes/WiseMenScene';

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const loadingScreen = document.getElementById('loading');

    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Initialize the game
    const game = new Game(canvas);
    const sceneManager = game.getSceneManager();

    // Register all scenes
    const mainMenuScene = new MainMenuScene(game);
    const maryJosephScene = new MaryJosephScene(game);
    const innkeeperScene = new InnkeeperScene(game);
    const shepherdsScene = new ShepherdsScene(game);
    const wiseMenScene = new WiseMenScene(game);

    sceneManager.registerScene('MainMenu', mainMenuScene);
    sceneManager.registerScene('MaryJoseph', maryJosephScene);
    sceneManager.registerScene('Innkeeper', innkeeperScene);
    sceneManager.registerScene('Shepherds', shepherdsScene);
    sceneManager.registerScene('WiseMen', wiseMenScene);

    // Start with main menu
    sceneManager.switchScene('MainMenu');

    // Hide loading screen and start game
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        game.start();
    }, 1000);

    console.log('🎄 Christmas Nativity Adventure loaded! 🎄');
});