/**
 * missions.js — Today's daily mission seed data.
 *
 * Phase 2+ will generate these dynamically based on
 * study plan, weak topics, and daily targets.
 *
 * Shape:
 *   id            — unique identifier
 *   title         — mission title
 *   subject       — subject display name
 *   subjectColor  — color token (physics / chemistry / math)
 *   xpReward      — XP earned on completion
 *   coinsReward   — Coins earned on completion
 *   progress      — tasks completed
 *   total         — tasks required
 *   completed     — whether fully done
 */

export const DAILY_MISSIONS = [
  {
    id:           'msn_lectures',
    title:        'Complete 3 Lectures',
    subject:      'Physics',
    subjectColor: 'physics',
    xpReward:     75,
    coinsReward:  15,
    progress:     2,
    total:        3,
    completed:    false,
  },
  {
    id:           'msn_dpp',
    title:        'Solve 10 DPP Questions',
    subject:      'Mathematics',
    subjectColor: 'math',
    xpReward:     100,
    coinsReward:  20,
    progress:     10,
    total:        10,
    completed:    true,
  },
  {
    id:           'msn_revise',
    title:        'Revise 1 Chapter',
    subject:      'Chemistry',
    subjectColor: 'chemistry',
    xpReward:     50,
    coinsReward:  10,
    progress:     0,
    total:        1,
    completed:    false,
  },
]

/** Bonus XP for completing ALL missions in a day */
export const DAILY_BONUS_XP = 150
