# Technical Documentation

**Project:** Rayan's Quest - RPG Portfolio Adventure
**Scope:** SWE363 - Assignment 4 (Final Project)
**Stack:** HTML5, CSS3, Canvas API, vanilla JavaScript

## 1) Overview

An innovative portfolio experience presented as a 2D RPG game. Players explore a village map, interact with NPCs, complete quests, and defeat enemies to progressively unlock traditional portfolio content (About, Projects, Skills, Contact). The game features a 4-quest unlock system with the unique "Craftsman Quest" serving as a meta-quest that ties all progression together.

## 2) Repository Structure

```
assignment-4/
├── index.html              # Entry point with game container and portfolio sections
├── css/
│   ├── style.css          # Traditional portfolio styles (theme, layout, forms)
│   └── game.css           # RPG game UI (HUD, dialogs, minimap, popups)
├── js/
│   ├── script.js          # Portfolio interactivity (scroll, accordion, API fetch)
│   └── game.js            # RPG game engine (~2500 lines)
├── assets/
│   └── images/            # Project screenshots and placeholders
├── docs/
│   ├── technical-documentation.md (this file)
│   ├── ai-usage-report.md
│   └── images/
├── presentation/          # Video demo and slides (user-provided)
└── README.md
```

## 3) Technologies & Conventions

- **HTML5**: Semantic sections, Canvas element for game rendering
- **CSS3**: Custom properties, Flexbox/Grid, CSS animations, pixel-art styling
- **JavaScript (ES6)**: Class-based game engine, Canvas 2D API, localStorage persistence
- **External API**: Advice Slip API, GitHub API for live repository feed

## 4) Game Architecture (`js/game.js`)

### 4.1 Core Game Class

```javascript
class RPGGame {
  constructor() {
    this.state = { ... };     // Game state (unlocks, progress, stats)
    this.player = { ... };    // Player position, stats, animation
    this.keys = { ... };      // Input state
    this.npcs = [];           // Non-player characters
    this.collectibles = [];   // Pickupable items
    this.enemies = [];        // Bug enemies
    // ...
  }
}
```

### 4.2 Game State Management

```javascript
this.state = {
  started: false,
  paused: false,
  currentMap: 'village',

  // 4-Quest Unlock System
  unlocked: {
    about: false,      // Lost Pages quest
    projects: false,   // Debug Computer quest
    skills: false,     // Bug Invasion quest
    contact: false     // Unlocked after all 4 challenges
  },

  // Progress tracking
  pagesFound: [],        // Array of collected page objects
  blueprintsFound: [],   // Array of collected blueprint objects
  bugsDefeated: 0,       // Counter for bug kills
  puzzleSolved: false,   // Computer debug mini-game

  // Player progression
  stats: { name, level, xp, hp, attack, gold },
  inventory: [],
  questLog: []
};
```

### 4.3 Game Loop

```javascript
gameLoop(currentTime) {
  const deltaTime = (currentTime - this.lastTime) / 1000;
  this.lastTime = currentTime;

  if (!this.state.paused) {
    this.update(deltaTime);  // Physics, AI, collisions
    this.render();           // Canvas drawing
  }

  this.animationId = requestAnimationFrame(t => this.gameLoop(t));
}
```

## 5) Quest System

### 5.1 Lost Pages Quest (About Me)
- **Objective**: Collect 3 glowing journal pages scattered around the map
- **Mechanic**: `checkCollectibles()` detects player proximity to page items
- **Completion**: Deliver pages to the Guide NPC
- **Unlock**: `unlockContent('about')`

### 5.2 Debug Computer Quest (Projects)
- **Objective**: Fix a glitched computer by completing a Simon-says puzzle
- **Mechanic**: `startPuzzleGame()` launches mini-game overlay
- **Completion**: Match 4-symbol sequence correctly
- **Unlock**: `unlockContent('projects')` via `puzzleSuccess()`

### 5.3 Bug Invasion Quest (Skills)
- **Objective**: Defeat 10 bug enemies
- **Mechanic**: `spawnBugWave()` creates enemies, combat via `attackEnemy()`
- **Completion**: `state.bugsDefeated >= 10`
- **Unlock**: `unlockContent('skills')`

### 5.4 Craftsman Quest (Best Project)
- **Objective**: Find 3 blueprints that appear AFTER completing main quests
- **Blueprint Locations**:
  - Database Blueprint: Appears after About unlocked
  - UI Design Blueprint: Appears after Projects unlocked
  - API Blueprint: Appears after Skills unlocked
- **Completion**: Return all 3 to Craftsman NPC, trigger `swordReady = true`
- **Reward**: View Best Project (MIPS CPU Simulator) with GitHub link

### 5.5 Contact Unlock
- **Condition**: All 4 challenges complete (`about && projects && skills && swordReady`)
- **Mechanic**: Locked chest in south becomes interactable
- **Unlock**: `unlockContent('contact')`

## 6) NPCs

### Guide NPC
- **Location**: Center of village (x: 480, y: 200)
- **Function**: Provides quest hints, tracks overall progress
- **Dialog Logic**: `getGuideDialog()` returns conditional dialog based on state

