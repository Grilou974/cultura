/* ----------  Cultura — True / False  ---------- */
const TrueFalse = (function () {
  const SIZE = 15;

  function start(theme, data, hooks) {
    const pool = Data.pick(data.trueFalse || [], Math.min(SIZE, (data.trueFalse || []).length));
    let idx = 0, score = 0, wrong = 0, locked = false;

    function renderQ() {
      const q = pool[idx];
      if (!q) return finish();

      CulturaApp.screen.innerHTML = `
        <div class="q-header">
          <span>${idx + 1} / ${pool.length}</span>
          <span>${Lang.t('score')} : ${score}</span>
        </div>
        <div class="q-progress"><div style="width:${(idx / pool.length) * 100}%"></div></div>
        <div id="quizChar" class="char-wrap mood-idle"></div>
        <div class="question">${Lang.pick(q.stmt)}</div>
        <div class="tf-buttons">
          <button class="btn true"  id="tf-true">${Lang.t('true')}</button>
          <button class="btn false" id="tf-false">${Lang.t('false')}</button>
        </div>
      `;
      Character.mount(document.getElementById('quizChar'), 'idle');
      locked = false;
      document.getElementById('tf-true').addEventListener('click', () => answer(true));
      document.getElementById('tf-false').addEventListener('click', () => answer(false));
    }

    function answer(picked) {
      if (locked) return;
      locked = true;
      const q = pool[idx];
      const correct = picked === q.answer;
      if (correct) score++; else wrong++;
      CulturaApp.scoreAnswer(correct);
      Character.play(document.getElementById('quizChar'), correct ? 'happy' : 'sad');
      const btnPicked = document.getElementById(picked ? 'tf-true' : 'tf-false');
      btnPicked.style.outline = correct ? '3px solid var(--good)' : '3px solid var(--bad)';
      Feedback.show(correct);
      setTimeout(() => { idx++; renderQ(); }, 800);
    }

    function finish() {
      const ratio = score / pool.length;
      let emoji = '🤔';
      if (ratio === 1) emoji = '🏆';
      else if (ratio >= 0.7) emoji = '🎉';
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
            <button class="btn" id="r-again">${Lang.t('continue')}</button>
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
