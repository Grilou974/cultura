/* ----------  Cultura — Time Attack (60s)  ---------- */
const TimeAttack = (function () {
  const DURATION = 60;

  function start(theme, data, hooks) {
    // Pool : toutes difficultés confondues
    const all = []
      .concat(data.quiz?.easy || [])
      .concat(data.quiz?.medium || [])
      .concat(data.quiz?.hard || [])
      .concat(data.quiz?.expert || []);
    const pool = Data.shuffle(all);

    let idx = 0, score = 0, wrong = 0, timeLeft = DURATION, locked = false;
    let timerId = null;

    function renderQ() {
      if (timeLeft <= 0) return finish();
      const q = pool[idx % pool.length];
      const opts = q.options.map((o, i) => ({ o, correct: i === q.answer }));
      const shuffled = Data.shuffle(opts);
      const correctIdx = shuffled.findIndex(x => x.correct);

      let qHtml = Lang.pick(q.q);
      if (q.image) {
        const imgUrl = `https://flagcdn.com/w320/${q.image}.png`;
        qHtml = `<img class="flag-img" src="${imgUrl}" alt="" />`;
      }

      CulturaApp.screen.innerHTML = `
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
      locked = false;
      CulturaApp.screen.querySelectorAll('.answer').forEach((b, i) => {
        b.addEventListener('click', () => answer(i, correctIdx));
      });
      updateBar();
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
      if (picked === correctIdx) score++; else wrong++;
      updateBar();
      setTimeout(() => {
        idx++;
        renderQ();
      }, 450);
    }

    function updateBar() {
      CulturaApp.showBottomBar(`✓ ${score}   ✗ ${wrong}`, `⏱ ${timeLeft}${Lang.t('seconds')}`);
      CulturaApp.setTimerDanger(timeLeft <= 10);
    }

    function tick() {
      timeLeft--;
      updateBar();
      if (timeLeft <= 0) {
        clearInterval(timerId);
        finish();
      }
    }

    function finish() {
      clearInterval(timerId);
      CulturaApp.hideBottomBar();
      let emoji = '🎯';
      if (score >= 30) emoji = '🔥';
      else if (score >= 20) emoji = '🏆';
      else if (score >= 10) emoji = '🎉';
      else emoji = '💪';

      CulturaApp.screen.innerHTML = `
        <div class="result">
          <div class="emoji">${emoji}</div>
          <h2>${Lang.t('time')} !</h2>
          <div class="score-big">${score}</div>
          <div class="stats">${score} ${Lang.t('correctAnswers')} · ${wrong} ✗</div>
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
    timerId = setInterval(tick, 1000);

    // Stop timer if user navigates away
    const observer = new MutationObserver(() => {
      if (!document.body.contains(CulturaApp.screen.firstElementChild)) {
        clearInterval(timerId);
        observer.disconnect();
      }
    });
  }

  return { start };
})();
