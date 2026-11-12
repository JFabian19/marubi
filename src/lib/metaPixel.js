// Meta Pixel & Conversions API Gateway (CAPIG) Advanced Matching Helper
// Pixel ID: 1635217208321987

export const META_PIXEL_ID = '1635217208321987';

const STORAGE_KEYS = {
  USER_DATA: 'marubi_user_data',
  EXTERNAL_ID: 'marubi_ext_id',
  FBC: 'marubi_fbc',
  FBP: 'marubi_fbp',
};

// Pure synchronous SHA-256 implementation (UTF-8 -> 64-char lowercase hex)
const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function rotr(n, x) {
  return (x >>> n) | (x << (32 - n));
}

export function sha256HexSync(input) {
  const str = String(input || '').trim().toLowerCase();
  if (!str) return '';
  const bytes = new TextEncoder().encode(str);
  const l = bytes.length * 8;
  const k = ((bytes.length + 8) >> 6) + 1;
  const words = new Int32Array(k * 16);
  for (let i = 0; i < bytes.length; i++) {
    words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }
  words[bytes.length >> 2] |= 0x80 << (24 - (bytes.length % 4) * 8);
  words[k * 16 - 1] = l;

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;
  const w = new Int32Array(64);

  for (let i = 0; i < words.length; i += 16) {
    for (let t = 0; t < 16; t++) w[t] = words[i + t];
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(7, w[t - 15]) ^ rotr(18, w[t - 15]) ^ (w[t - 15] >>> 3);
      const s1 = rotr(17, w[t - 2]) ^ rotr(19, w[t - 2]) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[t] + w[t]) | 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((v) => (v >>> 0).toString(16).padStart(8, '0'))
    .join('');
}

function getCookie(name) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

