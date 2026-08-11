/**
 * analytics.js — Demo chart data for the Analytics page.
 *
 * Three datasets for the period switcher:
 *   WEEKLY_DATA    — last 7 days (Mon → Sun)
 *   MONTHLY_DATA   — last 4 weeks
 *   ALL_TIME_DATA  — month-by-month since March 2026
 *
 * Each entry has:
 *   lectures  — lectures completed in that period
 *   xp        — XP earned (lectures × 25 + bonuses)
 *   minutes   — study time in minutes
 *
 * Phase 4+ will derive this from real StudyProgressContext
 * history instead of static seed values.
 */

export const WEEKLY_DATA = [
  { day: 'Mon', lectures: 4,  xp: 100, minutes: 92  },
  { day: 'Tue', lectures: 6,  xp: 150, minutes: 138 },
  { day: 'Wed', lectures: 3,  xp: 75,  minutes: 68  },
  { day: 'Thu', lectures: 8,  xp: 200, minutes: 185 },
  { day: 'Fri', lectures: 5,  xp: 125, minutes: 115 },
  { day: 'Sat', lectures: 7,  xp: 175, minutes: 162 },
  { day: 'Sun', lectures: 4,  xp: 100, minutes: 92  },
]

export const MONTHLY_DATA = [
  { week: 'Wk 1', lectures: 28, xp: 700,  minutes: 644  },
  { week: 'Wk 2', lectures: 33, xp: 825,  minutes: 758  },
  { week: 'Wk 3', lectures: 30, xp: 750,  minutes: 690  },
  { week: 'Wk 4', lectures: 37, xp: 925,  minutes: 852  },
]

export const ALL_TIME_DATA = [
  { month: 'Mar', lectures: 45,  xp: 1125, minutes: 1035 },
  { month: 'Apr', lectures: 72,  xp: 1800, minutes: 1656 },
  { month: 'May', lectures: 89,  xp: 2225, minutes: 2047 },
  { month: 'Jun', lectures: 112, xp: 2800, minutes: 2576 },
  { month: 'Jul', lectures: 134, xp: 3350, minutes: 3082 },
  { month: 'Aug', lectures: 37,  xp: 925,  minutes: 851  },
]

/**
 * Period config — maps period id to dataset + axis key.
 * Consumed by Analytics.jsx and the chart components.
 */
export const PERIOD_CONFIG = {
  '7d':  { data: WEEKLY_DATA,   xKey: 'day',   label: '7 Days'   },
  '30d': { data: MONTHLY_DATA,  xKey: 'week',  label: '30 Days'  },
  'all': { data: ALL_TIME_DATA, xKey: 'month', label: 'All Time' },
}
