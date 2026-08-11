/**
 * storage.js — Namespaced localStorage service.
 *
 * All PrepXP keys are prefixed with "prepxp:" so they
 * don't collide with other data in the browser's storage.
 *
 * Every method is wrapped in try/catch — localStorage can
 * throw in private-browsing mode or when storage is full.
 */

const NS = 'prepxp:'

/* ── Storage key constants ── */
export const KEYS = {
  USER:     'user',
  PROGRESS: 'study_progress',
  SETTINGS: 'settings',
}


/**
 * Read a value from storage.
 * Returns `fallback` (default null) if the key doesn't exist
 * or if JSON parsing fails.
 */
export function storageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(NS + key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}


/**
 * Write a value to storage.
 * Returns true on success, false on failure.
 */
export function storageSet(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn(`[PrepXP] Failed to save "${key}" to localStorage:`, err)
    return false
  }
}


/**
 * Remove a single key from storage.
 */
export function storageRemove(key) {
  try {
    localStorage.removeItem(NS + key)
    return true
  } catch {
    return false
  }
}


/**
 * Remove ALL PrepXP keys from localStorage.
 * Called by "Reset All Progress" in the Settings danger zone.
 */
export function storageClear() {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(NS))
      .forEach(k => localStorage.removeItem(k))
    return true
  } catch {
    return false
  }
}
