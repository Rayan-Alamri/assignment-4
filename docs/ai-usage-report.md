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

### How AI Was Used
AI tools played a significant role in developing the RPG game portion of this project. While I designed the concept and made all creative decisions, AI assisted with implementing game mechanics and solving technical challenges.

### Development Breakdown
| Component | My Work | AI Assistance |
|-----------|---------|---------------|
| Project Concept | Conceived RPG portfolio idea, designed game flow | None |
| HTML/CSS | Wrote markup, created RPG visual theme | Minor styling suggestions |
| Portfolio Features | Implemented accordion, filters, validation | Helped with API integration patterns |
| Game Engine | Designed game loop structure, controls | Helped implement Canvas rendering, state management |
| Quest System | Designed 4-quest concept, wrote dialog content | Assisted with quest logic and unlock conditions |
| Craftsman Quest | Created blueprint collection idea | Helped implement conditional spawning |
| Combat System | Designed combat flow | Assisted with collision detection, enemy AI |
| NPC Dialogs | Wrote all dialog text and narratives | Helped with conditional dialog state system |
| Content Writing | Wrote all About, Projects, Skills text | None |
| Testing | All manual testing across browsers | Suggested edge cases to check |

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

### My Work (Rayan)
- Conceived the RPG portfolio concept and overall vision
- Designed the game flow, quest structure, and user experience
- Created the complete CSS theme (both portfolio and game UI)
- Wrote all HTML structure and semantic markup
- Wrote all portfolio content (About, Projects, Skills)
- Wrote all NPC dialog text and quest narratives
- Performed all testing, debugging, and balancing
- Made all creative and design decisions
- Reviewed and integrated all code into the project

### AI Tools Role (Significant for Game Development)
- Helped implement the game engine (Canvas rendering, game loop)
- Assisted with quest system logic and unlock conditions
- Helped build the combat system and collision detection
- Assisted with NPC conditional dialog state management
- Helped with Craftsman quest blueprint mechanics
- Provided debugging assistance throughout development

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

### AI as a Learning Tool
- AI helped explain concepts I then implemented myself
- Every suggestion was evaluated and often rewritten
- Understanding the "why" was prioritized over copy-pasting
- AI is a tool like any other - the developer does the work

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
