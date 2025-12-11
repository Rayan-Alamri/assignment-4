/**
 * 🎮 RPG PORTFOLIO GAME ENGINE v2.0
 * Event & Reward System - Earn information through gameplay!
 */

class RPGGame {
  constructor() {
    // Game state
    this.state = {
      started: false,
      paused: false,
      currentMap: 'village',

      // Unlockable content - LOCKED by default!
      unlocked: {
        about: false,
        projects: false,
        skills: false,
        contact: false
      },

      // Collection progress
      pagesFound: [],
      blueprintsFound: [],
      bugsDefeated: 0,
      puzzleSolved: false,

      // Player stats
      stats: {
        name: localStorage.getItem('visitorName') || 'Adventurer',
        level: 1,
        xp: 0,
        xpToLevel: 100,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        attack: 10,
        gold: 0
      },

      // Inventory
      inventory: [],
      questLog: []
    };

    // Player
    this.player = {
      x: 480,
      y: 320,
      width: 32,
      height: 32,
      speed: 4,
      direction: 'down',
      frame: 0,
      animTimer: 0,
      isMoving: false,
      isAttacking: false,
      attackTimer: 0,
      invincible: false,
      invincibleTimer: 0
    };

    // Input state
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      interact: false,
      attack: false
    };

    // Game objects
    this.npcs = [];
    this.interactables = [];
    this.collectibles = [];
    this.enemies = [];
    this.particles = [];
    this.projectiles = [];

    // Mini-game states
    this.miniGame = {
      active: false,
      type: null,
      data: {}
    };

    // Dialog
    this.dialog = {
      active: false,
      speaker: '',
      text: '',
      fullText: '',
      charIndex: 0,
      options: [],
      callback: null
    };

    // UI state
    this.ui = {
      inventoryOpen: false,
      questLogOpen: false,
      menuOpen: false,
      notification: null,
      notificationTimer: 0,
      notificationQueue: []
    };

    // Animation
    this.lastTime = 0;
    this.animationId = null;

    // Canvas
    this.canvas = null;
    this.ctx = null;

    // Audio
    this.audioCtx = null;
    this.soundEnabled = true;

    // Sprites cache
    this.sprites = {};

    // Mobile detection
    this.isMobile = this.detectMobile();

