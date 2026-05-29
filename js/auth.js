/* ----------  Cultoko — Auth (Google Sign-In + local profile)  ---------- */
// To enable Google Sign-In, replace GOOGLE_CLIENT_ID with the one you create:
// 1. Go to https://console.cloud.google.com/apis/credentials
// 2. Create OAuth 2.0 Client ID (type = Web application)
// 3. Add https://grilou974.github.io as an Authorized JavaScript origin
// 4. Copy the Client ID and paste it below (replace the empty string).
const GOOGLE_CLIENT_ID = ''; // <-- paste here, e.g. "1234.apps.googleusercontent.com"

const Auth = (function () {
  const KEY = 'cultoko_user_v1';
  const listeners = [];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function save(u) {
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
    listeners.forEach(fn => fn(u));
  }

  let user = load();

  function getUser() { return user; }
  function isSignedIn() { return !!user; }
  function onChange(fn) { listeners.push(fn); }

  // Manual sign-in (just name, saved locally — no auth)
  function signInLocal(name, email) {
    user = {
      provider: 'local',
      name: name || 'Joueur',
      email: email || '',
      picture: '',
      ts: Date.now(),
    };
    save(user);
    return user;
  }

  function signOut() {
    user = null;
    save(null);
  }

  // ---------- Google Sign-In via Google Identity Services ----------
  function parseJwt(token) {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(json);
    } catch (e) { return null; }
  }

  function handleGoogleCredential(response) {
    const payload = parseJwt(response.credential);
    if (!payload) return;
    user = {
      provider: 'google',
      googleId: payload.sub,
      name: payload.name || payload.given_name || 'Joueur',
      email: payload.email || '',
      picture: payload.picture || '',
      ts: Date.now(),
    };
    save(user);
  }

  function isGoogleEnabled() {
    return GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.length > 0;
  }

  // Renders the Google Sign-In button into a container; returns true if it could initialize.
  function renderGoogleButton(container) {
    if (!isGoogleEnabled()) return false;
    if (typeof google === 'undefined' || !google.accounts) return false;
    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        logo_alignment: 'left',
      });
      return true;
    } catch (e) {
      console.warn('Google Sign-In init failed', e);
      return false;
    }
  }

  return {
    getUser, isSignedIn, onChange,
    signInLocal, signOut,
    isGoogleEnabled, renderGoogleButton, handleGoogleCredential,
    CLIENT_ID: GOOGLE_CLIENT_ID,
  };
})();
