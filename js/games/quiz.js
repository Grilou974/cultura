/* ----------  Cultura — Classic Quiz  ---------- */
const Quiz = (function () {
  const SIZE = 20; // 10 questions par session

  function start(theme, data, level, hooks) {
    const pool = (data.quiz && data.quiz[level]) || [];
    const questions = Data.pick(pool, Math.min(SIZE, pool.length));
    let idx = 0, score = 0;

    function renderQ() {
      const q = questions[idx];
      if (!q) return finish();

      // Prépare les options (shuffle), garde trace de l'index de la bonne
      const opts = q.options.map((o, i) => ({ o, correct: i === q.answer }));
      const shuffled = Data.shuffle(opts);
      const correctIdx = shuffled.findIndex(x => x.correct);

      let qHtml = Lang.pick(q.q);
      // Si la question a une image (drapeau)
      if (q.image) {
        const imgUrl = `https://flagcdn.com/w320/${q.image}.png`;
        qHtml = `<img class="flag-img" src="${imgUrl}" alt="" />`;
      }

      const html = `
        <div class="q-header">
          <span>${Lang.t('question')} ${idx + 1} ${Lang.t('of')} ${questions.length}</span>
          <span>${Lang.t('score')} : ${score}</span>
        </div>
        <div class="q-progress"><div style="width:${(idx / questions.length) * 100}%"></div></div>
        <div class="question">${qHtml}</div>
        <div class="answers">
          ${shuffled.map((opt, i) => `
            <button class="answer" data-i="${i}">
              <span class="letter">${'ABCD'[i]}</span>
              <span>${Lang.pick(opt.o)}</span>
            </button>
          `).join('')}
        </div>
      `;
      CulturaApp.screen.innerHTML = html;
      CulturaApp.screen.querySelectorAll('.answer').forEach((b, i) => {
        b.addEventListener('click', () => answer(i, correctIdx));
      });
    }

    function answer(picked, correctIdx) {
      const btns = CulturaApp.screen.querySelectorAll('.answer');
      btns.forEach((b, i) => {
        b.disabled = true;
        if (i === correctIdx) b.classList.add('correct');
        if (i === picked && picked !== correctIdx) b.classList.add('wrong');
      });
      const isCorrect = picked === correctIdx;
      if (isCorrect) score++;
      Feedback.show(isCorrect);
      setTimeout(() => {
        idx++;
        renderQ();
      }, 1100);
    }

    function finish() {
      const ratio = score / questions.length;
      let emoji = '😐', label = Lang.t('keepGoing');
      if (ratio === 1) { emoji = '🏆'; label = Lang.t('perfect'); }
      else if (ratio >= 0.8) { emoji = '🎉'; label = Lang.t('excellent'); }
      else if (ratio >= 0.5) { emoji = '👍'; label = Lang.t('nice'); }
      else { emoji = '💪'; label = Lang.t('tryAgain'); }

      CulturaApp.screen.innerHTML = `
        <div class="result">
          <div class="emoji">${emoji}</div>
          <h2>${label}</h2>
          <div class="score-big">${score} / ${questions.length}</div>
          <div class="stats">${Math.round(ratio * 100)}%</div>
          <div class="btn-row">
            <button class="btn secondary" id="r-home">${Lang.t('home')}</button>
            <button class="btn" id="r-again">${Lang.t('playAgain')}</button>
          </div>
        </div>
      `;
      document.getElementById('r-again').addEventListener('click', renderQ.bind(null));
      // Re-shuffle for a true replay
      document.getElementById('r-again').onclick = () => start(theme, data, level, hooks);
      document.getElementById('r-home').addEventListener('click', hooks.onHome);
    }

    renderQ();
  }

  return { start };
})();
