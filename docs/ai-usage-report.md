# AI Usage Report

**Course / Assignment:** SWE363 - Assignment 4 (Final Project)
**Student:** Rayan Alamri - 202247900
**Repo:** https://github.com/Rayan-Alamri/assignment-4
**Session Dates:** November - December 2025

---

## 1) Tools Used & Concrete Use Cases

### Phase 1: Portfolio Foundation (Assignment 3)
- **ChatGPT**
  - Expanded complex UI logic: filters/sorting, login toggle, timer, greeting memory
  - Refined validation logic (email confirmation, minimum message length)
  - Supported Advice Slip API integration with loading/error handling
  - Offered accessibility/performance suggestions (lazy images, aspect-ratio, reveals)

### Phase 2: RPG Game Development (Assignment 4)
- **Claude Code (Claude Opus 4.5)**
  - Designed the 4-quest unlock system architecture
  - Implemented the Craftsman NPC with conditional dialog states
  - Created blueprint collectible system with quest-gated visibility
  - Built combat system: enemy spawning, attack detection, XP rewards
  - Developed Simon-says puzzle mini-game for Debug Computer quest
  - Designed unlock tracker HUD with progress indicators
  - Debugged NPC dialog state transitions and collision detection
  - Implemented reward popup animations and content viewer panels
  - Polished UI elements: minimap, damage numbers, particle effects
  - Structured documentation (README, technical docs, this report)

### Development Tools
- **VS Code + Live Server**: Rapid preview during CSS and game development
- **Chrome DevTools**: Debugging Canvas rendering, localStorage, collision boxes
- **Git**: Version control for iterative development

---

## 2) AI Assistance Breakdown by Feature

### Craftsman Quest Implementation
| Component | AI Contribution | My Contribution |
|-----------|-----------------|-----------------|
| Quest Design | Suggested blueprint-gating mechanic | Defined 3 main quests as prerequisites |
| NPC Dialog | Provided conditional dialog structure | Wrote quest narrative and hints |
| Forging Animation | Suggested particle system approach | Implemented timing and visual effects |
| Sword Ready State | Helped with state management pattern | Integrated with overall unlock system |

### Combat System
| Component | AI Contribution | My Contribution |
|-----------|-----------------|-----------------|
| Enemy Spawning | Provided wave-based spawn logic | Balanced enemy stats and spawn rate |
| Attack Detection | Suggested box collision approach | Implemented attack hitbox directions |
| XP/Level System | Structured progression formulas | Tuned XP rewards for game balance |
| Damage Numbers | Provided floating text animation | Styled with game's visual theme |

### Mini-Game (Debug Computer)
| Component | AI Contribution | My Contribution |
|-----------|-----------------|-----------------|
| Puzzle Logic | Suggested Simon-says pattern | Chose symbols and sequence length |
| UI Layout | Provided grid button layout | Styled with pixel-art aesthetic |
| Success/Failure | Helped with state transitions | Added retry mechanism and hints |

---

## 3) Benefits & Challenges

### Benefits
- **Faster Iteration**: AI-assisted debugging reduced time spent on collision detection issues
- **Architecture Guidance**: Structured approach to state management prevented spaghetti code
- **Documentation Quality**: AI helped maintain consistent formatting across docs
- **Complex Feature Development**: Craftsman quest's conditional logic would have taken much longer solo

### Challenges
- **Context Switching**: Moving between AI tools (ChatGPT for portfolio, Claude for game) required re-explaining project context
- **Game Balance**: AI suggestions needed manual tuning for fun gameplay
- **Integration Complexity**: Merging AI-generated code with existing game loop required careful refactoring
- **Canvas Debugging**: AI couldn't visually see rendering issues, required detailed descriptions

---

## 4) Understanding & Rationale

### Why 4 Quests?
The portfolio has 4 main sections (About, Projects, Skills, Contact). Each quest thematically connects to its unlock:
- **Lost Pages** = Discovering the developer's story (About)
- **Debug Computer** = Technical problem-solving (Projects)
- **Bug Invasion** = Combat skills representing technical skills (Skills)
- **Craftsman** = Culminating achievement, best work (Best Project)

### Why Craftsman Quest is Special
The Craftsman quest requires completing the other 3 first, creating a meta-progression layer. This:
- Encourages full exploration of the game
- Provides a satisfying "final boss" equivalent
- Showcases the developer's best project with narrative weight

### State Management Approach
Using a single `state` object with nested `unlocked` flags allows:
- Easy serialization to localStorage
- Clear conditional checks in dialog trees
- Centralized progress tracking

---

## 5) Responsibilities & Collaboration

### Student (Rayan)
- Conceived the RPG portfolio concept
- Designed the village map layout and NPC placement
- Implemented core game loop and Canvas rendering
- Created pixel-art styled CSS theme
- Wrote all portfolio content (About, Projects, Skills)
- Tested gameplay flow and quest progression
- Made final decisions on game balance and UX

### AI Assistants
- **ChatGPT**: Portfolio interactivity, validation, API integration (Phase 1)
- **Claude Code**: Game engine architecture, quest systems, debugging, documentation (Phase 2)

---

## 6) Innovation & Creativity

- **Gamified Portfolio**: Transforms static resume into interactive adventure
- **Conditional Content**: Information earned through gameplay, not given freely
- **Multi-Quest Dependency**: Craftsman quest creates meta-progression
- **Procedural Sprites**: No external image assets for game characters
- **Integrated Experience**: Game and traditional portfolio coexist

---

## 7) Learning Outcomes

### Technical Skills Gained
- Canvas 2D API for game rendering
- Game loop architecture with deltaTime
- Complex state machines for NPC dialog
- Collision detection algorithms
- Particle systems and visual effects

### Soft Skills Developed
- Iterating on AI suggestions rather than accepting blindly
- Breaking complex features into manageable tasks
- Balancing feature scope with time constraints
- Writing clear documentation for future maintainers

### AI Collaboration Insights
- AI excels at boilerplate and patterns, humans excel at creativity and judgment
- Detailed prompts with context yield better results
- Code review of AI output is essential, not optional
- AI accelerates development but doesn't replace understanding

---

## 8) Session Log (Recent)

### December 2025 - Final Polish
- Added Craftsman forging animation with particle effects
- Fixed blueprint visibility conditions
- Implemented sword ready state rendering
- Updated all documentation for submission
- Created presentation folder structure

---

**Maintainer:** Rayan Alamri
**Last Updated:** December 2025