### Craftsman NPC
- **Location**: East side (x: 820, y: 280)
- **Function**: Meta-quest giver, receives blueprints, forges sword
- **Dialog Logic**: `getCraftsmanDialog()` checks `blueprintsFound.length` and `swordReady`
- **Special States**:
  - `forging`: Animation state during sword creation
  - `swordReady`: Final state, enables Best Project viewing

## 7) Collectibles System

```javascript
// Page collectible example
{
  id: 'page_1',
  type: 'page',
  x: 200, y: 150,
  collected: false,
  color: '#ffd700',
  content: { title: 'Journal Page 1', text: '...' }
}

// Blueprint collectible example
{
  id: 'blueprint_database',
  type: 'blueprint',
  x: 100, y: 400,
  collected: false,
  color: '#3498db',
  content: { title: 'Database Blueprint', ... },
  condition: () => this.state.unlocked.about  // Only appears after About unlocked
}
```

### Collection Logic (`checkCollectibles()`)
1. Loop through all collectibles
2. Check if player intersects with item bounds
3. If `type === 'page'`: Add to `pagesFound`, show notification
4. If `type === 'blueprint'`: Add to `blueprintsFound`, check if all 3 found
5. Mark item as `collected: true`, spawn pickup particles

## 8) Combat System

### Enemy Spawning
```javascript
spawnBugWave() {
  for (let i = 0; i < 3; i++) {
    this.enemies.push({
      id: `bug_${Date.now()}_${i}`,
      type: 'bug',
      x: randomX, y: randomY,
      hp: 20, maxHp: 20,
      damage: 5,
      speed: 1.5
    });
  }
}
```

### Attack Detection
```javascript
attackEnemy() {
  // Check if enemy in attack range
  if (this.boxCollision(attackBox, enemy)) {
    enemy.hp -= this.state.stats.attack;
    this.spawnDamageNumber(enemy.x, enemy.y, damage);

    if (enemy.hp <= 0) {
      this.state.bugsDefeated++;
      this.giveXP(15);
      // Check quest completion
      if (this.state.bugsDefeated >= 10) {
        this.unlockContent('skills');
      }
    }
  }
}
```

## 9) Unlock System (`unlockContent()`)

```javascript
unlockContent(type) {
  if (this.state.unlocked[type]) return;

  this.state.unlocked[type] = true;
  this.playSound('unlock');
  this.showRewardPopup(type);
  this.updateTrackerUI();

  // Save progress to localStorage
  localStorage.setItem('gameUnlocks', JSON.stringify(this.state.unlocked));
}
```

### Unlock Tracker HUD
Visual progress shown in top-center:
- Grayed icons for locked content
- Colored icons with checkmark for unlocked
- Progress counters (e.g., "2/3 pages")

## 10) Content Viewer

When content is unlocked, `showContentViewer(type)` displays:
- **About**: Bio, education, interests in styled "scroll" UI
- **Projects**: Project cards with descriptions and tech tags
- **Skills**: Categorized skill badges (Languages, Frameworks, Tools)
- **Contact**: In-game contact form with validation

## 11) CSS Architecture (`css/game.css`)

### Key Components
- **Game Container**: Fixed fullscreen overlay (`z-index: 9999`)
- **HUD**: Absolute positioned stats, unlock tracker, minimap
- **Dialog Box**: Bottom-center overlay with typewriter text
- **Mini-game Container**: Centered modal for puzzles
- **Content Viewer**: Parchment-styled scrollable panel

### Responsive Design
- Tablet (768px): Simplified HUD, hidden minimap
- Mobile (480px): Hidden unlock tracker, 2-column puzzle buttons

### Accessibility
- `prefers-reduced-motion`: Disables animations
- `prefers-contrast`: High contrast borders
- ARIA labels on interactive elements

## 12) Traditional Portfolio (`js/script.js`)

Retained from Assignment 3:
- Smooth scrolling with `prefers-reduced-motion` check
- Project accordion with ARIA states
- Advice API integration with error handling
- Form validation with inline feedback
- Theme toggle persistence

## 13) Performance Considerations

- **Canvas Rendering**: `requestAnimationFrame` for smooth 60fps
- **Sprite Caching**: Pre-rendered sprites stored in object
- **Collision Optimization**: Only check nearby objects
- **Lazy Loading**: Portfolio images use `loading="lazy"`
- **Minimal Dependencies**: No external libraries

## 14) Testing Checklist

### Game Tests
- [ ] Player movement responds to WASD/Arrow keys
- [ ] NPCs display correct dialog based on progress
- [ ] Pages/blueprints can be collected
- [ ] Bug enemies spawn and can be defeated
- [ ] Computer puzzle mini-game functions correctly
- [ ] Craftsman forges sword after 3 blueprints
- [ ] Contact chest unlocks after all 4 challenges
- [ ] Content viewers display correct information

### Portfolio Tests
- [ ] Theme toggle persists across reloads
- [ ] Advice API shows loading, success, error states
- [ ] Contact form validates all fields
- [ ] Responsive layout on mobile/tablet

## 15) Future Enhancements

- Save/Load game progress with full state serialization
- Additional maps (dungeon, forest)
- More enemy types with different behaviors
- Achievement system with badges
- Sound effects and background music toggle
- Multiplayer leaderboard for speedruns

---

**Maintainer:** Rayan Alamri
**Last Updated:** December 2025
