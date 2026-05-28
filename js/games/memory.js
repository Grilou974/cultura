/* ----------  Cultura — Memory / Association  ---------- */
const Memory = (function () {
  const PAIRS = 8; // 8 paires = 16 cellules

  function start(theme, data, hooks) {
    const allPairs = data.memory?.pairs || [];
    const pairs = Data.pick(allPairs, Math.min(PAIRS, allPairs.length));
    const startedAt = Date.now();

    // Construit les 2n cellules : moitié 'a', moitié 'b'
    const cells = [];
    pairs.forEach((p, i) => {
      cells.push({ pid: i, side: 'a', text: Lang.pick(p.a) });
      cells.push({ pid: i, side: 'b', text: Lang.pick(p.b) });
    });
    const shuffled = Data.shuffle(cells);

    let selected = null;
    let matched = new Set();
    let attempts = 0;
    let locked = false;

    function render() {
      const cols = pairs.length <= 6 ? 4 : 4;
      CulturaApp.screen.innerHTML = `
        <div class="q-header">
          <span>${Lang.t('pairs')} : ${matched.size} / ${pairs.length}</span>
          <span>${attempts} essais</span>
        </div>
        <div class="memory-grid" style="grid-template-columns: repeat(${cols}, 1fr)">
          ${shuffled.map((c, i) => {
            const cls = matched.has(c.pid) ? 'matched' : (selected?.idx === i ? 'selected' : '');
            return `<div class="memory-cell ${cls}" data-idx="${i}">${c.text}</div>`;
          }).join('')}
        </div>
      `;
      CulturaApp.screen.querySelectorAll('.memory-cell').forEach(el => {
        el.addEventListener('click', () => pick(parseInt(el.dataset.idx)));
      });
    }

    function pick(idx) {
      if (locked) return;
      const cell = shuffled[idx];
      if (matched.has(cell.pid)) return;
      if (selected && selected.idx === idx) return; // ignore re-click on same cell

      if (!selected) {
        selected = { idx, cell };
        render();
        return;
      }
      // Second pick
      attempts++;
      if (selected.cell.pid === cell.pid && selected.cell.side !== cell.side) {
        matched.add(cell.pid);
        selected = null;
        render();
        if (matched.size === pairs.length) {
          setTimeout(finish, 400);
        }
      } else {
        locked = true;
        const a = CulturaApp.screen.querySelector(`[data-idx="${selected.idx}"]`);
        const b = CulturaApp.screen.querySelector(`[data-idx="${idx}"]`);
        a?.classList.add('wrong-flash');
        b?.classList.add('wrong-flash');
        setTimeout(() => {
          selected = null;
          locked = false;
          render();
        }, 700);
      }
    }

    function finish() {
      const secs = Math.round((Date.now() - startedAt) / 1000);
      CulturaApp.screen.innerHTML = `
        <div class="result">
          <div class="emoji">🧩</div>
          <h2>${Lang.t('excellent')}</h2>
          <div class="score-big">${attempts}</div>
          <div class="stats">${attempts} essais · ${secs}${Lang.t('seconds')}</div>
          <div class="btn-row">
            <button class="btn secondary" id="r-home">${Lang.t('home')}</button>
            <button class="btn" id="r-again">${Lang.t('continue')}</button>
          </div>
        </div>
      `;
      document.getElementById('r-again').onclick = () => start(theme, data, hooks);
      document.getElementById('r-home').onclick = hooks.onHome;
    }

    render();
  }

  return { start };
})();
