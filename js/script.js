/**
 * ========================================
 * PORTFOLIO INTERACTIVITY SCRIPT
 * Handles: Theme toggle, smooth scroll, accordions,
 * form validation, API integrations
 * ========================================
 */

// ---------- Smooth scrolling ----------
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const siteState = {
  level: 'all',
  type: 'all',
  sort: 'newest',
  loggedIn: false,
  projectsVisible: true
};

// Only handle in-page links like <a href="#about">
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    // Optional: update hash without jump
    history.pushState(null, '', id);
  });
});

// ---------- Dark mode toggle with memory ----------
const root = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');
const STORAGE_KEY = 'theme'; // 'dark' or 'light'
const NAME_KEY = 'visitorName';
const LOGIN_KEY = 'isLoggedIn';
const PROJECT_VIS_KEY = 'projectsVisible';
const greeting = document.getElementById('greeting');
const visitorNameInput = document.getElementById('visitorName');
const nameStatus = document.getElementById('nameStatus');
const loginToggle = document.getElementById('loginToggle');
const loginStatus = document.getElementById('loginStatus');
const projectsVisibilityBtn = document.getElementById('projectsVisibility');
const projectsSection = document.getElementById('projects');
const timeOnPage = document.getElementById('timeOnPage');

// Apply a theme ('dark' or 'light')
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  toggleBtn.setAttribute('aria-pressed', String(theme === 'dark'));
  toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

// Initialize: use saved theme or system preference
(function initTheme(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(systemDark ? 'dark' : 'light');
  }
})();

// Toggle on click and save
let themePulseTimer = null;
toggleBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
  toggleBtn.classList.remove('theme-toggle--pulse');
  if (themePulseTimer) clearTimeout(themePulseTimer);
  // Trigger a gentle pulse animation to emphasize the change
  requestAnimationFrame(() => {
    toggleBtn.classList.add('theme-toggle--pulse');
    themePulseTimer = setTimeout(() => {
      toggleBtn.classList.remove('theme-toggle--pulse');
    }, 500);
  });
});

// ---------- Weather in nav ----------
const weatherTemp = document.getElementById('weatherTemp');
const weatherState = document.getElementById('weatherState');
const weatherRefresh = document.getElementById('weatherRefresh');
// KFUPM / Dhahran coordinates
const WEATHER_LAT = 26.304;
const WEATHER_LON = 50.150;
const WEATHER_ENDPOINT = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current=temperature_2m,weather_code&timezone=auto`;

const weatherCodeLabels = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  85: 'Snow showers',
  86: 'Snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm w/ hail',
  99: 'Thunderstorm w/ hail'
};

if (weatherTemp && weatherState && weatherRefresh) {
  const setWeatherStatus = (tempText, stateText, isError = false) => {
    weatherTemp.textContent = tempText;
    weatherState.textContent = stateText;
    weatherState.classList.toggle('is-error', isError);
  };

  const fetchWeather = async (trigger = 'auto') => {
    weatherRefresh.disabled = true;
    setWeatherStatus('--°', 'Loading weather...');
    try {
      const response = await fetch(WEATHER_ENDPOINT, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Weather request failed (${response.status})`);

      const payload = await response.json();
      const current = payload?.current;
      const temp = current?.temperature_2m;
      const code = current?.weather_code;

      if (typeof temp !== 'number' || typeof code !== 'number') {
        throw new Error('Missing weather fields');
      }

      const tempRounded = Math.round(temp);
      const stateText = weatherCodeLabels[code] || 'Weather update';
      setWeatherStatus(`${tempRounded}°`, trigger === 'manual' ? `${stateText} (refreshed)` : stateText);
    } catch (error) {
      console.error('Weather fetch failed:', error);
      setWeatherStatus('--°', 'Weather unavailable', true);
    } finally {
      weatherRefresh.disabled = false;
    }
  };

  weatherRefresh.addEventListener('click', () => fetchWeather('manual'));
  fetchWeather('auto');
}

// ---------- Session + personalization ----------
const formatClock = totalSeconds => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const padded = n => String(n).padStart(2, '0');
  return `${padded(minutes)}:${padded(seconds)}`;
};

