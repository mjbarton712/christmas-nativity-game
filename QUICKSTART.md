# 🎄 Christmas Nativity Adventure - Quick Start Guide 🎄

## What We've Built
A beautiful 3D interactive educational game that tells the story of Jesus's birth from multiple perspectives!

## Features Implemented
✅ **Core Game Engine**
- Three.js-powered 3D rendering
- Scene management system
- Keyboard/mouse input handling
- Smooth transitions between scenes

✅ **5 Interactive Scenes**
1. **Main Menu** - Beautiful starfield with character selection
2. **Mary & Joseph** - Their journey to Bethlehem
3. **The Innkeeper** - The night at the inn
4. **The Shepherds** - The angelic announcement
5. **The Wise Men** - Following the star

✅ **Character System**
- 5 unique characters with custom 3D models (using simple geometry)
- Each character has 6-9 dialogue lines
- Animated movements and interactions

✅ **UI Components**
- Professional dialogue system
- HUD with instructions
- Interactive menu system

## How to Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Your Browser
The game will automatically open at `http://localhost:3000`

## Controls
- **SPACE**: Advance dialogue
- **ESC**: Return to main menu
- **MOUSE**: Click menu buttons

## Game Flow
1. Main menu with starfield background
2. Click on any character to hear their story
3. Read through their dialogue (press SPACE to advance)
4. Automatically returns to menu when story completes
5. Explore all 4 character perspectives!

## Technical Details
- Built with TypeScript for type safety
- Uses Three.js for 3D graphics
- Vite for fast development and building
- All characters use procedural geometry (no external 3D models needed)

## Character Highlights

### Mary & Joseph (6 dialogues each, alternating)
- Mary's acceptance of God's plan
- Joseph's protective role
- Their journey to Bethlehem

### The Innkeeper (7 dialogues)
- The busy night of the census
- Offering the stable
- Witnessing history

### The Shepherds (7 dialogues)
- Watching flocks by night
- The angelic announcement
- Rushing to see Jesus

### The Wise Men (9 dialogues)
- Following the star
- Bringing gifts
- Avoiding Herod

## Production Build
When ready to deploy:
```bash
npm run build
npm run preview
```

## Merry Christmas! 🌟
Enjoy exploring the nativity story through this interactive 3D experience!
