/* ============================================
   MAIN.JS — Lost in the Scroll  v2.0
   ============================================ */

const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
const storage = createStorageAdapter();

// ── GLOBAL STATE ──
const caseName = "CASE #4471 — THE RENDER MURDERS";
let cluesFound = 0;
let suspectsInterrogated = 0;
let introComplete = false;
let introTimeline = null;
let smoother = null;
const mobileStoryMedia = window.matchMedia('(max-width: 900px)');
let currentMurdererKey = null;
const foundClueKeys = new Set();
const interrogatedSuspectKeys = new Set();

// Mouse position
let mouseX = 0, mouseY = 0;
let parallaxRaf = null;

// All DOM refs populated in DOMContentLoaded
let dom = {};

function createStorageAdapter() {
  const memoryStore = new Map();

  function safeGet(method, key, value) {
    try {
      return window.localStorage[method](key, value);
    } catch (error) {
      if (method === 'getItem') {
        return memoryStore.has(key) ? memoryStore.get(key) : null;
      }
      if (method === 'removeItem') {
        memoryStore.delete(key);
        return null;
      }
      memoryStore.set(key, String(value));
      return null;
    }
  }

  return {
    getItem(key) {
      return safeGet('getItem', key);
    },
    setItem(key, value) {
      safeGet('setItem', key, value);
    },
    removeItem(key) {
      safeGet('removeItem', key);
    }
  };
}

function addMediaQueryChangeListener(mediaQueryList, handler) {
  if (!mediaQueryList) return;
  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', handler);
    return;
  }
  if (typeof mediaQueryList.addListener === 'function') {
    mediaQueryList.addListener(handler);
  }
}

function isMotionReduced() {
  return reducedMotionMedia.matches || storage.getItem('motionReduction') === 'true';
}

function getClueKey(clueEl, fallbackIndex) {
  return (clueEl && clueEl.dataset && clueEl.dataset.clue) || String(fallbackIndex);
}

function syncCaseProgressUI() {
  cluesFound = foundClueKeys.size;
  suspectsInterrogated = interrogatedSuspectKeys.size;

  const clueCounter = document.querySelector('.clues-count');
  if (clueCounter) clueCounter.textContent = String(cluesFound);

  const savedClues = document.querySelector('#saved-clues');
  const savedSuspects = document.querySelector('#saved-suspects');
  if (savedClues) savedClues.textContent = String(cluesFound);
  if (savedSuspects) savedSuspects.textContent = String(suspectsInterrogated);

  document.querySelectorAll('.clue-item').forEach((clueEl, idx) => {
    const found = foundClueKeys.has(getClueKey(clueEl, idx));
    clueEl.classList.toggle('found', found);
    const evItem = document.querySelector('#ev-' + idx);
    if (evItem) evItem.classList.toggle('found', found);
  });

  document.querySelectorAll('.suspect-card').forEach((card) => {
    const suspectKey = card.dataset.suspect;
    card.classList.toggle('interrogated', interrogatedSuspectKeys.has(suspectKey));
  });

  document.querySelectorAll('.sus-row').forEach((row) => {
    const suspectKey = row.id.replace('sus-', '');
    row.classList.toggle('done', interrogatedSuspectKeys.has(suspectKey));
  });

  const prompt = document.querySelector('#interrogation-prompt');
  const lockMsg = document.querySelector('#scroll-lock-msg');
  if (suspectsInterrogated >= 4) {
    if (prompt) prompt.textContent = '✓ ALL SUSPECTS QUESTIONED — SCROLL TO CONTINUE';
    if (lockMsg) lockMsg.style.opacity = '0';
  } else {
    const remaining = Math.max(0, 4 - suspectsInterrogated);
    if (prompt) prompt.textContent = 'CLICK A SUSPECT — REVEAL THEIR SECRETS';
    if (lockMsg) {
      lockMsg.style.opacity = '1';
      lockMsg.textContent = `${remaining} SUSPECT${remaining === 1 ? '' : 'S'} REMAINING`;
    }
  }

  renderCaseConclusionReveal();
}

function saveCaseProgress() {
  storage.setItem('cluesFound', String(cluesFound));
  storage.setItem('suspectsInterrogated', String(suspectsInterrogated));
  storage.setItem('foundClues', JSON.stringify(Array.from(foundClueKeys)));
  storage.setItem('interrogatedSuspects', JSON.stringify(Array.from(interrogatedSuspectKeys)));
  storage.setItem('currentMurdererKey', getCurrentMurdererKey());
  storage.setItem('savedAt', new Date().toLocaleTimeString());
}

function loadCaseProgress() {
  foundClueKeys.clear();
  interrogatedSuspectKeys.clear();

  const clueButtons = Array.from(document.querySelectorAll('.clue-item'));
  const suspectCards = Array.from(document.querySelectorAll('.suspect-card'));
  const savedMurdererKey = storage.getItem('currentMurdererKey');
  let hasSavedData = false;

  currentMurdererKey = MURDERERS.includes(savedMurdererKey) ? savedMurdererKey : null;

  try {
    const savedClues = JSON.parse(storage.getItem('foundClues') || '[]');
    if (Array.isArray(savedClues) && savedClues.length) {
      savedClues.forEach((key) => foundClueKeys.add(String(key)));
      hasSavedData = true;
    }
  } catch (error) {
    console.warn('Unable to parse saved clues', error);
  }

  try {
    const savedSuspects = JSON.parse(storage.getItem('interrogatedSuspects') || '[]');
    if (Array.isArray(savedSuspects) && savedSuspects.length) {
      savedSuspects.forEach((key) => interrogatedSuspectKeys.add(String(key)));
      hasSavedData = true;
    }
  } catch (error) {
    console.warn('Unable to parse saved suspects', error);
  }

  if (!hasSavedData) {
    const legacyClueCount = parseInt(storage.getItem('cluesFound') || '0', 10) || 0;
    const legacySuspectCount = parseInt(storage.getItem('suspectsInterrogated') || '0', 10) || 0;

    clueButtons.slice(0, legacyClueCount).forEach((clueEl, idx) => {
      foundClueKeys.add(getClueKey(clueEl, idx));
    });
    suspectCards.slice(0, legacySuspectCount).forEach((card) => {
      interrogatedSuspectKeys.add(card.dataset.suspect);
    });

    hasSavedData = legacyClueCount > 0 || legacySuspectCount > 0;
  }

  syncCaseProgressUI();
  return hasSavedData;
}

function announceDarkroomLabel(text) {
  if (!dom.darkroomLiveRegion || !text) return;
  dom.darkroomLiveRegion.textContent = '';
  window.setTimeout(() => {
    if (dom.darkroomLiveRegion) dom.darkroomLiveRegion.textContent = `${text} developed.`;
  }, 30);
}


/* ─────────────────────────────────────────────
   DOM READY
   ───────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {

  dom = {
    introScene:      document.querySelector('#intro-scene'),
    scrollWrapper:   document.querySelector('#scroll-wrapper'),
    continuePrompt:  document.querySelector('#continue-prompt'),
    bloodOverlay:    document.querySelector('#blood-overlay'),
    bloodDripBar:    document.querySelector('#blood-drip-bar'),
    progressBar:     document.querySelector('#progress-bar'),
    chapterNav:      document.querySelector('#chapter-nav'),
    flashlightEl:    document.querySelector('#flashlight-overlay'),
    darkroomFlash:   document.querySelector('#darkroom-flashlight'),
    darkroomLiveRegion: document.querySelector('#darkroom-labels-live'),
    scrollHint:      document.querySelector('#scroll-hint'),
    cursor:          document.querySelector('#custom-cursor'),
    skipBtn:         document.querySelector('#skip-intro-btn'),
    introMurderer:   document.querySelector('#intro-murderer'),
    introShooting:   document.querySelector('#intro-shooting'),
    introVictim:     document.querySelector('#intro-victim'),
    introVictimDead: document.querySelector('#intro-victim-dead'),
  };

  initRain('intro-rain');
  setupMouseListeners();
  setupKeyboard();
  setupNavDots();
  setupContinuePrompt();
  setupSkipButton();
  initThemeSystem();

  if (dom.progressBar) dom.progressBar.setAttribute('aria-valuenow', '0');

  console.log(
    '%c╔════════════════════════════════╗\n║  JAVANOIR  v3.0        ║\n║  Open DevTools to begin (F12)  ║\n╚════════════════════════════════╝',
    'color: #00ff41; font-family: monospace; font-size: 11px;'
  );

  const title = document.querySelector('#intro-title');
  if (title) gsap.to(title, { opacity: 1, duration: 0.8, delay: 0.3 });

  setTimeout(startIntroSequence, 600);
});


/* ─────────────────────────────────────────────
   THEME SYSTEM — hamburger menu, light/dark/system
   ───────────────────────────────────────────── */
