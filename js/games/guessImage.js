/* ----------  Cultura — Guess the Image  ---------- */
const GuessImage = (function () {
  const SIZE = 10;

  function start(theme, data, hooks) {
    const all = data.guessImage || [];
    const pool = Data.pick(all, Math.min(SIZE, all.length));
    let idx = 0, score = 0, locked = false;

    function renderQ() {
      const q = pool[idx];
      if (!q) return finish();
      // Construit 4 options : 1 vraie + 3 autres réponses du pool
      const correctText = Lang.pick(q.answer);
      const distractors = Data.shuffle(
        all.filter(x => Lang.pick(x.answer) !== correctText)
      ).slice(0, 3).map(x => x.answer);
      const opts = Data.shuffle([q.answer, ...distractors]);
      const correctIdx = opts.findIndex(o => Lang.pick(o) === correctText);

      // Image source : si c'est un code pays -> flagcdn, sinon URL directe
      const src = q.image && q.image.length === 2
        ? `https://flagcdn.com/w320/${q.image}.png`
        : q.image;

      CulturaApp.screen.innerHTML = `
        <div class="q-header">
          <span>${Lang.t('question')} ${idx + 1} ${Lang.t('of')} ${pool.length}</span>
          <span>${Lang.t('score')} : ${score}</span>
        </div>
        <div class="q-progress"><div style="width:${(idx / pool.length) * 100}%"></div></div>
        <div class="question"><img class="flag-img" src="${src}" alt="" /></div>
        <div class="answers">
          ${opts.map((o, i) => `
            <button class="answer" data-i="${i}">
              <span class="letter">${'ABCD'[i]}</span>
              <span>${Lang.pick(o)}</span>
            </button>
          `).join('')}
        </div>
      `;
      locked = false;
      CulturaApp.screen.querySelectorAll('.answer').forEach((b, i) => {
        b.addEventListener('click', () => answer(i, correctIdx));
      });
    }

    function answer(picked, correctIdx) {
      if (locked) return;
      locked = true;
      const btns = CulturaApp.screen.querySelectorAll('.answer');
      btns.forEach((b, i) => {
        b.disabled = true;
        if (i === correctIdx) b.classList.add('correct');
        if (i === picked && picked !== correctIdx) b.classList.add('wrong');
      });
      const isCorrect = picked === correctIdx;
      if (isCorrect) score++;
      Feedback.show(isCorrect);
      setTimeout(() => { idx++; renderQ(); }, 1100);
    }

    function finish() {
      const ratio = score / pool.length;
      let emoji = '😐';
      if (ratio === 1) emoji = '🏆';
      else if (ratio >= 0.8) emoji = '🎉';
      else if (ratio >= 0.5) emoji = '👍';
      else emoji = '💪';

      CulturaApp.screen.innerHTML = `
        <div class="result">
          <div class="emoji">${emoji}</div>
          <h2>${Lang.t('finish')}</h2>
          <div class="score-big">${score} / ${pool.length}</div>
          <div class="stats">${Math.round(ratio * 100)}%</div>
          <div class="btn-row">
            <button class="btn secondary" id="r-home">${Lang.t('home')}</button>
            <button class="btn" id="r-again">${Lang.t('playAgain')}</button>
          </div>
        </div>
      `;
      document.getElementById('r-again').onclick = () => start(theme, data, hooks);
      document.getElementById('r-home').onclick = hooks.onHome;
    }

    renderQ();
  }

  return { start };
})();
