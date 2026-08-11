import {
  createContext, useContext,
  useEffect, useMemo,
} from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

/**
 * SettingsContext — Persistent app settings.
 *
 * Every setting is stored in localStorage under "prepxp:settings".
 * Side effects (theme, reducedMotion) are applied directly to
 * the <html> element via useEffect so they survive page refresh.
 *
 * Theme application:
 *   data-theme="deep-space"  — default (matches @theme in globals.css)
 *   data-theme="ocean"       — cool blue override
 *   data-theme="nebula"      — deep purple override
 *
 *   CSS in globals.css defines [data-theme="ocean"] { --color-canvas: ... }
 *   Tailwind utilities reference these variables → colors change live.
 *
 * Reduced motion:
 *   Adds/removes .reduce-motion on <html>.
 *   MotionWrapper in App.jsx also reads this and passes
 *   reducedMotion="always" to Framer Motion's <MotionConfig>.
 */

export const DEFAULT_SETTINGS = {
  theme:          'deep-space',   /* 'deep-space' | 'ocean' | 'nebula' */
  notifications:  true,
  streakAlert:    true,
  levelUpAlert:   true,
  missionAlert:   false,
  soundEffects:   false,
  pageAnimations: true,
  hapticFeedback: true,
  reducedMotion:  false,
  focusMode:      false,
  showDuration:   true,
  autoSaveNotes:  true,
  cloudSync:      false,
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('settings', DEFAULT_SETTINGS)

  /** Update a single setting key */
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  /* ── Apply theme to <html data-theme="..."> ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme ?? 'deep-space')
  }, [settings.theme])

  /* ── Apply / remove reduced-motion class on <html> ── */
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', !!settings.reducedMotion)
  }, [settings.reducedMotion])

  const value = useMemo(
    () => ({ settings, updateSetting }),
    [settings],   // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

/** useSettings — must be inside <SettingsProvider> */
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('[PrepXP] useSettings() must be inside <SettingsProvider>')
  return ctx
}
