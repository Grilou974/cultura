/* ----------  Cultura — Main app & router  ---------- */
(function () {
  const screen = document.getElementById('screen');
  const backBtn = document.getElementById('backBtn');
  const langBtn = document.getElementById('langBtn');
  const topTitle = document.getElementById('topTitle');
  const bottomBar = document.getElementById('bottomBar');

  // ---------- State stack for navigation ----------
  const stack = [];

  function push(entry) {
    stack.push(entry);
    updateChrome();
    entry.render();
    try { window.scrollTo(0, 0); } catch (_) {}
  }
  function pop() {
    if (stack.length <= 1) return;
    stack.pop();
    const top = stack[stack.length - 1];
    updateChrome();
    top.render();
    try { window.scrollTo(0, 0); } catch (_) {}
  }
  function reset() {
    stack.length = 0;
  }
  function updateChrome() {
    backBtn.classList.toggle('hidden', stack.length <= 1);
    const top = stack[stack.length - 1];
    topTitle.textContent = top?.title || Lang.t('appTitle');
    bottomBar.classList.add('hidden');
  }

  // Get a possibly theme-overridden mode label
  function modeLabel(theme, modeId) {
    const override = theme?.modeLabels?.[modeId];
    if (override) return Lang.pick(override);
    return Lang.t('modes.' + modeId);
  }

  backBtn.addEventListener('click', pop);
  langBtn.addEventListener('click', () => {
    Lang.set(Lang.current === 'fr' ? 'en' : 'fr');
    langBtn.textContent = Lang.current.toUpperCase();
    document.documentElement.lang = Lang.current;
    const top = stack[stack.length - 1];
    if (top) {
      updateChrome();
      top.render();
    }
  });
  langBtn.textContent = Lang.current.toUpperCase();
  document.documentElement.lang = Lang.current;

  // ---------- PWA Install prompt ----------
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstall = e;
  });

  // ---------- Home ----------
  async function renderHome() {
    const themes = await Data.loadThemes();
    let html = `
      <div class="hero">
        <h2>${Lang.t('appTitle')}</h2>
        <p>${Lang.t('tagline')}</p>
      </div>`;

    if (deferredInstall) {
      html += `
        <div class="install-prompt">
          <span>📱 ${Lang.t('install')}</span>
          <button class="btn" id="installBtn">${Lang.t('installBtn')}</button>
        </div>`;
    }

    html += `<div class="section-title">${Lang.t('chooseTheme')}</div>`;
    html += '<div class="grid">';
    themes.forEach((t, i) => {
      html += `
        <button class="card theme-card" data-theme="${t.id}" style="--card-delay:${i * 40}ms">
          <span class="icon">${t.emoji}</span>
          <span class="title">${Lang.pick(t.name)}</span>
        </button>`;
    });
    html += '</div>';

    screen.innerHTML = html;

    screen.querySelectorAll('[data-theme]').forEach(b => {
      b.addEventListener('click', () => openTheme(b.dataset.theme));
    });

    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredInstall) return;
        deferredInstall.prompt();
        await deferredInstall.userChoice;
        deferredInstall = null;
        renderHome();
      });
    }
  }

  async function openTheme(themeId) {
    const themes = await Data.loadThemes();
    const theme = themes.find(t => t.id === themeId);
    push({
      title: Lang.pick(theme.name),
      render: () => renderModes(theme)
    });
  }

  async function renderModes(theme) {
    const data = await Data.loadTheme(theme.id);

    const modes = [
      { id: 'quiz',       icon: '🎯', requires: 'quiz' },
      { id: 'timeAttack', icon: '⏱️', requires: 'quiz' },
      { id: 'trueFalse',  icon: '✅', requires: 'trueFalse' },
      { id: 'memory',     icon: '🧩', requires: 'memory' },
      { id: 'guessImage', icon: '🖼️', requires: 'guessImage' }
    ];

    let html = `<div class="section-title">${Lang.t('chooseMode')}</div>`;
    html += '<div class="grid">';
    modes.forEach((m, i) => {
      const available = isModeAvailable(data, m.requires);
      const label = modeLabel(theme, m.id);
      const sub = available ? Lang.t('modesSub.' + m.id) : Lang.t('notAvailable');
      html += `
        <button class="card mode-card" data-mode="${m.id}" style="--card-delay:${i * 40}ms" ${available ? '' : 'disabled'}>
          <span class="icon">${m.icon}</span>
          <span class="title">${label}</span>
          <span class="sub">${sub}</span>
        </button>`;
    });
    html += '</div>';

    screen.innerHTML = html;
    screen.querySelectorAll('[data-mode]:not([disabled])').forEach(b => {
      b.addEventListener('click', () => openMode(theme, data, b.dataset.mode));
    });
  }

  function isModeAvailable(data, key) {
    if (key === 'quiz') {
      return data.quiz && Object.values(data.quiz).some(arr => arr && arr.length > 0);
    }
    if (key === 'trueFalse') return Array.isArray(data.trueFalse) && data.trueFalse.length > 0;
    if (key === 'memory') return data.memory && Array.isArray(data.memory.pairs) && data.memory.pairs.length >= 6;
    if (key === 'guessImage') return Array.isArray(data.guessImage) && data.guessImage.length > 0;
    return false;
  }

  function openMode(theme, data, mode) {
    const label = modeLabel(theme, mode);
    const tName = Lang.pick(theme.name);
    if (mode === 'quiz') {
      push({ title: `${tName} · ${label}`, render: () => renderLevelPick(theme, data, 'quiz') });
    } else if (mode === 'timeAttack') {
      push({ title: `${tName} · ${label}`, render: () => TimeAttack.start(theme, data, { onExit: pop, onHome: goHome }) });
    } else if (mode === 'trueFalse') {
      push({ title: `${tName} · ${label}`, render: () => TrueFalse.start(theme, data, { onExit: pop, onHome: goHome }) });
    } else if (mode === 'memory') {
      push({ title: `${tName} · ${label}`, render: () => Memory.start(theme, data, { onExit: pop, onHome: goHome }) });
    } else if (mode === 'guessImage') {
      push({ title: `${tName} · ${label}`, render: () => GuessImage.start(theme, data, { onExit: pop, onHome: goHome }) });
    }
  }

  function renderLevelPick(theme, data, mode) {
    const levels = ['easy', 'medium', 'hard', 'expert'];
    let html = `<div class="section-title">${Lang.t('chooseLevel')}</div>`;
    html += '<div class="grid">';
    levels.forEach((lv, i) => {
      const count = (data.quiz?.[lv] || []).length;
      const available = count >= 4;
      html += `
        <button class="card level-card lv-${lv}" data-level="${lv}" style="--card-delay:${i * 40}ms" ${available ? '' : 'disabled'}>
          <span class="icon">${({ easy:'🟢', medium:'🟡', hard:'🟠', expert:'🔴' })[lv]}</span>
          <span class="title">${Lang.t('levels.' + lv)}</span>
          <span class="sub">${count} questions</span>
        </button>`;
    });
    html += '</div>';
    screen.innerHTML = html;

    screen.querySelectorAll('[data-level]:not([disabled])').forEach(b => {
      b.addEventListener('click', () => {
        const lv = b.dataset.level;
        push({
          title: `${Lang.pick(theme.name)} · ${Lang.t('levels.' + lv)}`,
          render: () => Quiz.start(theme, data, lv, { onExit: pop, onHome: goHome })
        });
      });
    });
  }

  function goHome() {
    reset();
    push({ title: Lang.t('appTitle'), render: renderHome });
  }

  // ---------- Expose helpers ----------
  window.CulturaApp = {
    push, pop, goHome,
    showBottomBar(score, timer) {
      bottomBar.classList.remove('hidden');
      document.getElementById('bottomScore').textContent = score ?? '';
      document.getElementById('bottomTimer').textContent = timer ?? '';
    },
    hideBottomBar() { bottomBar.classList.add('hidden'); },
    setTimerDanger(on) { document.getElementById('bottomTimer').classList.toggle('danger', !!on); },
    setBack(visible) { backBtn.classList.toggle('hidden', !visible); },
    screen
  };

  // ---------- Boot ----------
  goHome();
})();
