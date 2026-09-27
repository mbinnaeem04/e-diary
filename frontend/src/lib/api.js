const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Normalizes backend MongoDB note document to the format expected by the frontend UI.
 */
export const normalizeNote = (n) => ({
  id: n._id || n.id,
  title: n.title || 'Untitled',
  body: n.content ?? n.body ?? '',
  date: n.date || n.createdAt || new Date().toISOString(),
  pinned: Boolean(n.pinned),
  color: typeof n.color === 'number' ? n.color : 0,
  tilt: typeof n.tilt === 'number' ? n.tilt : 0,
});

const TOKEN_KEY = 'ediary_auth_token';
const USER_KEY = 'ediary_auth_user';

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthSession(token, user) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);

    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {}
}

export function getAuthUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Too many requests. Please wait a moment before trying again.');
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to reach backend server. Please verify the server is running.');
    }
    throw err;
  }
}

// Auth API Methods
export async function signupUser({ email, password, name }) {
  const res = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  if (res.token) {
    setAuthSession(res.token, res.user);
  }
  return res;
}

export async function loginUser({ email, password }) {
  const res = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.token) {
    setAuthSession(res.token, res.user);
  }
  return res;
}

const CACHE_KEY = 'ediary_notes_cache';

export function getCachedNotes() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

export function setCachedNotes(notes) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(notes));
  } catch {}
}

export async function fetchNotes() {
  const data = await request('/api/notes');
  if (Array.isArray(data)) {
    const normalized = data.map(normalizeNote);
    setCachedNotes(normalized);
    return normalized;
  }
  return [];
}

export async function createNote({ title, body, color = 0, tilt = 0, pinned = false }) {
  const payload = {
    title: title?.trim() || 'Untitled',
    content: body || '',
    pinned,
    color,
    tilt,
  };

  const res = await request('/api/notes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const created = res.data || res;
  const normalized = normalizeNote(created);
  const current = getCachedNotes();
  setCachedNotes([normalized, ...current.filter((n) => n.id !== normalized.id)]);
  return normalized;
}

export async function updateNote(id, { title, body, pinned, color, tilt }) {
  const payload = {};
  if (title !== undefined) payload.title = title.trim() || 'Untitled';
  if (body !== undefined) payload.content = body;
  if (pinned !== undefined) payload.pinned = pinned;
  if (color !== undefined) payload.color = color;
  if (tilt !== undefined) payload.tilt = tilt;

  const res = await request(`/api/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  const updated = res.data || res;
  const normalized = normalizeNote(updated);
  const current = getCachedNotes();
  setCachedNotes(current.map((n) => (n.id === id ? normalized : n)));
  return normalized;
}

export async function deleteNote(id) {
  const current = getCachedNotes();
  setCachedNotes(current.filter((n) => n.id !== id));
  return await request(`/api/notes/${id}`, {
    method: 'DELETE',
  });
}
