# Rayan's Quest
## Interactive Portfolio Web Application

**SWE363 - Final Project Presentation**

Rayan Alamri | 202247900

December 2025

---

# Introduction

## Project Overview

A **dual-experience portfolio** combining traditional web development with an innovative RPG game layer.

### Two Ways to Experience
1. **Traditional Portfolio** - Standard sections, responsive design, API integrations
2. **RPG Game Mode** - Unlock portfolio content through gameplay

### Objectives
- Build a complete, professional portfolio website
- Demonstrate HTML, CSS, and JavaScript proficiency
- Add creative interactivity through gamification
- Integrate external APIs and persist user preferences

---

# Introduction

## Personal Motivation

### Why This Approach?

- Wanted to showcase both **practical skills** and **creativity**
- Traditional portfolios demonstrate competence
- The game layer demonstrates innovation and ambition
- Combines everything learned in SWE363

### Target Audience
- Recruiters seeking technical skills (traditional view)
- Developers who appreciate creative projects (game mode)

---

# Technical Demonstration

## Portfolio Features Overview

### Core Sections
| Section | Features |
|---------|----------|
| About Me | Personal bio, education, interests |
| Projects | Expandable cards, filters, sorting |
| Skills | Categorized technical skills |
| Contact | Form validation, inline feedback |

### Enhancements
| Feature | Implementation |
|---------|----------------|
| Theme Toggle | Dark/Light mode with localStorage |
| Advice API | Live quotes from Advice Slip API |
| GitHub Feed | Latest repositories via GitHub API |
| Responsive | Mobile, tablet, desktop layouts |

---

# Technical Demonstration

## Traditional Portfolio - Key Features

### Responsive Design
- Mobile-first CSS with breakpoints at 768px and 480px
- Flexible layouts using Flexbox and Grid

### Accessibility
- Semantic HTML (header, main, section, footer)
- ARIA labels and live regions for screen readers
- prefers-reduced-motion support for animations

### State Persistence
- Theme preference saved to localStorage
- Visitor name remembered across sessions
- Login state and project visibility toggles

---

# Technical Demonstration

## API Integrations

### Advice Slip API
```javascript
fetch('https://api.adviceslip.com/advice')
  .then(res => res.json())
  .then(data => displayAdvice(data.slip.advice));
```
- Loading, success, and error states
- Manual refresh button
- Cache-busting with timestamps

### GitHub API
- Fetches latest public repositories
- Displays repo name, description, language
- Live refresh capability

---

# Technical Demonstration

## Innovative Feature: RPG Game Mode

### The Concept
Transform portfolio browsing into an **interactive adventure**

### Game Features
- 2D explorable village map with NPCs
- 4 quests that unlock portfolio sections
- Combat system with XP progression
- Mini-games and collectibles

### Why It Works
- Engages visitors longer than static pages
- Demonstrates advanced JavaScript skills
- Memorable and shareable experience

---

# Technical Demonstration

## Project Architecture

```
assignment-4/
├── index.html              # Single page with all content
├── css/
│   ├── style.css          # Portfolio (themes, layout, forms)
│   └── game.css           # RPG UI (HUD, dialogs, minimap)
├── js/
│   ├── script.js          # Portfolio (APIs, validation, toggle)
│   └── game.js            # Game engine (Canvas, quests)
├── assets/images/         # Project screenshots
└── docs/                  # Technical documentation
```

### Tech Stack
- **HTML5** - Semantic markup, Canvas element
- **CSS3** - Custom properties, animations, responsive
- **Vanilla JavaScript** - ES6 classes, Fetch API, localStorage

---

# Technical Demonstration

## AI Integration

### Tools Used
- **ChatGPT:** Portfolio foundation, validation logic, API patterns
- **Claude Code:** Game engine, quest system, documentation

### AI-Assisted Areas
| Area | AI Contribution |
|------|-----------------|
| Form Validation | Email confirmation, error messaging |
| API Integration | Fetch patterns, error handling |
| Game Architecture | State management, collision detection |
| Documentation | Structure and formatting |

### My Contributions
- Overall design and concept
- Visual styling and theming
- Content writing and testing
- Final implementation decisions

---

# Technical Deep Dive

## Most Challenging Aspects

### 1. Dual Experience Architecture
- Same content accessible via traditional UI and game
- Required careful state synchronization
- Solution: Shared content data, separate presentation layers

### 2. Form Validation with Good UX
- Inline errors without being intrusive
- Email confirmation matching
- Solution: Blur/input event handlers with ARIA updates

### 3. API Error Handling
- Network failures shouldn't break the experience
- Solution: Loading, success, error states with retry options

---

# Technical Deep Dive

## Innovative Solutions

### Theme System
- CSS custom properties for easy switching
- RPG-themed color palette (forest greens, parchment, gold)
- Smooth transitions between themes

### Responsive Design
- Portfolio adapts from mobile to desktop
- Game UI simplifies on smaller screens
- Touch-friendly interactions

### No External Dependencies
- Pure vanilla JavaScript throughout
- No frameworks or libraries
- Demonstrates fundamental understanding

---

# Technical Deep Dive

## Lessons Learned

### Web Development
- CSS custom properties simplify theming
- localStorage is powerful for UX personalization
- Semantic HTML improves accessibility significantly

### API Integration
- Always handle loading, success, and error states
- Cache-busting prevents stale data issues
- Consider rate limiting for public APIs

### Project Management
- Start with core features, add enhancements later
- Test incrementally throughout development
- Documentation alongside code saves time

---

# Conclusion

## Project Outcomes

### Achievements
- Complete, responsive portfolio website
- Working API integrations (Advice, GitHub)
- Accessible design with ARIA support
- Innovative RPG game layer
- Professional documentation

### Technical Metrics
- ~500 lines portfolio JavaScript
- ~2500 lines game engine
- ~800 lines portfolio CSS
- ~1700 lines game CSS
- 2 external API integrations

---

# Conclusion

## Future Improvements

### Portfolio Enhancements
- Backend for contact form submissions
- Blog section with markdown support
- Project filtering by technology

### Game Enhancements
- Save/Load game progress
- Sound effects and music
- Mobile touch controls

### Deployment
- CI/CD pipeline
- Performance monitoring
- Analytics integration

---

# Live Demo

## Demonstration Outline

1. **Traditional Portfolio View**
   - Navigate sections (About, Projects, Skills, Contact)
   - Toggle dark/light theme
   - Show Advice API and GitHub feed
   - Demonstrate form validation

2. **RPG Game Mode**
   - Start the adventure
   - Show quest and unlock system
   - Demonstrate combat and progression

---

# Thank You

## Rayan's Quest

**Live Demo:** https://rayanassignment4.netlify.app/

**GitHub:** https://github.com/Rayan-Alamri/assignment-4

**Documentation:** See /docs folder

### Questions?
