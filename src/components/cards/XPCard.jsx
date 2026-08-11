import { motion }     from 'framer-motion'
import { Gem, CalendarDays, Crown } from 'lucide-react'
import GlassCard   from '@/components/ui/GlassCard'
import ProgressBar from '@/components/ui/ProgressBar'

/**
 * XPCard — Hero card at the top of the Home dashboard.
 *
 * Displays:
 *   - Gradient avatar ring with user initials
 *   - Name + title + level badge
 *   - Animated XP progress bar
 *   - Bottom row: Coins · Days Active · Rank
 *
 * Props:
 *   user — from AppContext (name, level, xp, xpToNext, coins, daysActive, rank)
 */

/* Derive initials from full name */
function getInitials(name = '') {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/* XP percentage toward next level */
function xpPercent(xp, xpToNext) {
  return Math.min(Math.round((xp / xpToNext) * 100), 100)
}

/* ── Avatar with gradient ring ── */
function Avatar({ initials }) {
  return (
    <div className="relative flex-shrink-0">
      {/* Outer gradient ring */}
      <div className="w-[58px] h-[58px] rounded-full p-[3px] gradient-brand
                      glow-purple animate-glow">
        {/* Dark inner circle */}
        <div className="w-full h-full rounded-full bg-card
                        flex items-center justify-center">
          <span className="font-display font-bold text-[17px] text-gradient-brand
                           leading-none tracking-tight">
            {initials}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Bottom stat pill ── */
function StatPill({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={13} className="text-mist flex-shrink-0" />
      <div className="flex items-baseline gap-1">
        <span className="font-mono font-semibold text-[13px] text-frost leading-none">
          {value}
        </span>
        <span className="text-[10px] text-mist leading-none">{label}</span>
      </div>
    </div>
  )
}

export default function XPCard({ user }) {
  const {
    name      = 'User',
    level     = 1,
    xp        = 0,
    xpToNext  = 1000,
    coins     = 0,
    daysActive = 0,
    rank      = '--',
  } = user

  const initials = getInitials(name)
  const pct      = xpPercent(xp, xpToNext)
  const xpLeft   = xpToNext - xp

  return (
    <GlassCard accent="brand" className="p-5" noPadding>
      {/* Ambient purple glow blob (top-right) */}
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-8 w-40 h-40 rounded-full
                   bg-purple/[0.08] blur-3xl pointer-events-none"
      />

      {/* ── Row 1: Avatar + Info + Level ── */}
      <div className="flex items-center gap-4 mb-5">
        <Avatar initials={initials} />

        {/* Name + title */}
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-[18px] text-frost
                         leading-tight truncate">
            {name}
          </h2>
          <p className="text-[12px] text-mist mt-0.5">JEE Explorer</p>
        </div>

        {/* Level badge */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="gradient-brand rounded-xl px-3 py-1.5
                          glow-purple flex flex-col items-center">
            <span className="font-mono font-bold text-[11px] text-white/70
                             leading-none tracking-widest uppercase">
              LVL
            </span>
            <span className="font-display font-bold text-[22px] text-white
                             leading-none -mt-0.5">
              {level}
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 2: XP Progress ── */}
      <div className="mb-4">
        {/* XP labels */}
        <div className="flex justify-between items-baseline mb-2">
          <span className="font-mono font-semibold text-[13px] text-purple">
            {xp.toLocaleString()} XP
          </span>
          <span className="text-[11px] text-dim">
            {xpLeft.toLocaleString()} to Level {level + 1}
          </span>
        </div>

        {/* Animated XP bar */}
        <ProgressBar
          value={pct}
          color="brand"
          size="md"
          delay={0.35}
          showGlow
          showShimmer
        />

        {/* XP max label */}
        <p className="text-right text-[10px] text-dim mt-1">
          {xpToNext.toLocaleString()} XP
        </p>
      </div>

      {/* ── Row 3: Stats pills ── */}
      <motion.div
        className="flex items-center justify-between pt-3
                   border-t border-white/[0.06]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <StatPill icon={Gem}         value={coins}     label="coins"  />
        <div className="w-px h-4 bg-white/[0.08]" />
        <StatPill icon={CalendarDays} value={`${daysActive}d`} label="active" />
        <div className="w-px h-4 bg-white/[0.08]" />
        <StatPill icon={Crown}        value={`#${rank}`} label="rank"  />
      </motion.div>
    </GlassCard>
  )
}