function initThemeSystem() {
  const btn   = document.querySelector('#hamburger-btn');
  const menu  = document.querySelector('#hamburger-menu');
  const items = document.querySelectorAll('[data-theme-choice]');

  if (!btn || !menu) return;

  // Load saved preference (default to dark)
  const saved = storage.getItem('theme') || 'dark';
  if (!storage.getItem('theme')) {
    storage.setItem('theme', 'dark');
  }
  applyTheme(saved);
  setActiveThemeBtn(saved);

  const closeMenu = () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  };

  // Hamburger toggle
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== btn) {
      closeMenu();
    }
  });

  // Theme buttons (both in hamburger menu and elsewhere like Chapter 6)
  items.forEach(item => {
    item.addEventListener('click', () => {
      const choice = item.dataset.themeChoice;
      storage.setItem('theme', choice);
      applyTheme(choice);
      setActiveThemeBtn(choice);
      closeMenu();
      console.log('%c🎨 Theme set to: ' + choice + (choice === 'light' ? ' (UV Blacklight)' : ''), 'color: #a855ff;');
    });
  });

  // Close menu on Escape for keyboard users.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Listen for system changes when in system mode
  addMediaQueryChangeListener(colorSchemeMedia, () => {
    if (storage.getItem('theme') === 'system') applyTheme('system');
  });
  addMediaQueryChangeListener(reducedMotionMedia, () => {
    setMotionActive(storage.getItem('motionReduction') === 'true');
  });

  // Motion reduction toggle
  const motionBtn = document.querySelector('#motion-toggle');
  if (motionBtn) {
    const savedMotion = storage.getItem('motionReduction') === 'true';
    setMotionActive(savedMotion);

    motionBtn.addEventListener('click', () => {
      const enabled = storage.getItem('motionReduction') === 'true';
      const newState = !enabled;
      storage.setItem('motionReduction', String(newState));
      setMotionActive(newState);
      closeMenu();
      console.log('%c⏸️ Motion Reduction: ' + (newState ? 'ON' : 'OFF'), 'color: #7ab3ff;');
    });
  }
}

function setMotionActive(active) {
  const btn = document.querySelector('#motion-toggle');
  const effectiveMotionReduction = active || reducedMotionMedia.matches;
  if (btn) {
    const label = btn.querySelector('.hm-item-label');
    btn.dataset.motion = String(active);
    btn.classList.toggle('active', effectiveMotionReduction);
    btn.setAttribute('aria-pressed', String(effectiveMotionReduction));
    if (label) {
      label.textContent = effectiveMotionReduction ? 'Reduce Motion: ON' : 'Reduce Motion: OFF';
    }
  }
  document.documentElement.classList.toggle('motion-reduced', effectiveMotionReduction);

  // Kill or restore ScrollSmoother based on motion preference
  if (effectiveMotionReduction && smoother) {
    smoother.kill();
    smoother = null;
  } else if (!effectiveMotionReduction && !smoother && typeof ScrollSmoother !== 'undefined') {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.35,
      effects: true
    });
  }
}

function applyTheme(choice) {
  let resolved;
  if (choice === 'system') {
    resolved = colorSchemeMedia.matches ? 'dark' : 'light';
  } else {
    resolved = choice;
  }
  document.documentElement.setAttribute('data-theme', resolved);
}

function setActiveThemeBtn(choice) {
  document.querySelectorAll('[data-theme-choice]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeChoice === choice);
  });
}


/* ─────────────────────────────────────────────
   MOUSE: cursor + parallax + flashlights
   ───────────────────────────────────────────── */
function setupMouseListeners() {
  document.addEventListener('mousemove', (e) => {
    if (dom.cursor) {
      dom.cursor.style.left = e.clientX + 'px';
      dom.cursor.style.top  = e.clientY + 'px';
    }

    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (!introComplete && !isMotionReduced()) updateParallax();

    // Ch1 flashlight — chapter-relative coords
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (dom.flashlightEl && introComplete) {
      const ch1 = document.querySelector('#chapter-1');
      if (ch1) {
        const r = ch1.getBoundingClientRect();
        const cx = e.clientX - r.left, cy = e.clientY - r.top;
        const detective = ch1.querySelector('.detective-img');
        let hx = r.width * 0.40;
        let hy = r.height * 0.73;

        if (detective) {
          const dr = detective.getBoundingClientRect();
          // Approximate flashlight position in detective's hand.
          hx = dr.left - r.left + dr.width * 0.47;
          hy = dr.top - r.top + dr.height * 0.57;
        }

        dom.flashlightEl.style.background = isLight
          ? `radial-gradient(circle 180px at ${hx}px ${hy}px, rgba(240,210,255,.58) 0%, rgba(185,115,245,.28) 42%, rgba(110,48,170,0) 84%), radial-gradient(circle 200px at ${cx}px ${cy}px, rgba(80,0,160,0.15) 0%, rgba(40,0,100,0.7) 40%, rgba(20,0,60,0.94) 65%, rgba(10,0,40,0.98) 100%)`
          : `radial-gradient(circle 175px at ${hx}px ${hy}px, rgba(210,238,255,.52) 0%, rgba(125,185,255,.24) 40%, rgba(45,88,140,0) 82%), radial-gradient(circle 200px at ${cx}px ${cy}px, transparent 0%, rgba(0,0,0,.97) 100%)`;
        dom.flashlightEl.style.mixBlendMode = isLight ? 'multiply' : 'normal';
      }
    }

    // Ch4 darkroom flashlight
    if (dom.darkroomFlash && dom.darkroomFlash.classList.contains('active')) {
      const ch4 = document.querySelector('#chapter-4');
      if (ch4) {
        const r = ch4.getBoundingClientRect();
        const cx = e.clientX - r.left, cy = e.clientY - r.top;
        dom.darkroomFlash.style.background = isLight
          ? `radial-gradient(circle 220px at ${cx}px ${cy}px, rgba(80,0,180,0.12) 0%, rgba(50,0,130,0.65) 40%, rgba(25,0,80,0.93) 65%, rgba(10,0,40,0.99) 100%)`
          : `radial-gradient(circle 220px at ${cx}px ${cy}px, transparent 0%, rgba(0,0,0,.98) 100%)`;
        dom.darkroomFlash.style.mixBlendMode = isLight ? 'multiply' : 'normal';
      }
    }
  });
}


/* ─────────────────────────────────────────────
   PARALLAX
   ───────────────────────────────────────────── */
function updateParallax() {
  if (parallaxRaf) cancelAnimationFrame(parallaxRaf);
  parallaxRaf = requestAnimationFrame(() => {
    const ease = 'transform 0.12s cubic-bezier(0.25,0.46,0.45,0.94)';
    const layers = {
      '#parallax-sky':   [-4,  -2],
      '#parallax-bgimg': [-7,  -3],
      '#parallax-fg':    [-46, -16],
      '#parallax-chars': [-60, -22],
    };
    Object.entries(layers).forEach(([sel, [mx, my]]) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.transition = ease;
      el.style.transform  = `translate(${mouseX * mx}px, ${mouseY * my}px)`;
    });
    const title = document.querySelector('#intro-title');
    if (title && title.style.opacity !== '0') {
      title.style.transition = ease;
      title.style.transform  = `translate(${mouseX * 8}px, ${mouseY * 4}px)`;
    }
  });
}


/* ─────────────────────────────────────────────
   INTRO ANIMATION — murder in the alley
  Always plays as the opening scene.
   ───────────────────────────────────────────── */
function startIntroSequence() {
  if (isMotionReduced()) { showContinuePrompt(); return; }

  const { introMurderer: murderer, introShooting: shooting,
          introVictim: victimAlive, introVictimDead: victimDead,
  bloodOverlay, introScene } = dom;

  if (!murderer || !shooting || !victimAlive || !victimDead) {
    console.warn('Intro characters missing — skipping to prompt');
    showContinuePrompt();
    return;
  }

  // Initial states
  gsap.set(murderer,    { x: -520, display: 'none', opacity: 1 });
  gsap.set(shooting,    { display: 'none', opacity: 1, x: 0 });
  gsap.set(victimAlive, { display: 'block', opacity: 1 });
  gsap.set(victimDead,  { display: 'none' });

  introTimeline = gsap.timeline({ onComplete: showContinuePrompt });

  // ── 1. Murderer creeps in from left ──
  introTimeline.to(murderer, {
    x: 0, duration: 2.4, ease: 'power1.inOut',
    onStart: () => gsap.set(murderer, { display: 'block' })
  });

  // ── 2. Pause — murderer waits ──
  introTimeline.to({}, { duration: 0.7 });

  // ── 3. Switch to shooting pose ──
  introTimeline.call(() => {
    gsap.set(murderer, { display: 'none' });
    gsap.set(shooting, { display: 'block', x: 0 });
  });
  introTimeline.to({}, { duration: 0.3 });

  // ── 4. GUNSHOT: red screen flash ──
  if (bloodOverlay) {
    introTimeline.to(bloodOverlay, { opacity: 1, duration: 0.04, ease: 'none' });
    introTimeline.to(bloodOverlay, { opacity: 0.5, duration: 0.08, ease: 'none' });
    introTimeline.to(bloodOverlay, { opacity: 0, duration: 0.35, ease: 'power2.out' });
  }

  // ── 5. Screen shake (happens same time as flash) ──
  if (introScene) {
    introTimeline.to(introScene, {
      x: 11, duration: 0.04, ease: 'none', yoyo: true, repeat: 8,
      onComplete: () => gsap.set(introScene, { x: 0 })
    }, '<');
  }

  // ── 6. Victim collapses ──
  introTimeline.call(() => {
    gsap.set(victimAlive, { display: 'none' });
    gsap.set(victimDead,  { display: 'block' });
  });

  // ── 7. Blood drips from top of screen ──
  introTimeline.call(() => animateTopBloodDrip());

  // ── 8. Murderer RETREATS — flees back the way they came ──
  introTimeline.to(shooting, {
    x: -600, opacity: 0, duration: 1.1, ease: 'power2.in', delay: 0.7
  });

  // ── 9. Hold briefly, then prompt ──
  introTimeline.to({}, { duration: 1.8 });
}


