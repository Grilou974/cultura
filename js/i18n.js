/* ----------  Cultoko — i18n  ---------- */
const I18N = {
  fr: {
    appTitle: 'Cultoko',
    tagline: 'Mini-jeux de culture générale',
    chooseTheme: 'Choisis un thème',
    chooseMode: 'Choisis un mode de jeu',
    chooseLevel: 'Choisis une difficulté',
    modes: {
      quiz: 'Quiz classique',
      timeAttack: 'Contre-la-montre',
      trueFalse: 'Vrai ou Faux',
      memory: 'Memory / Association',
      guessImage: "Devine l'image"
    },
    modesSub: {
      quiz: '10 questions',
      timeAttack: '60 sec, max de bonnes réponses',
      trueFalse: 'Réponds le plus vite possible',
      memory: 'Trouve les paires',
      guessImage: 'Identifie l\'image'
    },
    levels: { easy: 'Facile', medium: 'Moyen', hard: 'Difficile', expert: 'Expert' },
    question: 'Question',
    of: 'sur',
    score: 'Score',
    finish: 'Résultat',
    next: 'Question suivante',
    playAgain: 'Rejouer',
    home: 'Accueil',
    backToThemes: 'Choisir un autre thème',
    backToModes: 'Choisir un autre mode',
    correct: 'Bravo !',
    wrong: 'Raté !',
    excellent: 'Excellent !',
    nice: 'Bien joué !',
    keepGoing: 'Continue tes efforts !',
    tryAgain: 'Réessaie !',
    perfect: 'PARFAIT !',
    time: 'Temps',
    seconds: 's',
    true: 'VRAI',
    false: 'FAUX',
    correctAnswers: 'bonnes réponses',
    pairs: 'Paires trouvées',
    notAvailable: 'Pas encore disponible pour ce thème',
    comingSoon: 'Bientôt disponible',
    starter: 'Contenu starter',
    starterDesc: 'Ce thème a peu de questions pour l\'instant. Ajoute-en facilement dans data/' ,
    install: 'Installer Cultoko sur ton appareil',
    installBtn: 'Installer',
    moreCountries: 'Note : pour voir les drapeaux, une connexion internet est nécessaire au 1er affichage.'
  },
  en: {
    appTitle: 'Cultoko',
    tagline: 'General-knowledge mini-games',
    chooseTheme: 'Choose a theme',
    chooseMode: 'Choose a game mode',
    chooseLevel: 'Choose a difficulty',
    modes: {
      quiz: 'Classic Quiz',
      timeAttack: 'Time Attack',
      trueFalse: 'True or False',
      memory: 'Memory / Pairs',
      guessImage: 'Guess the Image'
    },
    modesSub: {
      quiz: '10 questions',
      timeAttack: '60 sec, score as much as possible',
      trueFalse: 'Answer as fast as you can',
      memory: 'Find matching pairs',
      guessImage: 'Identify the image'
    },
    levels: { easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert' },
    question: 'Question',
    of: 'of',
    score: 'Score',
    finish: 'Result',
    next: 'Next question',
    playAgain: 'Play again',
    home: 'Home',
    backToThemes: 'Pick another theme',
    backToModes: 'Pick another mode',
    correct: 'Correct!',
    wrong: 'Wrong!',
    excellent: 'Excellent!',
    nice: 'Nicely done!',
    keepGoing: 'Keep going!',
    tryAgain: 'Try again!',
    perfect: 'PERFECT!',
    time: 'Time',
    seconds: 's',
    true: 'TRUE',
    false: 'FALSE',
    correctAnswers: 'correct answers',
    pairs: 'Pairs found',
    notAvailable: 'Not available yet for this theme',
    comingSoon: 'Coming soon',
    starter: 'Starter content',
    starterDesc: 'This theme has few questions for now. Add more in data/',
    install: 'Install Cultoko on your device',
    installBtn: 'Install',
    moreCountries: 'Note: an internet connection is needed the first time to load flag images.'
  }
};

const Lang = {
  current: localStorage.getItem('cultura_lang') || (navigator.language.startsWith('en') ? 'en' : 'fr'),
  set(l) {
    this.current = l;
    localStorage.setItem('cultura_lang', l);
  },
  t(key) {
    const parts = key.split('.');
    let v = I18N[this.current];
    for (const p of parts) v = v?.[p];
    return v ?? key;
  },
  // Get a localized value from a {fr, en} object or a string
  pick(val) {
    if (val == null) return '';
    if (typeof val === 'string') return val;
    return val[this.current] || val.fr || val.en || '';
  }
};