if (greeting && visitorNameInput && nameStatus) {
  const savedName = localStorage.getItem(NAME_KEY);
  const setGreeting = (name, source = 'new') => {
    const clean = name?.trim();
    if (clean) {
      greeting.textContent = `Hey ${clean}, welcome${source === 'returning' ? ' back' : ''}!`;
      nameStatus.textContent = 'Saved your name for next time.';
    } else {
      greeting.textContent = 'Tell me your name so I can greet you.';
      nameStatus.textContent = '';
    }
  };

  if (savedName) {
    visitorNameInput.value = savedName;
    setGreeting(savedName, 'returning');
  }

  visitorNameInput.addEventListener('input', () => {
    const value = visitorNameInput.value.trim();
    if (value.length >= 2) {
      localStorage.setItem(NAME_KEY, value);
      setGreeting(value);
    } else {
      localStorage.removeItem(NAME_KEY);
      setGreeting('');
    }
  });
}

if (loginToggle && loginStatus) {
  const savedLogin = localStorage.getItem(LOGIN_KEY);
  siteState.loggedIn = savedLogin === 'true';
  const updateLoginUI = () => {
    loginToggle.setAttribute('aria-pressed', String(siteState.loggedIn));
    loginToggle.textContent = siteState.loggedIn ? 'Log out' : 'Log in';
    loginStatus.textContent = siteState.loggedIn
      ? 'You are logged in. Advanced projects unlocked.'
      : 'You are logged out. You can still browse everything.';
  };
  updateLoginUI();
  loginToggle.addEventListener('click', () => {
    siteState.loggedIn = !siteState.loggedIn;
    localStorage.setItem(LOGIN_KEY, String(siteState.loggedIn));
    updateLoginUI();
    document.dispatchEvent(new Event('project-preferences-changed'));
  });
}

if (projectsVisibilityBtn && projectsSection) {
  const savedVisibility = localStorage.getItem(PROJECT_VIS_KEY);
  if (savedVisibility === 'false') {
    siteState.projectsVisible = false;
    projectsSection.hidden = true;
  }

  const updateProjectsToggle = () => {
    projectsVisibilityBtn.textContent = siteState.projectsVisible ? 'Hide projects' : 'Show projects';
    projectsVisibilityBtn.setAttribute('aria-pressed', String(!siteState.projectsVisible));
  };
  updateProjectsToggle();

  projectsVisibilityBtn.addEventListener('click', () => {
    siteState.projectsVisible = !siteState.projectsVisible;
    projectsSection.hidden = !siteState.projectsVisible;
    localStorage.setItem(PROJECT_VIS_KEY, String(siteState.projectsVisible));
    updateProjectsToggle();
  });
}

if (timeOnPage) {
  let seconds = 0;
  timeOnPage.textContent = formatClock(seconds);
  setInterval(() => {
    seconds += 1;
    timeOnPage.textContent = formatClock(seconds);
  }, 1000);
}

// ---------- Projects accordion ----------
const projectCards = Array.from(document.querySelectorAll('.project-card'));
const projectsList = document.querySelector('.projects-list');
const projectsEmptyMessage = document.getElementById('projectsEmpty');
const projectFilter = document.getElementById('projectFilter');
const projectSort = document.getElementById('projectSort');
const projectLevelButtons = document.querySelectorAll('#projectLevel button');
const levelMessage = document.getElementById('levelMessage');

const updateEmptyState = visibleCount => {
  if (!projectsEmptyMessage) return;
  if (visibleCount === 0) {
    projectsEmptyMessage.hidden = false;
    projectsEmptyMessage.classList.add('reveal', 'is-visible');
  } else {
    projectsEmptyMessage.hidden = true;
    projectsEmptyMessage.classList.remove('is-visible');
  }
};

const setLevelMessage = level => {
  if (!levelMessage) return;
  const levelText = {
    all: 'Showing beginner-friendly and advanced picks.',
    beginner: 'Beginner view: focused on approachable, well-documented builds.',
    advanced: siteState.loggedIn
      ? 'Advanced view: highlighting bigger builds and AI experiments.'
      : 'Advanced view: you can still browse, but log in to save these picks.'
  };
  levelMessage.textContent = levelText[level] || levelText.all;
};

