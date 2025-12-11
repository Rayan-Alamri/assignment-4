# Rayan's Quest - RPG Portfolio Adventure

An interactive RPG-style portfolio web application built for **SWE363 - Assignment 4: Final Project**.
Experience a unique portfolio where you unlock developer information by completing quests in a 2D game world!

---

## Features

### RPG Game Experience
- **2D Game World**: Explore a village map with NPCs, collectibles, and interactive objects
- **4 Unique Quests**: Complete challenges to unlock portfolio content
  - **Lost Pages Quest**: Collect 3 scattered journal pages to unlock "About Me"
  - **Debug Computer Quest**: Solve a Simon-says style puzzle to unlock "Projects"
  - **Bug Invasion Quest**: Defeat 10 bug enemies in combat to unlock "Skills"
  - **Craftsman Quest**: Find 3 blueprints (unlocked after main quests) and forge a sword to reveal the "Best Project"
- **Progression System**: Earn XP, level up, and track your progress on the HUD
- **Minimap & Navigation**: Real-time minimap shows your location and objectives

### Portfolio Content (Unlockable)
- **About Me**: Developer bio and background
- **Projects**: Showcase of development work with descriptions
- **Skills**: Technical skills organized by category
- **Contact**: Contact form (unlocked after all 4 quests)
- **Best Project**: Special GitHub showcase via Craftsman quest

### Traditional Portfolio Features
- **Responsive layout**: Optimized for mobile, tablet, and desktop
- **Dark/Light theme toggle**: Persistent preference via localStorage
- **Advice of the Day**: Live quotes from the Advice Slip API
- **GitHub Integration**: Live feed of latest repositories
- **Contact Form**: Validation with inline feedback

---

## How to Play

1. **Start the Game**: Enter your name and click "Start Adventure"
2. **Movement**: Use WASD or Arrow keys to move
3. **Interact**: Press E or Space near NPCs and objects
4. **Attack**: Press Space to attack bugs
5. **Menu**: Press Escape to pause, I for inventory, Q for quest log

### Quest Guide
| Quest | Objective | Unlock |
|-------|-----------|--------|
| Lost Pages | Find 3 glowing pages around the map | About Me |
| Debug Computer | Complete the symbol memory puzzle | Projects |
| Bug Invasion | Defeat 10 bugs spawning in the south | Skills |
| Craftsman | Collect 3 blueprints, forge the sword | Best Project |

**Final Unlock**: Complete all 4 quests to unlock the Contact chest!

---

## Setup Instructions

1. **Clone this repository**
   ```bash
   git clone https://github.com/Rayan-Alamri/assignment-4.git
   cd assignment-4
   ```
2. **Open locally**
   - Simply open `index.html` in your browser, or
   - Use a Live Server extension in VS Code for hot reload
3. **Assets**
   - Images: `assets/images/`
   - Game sprites are procedurally generated via Canvas

---

## Project Structure

```
assignment-4/
├── index.html              # Main HTML with game container
├── css/
│   ├── style.css          # Traditional portfolio styles
│   └── game.css           # RPG game UI styles
├── js/
│   ├── script.js          # Portfolio interactivity
│   └── game.js            # RPG game engine (2000+ lines)
├── assets/
│   └── images/            # Project images
├── docs/
│   ├── technical-documentation.md
│   ├── ai-usage-report.md
│   └── images/
├── presentation/          # Video demo & slides (user-provided)
└── README.md
```

---

## AI Usage Summary

**Claude Code (Claude Opus 4.5) assisted in:**
- Designing the 4-quest unlock system architecture
- Implementing the Craftsman NPC and blueprint collection mechanics
- Bug enemy spawning, combat system, and XP/level progression
- Debugging NPC dialog state transitions and collision detection
- UI polish for unlock tracker, minimap, and reward popups
- Documentation structure and professional formatting

**My role (Rayan):**
- Planned the game concept and portfolio integration
- Implemented core game loop, rendering, and controls
- Designed the visual theme and CSS styling
- Tested gameplay balance and quest progression
- Verified accessibility and responsiveness

For the full log, see [`docs/ai-usage-report.md`](docs/ai-usage-report.md).

---

## Documentation

- **[Technical Documentation](docs/technical-documentation.md)** - Architecture, game logic, and implementation details
- **[AI Usage Report](docs/ai-usage-report.md)** - Detailed AI assistance breakdown
- **Presentation Materials**: `presentation/` folder (add demo video and slides)

---

## Live Demo

Available at: https://rayanassignment4.netlify.app/ *(update with actual URL)*

---

## License

This project is for academic purposes (KFUPM SWE363 - Assignment 4).
You may reuse or adapt it for learning.

---

**Maintainer:** Rayan Alamri
**Last Updated:** December 2025
