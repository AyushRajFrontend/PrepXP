import { useRef, useEffect } from 'react'
import { useApp }            from '@/context/AppContext'
import { useToast }          from '@/context/ToastContext'

/**
 * LevelWatcher — Headless "listener" component.
 *
 * Watches `user.level` from AppContext.
 * When it increases, fires a level-up toast with confetti emoji.
 *
 * Why a component instead of logic inside AppContext?
 *   — AppContext doesn't know about the toast system
 *   — This keeps concerns separated: state vs. side-effects
 *   — Easily removable / replaceable with a different notification style
 *
 * Renders nothing — purely a side-effect container.
 * Mounted once at the top of the app inside both providers.
 *
 * Level-up toast shows:
 *   icon    "⚡"
 *   title   "Level 13 Unlocked!"
 *   message "+50 bonus coins awarded"
 *   duration 4 seconds
 */
export default function LevelWatcher() {
  const { user }  = useApp()
  const { toast } = useToast()

  /*
   * prevLevelRef starts as null (not yet mounted).
   * We skip the toast on the initial mount (null → current level)
   * and only fire on genuine increases thereafter.
   */
  const prevLevel = useRef(null)

  useEffect(() => {
    /* Skip the mount cycle */
    if (prevLevel.current === null) {
      prevLevel.current = user.level
      return
    }

    if (user.level > prevLevel.current) {
      toast({
        icon:     '⚡',
        title:    `Level ${user.level} Unlocked!`,
        message:  `+50 bonus coins awarded 🎉`,
        duration: 4000,
      })
    }

    prevLevel.current = user.level
  }, [user.level])   /* eslint-disable-line react-hooks/exhaustive-deps */
  /* toast is stable (useCallback with no deps) — safe to omit */

  return null
}