const applyProjectFilters = () => {
  if (!projectsList) return;
  const selectedType = projectFilter ? projectFilter.value : 'all';
  const sortMode = projectSort ? projectSort.value : 'newest';
  const selectedLevel = siteState.level;

  const visibleCards = [];

  projectCards.forEach(card => {
    const matchesType = selectedType === 'all' || card.dataset.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || card.dataset.level === selectedLevel;
    const isVisible = matchesType && matchesLevel;
    card.hidden = !isVisible;
    if (isVisible) visibleCards.push(card);
  });

  const sortedCards = [...visibleCards].sort((a, b) => {
    if (sortMode === 'title') {
      return a.querySelector('.project-title').textContent.localeCompare(
        b.querySelector('.project-title').textContent
      );
    }
    const dateA = new Date(a.dataset.date);
    const dateB = new Date(b.dataset.date);
    return sortMode === 'oldest' ? dateA - dateB : dateB - dateA;
  });

  sortedCards.forEach(card => projectsList.appendChild(card));
  updateEmptyState(sortedCards.length);
  setLevelMessage(selectedLevel);
};

if (projectFilter) projectFilter.addEventListener('change', () => applyProjectFilters());
if (projectSort) projectSort.addEventListener('change', () => applyProjectFilters());
projectLevelButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const level = btn.dataset.level || 'all';
    siteState.level = level;
    projectLevelButtons.forEach(button => button.classList.toggle('is-active', button === btn));
    applyProjectFilters();
  });
});
document.addEventListener('project-preferences-changed', () => applyProjectFilters());
applyProjectFilters();

projectCards.forEach(card => {
  const toggle = card.querySelector('.project-toggle');
  const content = card.querySelector('.project-content');
  if (!toggle || !content) return;

  const startExpanded = toggle.getAttribute('aria-expanded') === 'true';
  card.classList.toggle('is-open', startExpanded);

  const hideContent = event => {
    if (event.propertyName !== 'opacity') return;
    if (toggle.getAttribute('aria-expanded') === 'true') return;
    content.hidden = true;
    content.removeEventListener('transitionend', hideContent);
  };

  if (prefersReduced) {
    content.hidden = !startExpanded;
    if (startExpanded) content.classList.add('is-visible');

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      content.hidden = expanded;
      card.classList.toggle('is-open', !expanded);
    });
    return;
  }

  if (startExpanded) {
    content.hidden = false;
    content.classList.add('is-visible');
  } else {
    content.hidden = true;
    content.classList.remove('is-visible');
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';

    if (expanded) {
      toggle.setAttribute('aria-expanded', 'false');
      card.classList.remove('is-open');
      content.classList.remove('is-visible');
      content.addEventListener('transitionend', hideContent);
    } else {
      toggle.setAttribute('aria-expanded', 'true');
      card.classList.add('is-open');
      content.removeEventListener('transitionend', hideContent);
      content.hidden = false;
      requestAnimationFrame(() => {
        content.classList.add('is-visible');
      });
    }
  });
});

// ---------- Scroll reveal animations ----------
const revealElements = document.querySelectorAll('.reveal');
if (prefersReduced) {
  revealElements.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  revealElements.forEach(el => revealObserver.observe(el));
}

// ---------- Advice of the day ----------
const adviceText = document.getElementById('adviceText');
const adviceRefresh = document.getElementById('adviceRefresh');
const adviceStatus = document.getElementById('adviceStatus');
const ADVICE_ENDPOINT = 'https://api.adviceslip.com/advice';

