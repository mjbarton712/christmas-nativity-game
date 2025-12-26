# Christmas Nativity Adventure 🎄✨

## Overview
The Christmas Nativity Adventure is an interactive 3D educational game that explores the birth of Jesus Christ from the perspectives of various characters, including Mary, Joseph, the Innkeeper, the Shepherds, and the Wise Men. Players engage with the story through immersive 3D scenes, character interactions, and educational dialogue.

## Features
- **Multiple Perspectives**: Experience the nativity story through the eyes of different characters
- **3D Animation**: Beautifully crafted 3D scenes with Three.js that bring the story to life
- **Interactive Gameplay**: Navigate through scenes and advance dialogue with keyboard controls
- **Educational Content**: Learn about the historical and spiritual significance of the nativity story
- **Character-Driven Narratives**: Each character shares their unique perspective and experience

## Project Structure
```
christmas-nativity-game/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── index.ts            # Entry point
│   ├── game/               # Core game engine
│   │   ├── Game.ts         # Main game class with Three.js renderer
│   │   ├── SceneManager.ts # Manages scene transitions
│   │   └── InputManager.ts # Handles keyboard/mouse input
│   ├── characters/         # Character classes
│   │   ├── Character.ts    # Base character class
│   │   ├── Mary.ts         # Mary character with 3D model
│   │   ├── Joseph.ts       # Joseph character
│   │   ├── Innkeeper.ts    # Innkeeper character
│   │   ├── Shepherds.ts    # Shepherds characters
│   │   └── WiseMen.ts      # Wise Men characters
│   ├── scenes/             # Game scenes
│   │   ├── Scene.ts        # Base scene class
│   │   ├── MainMenuScene.ts
│   │   ├── MaryJosephScene.ts
│   │   ├── InnkeeperScene.ts
│   │   ├── ShepherdsScene.ts
│   │   └── WiseMenScene.ts
│   ├── components/         # UI and 3D components
│   │   ├── ui/
│   │   │   ├── Dialog.ts   # Dialogue box system
│   │   │   ├── HUD.ts      # Heads-up display
│   │   │   └── Menu.ts     # Main menu
│   │   └── 3d/
│   │       ├── Camera.ts
│   │       ├── Model.ts
│   │       └── Animation.ts
│   ├── utils/
│   │   ├── Constants.ts    # Game constants
│   │   └── Loader.ts       # Asset loader
│   └── types/
│       └── index.ts        # TypeScript type definitions
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   cd christmas-nativity-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production
To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:
```bash
npm run preview
```

## Gameplay

### Controls
- **SPACE**: Advance dialogue
- **ESC**: Return to main menu
- **Mouse**: Interact with menu buttons

### How to Play
1. Start the game from the main menu
2. Select a character's story to explore:
   - **Mary & Joseph**: Experience their journey to Bethlehem
   - **The Innkeeper**: Learn about the night the inn was full
   - **The Shepherds**: Witness the angelic announcement
   - **The Wise Men**: Follow the star from the East

3. Read through each character's dialogue to learn their unique perspective
4. Use SPACE to advance through the story
5. Return to the menu to explore other characters' stories

## Character Stories

### Mary & Joseph
Experience the journey of Mary and Joseph as they travel to Bethlehem for the census. Learn about Mary's faith when the angel appeared to her, and Joseph's protective love for his family.

### The Innkeeper
Discover the perspective of the Bethlehem innkeeper who, despite having no rooms available, offered the stable to Mary and Joseph. Little did he know he was hosting the birth of the King of Kings.

### The Shepherds
Join the shepherds in the fields as they witness the spectacular angelic announcement. Experience their joy and urgency as they rush to see the newborn Savior.

### The Wise Men
Follow the Magi from the East as they track the star that led them to Jesus. Learn about their gifts of gold, frankincense, and myrrh, and what they symbolize.

## Technologies Used
- **Three.js** (v0.160.0): 3D graphics library
- **TypeScript** (v5.3.3): Type-safe JavaScript
- **Vite** (v5.0.10): Fast build tool and dev server
- **GSAP** (v3.12.5): Animation library

## Educational Value
This game helps players:
- Understand the nativity story from multiple perspectives
- Learn about the historical context of Jesus's birth
- Appreciate the different roles each character played
- Engage with scripture in an interactive, memorable way

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

### Future Enhancements
- Add more detailed 3D models using GLTF/GLB format
- Include background music and sound effects
- Add more interactive elements (clickable objects, mini-games)
- Create additional scenes (journey from Egypt, etc.)
- Implement save/progress system
- Add multiple language support

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments
- Biblical narrative from the Gospels of Matthew and Luke
- Inspired by the timeless story of Christmas
- Created with love for educational purposes

---

**Merry Christmas! May this game help you and others appreciate the true meaning of Christmas.** 🎄⭐