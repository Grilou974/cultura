/* ----------  Cultura — SVG icon library (line, currentColor)  ---------- */
const Icons = (() => {
  const svg = (path, opts={}) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${opts.w||1.4}" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%" aria-hidden="true">${path}</svg>`;

  return {
    // Themes
    flag: svg('<path d="M4 21V4M4 4h12l-2 4 2 4H4"/>'),
    film: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 8h18M3 16h18M8 3v18M16 3v18"/>'),
    scales: svg('<path d="M12 3v18M3 7h18M6 7l-3 7a3 3 0 0 0 6 0l-3-7M18 7l-3 7a3 3 0 0 0 6 0l-3-7"/>'),
    controller: svg('<rect x="2" y="7" width="20" height="12" rx="6"/><path d="M7 13h2M8 12v2M15 13h.01M17 13h.01M13 13h.01"/>'),
    book: svg('<path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z"/><path d="M4 17a3 3 0 0 1 3-3h12"/>'),
    car: svg('<path d="M3 13l2-6a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 6"/><path d="M3 13h18v5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/>'),
    trophy: svg('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 6h3v3a3 3 0 0 1-3 3M7 6H4v3a3 3 0 0 0 3 3"/>'),
    monument: svg('<path d="M3 21h18M5 21V10M19 21V10M8 21V10M11 21V10M13 21V10M16 21V10M3 10h18l-3-4H6l-3 4z"/>'),

    // Modes
    target: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    check: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>'),
    puzzle: svg('<path d="M14 4h-4v2.5a1.5 1.5 0 1 1-3 0V4H4v6h2.5a1.5 1.5 0 1 1 0 3H4v7h7v-2.5a1.5 1.5 0 1 1 3 0V20h6v-7h-2.5a1.5 1.5 0 1 1 0-3H20V4h-6z"/>'),
    image: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>'),

    // Levels (sparkle dots indicating difficulty)
    level1: svg('<circle cx="6" cy="12" r="2" fill="currentColor"/>'),
    level2: svg('<circle cx="6" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'),
    level3: svg('<circle cx="6" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="18" cy="12" r="2" fill="currentColor"/>'),
    level4: svg('<path d="M12 2l2.4 5 5.6.7-4.1 4 1 5.6L12 14.8 7.1 17.3l1-5.6L4 7.7l5.6-.7L12 2z" fill="currentColor"/>'),

    // UI
    chevronLeft: svg('<path d="M15 6l-6 6 6 6"/>', {w: 2}),
    globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    download: svg('<path d="M12 4v12M6 12l6 6 6-6M5 21h14"/>'),
    home: svg('<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9z"/>'),
    refresh: svg('<path d="M20 12a8 8 0 1 1-2.34-5.66L20 9M20 4v5h-5"/>'),
    sparkle: svg('<path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" fill="currentColor" stroke="none"/>'),
  };
})();
