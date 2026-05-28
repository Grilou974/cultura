/* ----------  Cultoko — Cute character mascot (richer SVG)  ---------- */
const Character = (function () {

  // Skin catalog: body color, accent color, accessory SVG (positioned inside the 100x100 viewBox)
  const SKINS = {
    'default':   { name: { fr: 'Classique',  en: 'Classic'   }, body: '#F5E5C7', accent: '#B89968', glow: '#F0D9A0', cost: 0,  acc: '' },
    'mint':      { name: { fr: 'Menthe',     en: 'Mint'      }, body: '#CDEDE0', accent: '#1F6F4E', glow: '#A8DAC4', cost: 3,  acc: '' },
    'rose':      { name: { fr: 'Rose',       en: 'Rose'      }, body: '#FCD9DD', accent: '#D14D6E', glow: '#F9BFC7', cost: 3,  acc: '' },
    'sky':       { name: { fr: 'Azur',       en: 'Sky'       }, body: '#CFE5F5', accent: '#3A6EA5', glow: '#A8CFEC', cost: 3,  acc: '' },
    'crown':     { name: { fr: 'Royal',      en: 'Royal'     }, body: '#F5EBD8', accent: '#0E1A2B', glow: '#E8D7B2', cost: 8,  acc: '<g class="char-acc" transform="translate(38,6)"><path d="M0 14 L4 0 L10 8 L14 -4 L18 8 L24 0 L28 14 Z" fill="#D4AF37" stroke="#0E1A2B" stroke-width="0.8"/><circle cx="14" cy="-4" r="2" fill="#9B2C2C"/></g>' },
    'pirate':    { name: { fr: 'Pirate',     en: 'Pirate'    }, body: '#F2E7D2', accent: '#0E1A2B', glow: '#E5D6B5', cost: 10, acc: '<g class="char-acc"><path d="M22 28 q28 -18 56 0 v8 h-56 z" fill="#0E1A2B"/><circle cx="38" cy="38" r="5" fill="#0E1A2B"/></g>' },
    'astro':     { name: { fr: 'Astronaute', en: 'Astronaut' }, body: '#E8E9F0', accent: '#3A4A66', glow: '#D8DBE8', cost: 15, acc: '<g class="char-acc"><circle cx="50" cy="46" r="30" fill="rgba(180,210,240,0.18)" stroke="#3A4A66" stroke-width="1.5"/><path d="M28 36 Q50 22 72 36" stroke="#fff" stroke-width="2" fill="none" opacity="0.5"/></g>' },
  };

  function getSkin(id) { return SKINS[id] || SKINS['default']; }
  function allSkins() { return Object.entries(SKINS).map(([id, s]) => ({ id, ...s })); }

  // Build face elements for a mood
  function faceParts(mood) {
    let eyes, mouth, blush = '', tear = '', hands = '', hearts = '';

    if (mood === 'happy') {
      // Heart-shaped eyes
      eyes = `
        <g class="char-eye-left">
          <path d="M37 51 c0 -3 -4 -3 -4 0 c0 0 0 0 0 0 c0 -3 -4 -3 -4 0 c0 3 4 6 4 6 c0 0 4 -3 4 -6 z" fill="#D14D6E"/>
          <circle cx="34" cy="51" r="1.2" fill="#fff"/>
        </g>
        <g class="char-eye-right">
          <path d="M67 51 c0 -3 -4 -3 -4 0 c0 0 0 0 0 0 c0 -3 -4 -3 -4 0 c0 3 4 6 4 6 c0 0 4 -3 4 -6 z" fill="#D14D6E"/>
          <circle cx="64" cy="51" r="1.2" fill="#fff"/>
        </g>`;
      mouth = `<path d="M38 64 Q50 78 62 64 Q56 72 44 72 Q44 72 38 64 Z" fill="#9B2C2C" stroke="#0E1A2B" stroke-width="1.2" stroke-linejoin="round"/>
               <path d="M44 68 Q50 71 56 68" fill="none" stroke="#FF8FA3" stroke-width="1.4" stroke-linecap="round"/>`;
      blush = `<ellipse cx="30" cy="62" rx="5" ry="3" fill="#FF8FA3" opacity="0.7"/>
               <ellipse cx="70" cy="62" rx="5" ry="3" fill="#FF8FA3" opacity="0.7"/>`;
      // Hands waving
      hands = `<g class="char-hands">
                 <ellipse class="char-hand-l" cx="14" cy="60" rx="6" ry="7" fill="var(--char-body)" stroke="var(--char-accent)" stroke-width="1.4"/>
                 <ellipse class="char-hand-r" cx="86" cy="60" rx="6" ry="7" fill="var(--char-body)" stroke="var(--char-accent)" stroke-width="1.4"/>
               </g>`;
    } else if (mood === 'sad') {
      // Tearful droopy eyes
      eyes = `
        <g class="char-eye-left">
          <circle cx="40" cy="53" r="3" fill="#0E1A2B"/>
          <circle cx="39" cy="52" r="1" fill="#fff"/>
          <path d="M34 50 Q40 47 46 50" stroke="#0E1A2B" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        </g>
        <g class="char-eye-right">
          <circle cx="60" cy="53" r="3" fill="#0E1A2B"/>
          <circle cx="59" cy="52" r="1" fill="#fff"/>
          <path d="M54 50 Q60 47 66 50" stroke="#0E1A2B" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        </g>`;
      mouth = `<path d="M40 70 Q50 60 60 70" stroke="#0E1A2B" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      tear = `<path class="char-tear" d="M40 60 q-2 5 0 8 q2 -3 0 -8 z" fill="#5AB6E3" opacity="0.9"/>`;
    } else {
      // Idle: simple cute eyes with sparkle
      eyes = `
        <g class="char-eye-left">
          <ellipse cx="40" cy="53" rx="3.2" ry="4" fill="#0E1A2B"/>
          <circle cx="39" cy="51" r="1.4" fill="#fff"/>
          <circle cx="41" cy="55" r="0.7" fill="#fff" opacity="0.7"/>
        </g>
        <g class="char-eye-right">
          <ellipse cx="60" cy="53" rx="3.2" ry="4" fill="#0E1A2B"/>
          <circle cx="59" cy="51" r="1.4" fill="#fff"/>
          <circle cx="61" cy="55" r="0.7" fill="#fff" opacity="0.7"/>
        </g>`;
      mouth = `<path d="M44 65 Q50 70 56 65" stroke="#0E1A2B" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    }

    return { eyes, mouth, blush, tear, hands };
  }

  function sparklesSvg() {
    // 6 sparkles flying outward
    return `<g class="char-sparkles">
      ${[0, 60, 120, 180, 240, 300].map((deg, i) => `
        <g class="spark" style="--ang:${deg}deg; --d:${i * 30}ms">
          <path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill="#B89968"/>
        </g>`).join('')}
    </g>`;
  }

  function svg(skinId, mood = 'idle') {
    const s = getSkin(skinId);
    const { eyes, mouth, blush, tear, hands } = faceParts(mood);
    const sparkles = mood === 'happy' ? sparklesSvg() : '';

    return `
      <svg viewBox="0 0 100 110" class="char-svg" xmlns="http://www.w3.org/2000/svg" style="--char-body:${s.body};--char-accent:${s.accent};--char-glow:${s.glow}">
        <defs>
          <radialGradient id="bodyGrad" cx="0.35" cy="0.3" r="0.9">
            <stop offset="0%" stop-color="white" stop-opacity="0.55"/>
            <stop offset="40%" stop-color="white" stop-opacity="0.05"/>
            <stop offset="100%" stop-color="${s.accent}" stop-opacity="0.15"/>
          </radialGradient>
          <radialGradient id="glowGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="${s.glow}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${s.glow}" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- ground shadow -->
        <ellipse class="char-shadow" cx="50" cy="100" rx="22" ry="3.5" fill="rgba(11,14,20,0.18)"/>

        <!-- aura glow when happy -->
        ${mood === 'happy' ? '<circle cx="50" cy="60" r="44" fill="url(#glowGrad)"/>' : ''}

        <!-- Body group (animated as a whole) -->
        <g class="char-body-group">
          <!-- Antenna with glowing star -->
          <line x1="50" y1="26" x2="50" y2="14" stroke="${s.accent}" stroke-width="1.6" stroke-linecap="round"/>
          <g class="char-antenna" transform="translate(50, 10)">
            <path d="M0 -6 C1 -2 3 -1 6 0 C3 1 1 2 0 6 C-1 2 -3 1 -6 0 C-3 -1 -1 -2 0 -6 Z" fill="#D4AF37"/>
          </g>

          <!-- ears (small bumps) -->
          <circle cx="26" cy="34" r="6" fill="${s.body}" stroke="${s.accent}" stroke-width="1.5"/>
          <circle cx="74" cy="34" r="6" fill="${s.body}" stroke="${s.accent}" stroke-width="1.5"/>

          <!-- body main -->
          <ellipse class="char-body" cx="50" cy="58" rx="32" ry="34" fill="${s.body}" stroke="${s.accent}" stroke-width="1.6"/>
          <!-- inner gradient highlight -->
          <ellipse cx="50" cy="58" rx="32" ry="34" fill="url(#bodyGrad)"/>

          <!-- accessory (hat / helmet / etc.) -->
          ${s.acc}

          <!-- Eyes + mouth -->
          <g class="char-face">
            ${eyes}
            ${blush}
            ${mouth}
            ${tear}
          </g>

          <!-- hands (only when happy) -->
          ${hands}
        </g>

        <!-- sparkles overlay -->
        ${sparkles}
      </svg>
    `;
  }

  function mount(container, mood = 'idle') {
    if (!container) return;
    const skinId = Bank.equippedSkin();
    container.innerHTML = svg(skinId, mood);
    container.className = 'char-wrap mood-' + mood;
  }

  function play(container, mood) {
    if (!container) return;
    const skinId = Bank.equippedSkin();
    container.innerHTML = svg(skinId, mood);
    container.classList.remove('mood-idle', 'mood-happy', 'mood-sad', 'anim-bounce', 'anim-droop');
    void container.offsetWidth;
    container.classList.add('mood-' + mood);
    if (mood === 'happy') container.classList.add('anim-bounce');
    else if (mood === 'sad') container.classList.add('anim-droop');
    setTimeout(() => {
      if (!container.parentNode) return;
      container.innerHTML = svg(skinId, 'idle');
      container.classList.remove('mood-happy', 'mood-sad', 'anim-bounce', 'anim-droop');
      container.classList.add('mood-idle');
    }, 1300);
  }

  return { svg, mount, play, allSkins, getSkin };
})();