function setCookie(name, value, maxAgeSeconds = 7776000) {
  if (typeof document === 'undefined' || !value) return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function safeGetStorage(key) {
  try {
    return window.localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function safeSetStorage(key, value) {
  try {
    if (value) window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota / private mode errors
  }
}

function stripAccents(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function normalizePhone(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D+/g, '').replace(/^0+/, '');
  if (!digits) return '';
  if (digits.startsWith('51') && digits.length >= 11) {
    return digits;
  }
  if (digits.length === 9 && digits.startsWith('9')) {
    return '51' + digits;
  }
  if (digits.length >= 7) {
    return '51' + digits;
  }
  return '';
}

export function normalizeNameParts(rawFullName) {
  const cleaned = stripAccents(rawFullName)
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return { fn: '', ln: '' };
  const parts = cleaned.split(' ');
  const fn = parts[0] || '';
  const ln = parts.length > 1 ? parts.slice(1).join('') : '';
  return { fn, ln };
}

export function normalizeLocationToken(rawValue) {
  return stripAccents(rawValue).replace(/[^a-z]/g, '');
}

export function normalizeEmail(rawEmail) {
  const cleaned = String(rawEmail || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? cleaned : '';
}

export function ensureFbcAndFbp() {
  if (typeof window === 'undefined') return { fbc: '', fbp: '' };

  let fbc = getCookie('_fbc') || safeGetStorage(STORAGE_KEYS.FBC);
  try {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get('fbclid');
    if (fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`;
    }
  } catch {
    // Ignore URLSearchParams errors
  }
  if (fbc) {
    setCookie('_fbc', fbc);
    safeSetStorage(STORAGE_KEYS.FBC, fbc);
  }

  let fbp = getCookie('_fbp') || safeGetStorage(STORAGE_KEYS.FBP);
  if (!fbp) {
    const rand = Math.floor(1000000000 + Math.random() * 9000000000);
    fbp = `fb.1.${Date.now()}.${rand}`;
  }
  setCookie('_fbp', fbp);
  safeSetStorage(STORAGE_KEYS.FBP, fbp);

  return { fbc, fbp };
}

export function getOrCreateExternalId() {
  if (typeof window === 'undefined') return '';
  if (window.__marubiUserData?.external_id) {
    return window.__marubiUserData.external_id;
  }
  let extId = safeGetStorage(STORAGE_KEYS.EXTERNAL_ID) || getCookie('_mrb_eid');
  if (!extId) {
    extId = 'mrb_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }
  safeSetStorage(STORAGE_KEYS.EXTERNAL_ID, extId);
  setCookie('_mrb_eid', extId);
  return extId;
}

export function getStoredUserData() {
  const extId = getOrCreateExternalId();
  let stored = {};
  try {
    const raw = safeGetStorage(STORAGE_KEYS.USER_DATA);
    if (raw) stored = JSON.parse(raw) || {};
  } catch {
    stored = {};
  }
  const merged = {
    country: 'pe',
    external_id: extId,
    ...(window.__marubiUserData || {}),
    ...stored,
  };
  merged.country = 'pe';
  merged.external_id = extId;
  window.__marubiUserData = merged;
  return merged;
}

/**
 * Synchronously injects SHA-256 hashed Customer Information Parameters (user_data)
 * directly into the live fbevents.js Pixel instance so both Browser Pixel (ud[...])
 * and Conversions API Gateway (fb.advanced_matching) immediately include every field.
 */
function syncHashedUserDataToPixelInstance(normalizedData) {
  if (typeof window === 'undefined') return;
  const hashFields = ['em', 'ph', 'fn', 'ln', 'ct', 'st', 'country', 'external_id'];
  const hashedMap = {};
  hashFields.forEach((key) => {
    if (normalizedData[key]) {
      const h = sha256HexSync(normalizedData[key]);
      if (h) hashedMap[key] = h;
    }
  });

  const px = window.fbq?.instance?.pixelsByID?.[META_PIXEL_ID];
  if (px) {
    px.userData = { ...(px.userData || {}), ...hashedMap };
    px.userDataFormFields = { ...(px.userDataFormFields || {}), ...hashedMap };
  }
}

export function updateMetaUserData({ name, whatsapp, province, city, email } = {}) {
  const current = getStoredUserData();
  const next = { ...current, country: 'pe', external_id: getOrCreateExternalId() };

  if (name) {
    const { fn, ln } = normalizeNameParts(name);
    if (fn) next.fn = fn;
    if (ln) next.ln = ln;
  }
  if (whatsapp) {
    const ph = normalizePhone(whatsapp);
    if (ph) next.ph = ph;
  }
  if (city) {
    const ct = normalizeLocationToken(city);
    if (ct) next.ct = ct;
  }
  if (province) {
    const st = normalizeLocationToken(province);
    if (st) next.st = st;
  }
  if (email) {
    const em = normalizeEmail(email);
    if (em) next.em = em;
  }

  window.__marubiUserData = next;
  safeSetStorage(STORAGE_KEYS.USER_DATA, JSON.stringify(next));
  ensureFbcAndFbp();

  syncHashedUserDataToPixelInstance(next);

  return next;
}

export function sendKeepalivePixelBeacon(eventName, customData = {}, eventID = '') {
  if (typeof window === 'undefined') return;
  try {
    const userData = getStoredUserData();
    const { fbc, fbp } = ensureFbcAndFbp();

    const params = new URLSearchParams();
    params.set('id', META_PIXEL_ID);
    params.set('ev', eventName);
    params.set('dl', window.location.href);
    params.set('rl', document.referrer || '');
    params.set('if', 'false');
    params.set('ts', String(Date.now()));
    params.set('sw', String(window.screen?.width || 0));
    params.set('sh', String(window.screen?.height || 0));
    params.set('v', '2.9.205');
    params.set('r', 'stable');
    params.set('ec', '1');
    params.set('o', '4126');
    if (fbp) params.set('fbp', fbp);
    if (fbc) params.set('fbc', fbc);
    if (eventID) params.set('eid', eventID);

    const hashFields = ['em', 'ph', 'fn', 'ln', 'ct', 'st', 'country', 'external_id'];
    for (const key of hashFields) {
      if (userData[key]) {
        const hashed = sha256HexSync(userData[key]);
        if (hashed) params.set(`ud[${key}]`, hashed);
      }
    }

    Object.entries(customData).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      params.set(`cd[${k}]`, typeof v === 'object' ? JSON.stringify(v) : String(v));
    });

    const url = `https://www.facebook.com/tr/?${params.toString()}`;
    if (typeof window.fetch === 'function') {
      window.fetch(url, { method: 'GET', mode: 'no-cors', keepalive: true }).catch(() => {});
    } else if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      const img = new Image();
      img.src = url;
    }
  } catch {
    // Ignore beacon fallback errors
  }
}

export function trackMetaEvent(eventName, customData = {}, options = {}) {
  const { isCustom = false, eventID = '', userData = null, keepalive = false } = options;

  if (userData) {
    updateMetaUserData(userData);
  } else {
    syncHashedUserDataToPixelInstance(getStoredUserData());
    ensureFbcAndFbp();
  }

  const eid =
    eventID ||
    `${eventName.toLowerCase()}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  const fbqLoaded = typeof window !== 'undefined' && typeof window.fbq === 'function';
  const scriptReady = fbqLoaded && typeof window.fbq.callMethod === 'function';

  if (fbqLoaded) {
    window.fbq(isCustom ? 'trackCustom' : 'track', eventName, customData, { eventID: eid });
  }

  // Only fire the fallback beacon if fbevents.js failed to load / was blocked by an ad-blocker
  if (!scriptReady && keepalive) {
    sendKeepalivePixelBeacon(eventName, customData, eid);
  } else if (!scriptReady) {
    sendKeepalivePixelBeacon(eventName, customData, eid);
  }

  return eid;
}
