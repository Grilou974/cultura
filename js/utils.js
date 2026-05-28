/* ----------  Cultoko — Feedback toast  ---------- */
const Feedback = (function () {
  let activeToast = null;

  function show(isCorrect, opts = {}) {
    // Remove previous toast immediately
    if (activeToast) { activeToast.remove(); activeToast = null; }

    const toast = document.createElement('div');
    toast.className = 'feedback-toast ' + (isCorrect ? 'good' : 'bad');

    const isFR = (typeof Lang !== 'undefined' && Lang.current === 'fr');
    const okText = opts.text || (isFR ? 'Bravo !' : 'Nice!');
    const koText = opts.text || (isFR ? 'Raté !' : 'Missed!');
    const pointText = isFR ? 'point' : 'pt';

    if (isCorrect) {
      toast.innerHTML = `
        <div class="ft-row">
          <span class="ft-plus">+1</span>
          <span class="ft-point">${pointText}</span>
        </div>
        <div class="ft-text">${okText}</div>`;
    } else {
      toast.innerHTML = `
        <div class="ft-row">
          <span class="ft-cross">×</span>
        </div>
        <div class="ft-text">${koText}</div>`;
    }

    document.body.appendChild(toast);
    activeToast = toast;
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
      if (activeToast === toast) activeToast = null;
    }, 1100);
  }

  return { show };
})();
