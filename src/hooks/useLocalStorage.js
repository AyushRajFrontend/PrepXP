import { useState, useCallback } from 'react'
import { storageGet, storageSet } from '@/services/storage'

/**
 * useLocalStorage — localStorage-backed state hook.
 *
 * Drop-in replacement for useState that persists every update
 * to localStorage under the given key (namespaced by the
 * storage service).
 *
 * Supports:
 *   - Static or factory default values  (like useState)
 *   - Value or updater function in set  (like useState)
 *
 * Usage:
 *   const [theme, setTheme] = useLocalStorage('settings.theme', 'deep-space')
 *   setTheme('nebula')
 *   setTheme(prev => prev === 'dark' ? 'light' : 'dark')
 *
 * @param {string} key          — storage key (will be namespaced automatically)
 * @param {*|function} defaultValue — initial value or factory function
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    /* Read from storage first */
    const stored = storageGet(key)

    if (stored !== null) return stored

    /* Nothing stored — resolve default */
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  /**
   * Stable setter — writes to React state AND localStorage atomically.
   * Uses the functional setState form so it never depends on `value`,
   * keeping the callback reference stable across renders.
   */
  const set = useCallback((next) => {
    setValue(prev => {
      const newVal = typeof next === 'function' ? next(prev) : next
      storageSet(key, newVal)
      return newVal
    })
  }, [key])

  return [value, set]
}
