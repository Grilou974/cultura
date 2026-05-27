# Cultura — Mini-jeux de culture générale

Application web installable (PWA) inspirée de Plato, pour quizz et mini-jeux de culture générale.

## ✨ Ce qui est inclus

- **8 thèmes** : Drapeaux du monde, Cinéma, Droit, Jeux vidéo, Littérature, Voitures, Sport, Histoire
- **4 niveaux de difficulté** par thème : Facile / Moyen / Difficile / Expert
- **5 modes de jeu** : Quiz classique, Contre-la-montre (60s), Vrai/Faux, Memory (paires), Devine l'image
- **Bilingue FR/EN** — bouton en haut à droite pour basculer
- **Installable** sur PC, Android, iOS depuis le navigateur (PWA)
- **Fonctionne hors-ligne** une fois chargée (service worker)
- **Contenu actuel** :
  - Drapeaux : 200 questions + 80 « devine le drapeau » + 30 paires + 25 vrai/faux ✅ complet
  - Cinéma : 200 questions + 12 paires + 20 vrai/faux ✅ complet
  - Les 6 autres : ~20 questions par thème (starter pack, à enrichir)

## 🧪 Tester en local

Ouvre un terminal dans le dossier `cultura/` et lance un serveur HTTP :

```bash
# Python 3 (préinstallé sur Mac/Linux/Windows récent)
python -m http.server 8000

# OU avec Node.js
npx serve .
```

Puis ouvre **http://localhost:8000** dans Chrome/Edge/Safari.

Pour tester le PWA (bouton « Installer »), il faut soit l'ouvrir en HTTPS, soit utiliser `localhost` (qui est traité comme un origine sécurisée).

## ➕ Ajouter du contenu

Toutes les questions sont dans `data/<theme>.json`. La structure est simple :

```json
{
  "quiz": {
    "easy":   [ { "q": {"fr":"…","en":"…"}, "options": [...], "answer": 0 }, ... ],
    "medium": [...],
    "hard":   [...],
    "expert": [...]
  },
  "trueFalse": [
    { "stmt": {"fr":"…","en":"…"}, "answer": true }
  ],
  "memory": {
    "pairs": [
      { "a": {"fr":"…","en":"…"}, "b": {"fr":"…","en":"…"} }
    ]
  },
  "guessImage": [
    { "image": "fr", "answer": {"fr":"France","en":"France"} }
  ]
}
```

- `answer` (quiz) = index (0-3) de la bonne réponse. L'app les mélange à l'affichage.
- `image` (guessImage / quiz) = code pays ISO 2 lettres (chargé via flagcdn.com) **ou** une URL complète.
- Les options peuvent être des `string` ou des objets `{fr, en}`.

Pour ajouter un nouveau thème : crée `data/<id>.json` puis ajoute-le à `data/themes.json`.

---

## 🚀 Mettre l'app en ligne (gratuit, en 5 min)

### Option A — Netlify (recommandé, le plus simple)

1. Va sur https://app.netlify.com/drop
2. Glisse-dépose le dossier `cultura/` complet
3. Netlify te donne immédiatement une URL en `.netlify.app`
4. C'est tout — l'app est en ligne, en HTTPS, et installable sur tout appareil

### Option B — Vercel

1. Crée un compte sur https://vercel.com
2. `Add New → Project` puis upload le dossier (ou connecte un repo Git)
3. URL en `.vercel.app` générée automatiquement

### Option C — GitHub Pages

1. Crée un repo GitHub
2. Pousse le dossier `cultura/*` à la racine
3. Active GitHub Pages dans `Settings → Pages` (source : `main` branch / root)
4. URL en `<user>.github.io/<repo>/`

### Option D — Cloudflare Pages

Idem Netlify / Vercel, gratuit et rapide. https://pages.cloudflare.com

---

## 📱 Publier sur Google Play Store

1. Va sur **https://www.pwabuilder.com**
2. Entre l'URL publique de ton app (celle de Netlify/Vercel/…)
3. Onglet **Package For Stores → Android**
4. Télécharge l'**APK / AAB** signé (PWABuilder fait la signature)
5. Crée un compte développeur Google Play (frais unique 25 $)
6. Upload le fichier .aab depuis la console Google Play

PWABuilder utilise Trusted Web Activity, c'est officiellement supporté par Google.

## 🍎 Publier sur Apple App Store

iOS est plus strict, deux possibilités :

### Méthode 1 — PWABuilder iOS package (le plus simple)
1. Sur https://www.pwabuilder.com → onglet **iOS**
2. Télécharge le projet Xcode généré
3. Ouvre-le sur un Mac avec Xcode
4. Compile et envoie via App Store Connect (compte Apple Developer = 99 $/an)

### Méthode 2 — Capacitor (plus de contrôle)
```bash
npm install -g @capacitor/cli
npx cap init Cultura com.toi.cultura --web-dir=.
npx cap add ios
npx cap copy
npx cap open ios
```
Puis dans Xcode : configure, signe, soumets.

> ⚠️ Note Apple : Les apps qui ne sont qu'une « web view » sans valeur ajoutée native peuvent être refusées. PWABuilder ajoute des hooks (icônes adaptatives, splash screens, etc.) pour passer la review. Ajouter par la suite une vraie fonctionnalité native (notifications push, mode offline avancé, sons…) augmente les chances d'acceptation.

---

## 🛠 Structure des fichiers

```
cultura/
├── index.html              ← shell de l'app
├── manifest.json           ← métadonnées PWA
├── sw.js                   ← service worker (cache offline)
├── README.md
├── css/style.css
├── js/
│   ├── app.js              ← routeur + écran d'accueil
│   ├── data.js             ← chargeur de données
│   ├── i18n.js             ← traductions FR/EN
│   └── games/
│       ├── quiz.js
│       ├── timeAttack.js
│       ├── trueFalse.js
│       ├── memory.js
│       └── guessImage.js
├── data/
│   ├── themes.json         ← liste des thèmes
│   ├── flags.json          ← 200 Q + 80 images + 30 paires + 25 V/F
│   ├── cinema.json         ← 200 Q + 12 paires + 20 V/F
│   ├── droit.json          ← starter
│   ├── jeuxvideos.json     ← starter
│   ├── litterature.json    ← starter
│   ├── voitures.json       ← starter
│   ├── sport.json          ← starter
│   └── histoire.json       ← starter
└── icons/
    ├── icon.svg
    ├── icon-192.png
    └── icon-512.png
```

## 🎨 Personnaliser

- **Couleurs / thème** → variables CSS en haut de `css/style.css`
- **Textes UI** → `js/i18n.js`
- **Logo** → remplace `icons/icon.svg` et regénère les PNG si tu veux

## 📦 Roadmap suggérée

- [ ] Compléter les 6 thèmes starter à 200 Q chacun
- [ ] Ajouter un système de score persistant (localStorage)
- [ ] Mode multijoueur local (passe-passe)
- [ ] Sons et vibrations
- [ ] Plus de mini-jeux (anagrammes, ordre chronologique, etc.)

Bon jeu ! 🎮
