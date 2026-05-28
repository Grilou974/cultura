/* ----------  Cultoko — Cute character mascot  ---------- */
const Character = (function () {

  // Skin catalog. Each skin defines colors + optional accessory SVG.
  // Cost in bank points (default is free, others cost).
  const SKINS = {
    'default':   { name: { fr: 'Classique',  en: 'Classic'   }, body: '#F2E7D2', accent: '#B89968', cost: 0,  acc: '' },
    'mint':      { name: { fr: 'Menthe',     en: 'Mint'      }, body: '#CDEDE0', accent: '#1F6F4E', cost: 3,  acc: '' },
    'rose':      { name: { fr: 'Rose',       en: 'Rose'      }, body: '#FCD9DD', accent: '#D14D6E', cost: 3,  acc: '' },
    'sky':       { name: { fr: 'Azur',       en: 'Sky'       }, body: '#CFE5F5', accent: '#3A6EA5', cost: 3,  acc: '' },
    'crown':     { name: { fr: 'Royal',      en: 'Royal'     }, body: '#F5EBD8', accent: '#0E1A2B', cost: 8,  acc: '<g transform="translate(50,12)"><path d="M-18 0 L-12 -12 L-6 -4 L0 -16 L6 -4 L12 -12 L18 0 Z" fill="#D4AF37" stroke="#0E1A2B" stroke-width="1.2"/><circle cx="0" cy="-12" r="2" fill="#9B2C2C"/></g>' },
    'pirate':    { name: { fr: 'Pirate',     en: 'Pirate'    }, body: '#F2E7D2', accent: '#0E1A2B', cost: 10, acc: '<g><path d="M28 30 q22 -16 44 0 v6 h-44 z" fill="#0E1A2B"/><circle cx="40" cy="44" r="6" fill="#0E1A2B"/></g>' },
    'astro':     { name: { fr: 'Astronaute', en: 'Astronaut' }, body: '#E8E9F0', accent: '#3A4A66', cost: 15, acc: '<g><circle cx="50" cy="46" r="28" fill="rgba(255,255,255,0.15)" stroke="#3A4A66" stroke-width="1.5"/><path d="M30 38 Q50 22 70 38" stroke="#fff" stroke-width="2" fill="none" opacity="0.6"/></g>' },
  };

  function getSkin(id) {
    return SKINS[id] || SKINS['default'];
  }
  function allSkins() {
    return Object.entries(SKINS).map(([id, s]) => ({ id, ...s }));
  }

  // Render the character as inline SVG. mood: 'idle'|'happy'|'sad'
  function svg(skinId, mood = 'idle') {
    const s = getSkin(skinId);
    const eyes = mood === 'happy'
      ? '<path d="M37 50 q4 -5 8 0" stroke="#0E1A2B" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M55 50 q4 -5 8 0" stroke="#0E1A2B" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
      : mood === 'sad'
        ? '<circle cx="41" cy="52" r="2.4" fill="#0E1A2B"/><circle cx="59" cy="52" r="2.4" fill="#0E1A2B"/><circle cx="41" cy="58" r="1.4" fill="#3A6EA5" opacity="0.6"/>'
        : '<circle cx="41" cy="52" r="2.6" fill="#0E1A2B"/><circle cx="59" cy="52" r="2.6" fill="#0E1A2B"/>';
    const mouth = mood === 'happy'
      ? '<path d="M40 64 Q50 76 60 64" stroke="#0E1A2B" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
      : mood === 'sad'
        ? '<path d="M40 70 Q50 60 60 70" stroke="#0E1A2B" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
        : '<path d="M44 66 Q50 70 56 66" stroke="#0E1A2B" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    const blush = mood === 'happy'
      ? '<ellipse cx="33" cy="62" rx="4" ry="2.5" fill="#FF8FA3" opacity="0.55"/><ellipse cx="67" cy="62" rx="4" ry="2.5" fill="#FF8FA3" opacity="0.55"/>'
      : '';

    return `
      <svg viewBox="0 0 100 100" class="char-svg" xmlns="http://www.w3.org/2000/svg">
        <!-- soft shadow under -->
        <ellipse cx="50" cy="92" rx="22" ry="3" fill="rgba(11,14,20,0.15)"/>
        <!-- body -->
        <ellipse class="char-body" cx="50" cy="58" rx="32" ry="34" fill="${s.body}" stroke="${s.accent}" stroke-width="1.5"/>
        <!-- ears (little bumps) -->
        <circle cx="26" cy="34" r="6" fill="${s.body}" stroke="${s.accent}" stroke-width="1.5"/>
        <circle cx="74" cy="34" r="6" fill="${s.body}" stroke="${s.accent}" stroke-width="1.5"/>
        <!-- accessory -->
        ${s.acc}
        <!-- face -->
        ${eyes}
        ${blush}
        ${mouth}
      </svg>
    `;
  }

  // Mount the character into a container element
  function mount(container, mood = 'idle') {
    const skinId = Bank.equippedSkin();
    container.innerHTML = svg(skinId, mood);
    container.className = 'char-wrap mood-' + mood;
  }

  // Play an animation on existing character (and swap face)
  function play(container, mood) {
    if (!container) return;
    const skinId = Bank.equippedSkin();
    container.innerHTML = svg(skinId, mood);
    container.classList.remove('mood-idle', 'mood-happy', 'mood-sad', 'anim-bounce', 'anim-droop');
    container.classList.add('mood-' + mood);
    // Force reflow then add animation class
    void container.offsetWidth;
    if (mood === 'happy') container.classList.add('anim-bounce');
    else if (mood === 'sad') container.classList.add('anim-droop');
    // After animation, return to idle face
    setTimeout(() => {
      if (!container.parentNode) return;
      container.innerHTML = svg(skinId, 'idle');
      container.classList.remove('mood-happy', 'mood-sad', 'anim-bounce', 'anim-droop');
      container.classList.add('mood-idle');
    }, 1100);
  }

  return { svg, mount, play, allSkins, getSkin };
})();
