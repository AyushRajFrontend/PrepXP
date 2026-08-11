import {
  createContext, useContext,
  useReducer, useCallback,
  useEffect,
} from 'react'
import { storageGet, storageSet, storageClear, KEYS } from '@/services/storage'

export function xpForLevel(level) {
  return level * 400 + 200
}

const DEFAULT_USER = {
  id:         'usr_local_01',
  name:       'Ayush Raj',
  avatar:     null,
  level:      12,
  xp:         4820,
  xpToNext:   xpForLevel(12),
  streak:     7,
  coins:      320,
  rank:       23,
  daysActive: 47,
  joinedAt:   '2026-06-20',
}

function loadUser() {
  return storageGet(KEYS.USER) ?? DEFAULT_USER
}

export const ACTIONS = {
  ADD_XP:        'ADD_XP',
  ADD_COINS:     'ADD_COINS',
  UPDATE_STREAK: 'UPDATE_STREAK',
  RESET:         'RESET',
}

function appReducer(state, action) {
  switch (action.type) {

    case ACTIONS.ADD_XP: {
      let { xp, xpToNext, level, coins } = state.user
      const amount = action.payload

      if (amount < 0) {
        /* XP subtraction (lecture uncomplete) — floor at 0, no de-leveling */
        xp = Math.max(0, xp + amount)
        return { ...state, user: { ...state.user, xp } }
      }

      /* XP addition with automatic level-up */
      xp += amount
      while (xp >= xpToNext) {
        xp      -= xpToNext
        level   += 1
        coins   += 50
        xpToNext = xpForLevel(level)
      }
      return { ...state, user: { ...state.user, xp, xpToNext, level, coins } }
    }

    case ACTIONS.ADD_COINS:
      return {
        ...state,
        user: { ...state.user, coins: state.user.coins + action.payload },
      }

    case ACTIONS.UPDATE_STREAK:
      return { ...state, user: { ...state.user, streak: action.payload } }

    case ACTIONS.RESET:
      return { user: { ...DEFAULT_USER } }

    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => ({
    user: loadUser(),
  }))

  useEffect(() => {
    storageSet(KEYS.USER, state.user)
  }, [state.user])

  const addXp    = useCallback((amount) => dispatch({ type: ACTIONS.ADD_XP,    payload: amount }), [])
  const addCoins = useCallback((amount) => dispatch({ type: ACTIONS.ADD_COINS, payload: amount }), [])
  const reset    = useCallback(() => { storageClear(); dispatch({ type: ACTIONS.RESET }) }, [])

  return (
    <AppContext.Provider value={{ user: state.user, dispatch, addXp, addCoins, reset }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('[PrepXP] useApp() must be inside <AppProvider>')
  return ctx
}
