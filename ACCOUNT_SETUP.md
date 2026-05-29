# 🔐 Activer Google Sign-In dans Cultoko

Par défaut Cultoko propose la création d'un **profil local** (nom + email, stocké dans le navigateur). Pour ajouter le bouton **« Continuer avec Google »**, il faut créer un Client ID OAuth — 5 minutes.

## Étape 1 — Créer ton OAuth Client ID

1. Va sur https://console.cloud.google.com/apis/credentials
2. Connecte-toi avec ton compte Google (le même que celui de l'app si tu veux)
3. En haut, clique **« Sélectionner un projet »** → **« Nouveau projet »**
   - Nom : `Cultoko` (ou ce que tu veux)
   - Clique **Créer**
4. Une fois le projet créé, retourne sur **APIs et services → Identifiants**
5. Clique **+ Créer des identifiants** → **ID client OAuth**
6. Si demandé : **Configurer l'écran de consentement**
   - User type : **Externe**
   - Nom de l'app : `Cultoko`
   - Email d'assistance : ton email
   - Email du développeur : ton email
   - **Enregistrer et continuer**, ignorer les scopes, ajouter ton email en utilisateur de test, **Enregistrer**
7. Retourne sur **Identifiants → + Créer des identifiants → ID client OAuth**
   - Type d'application : **Application Web**
   - Nom : `Cultoko Web`
   - **Origines JavaScript autorisées** : ajoute
     - `https://grilou974.github.io`
     - `http://localhost:8000` (utile pour tester en local)
   - **Créer**
8. Copie ton **Client ID** (format : `1234567890-abc...apps.googleusercontent.com`)

## Étape 2 — Coller le Client ID

1. Ouvre `js/auth.js` dans le repo GitHub
2. Trouve la ligne :
   ```js
   const GOOGLE_CLIENT_ID = '';
   ```
3. Remplace par ton Client ID :
   ```js
   const GOOGLE_CLIENT_ID = '1234567890-abc...apps.googleusercontent.com';
   ```
4. Commit

## Étape 3 — Tester

Recharge l'app, va sur **Profil** (icône à droite de la banque or). Le vrai bouton Google apparaît à la place du faux.

---

## 🔮 Pour aller plus loin : synchro cross-device

Le bouton Google identifie l'utilisateur, mais les **points et skins restent stockés localement** dans chaque appareil. Pour synchroniser entre PC et mobile, il te faudra un backend léger comme **Firebase Firestore** :

1. Crée un projet sur https://console.firebase.google.com
2. Ajoute une **base Firestore** (mode test)
3. Configure les règles pour que chaque utilisateur ne puisse écrire que sous son propre UID
4. Ajoute le SDK Firebase dans `index.html`
5. Dans `js/bank.js`, remplace les écritures localStorage par des écritures Firestore quand l'utilisateur est connecté

Si tu veux qu'on implémente cette synchro, dis-le moi — je peux l'ajouter quand tu auras ton projet Firebase prêt.
