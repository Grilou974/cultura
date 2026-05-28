/* ----------  Cultura — Data loader  ---------- */
const Data = {
  themes: null,
  cache: {},

  async loadThemes() {
    if (this.themes) return this.themes;
    const res = await fetch('data/themes.json?v=8');
    this.themes = await res.json();
    return this.themes;
  },

  async loadTheme(id) {
    if (this.cache[id]) return this.cache[id];
    const res = await fetch(`data/${id}.json?v=8`);
    const data = await res.json();
    this.cache[id] = data;
    return data;
  },

  // Pioche n items aléatoires dans un tableau (sans répétition)
  pick(arr, n) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  },

  shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
};