if (adviceText && adviceRefresh && adviceStatus) {
  const setAdviceLoading = () => {
    adviceText.textContent = 'Fetching advice...';
    adviceStatus.textContent = 'Loading new advice...';
    adviceStatus.classList.remove('is-error');
    adviceRefresh.disabled = true;
    adviceRefresh.setAttribute('aria-busy', 'true');
  };

  const setAdviceIdle = () => {
    adviceRefresh.disabled = false;
    adviceRefresh.removeAttribute('aria-busy');
  };

  const showAdviceStatus = (message, isError = false) => {
    adviceStatus.textContent = message;
    adviceStatus.classList.toggle('is-error', isError);
  };

  const fetchAdvice = async (trigger = 'auto') => {
    setAdviceLoading();
    try {
      const response = await fetch(`${ADVICE_ENDPOINT}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const payload = await response.json();
      const advice = payload?.slip?.advice;
      if (!advice) {
        throw new Error('Advice not found in response.');
      }

      adviceText.textContent = `"${advice}"`;
      showAdviceStatus(trigger === 'manual' ? 'Here\'s another piece of advice.' : 'Loaded today\'s advice.');
    } catch (error) {
      console.error('Advice fetch failed:', error);
      adviceText.textContent = 'No advice available right now.';
      showAdviceStatus('Could not load advice. Please try again.', true);
    } finally {
      setAdviceIdle();
    }
  };

  adviceRefresh.addEventListener('click', () => fetchAdvice('manual'));
  fetchAdvice('auto');
}

// ---------- Latest GitHub repositories ----------
const githubList = document.getElementById('githubRepos');
const githubStatus = document.getElementById('githubStatus');
const githubRefresh = document.getElementById('githubRefresh');
const GITHUB_USER = 'Rayan-Alamri';
const GITHUB_ENDPOINT = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=5`;

if (githubList && githubStatus && githubRefresh) {
  const setGithubStatus = (message, isError = false) => {
    githubStatus.textContent = message;
    githubStatus.classList.toggle('is-error', isError);
  };

  const formatUpdated = isoDate => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return 'Updated recently';
    const diffDays = Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Updated today';
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 30) return `Updated ${diffDays} days ago`;
    return `Updated on ${date.toLocaleDateString()}`;
  };

  const renderRepos = repos => {
    githubList.innerHTML = '';
    if (!repos.length) {
      const empty = document.createElement('li');
      empty.className = 'github-empty';
      empty.textContent = 'No recent repositories to show.';
      githubList.appendChild(empty);
      return;
    }

    repos.forEach(repo => {
      const item = document.createElement('li');
      item.className = 'github-item';

      const title = document.createElement('a');
      title.href = repo.html_url;
      title.target = '_blank';
      title.rel = 'noreferrer noopener';
      title.textContent = repo.name || 'Untitled repository';

      const desc = document.createElement('p');
      desc.className = 'github-desc';
      desc.textContent = repo.description || 'No description provided.';

      const meta = document.createElement('div');
      meta.className = 'github-meta';
      if (repo.language) {
        const lang = document.createElement('span');
        lang.textContent = repo.language;
        meta.appendChild(lang);
      }
      const updated = document.createElement('span');
      updated.textContent = formatUpdated(repo.updated_at);
      meta.appendChild(updated);

      item.appendChild(title);
      item.appendChild(desc);
      item.appendChild(meta);
      githubList.appendChild(item);
    });
  };

  const fetchRepos = async (trigger = 'auto') => {
    githubRefresh.disabled = true;
    githubList.setAttribute('aria-busy', 'true');
    setGithubStatus('Loading latest repositories...');

    try {
      const response = await fetch(GITHUB_ENDPOINT, {
        cache: 'no-store',
        headers: { Accept: 'application/vnd.github+json' }
      });

      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status}`);
      }

      const payload = await response.json();
      const repos = Array.isArray(payload) ? payload.filter(repo => !repo.fork) : [];

      renderRepos(repos);
      setGithubStatus(trigger === 'manual' ? 'Refreshed from GitHub.' : 'Latest repositories loaded.');
    } catch (error) {
      console.error('GitHub fetch failed:', error);
      if (!githubList.children.length) {
        renderRepos([]);
      }
      setGithubStatus('Could not load GitHub repositories. Please try again.', true);
    } finally {
      githubRefresh.disabled = false;
      githubList.removeAttribute('aria-busy');
    }
  };

  githubRefresh.addEventListener('click', () => fetchRepos('manual'));
  fetchRepos('auto');
}

// ---------- Contact form feedback ----------
const contactForm = document.querySelector('#contact form');
const formStatus = document.getElementById('formStatus');
let formStatusTimer = null;
let formStatusHideTimer = null;

if (contactForm && formStatus) {
  const nameInput = contactForm.querySelector('#name');
  const emailInput = contactForm.querySelector('#email');
  const emailConfirmInput = contactForm.querySelector('#emailConfirm');
  const messageInput = contactForm.querySelector('#message');
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const minMessageLength = 20;
  const fieldErrors = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    emailConfirm: document.getElementById('emailConfirmError'),
    message: document.getElementById('messageError')
  };

  const resetStatusTimers = () => {
    if (formStatusTimer) {
      clearTimeout(formStatusTimer);
      formStatusTimer = null;
    }
    if (formStatusHideTimer) {
      clearTimeout(formStatusHideTimer);
      formStatusHideTimer = null;
    }
  };

  const hideFormStatus = () => {
    formStatus.classList.remove('is-visible');
    formStatusTimer = null;
    formStatusHideTimer = setTimeout(() => {
      formStatus.hidden = true;
      formStatusHideTimer = null;
    }, 300);
  };

  const showFormStatus = (message, type = 'info') => {
    resetStatusTimers();
    formStatus.hidden = false;
    formStatus.textContent = message;
    formStatus.classList.remove('is-error', 'is-success');
    if (type === 'error') {
      formStatus.classList.add('is-error');
    } else if (type === 'success') {
      formStatus.classList.add('is-success');
      formStatusTimer = setTimeout(hideFormStatus, 4000);
    }
    requestAnimationFrame(() => formStatus.classList.add('is-visible'));
  };

  const setFieldError = (input, message) => {
    if (!input) return;
    const errorElement = fieldErrors[input.name];
    if (!errorElement) return;

    if (message) {
      errorElement.textContent = message;
      errorElement.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      if (typeof input.setCustomValidity === 'function') {
        input.setCustomValidity(message);
      }
    } else {
      errorElement.textContent = '';
      errorElement.hidden = true;
      input.removeAttribute('aria-invalid');
      if (typeof input.setCustomValidity === 'function') {
        input.setCustomValidity('');
      }
    }
  };

  const validateField = (input, showEmptyError = false) => {
    if (!input) return true;
    const value = input.value.trim();
    let message = '';

    switch (input.name) {
      case 'name':
        if (!value && showEmptyError) {
          message = 'Please enter your name.';
        }
        break;
      case 'email':
        if (!value) {
          if (showEmptyError) {
            message = 'Please enter your email address.';
          }
        } else if (!emailPattern.test(value)) {
          message = 'Please enter a valid email address (e.g. name@example.com).';
        }
        break;
      case 'emailConfirm':
        if (!value) {
          if (showEmptyError) {
            message = 'Please confirm your email.';
          }
        } else if (!emailPattern.test(value)) {
          message = 'Please enter a valid confirmation email.';
        } else if (emailInput && value !== emailInput.value.trim()) {
          message = 'Email and confirmation must match.';
        }
        break;
      case 'message':
        if (!value && showEmptyError) {
          message = 'Please enter a message.';
        } else if (value && value.length < minMessageLength) {
          message = `Message should be at least ${minMessageLength} characters.`;
        }
        break;
      default:
        break;
    }

    setFieldError(input, message);
    return message === '';
  };

  const inputs = [nameInput, emailInput, emailConfirmInput, messageInput].filter(Boolean);

  const clearStatusIfResolved = () => {
    if (
      !inputs.length ||
      !formStatus.classList.contains('is-error') ||
      formStatus.hidden
    ) {
      return;
    }
    const hasInvalid = inputs.some(input => input.getAttribute('aria-invalid') === 'true');
    if (!hasInvalid) {
      hideFormStatus();
    }
  };

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      validateField(input, false);
      if (input.name === 'email' && emailConfirmInput) {
        validateField(emailConfirmInput, false);
      }
      clearStatusIfResolved();
    });
    input.addEventListener('blur', () => validateField(input, true));
  });

  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const isNameValid = validateField(nameInput, true);
    const isEmailValid = validateField(emailInput, true);
    const isEmailConfirmValid = validateField(emailConfirmInput, true);
    const isMessageValid = validateField(messageInput, true);

    if (!isNameValid || !isEmailValid || !isEmailConfirmValid || !isMessageValid) {
      showFormStatus('Please fix the highlighted fields.', 'error');
      const firstInvalid = inputs.find(input => input.getAttribute('aria-invalid') === 'true');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    showFormStatus('Sending message...', 'info');

    setTimeout(() => {
      showFormStatus('Thanks! Your message was sent (demo).', 'success');
      contactForm.reset();
      inputs.forEach(input => setFieldError(input, ''));
    }, 600);
  });
}