/* ─────────────────────────────────────────────
   BLOOD DRIP — drips from top of screen after gunshot, fades at 5s
   ───────────────────────────────────────────── */
function animateTopBloodDrip() {
  const bar = dom.bloodDripBar;
  if (!bar) return;

  // Create 18-25 individual drip streaks across the top
  const count = 18 + Math.floor(Math.random() * 8);
  bar.innerHTML = '';
  bar.style.height = '85vh';

  for (let i = 0; i < count; i++) {
    const drip = document.createElement('div');
    const left = 3 + Math.random() * 94;
    const width = 4 + Math.random() * 8;
    const maxH = 180 + Math.random() * 550;
    const delay = Math.random() * 0.4;
    const hue = 0;
    const lightness = 12 + Math.floor(Math.random() * 12);
    drip.style.cssText = `
      position:absolute;top:0;left:${left}%;width:${width}px;
      height:0;border-radius:0 0 ${width}px ${width}px;
      background:linear-gradient(to bottom,
        hsl(${hue},100%,${lightness}%) 0%,
        hsl(${hue},95%,${lightness - 5}%) 70%,
        hsl(${hue},85%,${lightness - 8}%) 85%,
        transparent 100%);
      opacity:0.92;
    `;
    bar.appendChild(drip);

    // Animate drip growing downward
    gsap.to(drip, {
      height: maxH, duration: 1.0 + Math.random() * 1.3,
      delay: delay, ease: 'power2.out'
    });
    gsap.to(drip, {
      opacity: 0.3, duration: 0.8,
      delay: delay + 1.8 + Math.random() * 0.5, ease: 'power2.in'
    });
  }

  // Fade out after 10 seconds
  gsap.to(bar, {
    opacity: 0, duration: 1.5, delay: 10,
    ease: 'power2.inOut',
    onComplete: () => { bar.style.height = '0'; bar.innerHTML = ''; bar.style.opacity = '1'; }
  });
}


/* ─────────────────────────────────────────────
   CONTINUE PROMPT & SKIP
   ───────────────────────────────────────────── */
function showContinuePrompt() {
  const { continuePrompt } = dom;
  if (continuePrompt) gsap.to(continuePrompt, { opacity: 1, duration: 1.0, ease: 'power2.out' });
}

function setupContinuePrompt() {
  const { continuePrompt } = dom;
  if (!continuePrompt) return;
  continuePrompt.addEventListener('click', beginStory);
}

function setupSkipButton() {
  const { skipBtn } = dom;
  if (!skipBtn) return;
  skipBtn.addEventListener('click', () => {
    if (introTimeline) { introTimeline.kill(); introTimeline = null; }
    const { introMurderer: m, introShooting: s, introVictim: va, introVictimDead: vd, bloodOverlay } = dom;
    if (m)  gsap.set(m,  { display: 'none', x: 0 });
    if (s)  gsap.set(s,  { display: 'none', x: 0, opacity: 1 });
    if (va) gsap.set(va, { display: 'none' });
    if (vd) gsap.set(vd, { display: 'block' });
    if (bloodOverlay) gsap.set(bloodOverlay, { opacity: 0 });
    const dripBar = dom.bloodDripBar;
    if (dripBar) { dripBar.style.height = '0'; dripBar.innerHTML = ''; dripBar.style.opacity = '1'; }
    beginStory();
  });
}

function beginStory() {
  if (introComplete) return;
  introComplete = true;

  // Lock one murderer for this run so interrogation behavior and final reveal match.
  getCurrentMurdererKey();

  const { skipBtn, introScene, scrollWrapper, chapterNav, scrollHint } = dom;
  if (skipBtn) skipBtn.style.display = 'none';

  console.log('%c🔍 CASE FILE OPENED: ' + caseName, 'color: #00ff41; font-size: 14px; font-family: monospace;');
  console.log('%c"The case talks back to me."', 'color: #7ab3ff; font-style: italic;');

  gsap.to(introScene, {
    opacity: 0, duration: 0.8,
    onComplete: () => {
      introScene.style.display = 'none';
      scrollWrapper.style.display = 'block';

      if (mobileStoryMedia.matches) {
        if (chapterNav) chapterNav.style.display = 'none';
        if (scrollHint) scrollHint.style.display = 'none';
        if (dom.progressBar) dom.progressBar.style.display = 'none';
      } else {
        if (chapterNav) gsap.to(chapterNav, { opacity: 1, duration: 0.6 });
        if (scrollHint) gsap.to(scrollHint, { opacity: 1, duration: 0.8, delay: 1 });
      }

      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (mobileStoryMedia.matches) {
          initMobileStoryMode();
        } else {
          initHorizontalScroll();
        }
        initRain('ch1-rain');
        if (document.querySelector('#ch5-rain')) initRain('ch5-rain');
      }));
    }
  });
}

function initMobileStoryMode() {
  const track = document.querySelector('#scroll-track');
  if (track) {
    track.style.transform = 'none';
    track.style.display = 'block';
    track.style.height = 'auto';
  }

  // In mobile mode, reveal case-closed text immediately instead of ScrollTrigger typing.
  document.querySelectorAll('.case-typed[data-typed-text]').forEach((line) => {
    line.textContent = line.dataset.typedText || '';
  });
  const cursor = document.querySelector('#chapter-6 .case-typing-cursor');
  if (cursor) cursor.style.display = 'none';

  initChapter1_Flashlight();
  initChapter2_Interrogation();
  initChapter3_EvidenceWeb();
  initChapter4_Darkroom();
  initChapter5_CaseFile();
}


/* ─────────────────────────────────────────────
   HORIZONTAL SCROLL
   ───────────────────────────────────────────── */
function initHorizontalScroll() {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollSmoother !== 'undefined') gsap.registerPlugin(ScrollSmoother);

  // ScrollSmoother — global smooth scrolling (bypassed for reduced motion)
  if (!smoother && typeof ScrollSmoother !== 'undefined' && !isMotionReduced()) {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.35,
      effects: true
    });
  }

  const track    = document.querySelector('#scroll-track');
  const chapters = document.querySelectorAll('.chapter');
  if (!track) return;

  const totalWidth = track.scrollWidth - window.innerWidth;
  if (totalWidth <= 0) { requestAnimationFrame(initHorizontalScroll); return; }
  const chapterSnapStep = chapters.length > 1 ? 1 / (chapters.length - 1) : 1;

  const scrollTween = gsap.to(track, {
    x: -totalWidth, ease: 'none',
    scrollTrigger: {
      trigger: '#scroll-wrapper',
      start: 'top top',
      end: () => '+=' + (totalWidth + window.innerWidth),
      scrub: 0.45, pin: true, anticipatePin: 1,
      // Let users scroll naturally, then lock to the nearest chapter.
      snap: isMotionReduced() ? false : {
        snapTo: chapterSnapStep,
        inertia: false,
        directional: true,
        duration: { min: 0.08, max: 0.2 },
        ease: 'power3.out',
        delay: 0.01
      },
      onUpdate: (self) => {
        if (dom.progressBar) {
          const progressValue = Math.round(self.progress * 100);
          dom.progressBar.style.width = progressValue + '%';
          dom.progressBar.setAttribute('aria-valuenow', String(progressValue));
        }
        const activeIdx = Math.round(self.progress * (chapters.length - 1));
        updateNavDots(activeIdx);
        // Hide scroll hint on last chapter
        const hint = dom.scrollHint;
        if (hint) {
          hint.classList.toggle('hidden', activeIdx >= chapters.length - 1);
        }
      }
    }
  });

  initChapter1_Flashlight();
  initChapter2_Interrogation();
  initChapter3_EvidenceWeb();
  initChapter4_Darkroom();
  initChapter5_CaseFile();
  initChapter6_CaseClosed(scrollTween);
  initTextFlyInEffects(scrollTween);
  initScrollMotion(scrollTween);
}

function updateNavDots(activeIdx) {
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    const isActive = i === activeIdx;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-current', isActive ? 'step' : 'false');
  });
}


/* ─────────────────────────────────────────────
   CHAPTER 1: THE ALLEY
   ───────────────────────────────────────────── */
