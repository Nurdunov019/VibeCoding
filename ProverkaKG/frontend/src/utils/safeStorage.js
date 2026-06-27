export function readStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : value
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // In-app browsers may block storage (private mode, iframe, etc.)
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
