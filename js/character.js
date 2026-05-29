/* ----------  Cultoko — Cute character mascot (rich SVG + designed accessories)  ---------- */
const Character = (function () {

  // accBack = drawn between body and face (hats, helmets)
  // accFront = drawn after face (eye patches, earrings — anything that should cover face/ears)
  // hideAntenna = if true, the default cute antenna is hidden (e.g. astronaut wears helmet instead)
  const SKINS = {
    'default': {
      name: { fr: 'Classique', en: 'Classic' }, body: '#F5E5C7', accent: '#B89968', glow: '#F0D9A0', cost: 0,
      accBack: '', accFront: '', hideAntenna: false,
    },
    'mint': {
      name: { fr: 'Menthe', en: 'Mint' }, body: '#CDEDE0', accent: '#1F6F4E', glow: '#A8DAC4', cost: 20,
      // Little leaf on top
      accBack: `
        <g class="char-acc" transform="translate(50, 24) rotate(-15)">
          <path d="M0 0 Q -8 -10 0 -16 Q 8 -10 0 0 Z" fill="#3D9970" stroke="#1F6F4E" stroke-width="0.6"/>
          <line x1="0" y1="-2" x2="0" y2="-14" stroke="#1F6F4E" stroke-width="0.6"/>
        </g>
      `, accFront: '', hideAntenna: false,
    },
    'rose': {
      name: { fr: 'Rose', en: 'Rose' }, body: '#FCD9DD', accent: '#D14D6E', glow: '#F9BFC7', cost: 20,
      // Cute flower on the side of head
      accBack: `
        <g class="char-acc" transform="translate(30, 28)">
          <circle cx="0"  cy="-4" r="3" fill="#F9C0CB"/>
          <circle cx="-3" cy="0"  r="3" fill="#F9C0CB"/>
          <circle cx="3"  cy="0"  r="3" fill="#F9C0CB"/>
          <circle cx="-1" cy="3"  r="3" fill="#F9C0CB"/>
          <circle cx="0"  cy="0"  r="1.5" fill="#D14D6E"/>
        </g>
      `, accFront: '', hideAntenna: false,
    },
    'sky': {
      name: { fr: 'Azur', en: 'Sky' }, body: '#CFE5F5', accent: '#3A6EA5', glow: '#A8CFEC', cost: 20,
      // Tiny cloud floating beside
      accBack: `
        <g class="char-acc" transform="translate(80, 30)">
          <ellipse cx="-4" cy="0" rx="5" ry="3.5" fill="#fff" stroke="#3A6EA5" stroke-width="0.4"/>
          <ellipse cx="2"  cy="-1" rx="6" ry="4"   fill="#fff" stroke="#3A6EA5" stroke-width="0.4"/>
          <ellipse cx="0"  cy="2" rx="4" ry="2.5"  fill="#fff" stroke="#3A6EA5" stroke-width="0.4"/>
        </g>
      `, accFront: '', hideAntenna: false,
    },

    'crown': {
      name: { fr: 'Royal', en: 'Royal' }, body: '#F5EBD8', accent: '#0E1A2B', glow: '#F1E2C5', cost: 60,
      hideAntenna: true,
      accBack: `
        <g class="char-acc" transform="translate(50, 18)">
          <!-- Velvet inside the crown (background fill) -->
          <path d="M-22 6 L-20 -10 L-10 0 L0 -14 L10 0 L20 -10 L22 6 Z" fill="#7B1E3A" opacity="0.5"/>
          <!-- Outer crown shape: 5 points -->
          <path d="M-22 6 L-22 -2 L-20 -10 L-10 0 L0 -14 L10 0 L20 -10 L22 -2 L22 6 Z"
                fill="#F4D06F" stroke="#0E1A2B" stroke-width="0.9" stroke-linejoin="round"/>
          <!-- Crown base band -->
          <rect x="-22" y="6" width="44" height="6" rx="1.4" fill="#D4AF37" stroke="#0E1A2B" stroke-width="0.9"/>
          <!-- Pearl line along the band -->
          <circle cx="-18" cy="9" r="1.1" fill="#FFF7DC"/>
          <circle cx="-9"  cy="9" r="1.1" fill="#FFF7DC"/>
          <circle cx="0"   cy="9" r="1.1" fill="#FFF7DC"/>
          <circle cx="9"   cy="9" r="1.1" fill="#FFF7DC"/>
          <circle cx="18"  cy="9" r="1.1" fill="#FFF7DC"/>
          <!-- Jewels on the crown peaks -->
          <circle cx="-20" cy="-10" r="2.4" fill="#9B2C2C" stroke="#0E1A2B" stroke-width="0.6"/>
          <circle cx="-20" cy="-10.6" r="0.6" fill="#FFD0D0"/>
          <circle cx="0"   cy="-14"  r="3.2" fill="#1F6F4E" stroke="#0E1A2B" stroke-width="0.6"/>
          <circle cx="-0.7" cy="-15"  r="0.7" fill="#A8E6C9"/>
          <circle cx="20"  cy="-10" r="2.4" fill="#3A6EA5" stroke="#0E1A2B" stroke-width="0.6"/>
          <circle cx="20"  cy="-10.6" r="0.6" fill="#C9DCEC"/>
          <!-- Highlight stroke on top edge -->
          <path d="M-22 -2 L-20 -10 L-10 0 L0 -14 L10 0 L20 -10 L22 -2" stroke="#FFF1C7" stroke-width="0.6" fill="none" opacity="0.85"/>
        </g>
        <!-- Royal cape behind body -->
        <g class="char-acc">
          <path d="M22 50 Q14 70 14 92 L20 92 L26 60 Z" fill="#7B1E3A" stroke="#0E1A2B" stroke-width="0.8"/>
          <path d="M78 50 Q86 70 86 92 L80 92 L74 60 Z" fill="#7B1E3A" stroke="#0E1A2B" stroke-width="0.8"/>
        </g>
      `, accFront: '',
    },

    'pirate': {
      name: { fr: 'Pirate', en: 'Pirate' }, body: '#F2E7D2', accent: '#0E1A2B', glow: '#E5D6B5', cost: 100,
      hideAntenna: true,
      accBack: `
        <g class="char-acc" transform="translate(50, 26)">
          <!-- Tricorn hat (main shape) -->
          <path d="M-34 8 Q-30 -10 0 -12 Q30 -10 34 8 Q20 2 0 2 Q-20 2 -34 8 Z"
                fill="#0E1A2B" stroke="#5C6373" stroke-width="0.6" stroke-linejoin="round"/>
          <!-- Red ribbon band -->
          <path d="M-32 7 Q0 2 32 7" stroke="#9B2C2C" stroke-width="2" fill="none"/>
          <!-- Skull -->
          <ellipse cx="0" cy="-2" rx="3.6" ry="3.4" fill="#FFFFFF"/>
          <ellipse cx="-1.2" cy="-2" rx="0.7" ry="0.9" fill="#0E1A2B"/>
          <ellipse cx="1.2"  cy="-2" rx="0.7" ry="0.9" fill="#0E1A2B"/>
          <rect x="-1" y="0.4" width="2" height="1.2" fill="#0E1A2B"/>
          <!-- Crossbones -->
          <line x1="-5" y1="4" x2="5" y2="0" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round"/>
          <line x1="-5" y1="0" x2="5" y2="4" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round"/>
          <circle cx="-5" cy="4" r="0.9" fill="#FFFFFF"/>
          <circle cx="5"  cy="4" r="0.9" fill="#FFFFFF"/>
          <circle cx="-5" cy="0" r="0.9" fill="#FFFFFF"/>
          <circle cx="5"  cy="0" r="0.9" fill="#FFFFFF"/>
        </g>
      `,
      accFront: `
        <!-- Eye patch over LEFT eye -->
        <g class="char-acc">
          <ellipse cx="40" cy="52" rx="7" ry="6" fill="#0E1A2B"/>
          <path d="M33 49 L20 42" stroke="#0E1A2B" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M33 56 L20 64" stroke="#0E1A2B" stroke-width="1.4" stroke-linecap="round"/>
          <!-- Gold hoop earring on right ear -->
          <circle cx="80" cy="40" r="2.4" fill="none" stroke="#D4AF37" stroke-width="1.6"/>
        </g>
      `,
    },

    'astro': {
      name: { fr: 'Astronaute', en: 'Astronaut' }, body: '#E8E9F0', accent: '#3A4A66', glow: '#D8DBE8', cost: 200,
      hideAntenna: true,
      accBack: `
        <g class="char-acc">
          <!-- Helmet ring at bottom of head -->
          <ellipse cx="50" cy="88" rx="34" ry="6" fill="#8A95B0" stroke="#3A4A66" stroke-width="1"/>
          <ellipse cx="50" cy="86" rx="34" ry="4" fill="#B5BDD0"/>
        </g>
      `,
      accFront: `
        <g class="char-acc">
          <!-- Glass bubble helmet (over everything) -->
          <ellipse cx="50" cy="55" rx="40" ry="44" fill="rgba(190,220,250,0.20)" stroke="#3A4A66" stroke-width="2"/>
          <!-- Inner subtle ring -->
          <ellipse cx="50" cy="55" rx="37" ry="41" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
          <!-- Big shine highlight -->
          <path d="M26 32 Q40 18 60 22" stroke="#FFFFFF" stroke-width="2.6" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M26 42 Q34 34 44 36" stroke="#FFFFFF" stroke-width="1.2" fill="none" opacity="0.5" stroke-linecap="round"/>
          <!-- Antenna with red blinking light -->
          <line x1="50" y1="11" x2="50" y2="4" stroke="#7A8BA8" stroke-width="1.6" stroke-linecap="round"/>
          <circle class="astro-led-glow" cx="50" cy="3" r="3.5" fill="#FF5252" opacity="0.4"/>
          <circle class="astro-led"      cx="50" cy="3" r="1.6" fill="#FF5252"/>
          <!-- Body patch (flag emblem on chest) -->
          <rect x="42" y="68" width="16" height="10" rx="2" fill="#3A6EA5" stroke="#0E1A2B" stroke-width="0.6"/>
          <text x="50" y="76" text-anchor="middle" font-family="serif" font-size="7" font-weight="700" fill="#FFFFFF" font-style="italic">C</text>
        </g>
      `,
    },
  };

  function getSkin(id) { return SKINS[id] || SKINS['default']; }
  function allSkins() { return Object.entries(SKINS).map(([id, s]) => ({ id, ...s })); }

  function faceParts(mood) {
    let eyes, mouth, blush = '', tear = '', hands = '';

    if (mood === 'happy') {
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
      hands = `<g class="char-hands">
                 <ellipse class="char-hand-l" cx="14" cy="60" rx="6" ry="7" fill="var(--char-body)" stroke="var(--char-accent)" stroke-width="1.4"/>
                 <ellipse class="char-hand-r" cx="86" cy="60" rx="6" ry="7" fill="var(--char-body)" stroke="var(--char-accent)" stroke-width="1.4"/>
               </g>`;
    } else if (mood === 'sad') {
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
    const antenna = s.hideAntenna ? '' : `
      <line x1="50" y1="26" x2="50" y2="14" stroke="${s.accent}" stroke-width="1.6" stroke-linecap="round"/>
      <g class="char-antenna" transform="translate(50, 10)">
        <path d="M0 -6 C1 -2 3 -1 6 0 C3 1 1 2 0 6 C-1 2 -3 1 -6 0 C-3 -1 -1 -2 0 -6 Z" fill="#D4AF37"/>
      </g>`;

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

        <ellipse class="char-shadow" cx="50" cy="100" rx="22" ry="3.5" fill="rgba(11,14,20,0.18)"/>
        ${mood === 'happy' ? '<circle cx="50" cy="60" r="44" fill="url(#glowGrad)"/>' : ''}

        <g class="char-body-group">
          ${antenna}

          <!-- ears -->
          <circle cx="26" cy="34" r="6" fill="${s.body}" stroke="${s.accent}" stroke-width="1.5"/>
          <circle cx="74" cy="34" r="6" fill="${s.body}" stroke="${s.accent}" stroke-width="1.5"/>

          <!-- body -->
          <ellipse class="char-body" cx="50" cy="58" rx="32" ry="34" fill="${s.body}" stroke="${s.accent}" stroke-width="1.6"/>
          <ellipse cx="50" cy="58" rx="32" ry="34" fill="url(#bodyGrad)"/>

          <!-- accessory back (hats, crowns, helmet ring) -->
          ${s.accBack || ''}

          <!-- face -->
          <g class="char-face">
            ${eyes}
            ${blush}
            ${mouth}
            ${tear}
          </g>

          <!-- accessory front (eye patch, helmet bubble) -->
          ${s.accFront || ''}

          ${hands}
        </g>

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