function initChapter1_Flashlight() {
  console.log('%c📁 CASE FILE OPENED: ' + caseName, 'color: #ffaa00; font-weight:bold;');
  const consoleLines = document.querySelector('#console-lines');
  const casefileName = document.querySelector('#clue-casefile-name');
  const casefileCaption = document.querySelector('#clue-casefile-caption');
  const casefileDetail = document.querySelector('#clue-casefile-detail');
  const investigationMoment = document.querySelector('#investigation-moment');

  syncCaseProgressUI();

  function addConsoleLine(html, cls) {
    if (!consoleLines) return;
    const div = document.createElement('div');
    div.className = 'cline ' + cls;
    div.innerHTML = html;
    consoleLines.appendChild(div);
    consoleLines.scrollTop = consoleLines.scrollHeight;
  }

  function updateCasefile(name, caption, detail) {
    if (casefileName) casefileName.textContent = name || 'Unlabeled evidence';
    if (casefileCaption) casefileCaption.textContent = caption || 'No field caption recorded.';
    if (casefileDetail) casefileDetail.textContent = detail || 'No hidden detail recorded yet.';

    if (!isMotionReduced()) {
      gsap.fromTo('#clue-casefile',
        { opacity: 0.7, y: 5 },
        { opacity: 1, y: 0, duration: 0.24, ease: 'power2.out' }
      );
    }
  }

  function setInvestigationMoment(text, unlocked) {
    if (!investigationMoment) return;
    investigationMoment.textContent = text;
    investigationMoment.classList.toggle('locked', !unlocked);
    investigationMoment.classList.toggle('unlocked', unlocked);
  }

  function playClueInspectAnimation(clueEl, clueName) {
    if (isMotionReduced() || !clueEl) return;
    const icon = clueEl.querySelector('.clue-svg');
    if (!icon) return;

    const clue = String(clueName || '').toLowerCase();

    if (clue.includes('shell')) {
      gsap.fromTo(icon,
        { rotation: -10, scale: 1 },
        { rotation: 10, scale: 1.12, duration: 0.14, yoyo: true, repeat: 1, ease: 'power1.inOut' }
      );
      return;
    }

    if (clue.includes('cloth')) {
      gsap.fromTo(icon,
        { skewX: 0, x: 0 },
        { skewX: 8, x: 3, duration: 0.18, yoyo: true, repeat: 1, ease: 'sine.inOut' }
      );
      return;
    }

    if (clue.includes('boot')) {
      gsap.fromTo(icon,
        { scale: 0.94, filter: 'brightness(1)' },
        { scale: 1.16, filter: 'brightness(1.22)', duration: 0.22, yoyo: true, repeat: 1, ease: 'back.out(2)' }
      );
      return;
    }

    if (clue.includes('cigarette')) {
      gsap.fromTo(icon,
        { boxShadow: '0 0 0 rgba(255,170,0,0)' },
        { boxShadow: '0 0 18px rgba(255,170,0,.55)', duration: 0.24, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
      return;
    }

    if (clue.includes('matchbook')) {
      gsap.fromTo(icon,
        { rotationY: 0, scale: 1, transformPerspective: 480 },
        { rotationY: 25, scale: 1.08, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }
      );
      return;
    }

    gsap.fromTo(icon,
      { scale: 1 },
      { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
    );
  }

  document.querySelectorAll('.clue-item').forEach((clue, idx) => {
    clue.addEventListener('mouseenter', function() {
      if (foundClueKeys.has(getClueKey(this, idx))) return;
      updateCasefile(
        this.dataset.clue,
        this.dataset.caption,
        'Hover to inspect. Click to log hidden detail.'
      );
    });

    clue.addEventListener('focus', function() {
      if (foundClueKeys.has(getClueKey(this, idx))) return;
      updateCasefile(
        this.dataset.clue,
        this.dataset.caption,
        'Keyboard inspect ready. Press Enter/Space to collect.'
      );
    });

    clue.addEventListener('click', function() {
      const clueKey = getClueKey(this, idx);
      if (foundClueKeys.has(clueKey)) return;

      const name = this.dataset.clue;
      const caption = this.dataset.caption;
      const detail = this.dataset.detail;
      const hiddenDetail = this.dataset.hidden || detail;
      const requiresInspect = this.dataset.requiresInspect === 'true';

      if (requiresInspect && this.dataset.inspected !== 'true') {
        this.dataset.inspected = 'true';
        this.classList.add('inspected');
        playClueInspectAnimation(this, name);
        updateCasefile(name, caption, hiddenDetail);
        setInvestigationMoment('✓ Hidden ink exposed. Click the matchbook again to log it as evidence.', true);
        addConsoleLine('<span class="c-comment">// Investigation moment: matchbook inspected under a better angle</span>', 'cline-dim');
        addConsoleLine(`<span class="c-key">console</span>.log(<span class="c-str">"🕵️ Hidden lead: ${hiddenDetail}"</span>);`, 'cline-find');

        if (!isMotionReduced()) {
          gsap.fromTo(this,
            { boxShadow: '0 0 0 rgba(122,179,255,0)' },
            { boxShadow: '0 0 18px rgba(122,179,255,.6)', duration: 0.28, yoyo: true, repeat: 1 }
          );
        }
        return;
      }

      foundClueKeys.add(clueKey);
      syncCaseProgressUI();
      playClueInspectAnimation(this, name);
      updateCasefile(name, caption, hiddenDetail);

      if (requiresInspect) {
        setInvestigationMoment('✓ Matchbook logged. Club Noir is now a confirmed lead.', true);
      }

      const counter = document.querySelector('.clues-count');
      if (counter) {
        counter.textContent = cluesFound;
        gsap.fromTo(counter,
          { color: '#ffffff', textShadow: '0 0 20px white' },
          { color: '#00ff41', textShadow: '0 0 15px #00ff41', duration: 0.4 }
        );
      }

      addConsoleLine(`<span class="c-key">console</span>.log(<span class="c-str">"🔎 ${name}"</span>);`, 'cline-find');
      addConsoleLine(`<span class="c-comment">// → ${detail}</span>`, 'cline-dim');
      addConsoleLine(`<span class="c-comment">// story: ${caption}</span>`, 'cline-dim');
      addConsoleLine(`cluesFound = <span class="c-num">${cluesFound}</span>;`, 'cline-log');

      console.log('%c🔎 Clue: ' + name, 'color: #ffaa00;');
      console.log('  Detail:', detail);
      console.log('  cluesFound =', cluesFound);

      if (cluesFound >= 5) {
        addConsoleLine('<span style="color:#00ff41;">// ✅ All clues found — scroll forward</span>', 'cline-log');
        console.log('%c✅ All 5 clues found!', 'color: #00ff41; font-weight: bold;');
      }
    });
  });
}



/* ─────────────────────────────────────────────
   CHAPTER TEXT FLY-INS
   Strong, readable word reveals for chapter panels.
   ───────────────────────────────────────────── */
function initTextFlyInEffects(containerTween) {
  if (isMotionReduced() || !containerTween) return;

  const panels = document.querySelectorAll('.text-panel');

  panels.forEach(panel => {
    const chapter = panel.closest('.chapter');
    if (!chapter) return;

    const words = panel.querySelectorAll('.chapter-label, .chapter-title, .chapter-subtitle, .chapter-body, .code-block, .metaphor-line');
    if (!words.length) return;

    const isRight = panel.classList.contains('text-panel--right');
    const isBoardPanel = panel.id === 'ch3-text-panel';
    const isDarkroomPanel = panel.id === 'ch4-text-panel';
    if (isDarkroomPanel) return;
    const startX = isBoardPanel ? 0 : (isRight ? 240 : -240);
    const startY = isBoardPanel ? -240 : 26;

    gsap.set(panel, {
      opacity: 0,
      y: isBoardPanel ? -220 : (isDarkroomPanel ? 50 : 24),
      scale: isBoardPanel ? 0.78 : 0.96,
      rotation: isBoardPanel ? -9 : 0,
      transformOrigin: isBoardPanel ? '50% 0%' : '50% 50%'
    });

    gsap.set(words, {
      opacity: 0,
      x: startX,
      y: startY,
      rotation: isBoardPanel ? 7 : (isRight ? 3 : -3),
      skewX: isBoardPanel ? -12 : (isRight ? 8 : -8),
      filter: 'blur(8px)'
    });

    ScrollTrigger.create({
      trigger: chapter,
      containerAnimation: containerTween,
      start: 'left 78%',
      once: false,
      onEnter: () => {
        if (isBoardPanel) {
          gsap.to(panel, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: -1,
            duration: 1.05,
            ease: 'bounce.out'
          });
        } else {
          gsap.to(panel, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out'
          });
        }
        gsap.to(words, {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          skewX: 0,
          filter: 'blur(0px)',
          duration: isBoardPanel ? 1.05 : 0.85,
          stagger: isBoardPanel ? 0.11 : 0.08,
          ease: isBoardPanel ? 'power4.out' : 'back.out(1.5)'
        });
      },
      onEnterBack: () => {
        gsap.to(panel, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: isBoardPanel ? -1 : 0,
          duration: isBoardPanel ? 0.6 : 0.45,
          ease: 'power2.out'
        });
        gsap.to(words, {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          skewX: 0,
          filter: 'blur(0px)',
          duration: 0.65,
          stagger: 0.05,
          ease: 'power3.out'
        });
      }
    });
  });
}


/* ─────────────────────────────────────────────
   SCROLL-DRIVEN MOTION
   Narrative GSAP animations tied to horizontal scroll progress.
   ───────────────────────────────────────────── */
