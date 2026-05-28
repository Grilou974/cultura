/* ----------  Cultoko — Bank (points) + Skins  ---------- */
const Bank = (function () {
  const KEY = 'cultoko_bank_v1';
  const SKINS_KEY = 'cultoko_skins_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { correct: 0, points: 0 }; }
    catch (e) { return { correct: 0, points: 0 }; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }
  function loadSkins() {
    try {
      const v = JSON.parse(localStorage.getItem(SKINS_KEY)) || {};
      if (!v.owned) v.owned = ['default'];
      if (!v.equipped) v.equipped = 'default';
      return v;
    } catch (e) { return { owned: ['default'], equipped: 'default' }; }
  }
  function saveSkins(s) {
    try { localStorage.setItem(SKINS_KEY, JSON.stringify(s)); } catch (_) {}
  }

  let state = load();
  let skins = loadSkins();
  const listeners = [];

  function getPoints() { return state.points; }
  function getCorrect() { return state.correct; }
  function getNextThreshold() { return Math.floor(state.correct / 10) * 10 + 10; }
  function progressInDecile() { return state.correct % 10; }

  // Returns object: {gained: 0 or 1, total: N, justLeveled: bool}
  function add(isCorrect) {
    if (!isCorrect) return { gained: 0, total: state.points, justLeveled: false };
    state.correct++;
    let gained = 0;
    if (state.correct % 10 === 0) {
      state.points++;
      gained = 1;
    }
    save(state);
    listeners.forEach(fn => fn(state));
    return { gained, total: state.points, justLeveled: gained === 1 };
  }

  function spend(amount) {
    if (state.points < amount) return false;
    state.points -= amount;
    save(state);
    listeners.forEach(fn => fn(state));
    return true;
  }

  function onChange(fn) { listeners.push(fn); }

  // Skins
  function ownedSkins() { return skins.owned.slice(); }
  function equippedSkin() { return skins.equipped; }
  function buySkin(id, cost) {
    if (skins.owned.includes(id)) return { ok: true, already: true };
    if (state.points < cost) return { ok: false, reason: 'not_enough' };
    state.points -= cost;
    skins.owned.push(id);
    save(state);
    saveSkins(skins);
    listeners.forEach(fn => fn(state));
    return { ok: true, already: false };
  }
  function equipSkin(id) {
    if (!skins.owned.includes(id)) return false;
    skins.equipped = id;
    saveSkins(skins);
    listeners.forEach(fn => fn(state));
    return true;
  }

  return {
    add, spend, getPoints, getCorrect, getNextThreshold, progressInDecile, onChange,
    ownedSkins, equippedSkin, buySkin, equipSkin,
  };
})();
