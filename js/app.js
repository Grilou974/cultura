/* ----------  Cultoko — Main app & router  ---------- */
(function () {
  const screen = document.getElementById('screen');
  const backBtn = document.getElementById('backBtn');
  const langBtn = document.getElementById('langBtn');
  const topTitle = document.getElementById('topTitle');
  const bottomBar = document.getElementById('bottomBar');
  const bankBadge = document.getElementById('bankBadge');

  backBtn.innerHTML = Icons.chevronLeft;
  langBtn.innerHTML = `<span class="lang-glyph">${Icons.globe}</span><span class="lang-text">${Lang.current.toUpperCase()}</span>`;

  const topLogo = document.getElementById('topLogo');
  if (topLogo) topLogo.addEventListener('click', () => goHome());

  // ---------- Bank badge ----------
  function renderBank(animate = false) {
    if (!bankBadge) return;
    bankBadge.innerHTML = `<span class="bank-icon">${Icons.sparkle}</span><span class="bank-num">${Bank.getPoints()}</span>`;
    if (animate) {
      bankBadge.classList.remove('pop');
      void bankBadge.offsetWidth;
      bankBadge.classList.add('pop');
    }
  }
  renderBank();
  Bank.onChange(() => renderBank(false));
  if (bankBadge) {
    bankBadge.addEventListener('click', () => openShop());
  }
  // Public hook for games to call when an answer is given
  window.CulturaApp = window.CulturaApp || {};
  window.CulturaApp.scoreAnswer = function (isCorrect) {
    const res = Bank.add(isCorrect);
    if (res.justLeveled) renderBank(true);
    return res;
  };

  // ---------- Stack ----------
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
  function reset() { stack.length = 0; }
  function updateChrome() {
    const isHome = stack.length <= 1;
    backBtn.classList.toggle('hidden', isHome);
    const top = stack[stack.length - 1];
    topTitle.textContent = isHome ? '' : (top?.title || '');
    bottomBar.classList.add('hidden');
  }

  function modeLabel(theme, modeId) {
    const override = theme?.modeLabels?.[modeId];
    if (override) return Lang.pick(override);
    return Lang.t('modes.' + modeId);
  }

  backBtn.addEventListener('click', pop);
  langBtn.addEventListener('click', () => {
    Lang.set(Lang.current === 'fr' ? 'en' : 'fr');
    langBtn.querySelector('.lang-text').textContent = Lang.current.toUpperCase();
    document.documentElement.lang = Lang.current;
    const top = stack[stack.length - 1];
    if (top) { updateChrome(); top.render(); }
  });
  document.documentElement.lang = Lang.current;

  // ---------- PWA Install ----------
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
        <img class="hero-logo" src="icons/logo-full.svg?v=8" alt="Cultoko" />
        <p class="hero-tag">${Lang.t('tagline')}</p>
      </div>`;

    if (deferredInstall) {
      html += `
        <div class="install-prompt">
          <span class="ip-icon">${Icons.download}</span>
          <span class="ip-text">${Lang.t('install')}</span>
          <button class="btn" id="installBtn">${Lang.t('installBtn')}</button>
        </div>`;
    }

    html += `<div class="section-title"><span>${Lang.t('chooseTheme')}</span></div>`;
    html += '<div class="grid">';
    themes.forEach((t, i) => {
      const iconKey = t.icon || 'sparkle';
      const iconSvg = Icons[iconKey] || Icons.sparkle;
      html += `
        <button class="card theme-card" data-theme="${t.id}" style="--card-delay:${i * 50}ms">
          <span class="icon">${iconSvg}</span>
          <span class="title">${Lang.pick(t.name)}</span>
          <span class="card-arrow">${Icons.chevronLeft.replace('<path d="M15 6l-6 6 6 6"/>', '<path d="M9 6l6 6-6 6"/>')}</span>
        </button>`;
    });
    html += '</div>';

    // Shop link
    html += `
      <button class="shop-link" id="shopLink">
        <span class="shop-icon">${Icons.sparkle}</span>
        <span class="shop-text">
          <strong>${Lang.t('shop')}</strong>
          <small>${Lang.t('shopDesc')}</small>
        </span>
        <span class="shop-arrow">${Icons.chevronLeft.replace('<path d="M15 6l-6 6 6 6"/>', '<path d="M9 6l6 6-6 6"/>')}</span>
      </button>`;

    screen.innerHTML = html;
    screen.querySelectorAll('[data-theme]').forEach(b => {
      b.addEventListener('click', () => openTheme(b.dataset.theme));
    });
    document.getElementById('shopLink')?.addEventListener('click', openShop);

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
    push({ title: Lang.pick(theme.name), render: () => renderModes(theme) });
  }

  async function renderModes(theme) {
    const data = await Data.loadTheme(theme.id);
    const modes = [
      { id: 'quiz',       icon: 'target',  requires: 'quiz' },
      { id: 'timeAttack', icon: 'clock',   requires: 'quiz' },
      { id: 'trueFalse',  icon: 'check',   requires: 'trueFalse' },
      { id: 'memory',     icon: 'puzzle',  requires: 'memory' },
      { id: 'guessImage', icon: 'image',   requires: 'guessImage' }
    ];
    let html = `<div class="section-title"><span>${Lang.t('chooseMode')}</span></div>`;
    html += '<div class="grid">';
    modes.forEach((m, i) => {
      const available = isModeAvailable(data, m.requires);
      const label = modeLabel(theme, m.id);
      const sub = available ? Lang.t('modesSub.' + m.id) : Lang.t('notAvailable');
      html += `
        <button class="card mode-card" data-mode="${m.id}" style="--card-delay:${i * 50}ms" ${available ? '' : 'disabled'}>
          <span class="icon">${Icons[m.icon]}</span>
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
    if (key === 'quiz') return data.quiz && Object.values(data.quiz).some(arr => arr && arr.length > 0);
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
    const levelIcons = { easy: 'level1', medium: 'level2', hard: 'level3', expert: 'level4' };
    let html = `<div class="section-title"><span>${Lang.t('chooseLevel')}</span></div>`;
    html += '<div class="grid">';
    levels.forEach((lv, i) => {
      const count = (data.quiz?.[lv] || []).length;
      const available = count >= 4;
      html += `
        <button class="card level-card lv-${lv}" data-level="${lv}" style="--card-delay:${i * 50}ms" ${available ? '' : 'disabled'}>
          <span class="icon">${Icons[levelIcons[lv]]}</span>
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

  // ---------- Shop screen ----------
  function openShop() {
    push({ title: Lang.t('shop'), render: renderShop });
  }
  function renderShop() {
    const skins = Character.allSkins();
    const equipped = Bank.equippedSkin();
    const owned = Bank.ownedSkins();
    const points = Bank.getPoints();
    let html = `
      <div class="shop-header">
        <h2>${Lang.t('shopTitle')}</h2>
        <p>${Lang.t('shopDesc')}</p>
      </div>
      <div class="shop-grid">`;
    skins.forEach(s => {
      const isOwned = owned.includes(s.id);
      const isEquipped = equipped === s.id;
      let costLine, btn;
      if (isEquipped) {
        costLine = `<span class="skin-cost owned">${Lang.t('skinEquipped')}</span>`;
        btn = `<button class="skin-btn is-equipped" disabled>${Lang.t('skinEquipped')}</button>`;
      } else if (isOwned) {
        costLine = `<span class="skin-cost owned">${Lang.t('skinOwn')}</span>`;
        btn = `<button class="skin-btn" data-action="equip" data-id="${s.id}">${Lang.t('skinEquip')}</button>`;
      } else if (s.cost === 0) {
        costLine = `<span class="skin-cost free">${Lang.t('skinFree')}</span>`;
        btn = `<button class="skin-btn" data-action="buy" data-id="${s.id}" data-cost="0">${Lang.t('skinEquip')}</button>`;
      } else {
        costLine = `<span class="skin-cost">${s.cost} ${s.cost === 1 ? Lang.t('point') : Lang.t('points')}</span>`;
        const canBuy = points >= s.cost;
        btn = `<button class="skin-btn ${canBuy ? '' : 'disabled'}" data-action="buy" data-id="${s.id}" data-cost="${s.cost}" ${canBuy ? '' : 'disabled'}>${canBuy ? Lang.t('skinBuy') : Lang.t('skinTooPoor')}</button>`;
      }
      html += `
        <div class="skin-card ${isEquipped ? 'equipped' : ''}">
          <div class="skin-preview">${Character.svg(s.id, 'happy')}</div>
          <div class="skin-name">${Lang.pick(s.name)}</div>
          ${costLine}
          ${btn}
        </div>`;
    });
    html += '</div>';
    screen.innerHTML = html;

    screen.querySelectorAll('.skin-btn[data-action]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.dataset.id;
        const action = b.dataset.action;
        if (action === 'equip') {
          Bank.equipSkin(id);
          renderShop();
        } else if (action === 'buy') {
          const cost = parseInt(b.dataset.cost || '0', 10);
          const res = Bank.buySkin(id, cost);
          if (res.ok) {
            Bank.equipSkin(id);
            renderShop();
          }
        }
      });
    });
  }

  function goHome() {
    reset();
    push({ title: Lang.t('appTitle'), render: renderHome });
  }

  // ---------- Expose helpers (extend) ----------
  Object.assign(window.CulturaApp, {
    push, pop, goHome,
    showBottomBar(score, timer) {
      bottomBar.classList.remove('hidden');
      document.getElementById('bottomScore').textContent = score ?? '';
      document.getElementById('bottomTimer').textContent = timer ?? '';
    },
    hideBottomBar() { bottomBar.classList.add('hidden'); },
    setTimerDanger(on) { document.getElementById('bottomTimer').classList.toggle('danger', !!on); },
    setBack(visible) { backBtn.classList.toggle('hidden', !visible); },
    screen,
  });

  // ---------- Boot ----------
  goHome();
})();