function initScrollMotion(scrollTween) {
  if (isMotionReduced() || !scrollTween) return;

  // ── CRIME BOARD SHOWPIECE (Ch3) — scrubbed timeline, 3 internal steps ──
  initCrimeBoardShowpiece(scrollTween);

  // ── CH1: Console panel slides in from the right ──
  const consolePanel = document.querySelector('#console-panel');
  if (consolePanel) {
    gsap.set(consolePanel, { x: 250, opacity: 0 });
    ScrollTrigger.create({
      trigger: '#chapter-1',
      containerAnimation: scrollTween,
      start: 'left 85%',
      once: true,
      onEnter: () => {
        gsap.to(consolePanel, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
      }
    });
  }

  // ── CH1: Clues fade into view as discovered beats ──
  const chapter1Clues = document.querySelectorAll('.clue-item');
  if (chapter1Clues.length) {
    gsap.set(chapter1Clues, { autoAlpha: 0, filter: 'blur(5px)' });
    ScrollTrigger.create({
      trigger: '#chapter-1',
      containerAnimation: scrollTween,
      start: 'left 82%',
      once: true,
      onEnter: () => {
        gsap.to(chapter1Clues, {
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 0.55,
          stagger: 0.1,
          ease: 'power2.out'
        });
      }
    });
  }

  // ── CH2: Suspect cards rise from shadow ──
  const suspectCards = document.querySelectorAll('.suspect-card');
  if (suspectCards.length) {
    gsap.set(suspectCards, { y: 80, opacity: 0, scale: 0.85 });
    ScrollTrigger.create({
      trigger: '#chapter-2',
      containerAnimation: scrollTween,
      start: 'left 65%',
      once: true,
      onEnter: () => {
        gsap.to(suspectCards, { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.7)' });
      }
    });
  }

  // ── CH4: Darkroom photos drift onto clothesline ──
  const drPhotos = document.querySelectorAll('.darkroom-photo');
  if (drPhotos.length) {
    gsap.set(drPhotos, { y: 40, scale: 0.92 });
    ScrollTrigger.create({
      trigger: '#chapter-4',
      containerAnimation: scrollTween,
      start: 'left 70%',
      once: true,
      onEnter: () => {
        gsap.to(drPhotos, { y: 0, scale: 1, duration: 0.8, stagger: 0.08, ease: 'power2.out' });
      }
    });
  }

  // ── CH5: Folder system rises into view ──
  const folderSystem = document.querySelector('#folder-system');
  const ch5Label = document.querySelector('#ch5-label');
  if (folderSystem) {
    gsap.set(folderSystem, { y: 60, opacity: 0 });
    if (ch5Label) gsap.set(ch5Label, { x: -80, opacity: 0 });
    ScrollTrigger.create({
      trigger: '#chapter-5',
      containerAnimation: scrollTween,
      start: 'left 65%',
      once: true,
      onEnter: () => {
        gsap.to(folderSystem, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
        if (ch5Label) {
          gsap.to(ch5Label, { x: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: 'back.out(1.5)' });
        }
      }
    });
  }
}


/* ─────────────────────────────────────────────
   CRIME BOARD SHOWPIECE — Ch3 pinned scroll-driven animation
   3 internal narrative steps driven by a single GSAP timeline:
     Step 1 — Evidence Appears:  cards drop onto the corkboard
     Step 2 — Connections Form:  red strings animate between items,
              text panel drops into centre
     Step 3 — Suspect Revealed:  photos enlarge, one suspect gets
              a glowing highlight ring
   The timeline is scrubbed by a ScrollTrigger spanning the
   full width of Ch3 inside the horizontal-scroll container,
   giving it a "hold-in-place" feel while steps play out.
   ───────────────────────────────────────────── */
function initCrimeBoardShowpiece(scrollTween) {
  const chapter    = document.querySelector('#chapter-3');
  const board      = document.querySelector('#corkboard');
  const eCards     = document.querySelectorAll('.evidence-card');
  const sPhotos    = document.querySelectorAll('.suspect-photo--board');
  const clickHint  = document.querySelector('#ch3-click-hint');
  const textPanel  = document.querySelector('#ch3-text-panel');
  const stringSvg  = document.querySelector('#showpiece-strings');
  const highlight  = document.querySelector('#suspect-highlight');
  const step1Label = document.querySelector('#sp-step-1');
  const step2Label = document.querySelector('#sp-step-2');
  const step3Label = document.querySelector('#sp-step-3');
  if (!chapter || !board || !eCards.length) return;

  // ── Initial hidden states ──
  gsap.set(eCards, { y: -150, opacity: 0, scale: 0.65 });
  // Suspect photos stay visible so users can interact with them
  gsap.set(sPhotos, { opacity: 0.8 });
  if (clickHint)  gsap.set(clickHint, { opacity: 0, y: -10 });
  if (textPanel)  gsap.set(textPanel, { opacity: 0, y: -300, x: -180, scale: 0.5, rotation: -25 });
  // Pin element — start hidden so it can pop in after panel lands
  const panelPin = textPanel ? textPanel.querySelector('.pin') : null;
  if (panelPin) gsap.set(panelPin, { scale: 0, opacity: 0 });
  if (stringSvg)  gsap.set(stringSvg, { opacity: 0 });
  if (highlight)  gsap.set(highlight, { opacity: 0, scale: 0.5 });

  // Pre-draw red connection strings so they can fade in during Step 2
  if (stringSvg) {
    const boardRect = board.getBoundingClientRect();
    stringSvg.setAttribute('viewBox', `0 0 ${boardRect.width} ${boardRect.height}`);

    const connections = [
      ['#ecard-0', '#ecard-1'],
      ['#ecard-1', '#ecard-2'],
      ['#ecard-2', '#ecard-3'],
      ['#bphoto-doctor', '#ecard-4'],
      ['#bphoto-widow', '#bphoto-butler'],
      ['#bphoto-butler', '#bphoto-nephew'],
    ];

    connections.forEach(([fromSelector, toSelector]) => {
      const fromEl = board.querySelector(fromSelector);
      const toEl = board.querySelector(toSelector);
      if (!fromEl || !toEl) return;

      const fromCenter = getElementCenter(fromEl, boardRect, 'center');
      const toCenter = getElementCenter(toEl, boardRect, 'center');
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', fromCenter.x); line.setAttribute('y1', fromCenter.y);
      line.setAttribute('x2', toCenter.x); line.setAttribute('y2', toCenter.y);
      line.setAttribute('stroke', '#cc1500');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('opacity', '0.7');
      line.setAttribute('stroke-dasharray', '600');
      line.setAttribute('stroke-dashoffset', '600');
      stringSvg.appendChild(line);
    });
  }

  // ── 3-step scrubbed timeline (second project timeline) ──
  const boardTL = gsap.timeline();

  // ── STEP 1: Evidence Appears ──
  if (step1Label) boardTL.to(step1Label, { opacity: 1, duration: 0.08 });
  boardTL.to(eCards, {
    y: 0, opacity: 1, scale: 1,
    duration: 0.35, stagger: 0.05,
    ease: 'back.out(1.4)'
  });
  // Brief hold at step 1
  boardTL.to({}, { duration: 0.08 });
  if (step1Label) boardTL.to(step1Label, { opacity: 0.35, duration: 0.05 });

  // ── STEP 2: Connections Form ──
  if (step2Label) boardTL.to(step2Label, { opacity: 1, duration: 0.08 });
  // Strings draw on
  if (stringSvg) {
    boardTL.to(stringSvg, { opacity: 1, duration: 0.05 });
    boardTL.to('#showpiece-strings line', {
      strokeDashoffset: 0,
      duration: 0.2, stagger: 0.04,
      ease: 'power2.inOut'
    });
  }
  // Text panel flies in from the upper-left and gets pinned to the board
  if (textPanel) {
    boardTL.to(textPanel, {
      opacity: 1, y: 0, x: 0, scale: 1, rotation: 1,
      duration: 0.22, ease: 'power4.out'
    }, '<+=0.06');
    // Settle: rotate to final resting angle
    boardTL.to(textPanel, {
      rotation: -1, duration: 0.06, ease: 'power1.inOut'
    });
    // Pin pops in — the "pinning" moment
    if (panelPin) {
      boardTL.to(panelPin, {
        scale: 1.4, opacity: 1, duration: 0.04, ease: 'back.out(3)'
      });
      boardTL.to(panelPin, {
        scale: 1, duration: 0.05, ease: 'elastic.out(1,0.4)'
      });
    }
  }
  boardTL.to({}, { duration: 0.08 });
  if (step2Label) boardTL.to(step2Label, { opacity: 0.35, duration: 0.05 });

  // ── STEP 3: Suspect Revealed ──
  if (step3Label) boardTL.to(step3Label, { opacity: 1, duration: 0.08 });
  boardTL.to(sPhotos, {
    opacity: 1,
    duration: 0.2, stagger: 0.04,
    ease: 'power2.out'
  });
  // Highlight ring pulses onto one suspect
  if (highlight) {
    boardTL.to(highlight, {
      opacity: 1, scale: 1,
      duration: 0.15, ease: 'elastic.out(1,0.4)'
    });
  }
  // Click hint appears as the final cue to interact
  if (clickHint) {
    boardTL.to(clickHint, {
      opacity: 1, y: 0,
      duration: 0.1, ease: 'power2.out'
    });
  }

  // ── ScrollTrigger: scrub the timeline across the full Ch3 scroll range ──
  ScrollTrigger.create({
    trigger: chapter,
    containerAnimation: scrollTween,
    start: 'left 90%',
    end: 'right 10%',
    scrub: 0.8,
    animation: boardTL
  });
}


/* ─────────────────────────────────────────────
   CHAPTER 2: INTERROGATION ROOM
   ───────────────────────────────────────────── */
const SUSPECTS = {
  doctor: {
    name: 'Dr. James Vue', role: 'The Family Physician',
    img:  'assets/images/suspectDoctor.png',
    body: 'Been treating the deceased for three years. His coat carries stains he cannot explain also he was seen near the east wing at 2 AM.',
    motive: 'MOTIVE: Blackmail — victim knew of a malpractice cover-up worth $800K'
  },
  widow: {
    name: 'Evelyn Ember', role: 'The Widow',
    img:  'assets/images/suspectWidow.png',
    body: 'Stands to inherit the entire estate — $4.2 million. Filed for divorce six weeks before the murder, then abruptly withdrew the papers.',
    motive: 'MOTIVE: Inheritance — $4.2M estate, sole beneficiary'
  },
  butler: {
    name: 'Edmund Angular', role: 'The Butler',
    img:  'assets/images/suspectButler.png',
    body: 'Forty years of service, dismissed without severance three days before the murder. He holds the only key to the east exit. Used at 2:08 AM.',
    motive: 'MOTIVE: Resentment — dismissed after 40 years, privy to all family secrets'
  },
  nephew: {
    name: 'Dante Ember', role: 'The Nephew',
    img:  'assets/images/suspectNephew.png',
    body: 'Cut from the will eight months ago. Three ATM withdrawals place him six blocks from the estate between 1 and 3 AM. Cigarette monogram: D.E.',
    motive: 'MOTIVE: Disinheritance — removed from $4.2M will, $180K gambling debt'
  }
};

function initChapter2_Interrogation() {
  const cards    = document.querySelectorAll('.suspect-card');
  const panel    = document.querySelector('#suspect-info-panel');
  const prompt   = document.querySelector('#interrogation-prompt');
  const lockMsg  = document.querySelector('#scroll-lock-msg');
  const closeBtn = document.querySelector('#suspect-info-close');
  const clReadout = document.querySelector('#classlist-value');

  function triggerNervousShake(card) {
    if (isMotionReduced()) return;
    const img = card.querySelector('img');
    if (!img) return;

    const duration = (0.45 + Math.random() * 0.55).toFixed(2);
    const intensity = (2 + Math.random() * 4).toFixed(1);

    img.style.setProperty('--nervous-duration', `${duration}s`);
    img.style.setProperty('--nervous-intensity', `${intensity}px`);
    img.classList.remove('suspect-nervous');
    void img.offsetWidth;
    img.classList.add('suspect-nervous');
    img.addEventListener('animationend', () => img.classList.remove('suspect-nervous'), { once: true });
  }

  function updateCLDisplay(card, isNew) {
    if (!clReadout) return;
    const cls = Array.from(card.classList).filter(c => ['active','interrogated'].includes(c));
    clReadout.textContent = cls.length ? '[ "' + cls.join('", "') + '" ]' : '[ ]';
    const actionEl = document.querySelector('#classlist-action');
    if (actionEl) {
      actionEl.textContent = isNew
        ? '→ classList.add("interrogated") called'
        : '→ already interrogated (classList unchanged)';
    }
  }

  const lampBtn = document.querySelector('#lamp-toggle-btn');
  let lampOn = true;
  const lampCone = document.querySelector('#lamp-cone');
  syncCaseProgressUI();
  if (lampBtn) {
    lampBtn.addEventListener('click', () => {
      lampOn = !lampOn;
      lampBtn.classList.toggle('lamp--off', !lampOn);
      lampBtn.setAttribute('aria-pressed', String(lampOn));
      const ch2 = document.querySelector('#chapter-2');
      if (lampCone) gsap.to(lampCone, { opacity: lampOn ? 1 : 0, duration: 0.6 });
      if (ch2) {
        ch2.classList.toggle('lamp-off', !lampOn);
        gsap.to(ch2, { backgroundColor: lampOn ? '' : '#010005', duration: 0.7 });
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const activeCard = document.querySelector('.suspect-card.active');
      if (activeCard) activeCard.classList.remove('active');
      if (panel) panel.classList.remove('open');
      if (clReadout) clReadout.textContent = '[ ]';
    });
  }

  cards.forEach(card => {
    card.addEventListener('click', function() {
      const data = SUSPECTS[this.dataset.suspect];
      if (!data || !panel) return;

      cards.forEach(c => {
        const cImg = c.querySelector('img');
        if (cImg) cImg.classList.remove('suspect-nervous');
      });

      cards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');

      if (this.dataset.suspect === getCurrentMurdererKey()) {
        triggerNervousShake(this);
      }

      let isNew = false;
      if (!interrogatedSuspectKeys.has(this.dataset.suspect)) {
        interrogatedSuspectKeys.add(this.dataset.suspect);
        syncCaseProgressUI();
        isNew = true;
      }

      updateCLDisplay(this, isNew);
      document.querySelector('#suspect-portrait').src = data.img;
      document.querySelector('#suspect-portrait').alt = data.name;
      document.querySelector('#suspect-info-name').textContent   = data.name;
      document.querySelector('#suspect-info-role').textContent   = data.role;
      document.querySelector('#suspect-info-body').textContent   = data.body;
      document.querySelector('#suspect-info-motive').textContent = data.motive;
      panel.classList.add('open');

      const remaining = 4 - suspectsInterrogated;
      if (suspectsInterrogated >= 4) {
        if (lockMsg) gsap.to(lockMsg, { opacity: 0, duration: 0.4 });
        if (prompt) {
          prompt.textContent = '✓ ALL SUSPECTS QUESTIONED — SCROLL TO CONTINUE';
          gsap.fromTo(prompt, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        }
      } else if (lockMsg) {
        lockMsg.textContent = `${remaining} SUSPECT${remaining > 1 ? 'S' : ''} REMAINING`;
      }
    });
  });
}

/* ─────────────────────────────────────────────
   CHAPTER 3: CRIME BOARD
   ───────────────────────────────────────────── */
const clickedBoardItems = [];

function initChapter3_EvidenceWeb() {
  const allItems = [
    ...document.querySelectorAll('.evidence-card'),
    ...document.querySelectorAll('.suspect-photo--board')
  ];

  allItems.forEach(item => {
    item.addEventListener('click', function() {
      const info  = this.dataset.info;
      const label = this.dataset.label;

      this.classList.toggle('revealed');
      showBoardTooltip(this, (label ? label + ': ' : '') + info);

      const board   = document.querySelector('#corkboard');
      const svg     = document.querySelector('#evidence-strings');
      const textPin = document.querySelector('#ch3-text-panel');

      if (!clickedBoardItems.includes(this)) {
        if (board && svg) {
          const boardRect = board.getBoundingClientRect();
          const svgRect = svg.getBoundingClientRect();
          // Set viewBox to match the actual SVG rendered dimensions
          svg.setAttribute('viewBox', `0 0 ${svgRect.width} ${svgRect.height}`);
          const newCenter = getElementCenter(this, boardRect);
          // Calculate center in SVG's actual rendered space
          const boardCenter = {
            x: svgRect.width / 2,
            y: svgRect.height / 2
          };
          drawString(svg, newCenter.x, newCenter.y, boardCenter.x, boardCenter.y, 'rgba(61,127,255,0.5)');
        }
        clickedBoardItems.push(this);
      }
    });

    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  setTimeout(() => {
    const board = document.querySelector('#corkboard');
    const svg   = document.querySelector('#evidence-strings');
    if (board && svg) {
      const r = board.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
    }
  }, 600);
}

function getElementCenter(el, boardRect, anchor = 'pin') {
  const r = el.getBoundingClientRect();
  if (anchor === 'center') {
    return {
      x: r.left + r.width / 2 - boardRect.left,
      y: r.top + r.height / 2 - boardRect.top
    };
  }

  const isCard = el.classList.contains('evidence-card');
  const isPhoto = el.classList.contains('suspect-photo--board');
  return {
    x: r.left + r.width / 2 - boardRect.left,
    y: isCard ? r.top + 6 - boardRect.top
      : isPhoto ? r.top + 20 - boardRect.top
      : r.top + r.height / 2 - boardRect.top
  };
}

function getPanelAnchorPoint(el, boardRect) {
  const r = el.getBoundingClientRect();
  const relX = r.left + r.width / 2 - boardRect.left;
  const relY = r.top + 12 - boardRect.top;
  return { x: relX, y: relY };
}

function drawString(svg, x1, y1, x2, y2, color) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', color || '#cc1500');
  line.setAttribute('stroke-width', '1.5');
  line.setAttribute('stroke-dasharray', '600');
  line.setAttribute('stroke-dashoffset', '600');
  line.setAttribute('opacity', '0.7');
  line.classList.add('evidence-string-line');
  svg.appendChild(line);

  requestAnimationFrame(() => {
    line.style.transition = 'stroke-dashoffset 0.55s ease-out, opacity 0.3s';
    line.setAttribute('stroke-dashoffset', '0');
  });
}

function showBoardTooltip(el, text) {
  const old = el.querySelector('.board-tooltip');
  if (old) old.remove();
  const tip = document.createElement('div');
  tip.className = 'board-tooltip';
  tip.textContent = text;
  el.style.position = 'absolute';
  el.appendChild(tip);
  gsap.fromTo(tip, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.2 });
  setTimeout(() => gsap.to(tip, { opacity: 0, duration: 0.3, onComplete: () => tip.remove() }), 3500);
}

/* ─────────────────────────────────────────────
   CHAPTER 4: DARKROOM
   ───────────────────────────────────────────── */
let darkroomLightsOn = true;
let photosDeveloped  = false;
let darkroomParallaxActive = false;
let drParallaxRaf = null;
let darkroomParallaxBound = false;

function initChapter4_Darkroom() {
  const switchBtn   = document.querySelector('#light-switch-btn');
  const roomLight   = document.querySelector('#darkroom-light');
  const safelight   = document.querySelector('#darkroom-safelight');
  const flashlight  = document.querySelector('#darkroom-flashlight');
  const instruction = document.querySelector('#darkroom-instruction');
  const chapterText = document.querySelector('#ch4-text-panel');
  const statusLabel = document.querySelector('#switch-status');
  const tokenReadout = document.querySelector('#token-readout');
  const trNight     = document.querySelector('#tr-night');
  const trAmber     = document.querySelector('#tr-amber');
  let panelUnlocked = false;
  let tokenUnlocked = false;

  if (!switchBtn) return;

  // Hide the chapter text panel until an OFF -> ON cycle has happened.
  if (chapterText) {
    chapterText.style.opacity = '0';
    chapterText.style.pointerEvents = 'none';
  }

  // Hide token readout until lights are toggled
  if (tokenReadout) {
    tokenReadout.style.opacity = '0';
    tokenReadout.style.pointerEvents = 'none';
  }

  // All photos start completely black (already set by CSS brightness(0))
  // Evidence content starts invisible
  document.querySelectorAll('.evidence-photo-content').forEach(c => {
    c.style.opacity = '0';
  });

  switchBtn.addEventListener('click', () => {
    darkroomLightsOn = !darkroomLightsOn;

    if (!darkroomLightsOn) {
      switchBtn.classList.add('off');
      if (roomLight)  roomLight.classList.add('off');
      if (safelight)  safelight.style.opacity = '1';
      if (statusLabel) statusLabel.textContent = 'OFF';
      if (instruction) instruction.textContent = 'MOVE MOUSE — CAST LIGHT OVER THE DEVELOPING PHOTOS';
      document.documentElement.style.setProperty('--color-night', '#080005');
      document.documentElement.style.setProperty('--color-amber', '#ff3300');
      if (trNight) trNight.textContent = '#080005';
      if (trAmber) trAmber.textContent = '#ff3300';
      setTimeout(() => {
        if (flashlight) { flashlight.classList.add('active'); dom.darkroomFlash = flashlight; }
      }, 1100);
      if (!photosDeveloped) {
        photosDeveloped = true;
        developPhotos();
      }
      // Activate parallax after photos start to appear
      setTimeout(() => {
        darkroomParallaxActive = true;
        startDarkroomParallax();
      }, 2000);
      console.log('%c🔴 Lights OFF — photos begin developing', 'color: #cc2200;');
      console.log('%cdocument.documentElement.style.setProperty("--color-night", "#080005")', 'color: #9b4dff; font-family: monospace;');
    } else {
      switchBtn.classList.remove('off');
      if (roomLight)  roomLight.classList.remove('off');
      if (safelight)  safelight.style.opacity = '0';
      if (flashlight) flashlight.classList.remove('active');
      if (statusLabel) statusLabel.textContent = 'ON';
      if (instruction) instruction.textContent = 'TURN OFF THE LIGHTS — WATCH THE EVIDENCE DEVELOP';

      // Reveal chapter text once photos have been developed, then keep it visible.
      if (chapterText && photosDeveloped && !panelUnlocked) {
        panelUnlocked = true;
        gsap.to(chapterText, { opacity: 1, duration: 0.45, ease: 'power2.out' });
        chapterText.style.pointerEvents = 'auto';

        if (tokenReadout && !tokenUnlocked) {
          tokenUnlocked = true;
          gsap.to(tokenReadout, { opacity: 1, duration: 0.45, ease: 'power2.out' });
          tokenReadout.style.pointerEvents = 'auto';
        }
      }
      document.documentElement.style.setProperty('--color-night', '#0a0818');
      document.documentElement.style.setProperty('--color-amber', '#ffaa00');
      if (trNight) trNight.textContent = '#0a0818';
      if (trAmber) trAmber.textContent = '#ffaa00';
      darkroomParallaxActive = false;
      console.log('%c💡 Lights ON', 'color: #ffaa00;');
      console.log('%cdocument.documentElement.style.setProperty("--color-night", "#0a0818")', 'color: #9b4dff; font-family: monospace;');
    }
  });
}

function initChapter6_CaseClosed(containerTween) {
  const chapter = document.querySelector('#chapter-6');
  if (!chapter) return;

  const lines = Array.from(chapter.querySelectorAll('.case-typed[data-typed-text]'));
  const cursor = chapter.querySelector('.case-typing-cursor');
  if (!lines.length) return;

  lines.forEach((line) => {
    if (!line.dataset.rawText) line.dataset.rawText = line.dataset.typedText || '';
    line.textContent = '';
  });

  const revealAll = () => {
    lines.forEach((line) => {
      line.textContent = line.dataset.rawText || '';
    });
    if (cursor) cursor.style.display = 'none';
  };

  if (isMotionReduced()) {
    revealAll();
    return;
  }

  if (!containerTween) {
    return;
  }

  const typeLine = (line, onDone) => {
    const text = line.dataset.rawText || '';
    let i = 0;
    const speed = line.classList.contains('case-red-neon') ? 10 : 4;
    const timer = setInterval(() => {
      i += 1;
      line.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(timer);
        setTimeout(onDone, 100);
      }
    }, speed);
  };

  const runTypeSequence = () => {
    if (isMotionReduced()) {
      revealAll();
      return;
    }

    let idx = 0;
    const next = () => {
      if (idx >= lines.length) {
        if (cursor) cursor.style.opacity = '0';
        return;
      }
      typeLine(lines[idx], () => {
        idx += 1;
        next();
      });
    };
    next();
  };

  ScrollTrigger.create({
    trigger: chapter,
    containerAnimation: containerTween,
    start: 'left 70%',
    once: true,
    onEnter: runTypeSequence
  });

  // Restart button — scroll back to the top
  const restartBtn = chapter.querySelector('#restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* Develop photos and evidence: stagger them in, then start drip animations */
function developPhotos() {
  // Develop suspect photos (brightness 0 → normal)
  document.querySelectorAll('.photo-frame img').forEach((img, i) => {
    setTimeout(() => {
      img.classList.add('developed');
      // Start water drip on this photo's canvas
      const canvas = img.closest('.photo-frame').querySelector('.drip-canvas');
      if (canvas) {
        canvas.classList.add('active');
        animateWaterDrip(canvas);
      }
      const label = img.closest('.photo-frame').querySelector('.photo-evidence-label');
      if (label) announceDarkroomLabel(label.textContent.trim());
      console.log('%c🖼 Developing: ' + img.alt, 'color: #9b4dff;');
    }, 600 + i * 550);
  });

  // Develop evidence SVG photos (opacity 0 → 1)
  document.querySelectorAll('.evidence-photo-content').forEach((evidenceContent, i) => {
    setTimeout(() => {
      evidenceContent.classList.add('developed');
      evidenceContent.style.opacity = '1';
      const canvas = evidenceContent.closest('.photo-frame--evidence').querySelector('.drip-canvas');
      if (canvas) {
        canvas.classList.add('active');
        animateWaterDrip(canvas);
      }
      // Reveal evidence label when photo develops
      const label = evidenceContent.closest('.photo-frame--evidence').querySelector('.photo-evidence-label');
      if (label) {
        label.classList.add('revealed');
        announceDarkroomLabel(label.textContent.trim());
      }
      // Also reveal caption
      const caption = evidenceContent.closest('.darkroom-photo').querySelector('.photo-caption');
      if (caption) {
        gsap.fromTo(caption, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 0.5 });
        console.log('%c🖼 Evidence developing: ' + caption.textContent, 'color: #9b4dff;');
      }
    }, 800 + i * 450);
  });

  // Also reveal labels on suspect photos
  document.querySelectorAll('.photo-frame img').forEach((img, i) => {
    setTimeout(() => {
      const label = img.closest('.photo-frame').querySelector('.photo-evidence-label');
      if (label) label.classList.add('revealed');
    }, 600 + i * 550 + 600);
  });
}

/* Water drip animation — simulates photos fresh out of developing bath */
function animateWaterDrip(canvas) {
  if (!canvas || isMotionReduced()) return;
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d');

  const drips = [];
  const COUNT = 4 + Math.floor(Math.random() * 4);
  for (let i = 0; i < COUNT; i++) {
    drips.push({
      x: 8 + Math.random() * (W - 16),
      y: -Math.random() * H * 0.5,
      speed: 0.3 + Math.random() * 0.6,
      len: 6 + Math.random() * 18,
      width: 1 + Math.random() * 1.5,
      opacity: 0.35 + Math.random() * 0.4,
      drop: false,
      dropY: 0,
      dropR: 0,
      dropMaxR: 1.5 + Math.random() * 2,
      phase: 'fall', // fall → pool → done
      delay: i * 400
    });
  }

  let startTime = null;
  const TOTAL_DURATION = 8000; // 8 seconds total drip life

  function draw(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    if (isMotionReduced()) {
      ctx.clearRect(0, 0, W, H);
      canvas.classList.remove('active');
      return;
    }
    if (elapsed > TOTAL_DURATION) {
      ctx.clearRect(0, 0, W, H);
      canvas.classList.remove('active');
      return;
    }

    ctx.clearRect(0, 0, W, H);
    let anyActive = false;

    drips.forEach(d => {
      if (elapsed < d.delay) return;
      anyActive = true;

      ctx.save();
      ctx.globalAlpha = d.opacity;

      if (d.phase === 'fall') {
        d.y += d.speed;
        // Draw teardrop
        ctx.fillStyle = 'rgba(120,160,220,.8)';
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.width, d.len * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Teardrop bulge at bottom
        ctx.beginPath();
        ctx.arc(d.x, d.y + d.len * 0.4, d.width * 1.3, 0, Math.PI * 2);
        ctx.fill();

        if (d.y > H) {
          d.phase = 'pool';
          d.dropY = H;
          d.y = H + 100; // move off screen
        }
      } else if (d.phase === 'pool') {
        d.dropR = Math.min(d.dropR + 0.08, d.dropMaxR);
        // Spreading water ring
        ctx.strokeStyle = 'rgba(100,140,200,.5)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(d.x, d.dropY, d.dropR * 3, d.dropR, 0, 0, Math.PI * 2);
        ctx.stroke();
        if (d.dropR >= d.dropMaxR) d.phase = 'done';
      }

      ctx.restore();
    });

    if (anyActive) requestAnimationFrame(draw);
    else {
      ctx.clearRect(0, 0, W, H);
      canvas.classList.remove('active');
    }
  }

  requestAnimationFrame(draw);
}

/* Darkroom mouse parallax — photos shift at different depths for 3D effect */
function startDarkroomParallax() {
  const ch4 = document.querySelector('#chapter-4');
  if (!ch4 || darkroomParallaxBound || isMotionReduced()) return;

  darkroomParallaxBound = true;

  ch4.addEventListener('mousemove', (e) => {
    if (!darkroomParallaxActive) return;
    if (drParallaxRaf) cancelAnimationFrame(drParallaxRaf);
    drParallaxRaf = requestAnimationFrame(() => {
      const r = ch4.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const my = ((e.clientY - r.top)  / r.height - 0.5) * 2;

      document.querySelectorAll('.dr-parallax').forEach(photo => {
        const depth = parseFloat(photo.dataset.depth) || 0.06;
        const tx = mx * depth * -80;
        const ty = my * depth * -40;
        photo.style.transition = 'transform 0.15s cubic-bezier(0.25,0.46,0.45,0.94)';
        photo.style.transform  = `translate(${tx}px, ${ty}px)`;
      });
    });
  });
}


/* ─────────────────────────────────────────────
   CHAPTER 5: CASE FILE — localStorage
   ───────────────────────────────────────────── */
// ── RANDOM MURDER SELECTION: ensures no repeats in a row ──
const MURDERERS = ['doctor', 'widow', 'butler', 'nephew'];
let murdererPool = [];
let lastMurderer = storage.getItem('lastMurderer') || null;

function getCurrentMurdererKey() {
  if (!currentMurdererKey) {
    currentMurdererKey = pickMurderer();
  }
  return currentMurdererKey;
}

function pickMurderer() {
  if (murdererPool.length === 0) {
    murdererPool = [...MURDERERS].filter(m => m !== lastMurderer);
    // Shuffle (Fisher-Yates)
    for (let i = murdererPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [murdererPool[i], murdererPool[j]] = [murdererPool[j], murdererPool[i]];
    }
  }
  lastMurderer = murdererPool.pop();
  storage.setItem('lastMurderer', lastMurderer);
  return lastMurderer;
}

const MURDERER_DATA = {
  doctor:  { name: 'DR. HARLOW',  img: 'assets/images/suspectDoctor.png',  reason: 'The blackmail victim became the victim. He silenced the one man who could destroy him.', style: 'color:#cc0000;' },
  widow:   { name: 'THE WIDOW',   img: 'assets/images/suspectWidow.png',   reason: 'She withdrew the divorce papers — then withdrew the man. $4.2M and no witnesses.', style: 'color:#cc0000;' },
  butler:  { name: 'THE BUTLER',  img: 'assets/images/suspectButler.png',  reason: 'Forty years of service. Dismissed without a word. He kept the key — and used it.', style: 'color:#cc0000;' },
  nephew:  { name: 'THE NEPHEW',  img: 'assets/images/suspectNephew.png', reason: 'Disinherited. Desperate. The monogram D.M. left at the scene sealed it.', style: 'color:#cc0000;' }
};

function renderCaseConclusionReveal() {
  const folderTitle = document.querySelector('.folder-title');
  if (!folderTitle) return;

  const canRevealMurderer = cluesFound >= 5 && suspectsInterrogated >= 4;
  let revealEl = document.querySelector('#murderer-reveal');

  if (!revealEl) {
    revealEl = document.createElement('div');
    revealEl.id = 'murderer-reveal';
    const divider = folderTitle.nextElementSibling;
    if (divider) divider.after(revealEl);
    else folderTitle.after(revealEl);
  }

  if (canRevealMurderer) {
    revealEl.dataset.murdererKey = getCurrentMurdererKey();
    const mData = MURDERER_DATA[revealEl.dataset.murdererKey];
    revealEl.style.cssText = 'margin-top:18px;margin-bottom:18px;padding:12px 14px;background:rgba(139,0,0,.08);border-left:3px solid #8b0000;font-family:var(--font-ui);font-size:.7rem;';
    revealEl.innerHTML = `<div style="font-size:.55rem;letter-spacing:.2em;color:#8b5020;text-transform:uppercase;margin-bottom:4px;">DETECTIVE\'S CONCLUSION</div><div style="color:#8b0000;font-weight:bold;font-size:.85rem;font-family:var(--font-display);">THE MURDERER: ${mData.name}</div><div style="color:#5c2000;font-size:.7rem;line-height:1.6;margin-top:4px;">${mData.reason}</div>`;
  } else {
    delete revealEl.dataset.murdererKey;
    revealEl.style.cssText = 'margin-top:18px;margin-bottom:18px;padding:12px 14px;background:rgba(60,40,20,.08);border-left:3px solid rgba(120,90,50,.55);font-family:var(--font-ui);font-size:.7rem;';
    revealEl.innerHTML = `<div style="font-size:.55rem;letter-spacing:.2em;color:#8b5020;text-transform:uppercase;margin-bottom:4px;">DETECTIVE\'S CONCLUSION</div><div style="color:#5c2000;font-weight:bold;font-size:.76rem;">CASE INCOMPLETE</div><div style="color:#5c2000;font-size:.7rem;line-height:1.6;margin-top:4px;">Find all 5 clues and interrogate all 4 suspects to unlock the murderer reveal.</div>`;
  }
}

function initChapter5_CaseFile() {
  const saveBtn = document.querySelector('#save-btn');
  const loadBtn = document.querySelector('#load-btn');
  const status  = document.querySelector('#storage-status');

  renderCaseConclusionReveal();

  document.querySelectorAll('.folder-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.folder-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.folder-page').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const page = document.querySelector('#fpage-' + this.dataset.tab);
      if (page) {
        void page.offsetWidth; // force reflow to re-trigger CSS animation
        page.classList.add('active');
      }
    });
  });

  syncCaseProgressUI();
  loadFromStorage();

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveCaseProgress();
      if (status) status.textContent = 'SAVED AT ' + (storage.getItem('savedAt') || '—');
      gsap.fromTo(saveBtn, { backgroundColor: '#006600' }, { backgroundColor: '#8b0000', duration: 0.8 });
      console.log('%c💾 Saved to localStorage', 'color: #ffaa00;');
    });
  }
  if (loadBtn) loadBtn.addEventListener('click', loadFromStorage);

  function loadFromStorage() {
    const loaded = loadCaseProgress();
    if (loaded) {
      const st = storage.getItem('savedAt');
      if (status) status.textContent = 'LOADED — SAVED AT ' + (st || '—');
    } else {
      if (status) status.textContent = 'NO SAVED DATA — HIT SAVE FIRST';
    }
  }
}


