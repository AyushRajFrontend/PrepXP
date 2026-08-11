import { motion }   from 'framer-motion'
import ProgressBar  from '@/components/ui/ProgressBar'

/**
 * ProfileHeader — Hero section at the top of the Profile page.
 *
 * Centered, card-free layout sitting directly on the page background.
 *
 * Structure (top → bottom):
 *   [Gradient ring avatar — 96×96 px — with level badge overlay]
 *   User name (large)
 *   [JEE Explorer badge]  [Rank badge]
 *   XP progress bar + labels
 *
 * Props:
 *   user — { name, level, xp, xpToNext, rank } from AppContext
 */

/** Derive 2-letter initials from a full name */
function getInitials(name = '') {
  return name
    .split(' ')
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function ProfileHeader({ user }) {
  const {
    name     = 'User',
    level    = 1,
    xp       = 0,
    xpToNext = 1000,
    rank     = '--',
  } = user

  const initials  = getInitials(name)
  const pct       = Math.min(Math.round((xp / xpToNext) * 100), 100)
  const xpLeft    = (xpToNext - xp).toLocaleString()
  const almostUp  = pct >= 85        /* show "almost there" pulse */

  return (
    <motion.div
      className="px-4 pt-6 pb-6 text-center"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >

      {/* ── Avatar with gradient ring ── */}
      <div className="relative w-24 h-24 mx-auto mb-4">

        {/* Gradient ring — 3 px padding trick */}
        <div className="absolute inset-0 rounded-full p-[3px] gradient-brand glow-purple">
          {/* Dark inner circle sits on canvas background */}
          <div
            className="w-full h-full rounded-full
                       flex items-center justify-center"
            style={{ background: 'var(--color-canvas)' }}
          >
            <span className="font-display font-bold text-[30px] leading-none
                             text-gradient-brand">
              {initials}
            </span>
          </div>
        </div>

        {/* Level badge — bottom-right corner */}
        <div
          className="absolute -bottom-2 -right-2
                     gradient-brand rounded-full
                     px-2.5 py-[3px]
                     border-2 border-canvas
                     flex items-center"
        >
          <span className="font-mono font-bold text-[10px] text-white leading-none">
            LVL {level}
          </span>
        </div>
      </div>

      {/* ── Name ── */}
      <h1 className="font-display font-bold text-[24px] text-frost
                     tracking-tight mb-2.5">
        {name}
      </h1>

      {/* ── Badges row ── */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-5">
        <span className="text-[11.5px] font-semibold
                         text-purple bg-purple/10 border border-purple/20
                         px-3 py-1 rounded-full">
          JEE Explorer
        </span>
        <span className="text-[11.5px] font-semibold
                         text-xp bg-xp/10 border border-xp/20
                         px-3 py-1 rounded-full">
          Rank #{rank}
        </span>
      </div>

      {/* ── XP progress ── */}
      <div className="text-left">
        {/* Labels above bar */}
        <div className="flex items-baseline justify-between text-[12px] mb-1.5">
          <span className="font-mono font-semibold text-purple">
            {xp.toLocaleString()} XP
          </span>
          <span className="text-mist">
            {xpLeft} to Level {level + 1}
          </span>
        </div>

        {/* Bar */}
        <ProgressBar
          value={pct}
          color="brand"
          size="md"
          delay={0.35}
          showGlow
          showShimmer
        />

        {/* Sub-label: context-aware */}
        <p className="text-center text-[11px] mt-1.5">
          {almostUp ? (
            <span className="text-purple font-semibold">
              ⚡ So close! {xpLeft} XP to Level {level + 1}
            </span>
          ) : (
            <span className="text-dim">
              {xpToNext.toLocaleString()} XP total to reach Level {level + 1}
            </span>
          )}
        </p>
      </div>
    </motion.div>
  )
}