    this.init();
  }

  /**
   * Detect mobile device using User-Agent string
   * Returns true if the device is a mobile/tablet
   */
  detectMobile() {
    const userAgent = navigator.userAgent || '';

    // Regular expression to match common mobile device identifiers
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|Tablet/i;

    // Also check for touch capability as a fallback
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Check screen size as additional indicator
    const isSmallScreen = window.innerWidth <= 1024 || window.innerHeight <= 768;

    const isMobileDevice = mobileRegex.test(userAgent);

    console.log(`[Mobile Detection] User-Agent: ${userAgent.substring(0, 50)}...`);
    console.log(`[Mobile Detection] Is Mobile: ${isMobileDevice}, Has Touch: ${hasTouch}, Small Screen: ${isSmallScreen}`);

    return isMobileDevice || (hasTouch && isSmallScreen);
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Apply mobile class to document for CSS targeting
    if (this.isMobile) {
      document.documentElement.classList.add('is-mobile-device');
      document.body.classList.add('is-mobile-device');
    }

    this.createGameUI();
    this.setupCanvas();
    this.setupGameObjects();
    this.setupControls();
    this.createSprites();
    this.initAudio();
    this.showStartScreen();
  }

  createGameUI() {
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.innerHTML = `
      <!-- Landscape Orientation Notice -->
      <div id="orientation-notice">
        <div class="orientation-content">
          <div class="orientation-icon">📱</div>
          <p>Rotate your device for a better experience</p>
          <div class="orientation-arrow">↻</div>
        </div>
      </div>

      <div id="game-screen">
        <canvas id="game-canvas"></canvas>

        <!-- HUD -->
        <div id="game-hud">
          <div class="hud-left">
            <div class="hud-stats">
              <div class="stat-bar hp-bar">
                <span class="stat-icon">❤️</span>
                <div class="stat-track"><div class="stat-fill" id="hp-fill"></div></div>
                <span class="stat-value" id="hp-value">100/100</span>
              </div>
              <div class="stat-bar xp-bar">
                <span class="stat-icon">⭐</span>
                <div class="stat-track"><div class="stat-fill" id="xp-fill"></div></div>
                <span class="stat-value" id="xp-value">0/100</span>
              </div>
            </div>
            <div class="hud-info">
              <span id="player-name">Adventurer</span>
              <span id="player-level">LVL 1</span>
            </div>
          </div>

          <div class="hud-center">
            <div class="unlock-tracker">
              <div class="unlock-item" id="unlock-about" data-tooltip="About Me - Find 3 Lost Pages">
                <span class="unlock-icon">📜</span>
                <span class="unlock-progress">0/3</span>
              </div>
              <div class="unlock-item" id="unlock-projects" data-tooltip="Projects - Debug the Computer">
                <span class="unlock-icon">💻</span>
                <span class="unlock-progress">🔒</span>
              </div>
              <div class="unlock-item" id="unlock-skills" data-tooltip="Skills - Defeat Bug Invasion">
                <span class="unlock-icon">⚔️</span>
                <span class="unlock-progress">0/10</span>
              </div>
              <div class="unlock-item" id="unlock-contact" data-tooltip="Contact - Complete all challenges">
                <span class="unlock-icon">✉️</span>
                <span class="unlock-progress">🔒</span>
              </div>
            </div>
          </div>

          <div class="hud-right">
            <span id="gold-display">💰 0</span>
          </div>
        </div>

        <!-- Minimap -->
        <div id="minimap">
          <canvas id="minimap-canvas" width="150" height="100"></canvas>
          <div class="map-legend">
            <span>📜 Pages</span>
            <span>💻 Computer</span>
            <span>🐛 Bugs</span>
          </div>
        </div>

        <!-- Dialog Box -->
        <div id="dialog-box" class="hidden">
          <div class="dialog-portrait" id="dialog-portrait"></div>
          <div class="dialog-content">
            <div class="dialog-speaker" id="dialog-speaker"></div>
            <div class="dialog-text" id="dialog-text"></div>
            <div class="dialog-options" id="dialog-options"></div>
          </div>
          <div class="dialog-continue">▼ SPACE</div>
        </div>

        <!-- Mini-Game Container -->
        <div id="minigame-container" class="hidden">
          <div id="minigame-content"></div>
        </div>

        <!-- Reward Popup -->
        <div id="reward-popup" class="hidden">
          <div class="reward-content">
            <h2 id="reward-title">🎉 UNLOCKED!</h2>
            <div id="reward-icon"></div>
            <p id="reward-text"></p>
            <button class="pixel-btn" id="reward-close">Continue</button>
          </div>
        </div>

        <!-- Inventory Screen -->
        <div id="inventory-screen" class="hidden">
          <div class="inventory-header">
            <h2>🎒 INVENTORY</h2>
            <button class="close-btn" id="close-inventory">✕</button>
          </div>
          <div class="inventory-sections">
            <div class="inventory-section">
              <h3>📜 Lost Pages (${this.state?.pagesFound?.length || 0}/3)</h3>
              <div class="inventory-grid" id="pages-grid"></div>
            </div>
            <div class="inventory-section">
              <h3>💻 Projects</h3>
              <div class="inventory-grid" id="projects-grid"></div>
            </div>
            <div class="inventory-section">
              <h3>⚔️ Skills</h3>
              <div class="inventory-grid" id="skills-grid"></div>
            </div>
          </div>
        </div>

        <!-- Unlocked Content Viewer -->
        <div id="content-viewer" class="hidden">
          <div class="content-header">
            <h2 id="content-title"></h2>
            <button class="close-btn" id="close-content">✕</button>
          </div>
          <div id="content-body"></div>
        </div>

        <!-- Start Screen -->
        <div id="start-screen">
          <div class="start-content">
            <div class="title-art">
              <div class="pixel-castle"></div>
            </div>
            <h1 class="game-title">RAYAN'S QUEST</h1>
            <p class="game-subtitle">🗡️ A Portfolio Adventure 🛡️</p>

            <div class="start-story">
              <p>The ancient knowledge of the Developer lies scattered across the land...</p>
              <p>Collect <strong>Lost Pages</strong>, <strong>Debug</strong> broken machines, and defeat the <strong>Bug Invasion</strong> to unlock the secrets!</p>
            </div>

            <div class="start-input">
              <label for="hero-name">Enter your name, Hero:</label>
              <input type="text" id="hero-name" maxlength="12" placeholder="Adventurer">
            </div>
            <button id="start-game-btn" class="pixel-btn pulse">▶ BEGIN ADVENTURE</button>

            <div class="start-controls">
              <div class="control-group">
                <span class="key">WASD</span> Move
              </div>
              <div class="control-group">
                <span class="key">SPACE</span> Interact
              </div>
              <div class="control-group">
                <span class="key">J</span> Attack
              </div>
              <div class="control-group">
                <span class="key">I</span> Inventory
              </div>
            </div>
          </div>
        </div>

        <!-- Pause Menu -->
        <div id="pause-menu" class="hidden">
          <div class="pause-content">
            <h2>⏸️ PAUSED</h2>
            <div class="pause-stats">
              <p>Pages Found: <span id="pause-pages">0</span>/3</p>
              <p>Bugs Defeated: <span id="pause-bugs">0</span>/10</p>
              <p>Computer: <span id="pause-computer">Not Debugged</span></p>
            </div>
            <button class="pixel-btn" id="resume-btn">▶ Resume</button>
            <button class="pixel-btn" id="sound-toggle-btn">🔊 Sound: ON</button>
            <button class="pixel-btn" id="view-portfolio-btn">📄 Portfolio Mode</button>
            <button class="pixel-btn" id="quit-btn">🚪 Quit</button>
          </div>
        </div>

        <!-- Notification -->
        <div id="notification" class="hidden"></div>

        <!-- Combat UI -->
        <div id="combat-ui" class="hidden">
          <div class="combo-counter">
            <span id="combo-count">0</span>
            <span class="combo-label">COMBO</span>
          </div>
        </div>

        <!-- Controls hint -->
        <div id="controls-hint">
          <span><kbd>WASD</kbd> Move</span>
          <span><kbd>SPACE</kbd> Interact</span>
          <span><kbd>J</kbd> Attack</span>
        </div>

        <!-- Mobile Controls -->
        <div id="mobile-controls">
          <div class="mobile-dpad">
            <button class="dpad-btn dpad-up" data-dir="up">▲</button>
            <button class="dpad-btn dpad-left" data-dir="left">◀</button>
            <button class="dpad-btn dpad-right" data-dir="right">▶</button>
            <button class="dpad-btn dpad-down" data-dir="down">▼</button>
          </div>
          <div class="mobile-actions">
            <button class="action-btn action-attack" data-action="attack">⚔️</button>
            <button class="action-btn action-interact" data-action="interact">💬</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertBefore(gameContainer, document.body.firstChild);

    // Mode toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'mode-toggle';
    toggleBtn.className = 'pixel-btn mode-toggle';
    toggleBtn.innerHTML = '📄 Portfolio';
    toggleBtn.addEventListener('click', () => this.toggleMode());
    document.body.appendChild(toggleBtn);
  }

  setupCanvas() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.ctx.imageSmoothingEnabled = false;
  }

  resizeCanvas() {
    const container = document.getElementById('game-screen');
    const isMobile = window.innerWidth <= 768;

    // Fixed internal game resolution for consistent gameplay
    const gameWidth = 960;
    const gameHeight = 640;

    // Set internal canvas resolution (game world size)
    this.canvas.width = gameWidth;
    this.canvas.height = gameHeight;

    // Calculate display size to fit container while maintaining aspect ratio
    const containerWidth = container.clientWidth || window.innerWidth;
    const containerHeight = container.clientHeight || window.innerHeight;
    const mobileControlsHeight = isMobile ? 150 : 0;

    const availableWidth = containerWidth - 8; // Account for borders
    const availableHeight = containerHeight - mobileControlsHeight - 8;

    const aspectRatio = gameWidth / gameHeight;
    let displayWidth = availableWidth;
    let displayHeight = displayWidth / aspectRatio;

    if (displayHeight > availableHeight) {
      displayHeight = availableHeight;
      displayWidth = displayHeight * aspectRatio;
    }

    // Set CSS display size
    this.canvas.style.width = Math.floor(displayWidth) + 'px';
    this.canvas.style.height = Math.floor(displayHeight) + 'px';

    if (this.ctx) this.ctx.imageSmoothingEnabled = false;
  }

  setupGameObjects() {
    // Clear existing
    this.npcs = [];
    this.interactables = [];
    this.collectibles = [];
    this.enemies = [];

    // === LOST PAGES (About Me) ===
    this.collectibles.push({
      id: 'page_1',
      type: 'page',
      x: 120,
      y: 100,
      width: 24,
      height: 24,
      collected: false,
      content: {
        title: "Page 1: Origin",
        text: "I'm Rayan Alamri, a CS student at KFUPM."
      }
    });

    this.collectibles.push({
      id: 'page_2',
      type: 'page',
      x: 800,
      y: 450,
      width: 24,
      height: 24,
      collected: false,
      content: {
        title: "Page 2: Passion",
        text: "I enjoy turning small ideas into working prototypes and refining them with feedback."
      }
    });

    this.collectibles.push({
      id: 'page_3',
      type: 'page',
      x: 200,
      y: 520,
      width: 24,
      height: 24,
      collected: false,
      content: {
        title: "Page 3: Journey",
        text: "Lately I have been exploring web development and automation to solve everyday problems."
      }
    });

    // === BROKEN COMPUTER (Projects) ===
    this.interactables.push({
      id: 'broken_computer',
      type: 'computer',
      x: 700,
      y: 150,
      width: 48,
      height: 48,
      fixed: false,
      glitchFrame: 0
    });

    // === BLUEPRINT COLLECTIBLES (Craftsman Fetch Quest) ===
    // Each blueprint only appears after completing a main quest
    this.collectibles.push({
      id: 'blueprint_database',
      type: 'blueprint',
      x: 750,
      y: 100,
      width: 24,
      height: 24,
      collected: false,
      requiresUnlock: 'about', // Appears after delivering pages
      label: 'DB',
      content: {
        title: "🗄️ Database",
        text: "Backend data architecture blueprint - handles all storage needs."
      }
    });

    this.collectibles.push({
      id: 'blueprint_ui',
      type: 'blueprint',
      x: 700,
      y: 350,
      width: 24,
      height: 24,
      collected: false,
      requiresUnlock: 'projects', // Appears after debugging computer
      label: 'UI',
      content: {
        title: "🎨 UI Design",
        text: "Frontend interface blueprint - creates beautiful user experiences."
      }
    });

    this.collectibles.push({
      id: 'blueprint_api',
      type: 'blueprint',
      x: 200,
      y: 350,
      width: 24,
      height: 24,
      collected: false,
      requiresUnlock: 'skills', // Appears after bug invasion
      label: 'API',
      content: {
        title: "🔌 API",
        text: "System integration blueprint - connects all the pieces together."
      }
    });

    // === MASTER CRAFTSMAN NPC (Best GitHub Project) ===
    this.npcs.push({
      id: 'craftsman',
      name: 'Craftsman',
      x: 820,
      y: 280,
      width: 32,
      height: 32,
      color: '#e67e22',
      portrait: '⚒️',
      dialog: this.getCraftsmanDialog(),
      swordReady: false
    });

    // === BUG SPAWNER (Skills) ===
    this.interactables.push({
      id: 'bug_nest',
      type: 'nest',
      x: 100,
      y: 350,
      width: 40,
      height: 40,
      activated: false,
      wavesCleared: 0
    });

    // === GUIDE NPC ===
    this.npcs.push({
      id: 'guide',
      name: 'Guide',
      x: 450,
      y: 200,
      width: 32,
      height: 32,
      color: '#3498db',
      portrait: '🧍',
      dialog: this.getGuideDialog()
    });

    // === LOCKED CHEST (Contact - unlocks after all challenges) ===
    this.interactables.push({
      id: 'contact_chest',
      type: 'locked_chest',
      x: 480,
      y: 500,
      width: 32,
      height: 32,
      unlocked: false
    });

    // Decorations
    this.setupDecorations();
  }

  setupDecorations() {
    // Trees (collision objects)
    this.interactables.push(
      { id: 'tree1', type: 'tree', x: 50, y: 50, width: 40, height: 40 },
      { id: 'tree2', type: 'tree', x: 880, y: 80, width: 40, height: 40 },
      { id: 'tree3', type: 'tree', x: 60, y: 450, width: 40, height: 40 },
      { id: 'tree4', type: 'tree', x: 850, y: 520, width: 40, height: 40 },
      { id: 'tree5', type: 'tree', x: 400, y: 60, width: 40, height: 40 }
    );

    // Rocks
    this.interactables.push(
      { id: 'rock1', type: 'rock', x: 300, y: 400, width: 28, height: 28 },
      { id: 'rock2', type: 'rock', x: 650, y: 350, width: 28, height: 28 }
    );

    // Sign
    this.interactables.push({
      id: 'sign_welcome',
      type: 'sign',
      x: 520,
      y: 280,
      width: 24,
      height: 32,
      message: "Welcome to the Developer's Village!\n\n📜 Find 3 Lost Pages\n💻 Debug the Computer\n🐛 Defeat 10 Bugs\n✉️ Unlock the Contact Chest"
    });
  }

  getGuideDialog() {
    const craftsman = this.npcs.find(n => n.id === 'craftsman');
    const swordReady = craftsman?.swordReady || false;

    return [
      // Initial state - no progress
      {
        condition: () => this.state.pagesFound.length === 0 && !this.state.unlocked.about && !this.state.unlocked.projects && !this.state.unlocked.skills,
        text: "Welcome, brave adventurer! I am your Guide.\n\nTo unlock the Developer's portfolio, you must complete 4 CHALLENGES:\n\n📜 Collect 3 Lost Pages (About Me)\n💻 Debug the Computer (Projects)\n🐛 Defeat 10 Bugs (Skills)\n⚒️ Help the Craftsman (Best Project)\n\nAsk me for detailed instructions!",
        options: [
          { text: "📜 Lost Pages?", action: 'hint_pages' },
          { text: "💻 Debug Computer?", action: 'hint_computer' },
          { text: "🐛 Fight Bugs?", action: 'hint_bugs' },
          { text: "⚒️ Craftsman?", action: 'hint_craftsman' },
          { text: "I'll explore!", action: 'close' }
        ]
      },
      // Found some pages but not all
      {
        condition: () => this.state.pagesFound.length > 0 && this.state.pagesFound.length < 3 && !this.state.unlocked.about,
        text: `📜 You found ${this.state.pagesFound.length}/3 Lost Pages!\n\nKeep searching for the rest. They glow golden!\n\nOnce you have all 3, bring them back to me.`,
        options: [
          { text: "Where are the others?", action: 'hint_pages' },
          { text: "I'll keep looking!", action: 'close' }
        ]
      },
      // Found all 3 pages - deliver them
      {
        condition: () => this.state.pagesFound.length >= 3 && !this.state.unlocked.about,
        text: "📜 You found ALL 3 Lost Pages!\n\nLet me assemble them into the Developer's biography...",
        options: [
          { text: "📜 Deliver the pages!", action: 'deliver_pages' }
        ]
      },
      // Some progress but not all done (including craftsman)
      {
        condition: () => (this.state.unlocked.about || this.state.unlocked.projects || this.state.unlocked.skills || swordReady) && !(this.state.unlocked.about && this.state.unlocked.projects && this.state.unlocked.skills && swordReady),
        text: `Progress Report:\n\n${this.state.unlocked.about ? '✅' : '❌'} About Me (Lost Pages)\n${this.state.unlocked.projects ? '✅' : '❌'} Projects (Debug Computer)\n${this.state.unlocked.skills ? '✅' : '❌'} Skills (Bug Invasion)\n${swordReady ? '✅' : '❌'} Best Project (Craftsman)\n\nKeep going, adventurer!`,
        options: [
          { text: "📜 Pages help", action: 'hint_pages' },
          { text: "💻 Computer help", action: 'hint_computer' },
          { text: "🐛 Bugs help", action: 'hint_bugs' },
          { text: "⚒️ Craftsman help", action: 'hint_craftsman' },
          { text: "Thanks!", action: 'close' }
        ]
      },
      // All 4 done - unlock contact
      {
        condition: () => this.state.unlocked.about && this.state.unlocked.projects && this.state.unlocked.skills && swordReady && !this.state.unlocked.contact,
        text: "🎉 CONGRATULATIONS!\n\nYou've completed all 4 challenges!\n\nThe CONTACT CHEST in the south is now unlocked. Open it to complete your quest!",
        options: [
          { text: "Thanks for your help!", action: 'close' }
        ]
      },
      // Everything done
      {
        condition: () => this.state.unlocked.contact,
        text: "🏆 You've unlocked EVERYTHING!\n\nPress 'I' to see your Inventory.\n\nOr click '📄 Portfolio' to switch to normal view.\n\nWell done, adventurer!",
        options: [
          { text: "This was fun!", action: 'close' }
        ]
      }
    ];
  }

  getCraftsmanDialog() {
    const craftsman = this.npcs.find(n => n.id === 'craftsman');
    const bpCount = this.state.blueprintsFound.length;

    return [
      // No blueprints yet - explain the requirements
      {
        condition: () => bpCount === 0 && !craftsman?.swordReady,
        text: "⚒️ Greetings! I am the Master Craftsman.\n\nI lost my 3 BLUEPRINTS, but they are protected by ancient magic!\n\n📊 Database - appears after unlocking ABOUT\n🎨 UI Design - appears after unlocking PROJECTS\n🔌 API - appears after unlocking SKILLS\n\nComplete the 3 main quests first!",
        options: [
          { text: "I'll complete the quests!", action: 'close' }
        ]
      },
      // Some blueprints found
      {
        condition: () => bpCount > 0 && bpCount < 3 && !craftsman?.swordReady,
        text: `⚒️ You found ${bpCount}/3 blueprints!\n\n${this.state.blueprintsFound.map(b => '✓ ' + b.content.title).join('\n')}\n\nKeep searching! The blueprints glow blue.`,
        options: [
          { text: "I'll find the rest!", action: 'close' }
        ]
      },
      // All 3 found - deliver them
      {
        condition: () => bpCount >= 3 && !craftsman?.swordReady,
        text: "⚒️ INCREDIBLE! You found ALL 3 blueprints!\n\n✓ 📊 The Database\n✓ 🎨 The UI Design\n✓ 🔌 The API\n\nNow I can build my masterpiece!",
        options: [
          { text: "⚒️ Build the sword!", action: 'build_sword' }
        ]
      },
      // Sword built - show best project
      {
        condition: () => craftsman?.swordReady,
        text: "⚒️ Behold! The MASTER SWORD!\n\nIt represents the Developer's BEST PROJECT:\n\n🗡️ MIPS CPU Simulator\nA single-cycle CPU in Logisim\n\n🔗 View it on GitHub!",
        options: [
          { text: "🔗 Open GitHub", action: 'open_github' },
          { text: "Amazing!", action: 'close' }
        ]
      }
    ];
  }

  setupControls() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // UI buttons
    document.getElementById('start-game-btn')?.addEventListener('click', () => this.startGame());
    document.getElementById('hero-name')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.startGame();
    });
    document.getElementById('close-inventory')?.addEventListener('click', () => this.toggleInventory());
    document.getElementById('close-content')?.addEventListener('click', () => this.closeContentViewer());
    document.getElementById('resume-btn')?.addEventListener('click', () => this.togglePause());
    document.getElementById('sound-toggle-btn')?.addEventListener('click', () => this.toggleSound());
    document.getElementById('view-portfolio-btn')?.addEventListener('click', () => this.toggleMode());
    document.getElementById('quit-btn')?.addEventListener('click', () => this.quitToTitle());
    document.getElementById('reward-close')?.addEventListener('click', () => this.closeRewardPopup());

    this.setupTouchControls();
  }

  setupTouchControls() {
    let touchStartX = 0;
    let touchStartY = 0;

    this.canvas?.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    this.canvas?.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      this.keys.left = dx < -30;
      this.keys.right = dx > 30;
      this.keys.up = dy < -30;
      this.keys.down = dy > 30;
    });

    this.canvas?.addEventListener('touchend', () => {
      this.keys.left = false;
      this.keys.right = false;
      this.keys.up = false;
      this.keys.down = false;
    });

    // Double tap to interact/attack
    let lastTap = 0;
    this.canvas?.addEventListener('touchend', () => {
      const now = Date.now();
      if (now - lastTap < 300) {
        if (this.enemies.length > 0) {
          this.playerAttack();
        } else {
          this.handleInteract();
        }
      }
      lastTap = now;
    });

    // Mobile D-pad controls
    document.querySelectorAll('.dpad-btn').forEach(btn => {
      const dir = btn.dataset.dir;

      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.keys[dir] = true;
      });

      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.keys[dir] = false;
      });

      // Also handle mouse for testing on desktop
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.keys[dir] = true;
      });

      btn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        this.keys[dir] = false;
      });

      btn.addEventListener('mouseleave', () => {
        this.keys[dir] = false;
      });
    });

    // Mobile action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
      const action = btn.dataset.action;

      const handleAction = (e) => {
        e.preventDefault();
        if (action === 'attack') {
          this.playerAttack();
        } else if (action === 'interact') {
          if (this.dialog.active) {
            this.advanceDialog();
          } else {
            this.handleInteract();
          }
        }
      };

      btn.addEventListener('touchstart', handleAction);
      btn.addEventListener('click', handleAction);
    });
  }

  handleKeyDown(e) {
    if (!this.state.started) return;

    // Allow typing in inputs/textareas
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const key = e.key.toLowerCase();

    // Prevent default for game keys
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'e', 'j', 'i', 'escape'].includes(key)) {
      e.preventDefault();
    }

    // If mini-game is active, pass to mini-game handler
    if (this.miniGame.active) {
      this.handleMiniGameInput(key);
      return;
    }

    // Movement
    if (key === 'w' || key === 'arrowup') this.keys.up = true;
    if (key === 's' || key === 'arrowdown') this.keys.down = true;
    if (key === 'a' || key === 'arrowleft') this.keys.left = true;
    if (key === 'd' || key === 'arrowright') this.keys.right = true;

    // Interact
    if (key === ' ' || key === 'e') {
      if (this.dialog.active) {
        this.advanceDialog();
      } else {
        this.handleInteract();
      }
    }

    // Attack
    if (key === 'j') {
      this.playerAttack();
    }

    // UI toggles
    if (key === 'i') this.toggleInventory();
    if (key === 'escape') {
      if (this.miniGame.active) this.closeMiniGame();
      else if (this.ui.inventoryOpen) this.toggleInventory();
      else if (this.dialog.active) this.closeDialog();
      else this.togglePause();
    }
  }

  handleKeyUp(e) {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') this.keys.up = false;
    if (key === 's' || key === 'arrowdown') this.keys.down = false;
    if (key === 'a' || key === 'arrowleft') this.keys.left = false;
    if (key === 'd' || key === 'arrowright') this.keys.right = false;
  }

  createSprites() {
    this.sprites = {
      player: this.createPlayerSprite(),
      playerAttack: this.createPlayerAttackSprite(),
      bug: this.createBugSprite(),
      page: this.createPageSprite()
    };
  }

  createPlayerSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Hero character
    ctx.fillStyle = '#f39c12'; // Hair
    ctx.fillRect(10, 2, 12, 8);

    ctx.fillStyle = '#ffeaa7'; // Skin
    ctx.fillRect(10, 8, 12, 8);

    ctx.fillStyle = '#3498db'; // Shirt
    ctx.fillRect(6, 16, 20, 10);

    ctx.fillStyle = '#2c3e50'; // Pants
    ctx.fillRect(8, 26, 6, 6);
    ctx.fillRect(18, 26, 6, 6);

    // Eyes
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(12, 10, 2, 2);
    ctx.fillRect(18, 10, 2, 2);

    // Sword on back
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(26, 8, 3, 16);
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(26, 6, 3, 4);

    return canvas;
  }

  createPlayerAttackSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Copy player
    ctx.drawImage(this.createPlayerSprite(), 0, 0);

    // Sword swing
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(32, 8, 14, 4);
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(32, 10, 14, 2);

    return canvas;
  }

  createBugSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d');

    // Bug body
    ctx.fillStyle = '#8e44ad';
    ctx.fillRect(6, 8, 12, 10);

    // Head
    ctx.fillStyle = '#9b59b6';
    ctx.fillRect(8, 4, 8, 6);

    // Eyes (red, angry)
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(9, 5, 2, 2);
    ctx.fillRect(13, 5, 2, 2);

    // Legs
    ctx.fillStyle = '#6c3483';
    ctx.fillRect(4, 10, 4, 2);
    ctx.fillRect(16, 10, 4, 2);
    ctx.fillRect(4, 14, 4, 2);
    ctx.fillRect(16, 14, 4, 2);

    return canvas;
  }

  createPageSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d');

    // Scroll
    ctx.fillStyle = '#f4e8d0';
    ctx.fillRect(4, 2, 16, 20);

    // Scroll ends
    ctx.fillStyle = '#d4a574';
    ctx.fillRect(2, 2, 4, 20);
    ctx.fillRect(18, 2, 4, 20);

    // Text lines
    ctx.fillStyle = '#5c4a3a';
    ctx.fillRect(7, 6, 10, 2);
    ctx.fillRect(7, 10, 8, 2);
    ctx.fillRect(7, 14, 10, 2);

    return canvas;
  }

  initAudio() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this.soundEnabled = false;
    }
  }

  playSound(type) {
    if (!this.soundEnabled || !this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    const sounds = {
      step: { freq: 200, dur: 0.05, vol: 0.03, type: 'square' },
      interact: { freq: 440, dur: 0.1, vol: 0.08, type: 'square' },
      collect: { freq: 880, dur: 0.15, vol: 0.1, type: 'square' },
      attack: { freq: 150, dur: 0.1, vol: 0.1, type: 'sawtooth' },
      hit: { freq: 100, dur: 0.15, vol: 0.12, type: 'square' },
      enemyDie: { freq: 200, dur: 0.2, vol: 0.1, type: 'sawtooth' },
      unlock: { freq: 523, dur: 0.4, vol: 0.12, type: 'square' },
      error: { freq: 100, dur: 0.2, vol: 0.1, type: 'square' },
      levelUp: { freq: 440, dur: 0.5, vol: 0.1, type: 'square' },
      puzzleCorrect: { freq: 660, dur: 0.1, vol: 0.08, type: 'square' },
      puzzleWrong: { freq: 150, dur: 0.2, vol: 0.08, type: 'square' }
    };

    const s = sounds[type] || sounds.interact;
    osc.type = s.type;
    osc.frequency.value = s.freq;
    gain.gain.value = s.vol;

    // Special sounds with pitch changes
    if (type === 'unlock' || type === 'levelUp') {
      osc.frequency.setValueAtTime(523, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(659, this.audioCtx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, this.audioCtx.currentTime + 0.2);
      osc.frequency.setValueAtTime(1047, this.audioCtx.currentTime + 0.3);
    }

    osc.start();
    osc.stop(this.audioCtx.currentTime + s.dur);
  }

  showStartScreen() {
    document.getElementById('start-screen').classList.remove('hidden');
    const savedName = localStorage.getItem('visitorName');
    if (savedName) {
      document.getElementById('hero-name').value = savedName;
    }
  }

  startGame() {
    const nameInput = document.getElementById('hero-name');
    const name = nameInput.value.trim() || 'Adventurer';

    this.state.stats.name = name;
    localStorage.setItem('visitorName', name);

    document.getElementById('start-screen').classList.add('hidden');
    this.state.started = true;

    this.playSound('unlock');
    this.showNotification(`Welcome, ${name}! Your quest begins!`);

    // Delayed tip to visit the guide
    setTimeout(() => {
      this.showNotification('🧭 Tip: Talk to the Guide for quest info!');
    }, 3000);

    // Add main quest
    this.addQuest({
      id: 'main_quest',
      title: "Developer's Secrets",
      description: "Unlock all knowledge about the Developer",
      objectives: [
        { id: 'pages', text: 'Find 3 Lost Pages (About Me)', completed: false },
        { id: 'computer', text: 'Debug the Computer (Projects)', completed: false },
        { id: 'bugs', text: 'Defeat Bug Invasion (Skills)', completed: false },
        { id: 'contact', text: 'Open the Contact Chest', completed: false }
      ]
    });

    this.updateHUD();
    this.gameLoop(0);
  }

  gameLoop(timestamp) {
    if (!this.state.started) return;

    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (!this.state.paused && !this.dialog.active && !this.ui.inventoryOpen && !this.miniGame.active) {
      this.update(deltaTime);
    }

    this.render();
    this.updateDialog(deltaTime);
    this.updateNotification(deltaTime);
    this.updateParticles(deltaTime);

    this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(deltaTime) {
    // Player movement
    let dx = 0;
    let dy = 0;

    if (this.keys.up) dy -= this.player.speed;
    if (this.keys.down) dy += this.player.speed;
    if (this.keys.left) dx -= this.player.speed;
    if (this.keys.right) dx += this.player.speed;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    if (dx < 0) this.player.direction = 'left';
    if (dx > 0) this.player.direction = 'right';
    if (dy < 0) this.player.direction = 'up';
    if (dy > 0) this.player.direction = 'down';

    const newX = this.player.x + dx;
    const newY = this.player.y + dy;

    if (!this.checkCollision(newX, this.player.y)) {
      this.player.x = newX;
    }
    if (!this.checkCollision(this.player.x, newY)) {
      this.player.y = newY;
    }

    // Bounds
    this.player.x = Math.max(16, Math.min(this.canvas.width - 48, this.player.x));
    this.player.y = Math.max(16, Math.min(this.canvas.height - 48, this.player.y));

    // Animation
    this.player.isMoving = dx !== 0 || dy !== 0;
    if (this.player.isMoving) {
      this.player.animTimer += deltaTime;
      if (this.player.animTimer > 150) {
        this.player.frame = (this.player.frame + 1) % 4;
        this.player.animTimer = 0;
      }
    }

    // Attack cooldown
    if (this.player.isAttacking) {
      this.player.attackTimer -= deltaTime;
      if (this.player.attackTimer <= 0) {
        this.player.isAttacking = false;
      }
    }

    // Invincibility
    if (this.player.invincible) {
      this.player.invincibleTimer -= deltaTime;
      if (this.player.invincibleTimer <= 0) {
        this.player.invincible = false;
      }
    }

    // Check collectible pickup
    this.checkCollectibles();

    // Update enemies
    this.updateEnemies(deltaTime);

    // Check enemy collision with player
    this.checkEnemyCollision();
  }

  checkCollision(x, y) {
    // Check solid interactables
    for (const obj of this.interactables) {
      if (['tree', 'rock', 'computer', 'nest', 'locked_chest'].includes(obj.type)) {
        if (this.rectIntersect(x, y, this.player.width, this.player.height,
          obj.x, obj.y, obj.width, obj.height)) {
          return true;
        }
      }
    }

    // Check NPCs
    for (const npc of this.npcs) {
      if (this.rectIntersect(x, y, this.player.width, this.player.height,
        npc.x, npc.y, npc.width, npc.height)) {
        return true;
      }
    }

    return false;
  }

  rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  checkCollectibles() {
    for (const item of this.collectibles) {
      if (item.collected) continue;

      // Skip items that require an unlock the player doesn't have
      if (item.requiresUnlock && !this.state.unlocked[item.requiresUnlock]) {
        continue;
      }

      const dist = Math.hypot(
        (this.player.x + 16) - (item.x + 12),
        (this.player.y + 16) - (item.y + 12)
      );

      if (dist < 30) {
        this.collectItem(item);
      }
    }
  }

  collectItem(item) {
    item.collected = true;
    this.playSound('collect');

    if (item.type === 'page') {
      this.state.pagesFound.push(item);
      this.showNotification(`📜 Found: ${item.content.title}`);
      this.spawnParticles(item.x, item.y, '#f4e8d0', 10);

      // Add to inventory
      this.state.inventory.push({
        id: item.id,
        type: 'page',
        name: item.content.title,
        description: item.content.text,
        icon: '📜'
      });

      // Notify player to return to guide when all pages found
      if (this.state.pagesFound.length >= 3) {
        setTimeout(() => {
          this.showNotification('📜 All pages found! Return to the Old Sage!');
        }, 1500);
      }

      this.updateHUD();
    }

    // Blueprint collection (for Craftsman quest)
    if (item.type === 'blueprint') {
      this.state.blueprintsFound.push(item);
      this.showNotification(`📐 Found: ${item.content.title}`);
      this.spawnParticles(item.x, item.y, '#3498db', 12);
      this.playSound('collect');

      // Add to inventory
      this.state.inventory.push({
        id: item.id,
        type: 'blueprint',
        name: item.content.title,
        description: item.content.text,
        icon: '📐'
      });

      // Notify player to return to Craftsman
      if (this.state.blueprintsFound.length === 3) {
        setTimeout(() => {
          this.showNotification('⚒️ All blueprints found! Return to the Craftsman!');
        }, 1500);
      }

      this.updateHUD();
    }
  }

  // Forging animation for Craftsman
  startForging() {
    const craftsman = this.npcs.find(n => n.id === 'craftsman');
    if (!craftsman) return;

    craftsman.forging = true;
    this.showNotification('⚒️ Forging the Master Sword...');

    // Hammer sounds and particles
    let forgeCount = 0;
    const forgeInterval = setInterval(() => {
      this.playSound('hit');
      this.spawnParticles(craftsman.x + 16, craftsman.y, '#f39c12', 5);
      forgeCount++;

      if (forgeCount >= 5) {
        clearInterval(forgeInterval);
        craftsman.forging = false;
        craftsman.swordReady = true;
        this.playSound('unlock');
        this.unlockContent('projects');
      }
    }, 500);
  }


  handleInteract() {
    const interactRange = 50;

    // Check NPCs
    for (const npc of this.npcs) {
      const dist = Math.hypot(
        (this.player.x + 16) - (npc.x + 16),
        (this.player.y + 16) - (npc.y + 16)
      );

      if (dist < interactRange) {
        this.interactWithNPC(npc);
        return;
      }
    }

    // Check interactables
    for (const obj of this.interactables) {
      const dist = Math.hypot(
        (this.player.x + 16) - (obj.x + obj.width / 2),
        (this.player.y + 16) - (obj.y + obj.height / 2)
      );

      if (dist < interactRange) {
        this.interactWithObject(obj);
        return;
      }
    }
  }

  interactWithNPC(npc) {
    this.playSound('interact');

    // Refresh dialog for guide and craftsman to get updated progress
    if (npc.id === 'guide') {
      npc.dialog = this.getGuideDialog();
    }
    if (npc.id === 'craftsman') {
      npc.dialog = this.getCraftsmanDialog();
    }

    // Find appropriate dialog based on conditions
    let dialog = npc.dialog.find(d => d.condition());
    if (!dialog) dialog = npc.dialog[npc.dialog.length - 1]; // Default to last

    this.showDialog(npc.name, dialog.text, dialog.options, (action) => {
      this.handleDialogAction(npc, action);
    }, npc.portrait);
  }

  handleDialogAction(npc, action) {
    switch (action) {
      case 'close':
        this.closeDialog();
        break;
      case 'hint_pages':
        this.showDialog(npc.name,
          "📜 LOST PAGES GUIDE:\n\n" +
          "Step 1: Find 3 glowing pages on the map.\n" +
          "   - NORTHWEST corner\n" +
          "   - SOUTHEAST corner\n" +
          "   - SOUTHWEST corner\n\n" +
          "Step 2: Walk over them to collect.\n\n" +
          "Step 3: RETURN TO ME with all 3 pages!\n\n" +
          "I will assemble the About Me section.",
          null);
        break;
      case 'hint_computer':
        this.showDialog(npc.name,
          "💻 DEBUG PUZZLE GUIDE:\n\n" +
          "Step 1: Find the BROKEN COMPUTER in the NORTHEAST.\n\n" +
          "Step 2: Press SPACE to interact.\n\n" +
          "Step 3: Click 'Show Sequence' to see 4 symbols.\n\n" +
          "Step 4: Repeat the sequence in order.\n\n" +
          "Tip: Use keyboard 1-4! Success unlocks 'Projects'.",
          null);
        break;
      case 'hint_bugs':
        this.showDialog(npc.name,
          "🐛 BUG INVASION GUIDE:\n\n" +
          "Step 1: Find the BUG NEST in the WEST.\n\n" +
          "Step 2: Press SPACE, choose 'Bring it on!'.\n\n" +
          "Step 3: Press J to ATTACK bugs.\n\n" +
          "Step 4: Defeat 10 bugs total.\n\n" +
          "Tip: Keep moving! Success unlocks 'Skills'.",
          null);
        break;
      case 'hint_craftsman':
        this.showDialog(npc.name,
          "⚒️ CRAFTSMAN QUEST GUIDE:\n\n" +
          "Step 1: Complete the 3 main quests first.\n\n" +
          "Step 2: Each quest unlocks a BLUEPRINT:\n" +
          "   About → 📊 Database\n" +
          "   Projects → 🎨 UI Design\n" +
          "   Skills → 🔌 API\n\n" +
          "Step 3: Collect all 3 blueprints (glow blue).\n\n" +
          "Step 4: Return to Craftsman to build the sword!",
          null);
        break;
      case 'deliver_pages':
        this.closeDialog();
        this.unlockContent('about');
        break;
      case 'open_github':
        this.closeDialog();
        window.open('https://github.com/Rayan-Alamri', '_blank');
        this.showNotification('🔗 Opening GitHub...');
        break;
      case 'build_sword':
        this.closeDialog();
        const craftsman = this.npcs.find(n => n.id === 'craftsman');
        if (craftsman) {
          craftsman.swordReady = true;
          this.playSound('unlock');
          this.spawnParticles(craftsman.x + 16, craftsman.y, '#ffd700', 20);
          this.showNotification('🗡️ The Master Sword has been forged!');
          setTimeout(() => {
            this.showNotification('Talk to the Craftsman to see the best project!');
          }, 2000);
        }
        break;
      case 'forge_sword':
        this.closeDialog();
        this.startForging();
        break;
    }
  }

  interactWithObject(obj) {
    this.playSound('interact');

    switch (obj.type) {
      case 'sign':
        this.showDialog('Sign', obj.message, null);
        break;

      case 'computer':
        if (obj.fixed) {
          this.showContentViewer('projects');
        } else {
          this.startDebugPuzzle(obj);
        }
        break;

      case 'nest':
        if (!obj.activated && !this.state.unlocked.skills) {
          this.showDialog('Bug Nest', "A swarm of bugs is ready to emerge! Defeat all 10 to prove your debugging skills!\n\nPress SPACE to start the invasion!", [
            { text: "⚔️ Bring it on!", action: 'start_invasion' },
            { text: "Not yet...", action: 'close' }
          ], (action) => {
            if (action === 'start_invasion') {
              this.startBugInvasion(obj);
            }
            this.closeDialog();
          });
        } else if (this.state.unlocked.skills) {
          this.showContentViewer('skills');
        }
        break;

      case 'locked_chest':
        const craftsmanNpc = this.npcs.find(n => n.id === 'craftsman');
        const allDone = this.state.unlocked.about && this.state.unlocked.projects && this.state.unlocked.skills && craftsmanNpc?.swordReady;

        if (allDone) {
          if (!this.state.unlocked.contact) {
            this.unlockContent('contact');
            obj.unlocked = true;
          } else {
            this.showContentViewer('contact');
          }
        } else {
          const remaining = [];
          if (!this.state.unlocked.about) remaining.push('Lost Pages');
          if (!this.state.unlocked.projects) remaining.push('Computer Debug');
          if (!this.state.unlocked.skills) remaining.push('Bug Invasion');
          if (!craftsmanNpc?.swordReady) remaining.push('Craftsman Sword');
          this.showDialog('Locked Chest', `This chest requires all 4 challenges!\n\nRemaining: ${remaining.join(', ')}`, null);
        }
        break;

      case 'tree':
        this.showNotification("It's a tree. Very... tree-like.");
        break;

      case 'rock':
        this.showNotification("A sturdy rock. Nothing special.");
        break;
    }
  }

  // ===============================
  // DEBUG PUZZLE MINI-GAME
  // ===============================
  startDebugPuzzle(computer) {
    this.miniGame.active = true;
    this.miniGame.type = 'debug';
    this.miniGame.data = {
      computer: computer,
      sequence: [],
      playerSequence: [],
      level: 1,
      showingSequence: false,
      currentIndex: 0,
      timer: 0
    };

    // Generate sequence
    const symbols = ['🔴', '🔵', '🟢', '🟡'];
    for (let i = 0; i < 4; i++) {
      this.miniGame.data.sequence.push(symbols[Math.floor(Math.random() * 4)]);
    }

    this.renderDebugPuzzle();
  }

  renderDebugPuzzle() {
    const container = document.getElementById('minigame-container');
    const content = document.getElementById('minigame-content');

    content.innerHTML = `
      <div class="puzzle-game">
        <h2>💻 DEBUG THE COMPUTER</h2>
        <p class="puzzle-instruction">Memorize the sequence, then repeat it!</p>

        <div class="puzzle-display" id="puzzle-display">
          <span class="puzzle-symbol">?</span>
        </div>

        <div class="puzzle-buttons" id="puzzle-buttons">
          <button class="puzzle-btn" data-symbol="🔴">🔴</button>
          <button class="puzzle-btn" data-symbol="🔵">🔵</button>
          <button class="puzzle-btn" data-symbol="🟢">🟢</button>
          <button class="puzzle-btn" data-symbol="🟡">🟡</button>
        </div>

        <div class="puzzle-progress">
          <span id="puzzle-progress">0 / ${this.miniGame.data.sequence.length}</span>
        </div>

        <button class="pixel-btn" id="puzzle-start">▶ Show Sequence</button>
        <button class="pixel-btn puzzle-cancel" id="puzzle-cancel">✕ Cancel</button>
      </div>
    `;

    container.classList.remove('hidden');

    // Event listeners
    document.getElementById('puzzle-start').addEventListener('click', () => this.showPuzzleSequence());
    document.getElementById('puzzle-cancel').addEventListener('click', () => this.closeMiniGame());

    document.querySelectorAll('.puzzle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.miniGame.data.showingSequence) {
          this.handlePuzzleInput(btn.dataset.symbol);
        }
      });
    });
  }

  showPuzzleSequence() {
    this.miniGame.data.showingSequence = true;
    this.miniGame.data.currentIndex = 0;
    document.getElementById('puzzle-start').style.display = 'none';

    const display = document.getElementById('puzzle-display');
    const showNext = () => {
      if (this.miniGame.data.currentIndex < this.miniGame.data.sequence.length) {
        const symbol = this.miniGame.data.sequence[this.miniGame.data.currentIndex];
        display.innerHTML = `<span class="puzzle-symbol flash">${symbol}</span>`;
        this.playSound('puzzleCorrect');

        setTimeout(() => {
          display.innerHTML = `<span class="puzzle-symbol">?</span>`;
          this.miniGame.data.currentIndex++;
          setTimeout(showNext, 300);
        }, 700);
      } else {
        this.miniGame.data.showingSequence = false;
        display.innerHTML = `<span class="puzzle-symbol">Your turn!</span>`;
      }
    };

    showNext();
  }

  handlePuzzleInput(symbol) {
    const data = this.miniGame.data;
    const expected = data.sequence[data.playerSequence.length];

    if (symbol === expected) {
      data.playerSequence.push(symbol);
      this.playSound('puzzleCorrect');
      document.getElementById('puzzle-progress').textContent = `${data.playerSequence.length} / ${data.sequence.length}`;

      const display = document.getElementById('puzzle-display');
      display.innerHTML = `<span class="puzzle-symbol correct">${symbol}</span>`;

      if (data.playerSequence.length === data.sequence.length) {
        // Success!
        setTimeout(() => this.puzzleSuccess(), 500);
      }
    } else {
      // Wrong!
      this.playSound('puzzleWrong');
      const display = document.getElementById('puzzle-display');
      display.innerHTML = `<span class="puzzle-symbol wrong">✕</span>`;
      data.playerSequence = [];
      document.getElementById('puzzle-progress').textContent = `0 / ${data.sequence.length}`;
      document.getElementById('puzzle-start').style.display = 'block';
      document.getElementById('puzzle-start').textContent = '🔄 Try Again';

      setTimeout(() => {
        display.innerHTML = `<span class="puzzle-symbol">?</span>`;
      }, 500);
    }
  }

  handleMiniGameInput(key) {
    // ESC to close mini-game
    if (key === 'escape') {
      this.closeMiniGame();
      return;
    }

    if (this.miniGame.type === 'debug') {
      const keyMap = { '1': '🔴', '2': '🔵', '3': '🟢', '4': '🟡' };
      if (keyMap[key] && !this.miniGame.data.showingSequence) {
        this.handlePuzzleInput(keyMap[key]);
      }
    }
  }

  puzzleSuccess() {
    // Save reference before clearing mini-game data
    const computer = this.miniGame.data.computer;

    this.closeMiniGame();

    // Now mark computer as fixed
    if (computer) {
      computer.fixed = true;
    }
    this.state.puzzleSolved = true;
    this.unlockContent('projects');
  }

  closeMiniGame() {
    this.miniGame.active = false;
    this.miniGame.type = null;
    this.miniGame.data = {};
    document.getElementById('minigame-container').classList.add('hidden');
  }

  // ===============================
  // BUG INVASION COMBAT
  // ===============================
  startBugInvasion(nest) {
    nest.activated = true;
    this.state.bugsDefeated = 0;

    this.showNotification('🐛 BUG INVASION STARTED!');
    document.getElementById('combat-ui').classList.remove('hidden');

    // Spawn initial bugs
    this.spawnBugs(3);

    // Spawn more over time
    this.bugSpawnInterval = setInterval(() => {
      if (this.state.bugsDefeated >= 10) {
        clearInterval(this.bugSpawnInterval);
        return;
      }
      if (this.enemies.length < 5) {
        this.spawnBugs(2);
      }
    }, 3000);
  }

  spawnBugs(count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 150 + Math.random() * 100;
      const x = this.player.x + Math.cos(angle) * dist;
      const y = this.player.y + Math.sin(angle) * dist;

      this.enemies.push({
        id: `bug_${Date.now()}_${i}`,
        type: 'bug',
        x: Math.max(50, Math.min(this.canvas.width - 50, x)),
        y: Math.max(50, Math.min(this.canvas.height - 50, y)),
        width: 24,
        height: 24,
        hp: 20,
        maxHp: 20,
        speed: 1.5 + Math.random(),
        damage: 10,
        frame: 0,
        animTimer: 0,
        knockback: { x: 0, y: 0 },
        state: 'chase'
      });
    }
  }

  updateEnemies(deltaTime) {
    // Skip if invasion is complete
    if (this.state.unlocked.skills) {
      this.enemies = [];
      return;
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // Apply knockback
      if (enemy.knockback.x !== 0 || enemy.knockback.y !== 0) {
        enemy.x += enemy.knockback.x;
        enemy.y += enemy.knockback.y;
        enemy.knockback.x *= 0.8;
        enemy.knockback.y *= 0.8;
        if (Math.abs(enemy.knockback.x) < 0.1) enemy.knockback.x = 0;
        if (Math.abs(enemy.knockback.y) < 0.1) enemy.knockback.y = 0;
        continue;
      }

      // Chase player
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 10) {
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
      }

      // Bounds
      enemy.x = Math.max(20, Math.min(this.canvas.width - 40, enemy.x));
      enemy.y = Math.max(20, Math.min(this.canvas.height - 40, enemy.y));

      // Animation
      enemy.animTimer += deltaTime;
      if (enemy.animTimer > 200) {
        enemy.frame = (enemy.frame + 1) % 2;
        enemy.animTimer = 0;
      }

      // Check if dead
      if (enemy.hp <= 0 && !enemy.isDead) {
        this.killEnemy(enemy, i);
      }
    }
  }

  checkEnemyCollision() {
    if (this.player.invincible) return;
    if (this.state.unlocked.skills) return; // No enemies after invasion complete

    for (const enemy of this.enemies) {
      if (this.rectIntersect(
        this.player.x, this.player.y, this.player.width, this.player.height,
        enemy.x, enemy.y, enemy.width, enemy.height
      )) {
        this.playerTakeDamage(enemy.damage);
        break;
      }
    }
  }

  playerTakeDamage(amount) {
    this.state.stats.hp = Math.max(0, this.state.stats.hp - amount);
    this.player.invincible = true;
    this.player.invincibleTimer = 1000;
    this.playSound('hit');
    this.spawnParticles(this.player.x + 16, this.player.y + 16, '#e74c3c', 5);
    this.updateHUD();

    if (this.state.stats.hp <= 0) {
      this.playerDeath();
    }
  }

  playerDeath() {
    this.showNotification('💀 You were defeated! Respawning...');
    this.state.stats.hp = this.state.stats.maxHp;

    // Clear enemies
    this.enemies = [];
    clearInterval(this.bugSpawnInterval);
    document.getElementById('combat-ui').classList.add('hidden');

    // Reset bug nest
    const nest = this.interactables.find(o => o.type === 'nest');
    if (nest) nest.activated = false;

    // Respawn player
    this.player.x = 480;
    this.player.y = 320;
    this.player.invincible = true;
    this.player.invincibleTimer = 2000;

    this.updateHUD();
  }

  playerAttack() {
    if (this.player.isAttacking) return;

    this.player.isAttacking = true;
    this.player.attackTimer = 300;
    this.playSound('attack');

    // Attack hitbox based on direction
    let hitX = this.player.x;
    let hitY = this.player.y;
    const hitW = 40;
    const hitH = 40;

    switch (this.player.direction) {
      case 'right': hitX += 30; break;
      case 'left': hitX -= 30; break;
      case 'down': hitY += 30; break;
      case 'up': hitY -= 30; break;
    }

    // Check enemy hits
    for (const enemy of this.enemies) {
      if (this.rectIntersect(hitX, hitY, hitW, hitH, enemy.x, enemy.y, enemy.width, enemy.height)) {
        this.hitEnemy(enemy, this.state.stats.attack);
      }
    }

    // Spawn attack particles
    this.spawnParticles(hitX + hitW / 2, hitY + hitH / 2, '#f39c12', 3);
  }

  hitEnemy(enemy, damage) {
    enemy.hp -= damage;
    this.playSound('hit');

    // Knockback
    const dx = enemy.x - this.player.x;
    const dy = enemy.y - this.player.y;
    const dist = Math.hypot(dx, dy) || 1;
    enemy.knockback.x = (dx / dist) * 15;
    enemy.knockback.y = (dy / dist) * 15;

    // Damage particles
    this.spawnParticles(enemy.x + 12, enemy.y, '#e74c3c', 3);

    // Check if enemy died immediately
    if (enemy.hp <= 0) {
      const index = this.enemies.indexOf(enemy);
      if (index > -1) {
        this.killEnemy(enemy, index);
      }
    }
  }

  killEnemy(enemy, index) {
    // Prevent double-kill
    if (enemy.isDead) return;
    enemy.isDead = true;

    this.playSound('enemyDie');
    this.spawnParticles(enemy.x + 12, enemy.y + 12, '#9b59b6', 8);
    this.enemies.splice(index, 1);

    this.state.bugsDefeated++;
    document.getElementById('combo-count').textContent = this.state.bugsDefeated;

    // Don't show individual notifications - just update the combo counter
    // XP will be given at the end as a summary

    // Check if invasion complete
    if (this.state.bugsDefeated >= 10) {
      clearInterval(this.bugSpawnInterval);
      // Clear all remaining enemies
      this.enemies = [];
      document.getElementById('combat-ui').classList.add('hidden');

      // Show summary notification
      this.showNotification(`🎉 Bug Invasion Complete! 10 bugs defeated!`);

      // Give total XP reward (15 per bug = 150 total)
      this.giveXP(150);

      this.unlockContent('skills');
    }

    this.updateHUD();
  }

  // ===============================
  // UNLOCK SYSTEM
  // ===============================
  unlockContent(type) {
    if (this.state.unlocked[type]) return;

    this.state.unlocked[type] = true;
    this.playSound('unlock');

    const rewards = {
      about: {
        title: '📜 ABOUT ME UNLOCKED!',
        icon: '👨‍💻',
        text: "You've assembled all the Lost Pages! The Developer's biography is now available."
      },
      projects: {
        title: '💻 PROJECTS UNLOCKED!',
        icon: '⚒️',
        text: "The computer has been debugged! The Developer's projects are now accessible."
      },
      skills: {
        title: '⚔️ SKILLS UNLOCKED!',
        icon: '🏆',
        text: "You've vanquished the Bug Invasion! The Developer's skills have been revealed."
      },
      contact: {
        title: '✉️ CONTACT UNLOCKED!',
        icon: '📬',
        text: "All challenges complete! You can now contact the Developer!"
      }
    };

    const reward = rewards[type];
    this.showRewardPopup(reward.title, reward.icon, reward.text, type);

    // Update quest
    const questMap = {
      about: 'pages',
      projects: 'computer',
      skills: 'bugs',
      contact: 'contact'
    };
    this.updateQuestObjective('main_quest', questMap[type]);

    // Add items to inventory based on unlock
    if (type === 'projects') {
      const projects = [
        { id: 'proj_cpu', name: 'MIPS CPU', icon: '🔨', description: 'Single-cycle CPU in Logisim executing MIPS instructions', tech: 'Logisim, MIPS, MARS' },
        { id: 'proj_league', name: 'League Organizer', icon: '📜', description: 'Website for team registration and standings', tech: 'HTML, CSS, JavaScript' },
        { id: 'proj_ai', name: 'Study Buddy AI', icon: '🔮', description: 'Chatbot for notes, flashcards, and reminders', tech: 'Node.js, AI/ML, REST API' }
      ];
      projects.forEach(p => this.state.inventory.push({ ...p, type: 'project' }));
    }

    if (type === 'skills') {
      const skills = [
        { id: 'skill_js', name: 'JavaScript', icon: '📜', description: 'Web scripting and Node.js' },
        { id: 'skill_python', name: 'Python', icon: '🐍', description: 'Automation and ML' },
        { id: 'skill_html', name: 'HTML/CSS', icon: '🎨', description: 'Web markup and styling' },
        { id: 'skill_git', name: 'Git', icon: '📦', description: 'Version control' },
        { id: 'skill_react', name: 'React', icon: '⚛️', description: 'UI framework' }
      ];
      skills.forEach(s => this.state.inventory.push({ ...s, type: 'skill' }));
    }

    this.updateHUD();
  }

  showRewardPopup(title, icon, text, type) {
    const popup = document.getElementById('reward-popup');
    document.getElementById('reward-title').textContent = title;
    document.getElementById('reward-icon').textContent = icon;
    document.getElementById('reward-text').textContent = text;

    popup.classList.remove('hidden');
    popup.dataset.type = type;
  }

  closeRewardPopup() {
    const popup = document.getElementById('reward-popup');
    const type = popup.dataset.type;
    popup.classList.add('hidden');

    // Automatically show content viewer
    if (type) {
      setTimeout(() => this.showContentViewer(type), 300);
    }
  }

  showContentViewer(type) {
    const viewer = document.getElementById('content-viewer');
    const title = document.getElementById('content-title');
    const body = document.getElementById('content-body');

    const content = {
      about: {
        title: '📜 About Me',
        body: `
          <div class="content-about">
            <div class="about-header">
              <div class="about-avatar">👨‍💻</div>
              <div class="about-info">
                <h3 style="font-family: 'Arial', sans-serif; font-size: 24px; letter-spacing: 1px;">Rayan Alamri</h3>
                <p class="about-subtitle">Level 21 Developer | KFUPM</p>
              </div>
            </div>
            <div class="about-pages">
              ${[...this.state.pagesFound].sort((a, b) => a.id.localeCompare(b.id)).map(p => `
                <div class="about-page">
                  <h4>${p.content.title}</h4>
                  <p>${p.content.text}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `
      },
      projects: {
        title: '💻 Projects',
        body: `
          <div class="content-projects">
            <div class="project-item">
              <div class="project-icon">🔨</div>
              <div class="project-info">
                <h4>MIPS CPU in Logisim</h4>
                <p>Built a simple single-cycle CPU in Logisim to execute a small subset of MIPS-style instructions (add, sub, lw, sw, beq). Designed the datapath and control unit.</p>
                <div class="project-tech">Logisim • MIPS Assembly • MARS Simulator</div>
              </div>
            </div>
            <div class="project-item">
              <div class="project-icon">📜</div>
              <div class="project-info">
                <h4>University League Organizer</h4>
                <p>A lightweight website to register teams, generate fixtures, and track standings for the university league. Clean, mobile-first UI.</p>
                <div class="project-tech">HTML • CSS • JavaScript</div>
              </div>
            </div>
            <div class="project-item">
              <div class="project-icon">🔮</div>
              <div class="project-info">
                <h4>Study Buddy (AI Assistant)</h4>
                <p>A chatbot-style assistant that summarizes class notes, generates flashcards, and sets reminders.</p>
                <div class="project-tech">Node.js • AI/ML • REST API</div>
              </div>
            </div>
          </div>
        `
      },
      skills: {
        title: '⚔️ Skills',
        body: `
          <div class="content-skills">
            <div class="skill-category">
              <h4>🗡️ Combat Skills (Languages)</h4>
              <div class="skill-list">
                <div class="skill-item"><span class="skill-icon">📜</span> JavaScript</div>
                <div class="skill-item"><span class="skill-icon">🐍</span> Python</div>
                <div class="skill-item"><span class="skill-icon">☕</span> Java</div>
                <div class="skill-item"><span class="skill-icon">💾</span> SQL</div>
              </div>
            </div>
            <div class="skill-category">
              <h4>🛡️ Defense Skills (Frameworks)</h4>
              <div class="skill-list">
                <div class="skill-item"><span class="skill-icon">⚛️</span> React</div>
                <div class="skill-item"><span class="skill-icon">🟢</span> Node.js</div>
                <div class="skill-item"><span class="skill-icon">🎨</span> HTML/CSS</div>
              </div>
            </div>
            <div class="skill-category">
              <h4>🧰 Utility Skills (Tools)</h4>
              <div class="skill-list">
                <div class="skill-item"><span class="skill-icon">📦</span> Git</div>
                <div class="skill-item"><span class="skill-icon">🐳</span> Docker</div>
                <div class="skill-item"><span class="skill-icon">☁️</span> AWS</div>
              </div>
            </div>
          </div>
        `
      },
      contact: {
        title: '✉️ Contact',
        body: `
          <div class="content-contact">
            <p class="contact-intro">The Developer awaits your message!</p>
            <form id="game-contact-form" class="game-form">
              <div class="form-group">
                <label>Your Name</label>
                <input type="text" id="gc-name" placeholder="Hero's name..." required>
              </div>
              <div class="form-group">
                <label>Your Email</label>
                <input type="email" id="gc-email" placeholder="your@email.com" required>
              </div>
              <div class="form-group">
                <label>Your Message</label>
                <textarea id="gc-message" placeholder="What would you like to say?" rows="4" required></textarea>
              </div>
              <button type="submit" class="pixel-btn">📨 Send Message</button>
            </form>
            <p id="gc-status" class="form-status"></p>
          </div>
        `
      }
    };

    const c = content[type];
    if (!c) return;

    title.textContent = c.title;
    body.innerHTML = c.body;
    viewer.classList.remove('hidden');

    // Contact form handler
    if (type === 'contact') {
      document.getElementById('game-contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('gc-status').textContent = '✨ Message sent! Redirecting to portfolio...';
        document.getElementById('gc-status').className = 'form-status success';
        this.giveXP(50);

        // Close viewer and switch to portfolio after 2 seconds
        setTimeout(() => {
          this.closeContentViewer();
          this.showNotification('📄 Opening portfolio...');
          setTimeout(() => {
            this.toggleMode(); // Switch to portfolio mode
          }, 500);
        }, 2000);
      });
    }
  }

  closeContentViewer() {
    document.getElementById('content-viewer').classList.add('hidden');
  }

  // ===============================
  // UI & HELPERS
  // ===============================
  showDialog(speaker, text, options = null, callback = null, portrait = '💬') {
    this.dialog.active = true;
    this.dialog.speaker = speaker;
    this.dialog.fullText = text;
    this.dialog.text = '';
    this.dialog.charIndex = 0;
    this.dialog.options = options || [];
    this.dialog.callback = callback;

    document.getElementById('dialog-box').classList.remove('hidden');
    document.getElementById('dialog-speaker').textContent = speaker;
    document.getElementById('dialog-portrait').textContent = portrait;
    document.getElementById('dialog-text').textContent = '';

    if (options) {
      this.renderDialogOptions(options, callback);
    } else {
      document.getElementById('dialog-options').innerHTML = '';
    }
  }

  renderDialogOptions(options, callback) {
    const container = document.getElementById('dialog-options');
    container.innerHTML = '';

    options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'dialog-option';
      btn.textContent = `${i + 1}. ${opt.text}`;
      btn.addEventListener('click', () => {
        this.playSound('interact');
        if (callback) callback(opt.action);
      });
      container.appendChild(btn);
    });
  }

  updateDialog(deltaTime) {
    if (!this.dialog.active) return;

    if (this.dialog.charIndex < this.dialog.fullText.length) {
      this.dialog.charIndex += 2; // Faster text
      this.dialog.text = this.dialog.fullText.substring(0, Math.floor(this.dialog.charIndex));
      document.getElementById('dialog-text').textContent = this.dialog.text;
    }
  }

  advanceDialog() {
    if (this.dialog.charIndex < this.dialog.fullText.length) {
      // Skip to end of text
      this.dialog.charIndex = this.dialog.fullText.length;
      this.dialog.text = this.dialog.fullText;
      document.getElementById('dialog-text').textContent = this.dialog.text;
    } else if (this.dialog.options.length === 0) {
      // No options, close dialog
      if (this.dialog.callback) {
        this.dialog.callback();
      } else {
        this.closeDialog();
      }
    } else {
      // Has options - select first one or close
      const firstOption = this.dialog.options[0];
      if (firstOption && this.dialog.callback) {
        this.playSound('interact');
        this.dialog.callback(firstOption.action);
      } else {
        this.closeDialog();
      }
    }
  }

  closeDialog() {
    this.dialog.active = false;
    document.getElementById('dialog-box').classList.add('hidden');
  }

  giveXP(amount) {
    this.state.stats.xp += amount;
    this.showNotification(`+${amount} XP`);

    while (this.state.stats.xp >= this.state.stats.xpToLevel) {
      this.state.stats.xp -= this.state.stats.xpToLevel;
      this.state.stats.level++;
      this.state.stats.xpToLevel = Math.floor(this.state.stats.xpToLevel * 1.5);
      this.state.stats.maxHp += 10;
      this.state.stats.hp = this.state.stats.maxHp;
      this.state.stats.attack += 3;
      this.playSound('levelUp');
      this.showNotification(`🎉 LEVEL UP! Now level ${this.state.stats.level}`);
    }

    this.updateHUD();
  }

  addQuest(quest) {
    if (!this.state.questLog.find(q => q.id === quest.id)) {
      this.state.questLog.push(quest);
    }
  }

  updateQuestObjective(questId, objectiveId) {
    const quest = this.state.questLog.find(q => q.id === questId);
    if (quest) {
      const obj = quest.objectives.find(o => o.id === objectiveId);
      if (obj && !obj.completed) {
        obj.completed = true;

        if (quest.objectives.every(o => o.completed)) {
          quest.completed = true;
          this.showNotification('🎉 Main Quest Complete!');
          this.giveXP(200);
        }
      }
    }
  }

  showNotification(message) {
    this.ui.notificationQueue.push(message);
    if (!this.ui.notification) {
      this.displayNextNotification();
    }
  }

  displayNextNotification() {
    if (this.ui.notificationQueue.length === 0) {
      this.ui.notification = null;
      return;
    }

    const message = this.ui.notificationQueue.shift();
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.classList.remove('hidden');
    this.ui.notification = message;
    this.ui.notificationTimer = 5000; // 5 seconds
  }

  updateNotification(deltaTime) {
    if (this.ui.notificationTimer > 0) {
      this.ui.notificationTimer -= deltaTime;
      if (this.ui.notificationTimer <= 0) {
        document.getElementById('notification').classList.add('hidden');
        setTimeout(() => this.displayNextNotification(), 200);
      }
    }
  }

  updateHUD() {
    const s = this.state.stats;

    document.getElementById('hp-fill').style.width = `${(s.hp / s.maxHp) * 100}%`;
    document.getElementById('hp-value').textContent = `${s.hp}/${s.maxHp}`;

    document.getElementById('xp-fill').style.width = `${(s.xp / s.xpToLevel) * 100}%`;
    document.getElementById('xp-value').textContent = `${s.xp}/${s.xpToLevel}`;

    document.getElementById('player-name').textContent = s.name;
    document.getElementById('player-level').textContent = `LVL ${s.level}`;
    document.getElementById('gold-display').textContent = `💰 ${s.gold}`;

    // Update unlock tracker
    const pagesCount = this.state.pagesFound.length;
    document.querySelector('#unlock-about .unlock-progress').textContent =
      this.state.unlocked.about ? '✓' : `${pagesCount}/3`;
    document.querySelector('#unlock-about').classList.toggle('unlocked', this.state.unlocked.about);

    document.querySelector('#unlock-projects .unlock-progress').textContent =
      this.state.unlocked.projects ? '✓' : '🔒';
    document.querySelector('#unlock-projects').classList.toggle('unlocked', this.state.unlocked.projects);

    document.querySelector('#unlock-skills .unlock-progress').textContent =
      this.state.unlocked.skills ? '✓' : `${this.state.bugsDefeated}/10`;
    document.querySelector('#unlock-skills').classList.toggle('unlocked', this.state.unlocked.skills);

    document.querySelector('#unlock-contact .unlock-progress').textContent =
      this.state.unlocked.contact ? '✓' : '🔒';
    document.querySelector('#unlock-contact').classList.toggle('unlocked', this.state.unlocked.contact);
  }

  toggleInventory() {
    this.ui.inventoryOpen = !this.ui.inventoryOpen;
    document.getElementById('inventory-screen').classList.toggle('hidden', !this.ui.inventoryOpen);

    if (this.ui.inventoryOpen) {
      this.renderInventory();
      this.playSound('interact');
    }
  }

  renderInventory() {
    // Pages
    const pagesGrid = document.getElementById('pages-grid');
    pagesGrid.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const slot = document.createElement('div');
      slot.className = 'inventory-slot';
      const page = this.state.pagesFound[i];
      if (page) {
        slot.innerHTML = `<span class="item-icon">📜</span>`;
        slot.title = page.content.title;
        slot.classList.add('filled');
        slot.style.cursor = 'pointer';
        slot.addEventListener('click', () => {
          this.showDialog('📜 ' + page.content.title, page.content.text, null);
        });
      }
      pagesGrid.appendChild(slot);
    }

    // Projects
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';
    const projects = this.state.inventory.filter(i => i.type === 'project');
    for (let i = 0; i < 4; i++) {
      const slot = document.createElement('div');
      slot.className = 'inventory-slot';
      const proj = projects[i];
      if (proj) {
        slot.innerHTML = `<span class="item-icon">${proj.icon}</span>`;
        slot.title = proj.name;
        slot.classList.add('filled');
        slot.style.cursor = 'pointer';
        slot.addEventListener('click', () => {
          this.showDialog('💻 ' + proj.name, proj.description + '\n\nTech: ' + (proj.tech || 'N/A'), null);
        });
      }
      projectsGrid.appendChild(slot);
    }

    // Skills
    const skillsGrid = document.getElementById('skills-grid');
    skillsGrid.innerHTML = '';
    const skills = this.state.inventory.filter(i => i.type === 'skill');
    for (let i = 0; i < 6; i++) {
      const slot = document.createElement('div');
      slot.className = 'inventory-slot';
      const skill = skills[i];
      if (skill) {
        slot.innerHTML = `<span class="item-icon">${skill.icon}</span>`;
        slot.title = skill.name;
        slot.classList.add('filled');
        slot.style.cursor = 'pointer';
        slot.addEventListener('click', () => {
          this.showDialog('⚔️ ' + skill.name, skill.description, null);
        });
      }
      skillsGrid.appendChild(slot);
    }
  }

  togglePause() {
    this.state.paused = !this.state.paused;
    document.getElementById('pause-menu').classList.toggle('hidden', !this.state.paused);

    if (this.state.paused) {
      document.getElementById('pause-pages').textContent = this.state.pagesFound.length;
      document.getElementById('pause-bugs').textContent = this.state.bugsDefeated;
      document.getElementById('pause-computer').textContent =
        this.state.unlocked.projects ? 'Debugged ✓' : 'Not Debugged';
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    document.getElementById('sound-toggle-btn').textContent =
      this.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
  }

  toggleMode() {
    const gameContainer = document.getElementById('game-container');
    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const modeBtn = document.getElementById('mode-toggle');

    const isGameMode = !gameContainer.classList.contains('hidden');

    if (isGameMode) {
      gameContainer.classList.add('hidden');
      if (mainContent) mainContent.style.display = '';
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      modeBtn.innerHTML = '🎮 Game';
      this.state.paused = true;
    } else {
      gameContainer.classList.remove('hidden');
      if (mainContent) mainContent.style.display = 'none';
      if (header) header.style.display = 'none';
      if (footer) footer.style.display = 'none';
      modeBtn.innerHTML = '📄 Portfolio';
      this.state.paused = false;
      document.getElementById('pause-menu').classList.add('hidden');
    }
  }

  quitToTitle() {
    this.state.started = false;
    this.state.paused = false;
    this.enemies = [];
    clearInterval(this.bugSpawnInterval);
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('combat-ui').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  // ===============================
  // PARTICLES
  // ===============================
  spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 500,
        maxLife: 500,
        color: color,
        size: 4 + Math.random() * 4
      });
    }
  }

  updateParticles(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life -= deltaTime;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  // ===============================
  // RENDER
  // ===============================
  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Background
    ctx.fillStyle = '#6ab04c';
    ctx.fillRect(0, 0, w, h);

    // Grass pattern
    ctx.fillStyle = '#78e08f';
    for (let x = 0; x < w; x += 32) {
      for (let y = 0; y < h; y += 32) {
        if ((x + y) % 64 === 0) {
          ctx.fillRect(x + 8, y + 8, 16, 16);
        }
      }
    }

    // Paths
    ctx.fillStyle = '#c4a76c';
    ctx.fillRect(0, h / 2 - 25, w, 50);
    ctx.fillRect(w / 2 - 25, 0, 50, h);

    // Path detail (static positions to avoid flicker)
    ctx.fillStyle = '#b39759';
    const pathDetails = [
      [80, h / 2 - 10], [200, h / 2 + 5], [350, h / 2 - 15], [500, h / 2 + 10], [650, h / 2 - 5], [800, h / 2 + 8],
      [w / 2 - 10, 60], [w / 2 + 5, 180], [w / 2 - 8, 300], [w / 2 + 12, 420], [w / 2 - 5, 540]
    ];
    for (const [px, py] of pathDetails) {
      ctx.fillRect(px, py, 8, 8);
    }

    // Draw interactables
    this.drawInteractables(ctx);

    // Draw collectibles
    this.drawCollectibles(ctx);

    // Draw NPCs
    this.drawNPCs(ctx);

    // Draw enemies
    this.drawEnemies(ctx);

    // Draw particles
    this.drawParticles(ctx);

    // Draw player
    this.drawPlayer(ctx);

    // Draw minimap
    this.drawMinimap();
  }

  drawInteractables(ctx) {
    for (const obj of this.interactables) {
      switch (obj.type) {
        case 'tree':
          ctx.font = '40px Arial';
          ctx.fillText('🌲', obj.x, obj.y + 40);
          break;

        case 'rock':
          ctx.font = '28px Arial';
          ctx.fillText('🪨', obj.x, obj.y + 24);
          break;

        case 'sign':
          ctx.font = '28px Arial';
          ctx.fillText('🪧', obj.x, obj.y + 28);
          break;

        case 'computer':
          ctx.font = '40px Arial';
          if (obj.fixed) {
            ctx.fillText('💻', obj.x, obj.y + 40);
          } else {
            // Glitching effect (slower)
            obj.glitchFrame = (obj.glitchFrame + 1) % 120;
            const glitch = obj.glitchFrame < 60 ? '💻' : '❌';
            ctx.fillText(glitch, obj.x + (Math.random() - 0.5) * 2, obj.y + 40);
          }

          // Interaction hint
          const distComp = Math.hypot(
            (this.player.x + 16) - (obj.x + 24),
            (this.player.y + 16) - (obj.y + 24)
          );
          if (distComp < 60) {
            ctx.fillStyle = '#ffd700';
            ctx.font = '12px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText(obj.fixed ? 'VIEW' : 'DEBUG', obj.x + 24, obj.y - 10);
            ctx.textAlign = 'left';
          }
          break;

        case 'nest':
          ctx.font = '36px Arial';
          ctx.fillText(obj.activated ? '🕳️' : '🐛', obj.x, obj.y + 36);

          const distNest = Math.hypot(
            (this.player.x + 16) - (obj.x + 20),
            (this.player.y + 16) - (obj.y + 20)
          );
          if (distNest < 60 && !obj.activated && !this.state.unlocked.skills) {
            ctx.fillStyle = '#e74c3c';
            ctx.font = '10px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText('FIGHT!', obj.x + 20, obj.y - 10);
            ctx.textAlign = 'left';
          }
          break;

        case 'locked_chest':
          ctx.font = '32px Arial';
          const craftsmanForChest = this.npcs.find(n => n.id === 'craftsman');
          const isUnlockable = this.state.unlocked.about &&
            this.state.unlocked.projects &&
            this.state.unlocked.skills &&
            craftsmanForChest?.swordReady;
          ctx.fillText(isUnlockable ? '📬' : '🔒', obj.x, obj.y + 28);

          if (isUnlockable && !this.state.unlocked.contact) {
            // Glow effect
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 20;
            ctx.fillText('📬', obj.x, obj.y + 28);
            ctx.shadowBlur = 0;
          }
          break;
      }
    }
  }

  drawCollectibles(ctx) {
    const time = Date.now();

    for (const item of this.collectibles) {
      if (item.collected) continue;

      // Check if blueprint requires unlock
      if (item.requiresUnlock && !this.state.unlocked[item.requiresUnlock]) {
        continue; // Don't show this item yet
      }

      // Floating animation
      const float = Math.sin(time / 300 + item.x) * 4;

      // Different glow for pages vs blueprints
      if (item.type === 'blueprint') {
        ctx.shadowColor = '#3498db';
        ctx.shadowBlur = 18;

        // Draw rounded background
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.roundRect(item.x - 2, item.y + float, 28, 20, 4);
        ctx.fill();

        // Draw text label (DB, UI, API)
        ctx.fillStyle = '#3498db';
        ctx.font = 'bold 12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(item.label || '?', item.x + 12, item.y + 15 + float);
        ctx.textAlign = 'left';
      } else {
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 15;
        ctx.drawImage(this.sprites.page, item.x, item.y + float);
      }

      ctx.shadowBlur = 0;

      // Hint
      const dist = Math.hypot(
        (this.player.x + 16) - (item.x + 12),
        (this.player.y + 16) - (item.y + 12)
      );
      if (dist < 60) {
        ctx.fillStyle = item.type === 'blueprint' ? '#3498db' : '#ffd700';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('GET', item.x + 12, item.y - 10 + float);
        ctx.textAlign = 'left';
      }
    }
  }

  drawNPCs(ctx) {
    for (const npc of this.npcs) {
      // Body
      ctx.fillStyle = npc.color;
      ctx.fillRect(npc.x, npc.y, npc.width, npc.height);

      // Portrait
      ctx.font = '24px Arial';
      ctx.fillText(npc.portrait, npc.x + 4, npc.y + 26);

      // Name
      ctx.fillStyle = '#fff';
      ctx.font = '10px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, npc.x + 16, npc.y - 8);
      ctx.textAlign = 'left';

      // Special rendering for Craftsman
      if (npc.id === 'craftsman') {
        if (npc.swordReady) {
          // Show completed sword with glow
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 15;
          ctx.font = '28px Arial';
          ctx.fillText('🗡️', npc.x + 35, npc.y + 30);
          ctx.shadowBlur = 0;
        } else {
          // Show blueprint progress
          const bpCount = this.state.blueprintsFound.length;
          ctx.fillStyle = bpCount === 3 ? '#2ecc71' : '#f39c12';
          ctx.font = '8px \"Press Start 2P\"';
          ctx.textAlign = 'center';
          ctx.fillText(bpCount + '/3 📐', npc.x + 16, npc.y + 45);
          ctx.textAlign = 'left';
        }
      }

      // Interaction hint
      const dist = Math.hypot(
        (this.player.x + 16) - (npc.x + 16),
        (this.player.y + 16) - (npc.y + 16)
      );
      if (dist < 50) {
        ctx.fillStyle = '#ffd700';
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('E', npc.x + 16, npc.y - 24);
        ctx.textAlign = 'left';
      }
    }
  }

  drawEnemies(ctx) {
    for (const enemy of this.enemies) {
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(enemy.x + 12, enemy.y + 22, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Enemy sprite
      const bob = enemy.frame === 1 ? 2 : 0;
      ctx.drawImage(this.sprites.bug, enemy.x, enemy.y + bob);

      // HP bar
      if (enemy.hp < enemy.maxHp) {
        ctx.fillStyle = '#333';
        ctx.fillRect(enemy.x, enemy.y - 8, 24, 4);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(enemy.x, enemy.y - 8, 24 * (enemy.hp / enemy.maxHp), 4);
      }
    }
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  drawPlayer(ctx) {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(this.player.x + 16, this.player.y + 30, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Invincibility flash
    if (this.player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Bob animation
    const bob = this.player.isMoving ? Math.sin(Date.now() / 100) * 2 : 0;

    // Attack animation
    if (this.player.isAttacking) {
      ctx.save();
      ctx.translate(this.player.x + 16, this.player.y + 16);

      let rotation = 0;
      switch (this.player.direction) {
        case 'right': rotation = 0; break;
        case 'down': rotation = Math.PI / 2; break;
        case 'left': rotation = Math.PI; break;
        case 'up': rotation = -Math.PI / 2; break;
      }
      ctx.rotate(rotation);

      // Sword swing
      ctx.fillStyle = '#bdc3c7';
      ctx.fillRect(16, -4, 24, 8);
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(14, -4, 4, 8);

      ctx.restore();
    }

    ctx.drawImage(this.sprites.player, this.player.x, this.player.y + bob);

    ctx.globalAlpha = 1;
  }

  drawMinimap() {
    const miniCanvas = document.getElementById('minimap-canvas');
    if (!miniCanvas) return;
    const mctx = miniCanvas.getContext('2d');
    const scale = 0.15;

    // Background
    mctx.fillStyle = '#2d3436';
    mctx.fillRect(0, 0, 150, 100);

    mctx.fillStyle = '#6ab04c';
    mctx.fillRect(5, 5, 140, 90);

    // Paths
    mctx.fillStyle = '#c4a76c';
    mctx.fillRect(5, 45, 140, 10);
    mctx.fillRect(70, 5, 10, 90);

    // Collectibles
    mctx.fillStyle = '#ffd700';
    for (const item of this.collectibles) {
      if (!item.collected) {
        mctx.fillRect(item.x * scale + 5, item.y * scale + 5, 6, 6);
      }
    }

    // Computer
    const comp = this.interactables.find(o => o.type === 'computer');
    if (comp) {
      mctx.fillStyle = comp.fixed ? '#3498db' : '#e74c3c';
      mctx.fillRect(comp.x * scale + 5, comp.y * scale + 5, 8, 8);
    }

    // Bug nest
    const nest = this.interactables.find(o => o.type === 'nest');
    if (nest) {
      mctx.fillStyle = '#9b59b6';
      mctx.fillRect(nest.x * scale + 5, nest.y * scale + 5, 8, 8);
    }

    // Enemies
    mctx.fillStyle = '#e74c3c';
    for (const enemy of this.enemies) {
      mctx.fillRect(enemy.x * scale + 5, enemy.y * scale + 5, 4, 4);
    }

    // Player
    mctx.fillStyle = '#f1c40f';
    mctx.fillRect(this.player.x * scale + 5, this.player.y * scale + 5, 6, 6);

    // Border
    mctx.strokeStyle = '#ffd700';
    mctx.lineWidth = 2;
    mctx.strokeRect(2, 2, 146, 96);
  }
}

// Initialize
const game = new RPGGame();