/* ─────────────────────────────────────────────
   RAIN CANVAS
   ───────────────────────────────────────────── */
function initRain(canvasId) {
  const canvas = document.querySelector('#' + canvasId);
  if (!canvas || isMotionReduced()) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth  || window.innerWidth;
  canvas.height = canvas.offsetHeight || window.innerHeight;

  const isIntroRain = canvasId === 'intro-rain';
  const rainCount = isIntroRain ? 220 : 120;
  const speedBase = isIntroRain ? 6 : 4;
  const speedVar = isIntroRain ? 10 : 8;
  const lenBase = isIntroRain ? 12 : 8;
  const lenVar = isIntroRain ? 26 : 20;
  const alphaBase = isIntroRain ? 0.08 : 0.05;
  const alphaVar = isIntroRain ? 0.14 : 0.1;

  const drops = Array.from({ length: rainCount }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    speed: speedBase + Math.random() * speedVar,
    length: lenBase + Math.random() * lenVar,
    opacity: alphaBase + Math.random() * alphaVar
  }));

  (function draw() {
    if (isMotionReduced()) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach(d => {
      ctx.strokeStyle = `rgba(100,150,255,${d.opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 1, d.y + d.length); ctx.stroke();
      d.y += d.speed;
      if (d.y > canvas.height) { d.y = -d.length; d.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(draw);
  })();

  window.addEventListener('resize', () => {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  });
}


/* ─────────────────────────────────────────────
   KEYBOARD NAV
   ───────────────────────────────────────────── */
function setupKeyboard() {
  document.addEventListener('keydown', e => {
    if (!introComplete) return;
    const step = window.innerWidth * 0.8;
    if (e.key === 'ArrowRight') window.scrollBy({ top: step,  behavior: 'smooth' });
    if (e.key === 'ArrowLeft')  window.scrollBy({ top: -step, behavior: 'smooth' });
  });

  // Touch swipe support for mobile
  let touchStartX = 0, touchStartY = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (!introComplete) return;
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 50 && dy < 80) {
      const step = window.innerWidth * 0.9;
      window.scrollBy({ top: dx > 0 ? step : -step, behavior: 'smooth' });
    }
  }, { passive: true });
}

function setupNavDots() {
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const chapters = document.querySelectorAll('.chapter');
      const total = document.body.scrollHeight - window.innerHeight;
      window.scrollTo({ top: (i / (chapters.length - 1)) * total, behavior: 'smooth' });
    });
  });
}
