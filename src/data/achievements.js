/**
 * achievements.js — Badge / achievement seed data.
 *
 * Phase 3+ will compute `earned` dynamically based on
 * real study progress (streak length, lecture counts, level, etc.)
 * and persist unlocked badges to localStorage.
 *
 * Shape:
 *   id          — unique key
 *   name        — badge title
 *   desc        — short unlock condition
 *   icon        — emoji representation
 *   earned      — whether the user has unlocked this badge
 *   earnedDate  — ISO date string (if earned)
 *   rarity      — 'common' | 'rare' | 'epic' | 'legendary'
 */

export const ACHIEVEMENTS = [
  {
    id:         'week_warrior',
    name:       'Week Warrior',
    desc:       '7-day streak',
    icon:       '🔥',
    earned:     true,
    earnedDate: '2026-08-01',
    rarity:     'common',
  },
  {
    id:         'speed_runner',
    name:       'Speed Runner',
    desc:       '10 lectures/day',
    icon:       '⚡',
    earned:     true,
    earnedDate: '2026-07-28',
    rarity:     'rare',
  },
  {
    id:         'chapter_crusher',
    name:       'Chapter Crusher',
    desc:       '50 chapters done',
    icon:       '🎯',
    earned:     true,
    earnedDate: '2026-07-22',
    rarity:     'rare',
  },
  {
    id:         'bookworm',
    name:       'Bookworm',
    desc:       '300 lectures done',
    icon:       '📚',
    earned:     true,
    earnedDate: '2026-08-04',
    rarity:     'epic',
  },
  {
    id:         'jee_ready',
    name:       'JEE Ready',
    desc:       '100% preparation',
    icon:       '🏆',
    earned:     false,
    rarity:     'legendary',
  },
  {
    id:         'top_ranker',
    name:       'Top Ranker',
    desc:       'Reach Rank #1',
    icon:       '⭐',
    earned:     false,
    rarity:     'legendary',
  },
  {
    id:         'diamond_streak',
    name:       'Diamond Streak',
    desc:       '30-day streak',
    icon:       '💎',
    earned:     false,
    rarity:     'epic',
  },
  {
    id:         'rocket',
    name:       'Rocket',
    desc:       'Reach Level 20',
    icon:       '🚀',
    earned:     false,
    rarity:     'epic',
  },
]

/** Count of earned badges */
export const EARNED_COUNT = ACHIEVEMENTS.filter(a => a.earned).length
