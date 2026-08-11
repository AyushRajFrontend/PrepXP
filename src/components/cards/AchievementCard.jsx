import { motion } from 'framer-motion'
import { Lock }   from 'lucide-react'
import { cn }     from '@/utils/cn'

/**
 * AchievementCard — Single achievement badge cell.
 *
 * Used in the 4-column grid on the Profile page.
 *
 * Earned badges:
 *   Full opacity, glassmorphic background, spring entrance,
 *   and a subtle press animation on tap.
 *
 * Locked badges:
 *   Greyscale, 35% opacity, small lock icon in corner.
 *   Still animate in (to show what's coming) but clearly unavailable.
 *
 * Props:
 *   achievement — { id, name, desc, icon, earned, rarity }
 *   index       — position in grid (drives stagger entrance delay)
 */

/* ── Rarity → subtle glow color on earned cards ── */
const RARITY_GLOW = {
  common:    '',                    /* no glow */
  rare:      'shadow-[0_0_14px_rgba(6,182,212,0.2)]',
  epic:      'shadow-[0_0_14px_rgba(124,58,237,0.25)]',
  legendary: 'shadow-[0_0_18px_rgba(245,158,11,0.30)]',
}

export default function AchievementCard({ achievement, index = 0 }) {
  const { name, desc, icon, earned, rarity = 'common' } = achievement

  return (
    <motion.div
      className={cn(
        /* Layout */
        'relative flex flex-col items-center justify-center gap-1.5',
        'py-4 px-2 rounded-2xl border text-center',
        /* Earned: glass card */
        earned
          ? cn('glass-elevated border-white/[0.10]', RARITY_GLOW[rarity])
          : 'bg-card border-white/[0.04]',
        /* Tap feedback only on earned */
        earned && 'cursor-pointer active:scale-95 transition-transform duration-150',
      )}
      /* Spring pop-in entrance */
      initial={{ opacity: 0, scale: 0.75, y: 12 }}
      whileInView={{
        opacity: earned ? 1 : 0.35,
        scale: 1,
        y: 0,
      }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.4,
        ease:     [0.34, 1.56, 0.64, 1],  /* back-out spring */
        delay:    0.12 + index * 0.055,
      }}
      /* Greyscale on locked — CSS filter applied via style */
      style={!earned ? { filter: 'grayscale(0.65)' } : undefined}
    >
      {/* Badge icon */}
      <span
        className="text-[26px] leading-none"
        role="img"
        aria-label={name}
      >
        {icon}
      </span>

      {/* Badge name */}
      <span className="text-[10.5px] font-bold text-frost leading-tight line-clamp-2">
        {name}
      </span>

      {/* Condition */}
      <span className="text-[9px] text-mist leading-tight line-clamp-1">
        {desc}
      </span>

      {/* Lock icon — bottom-right corner on locked badges */}
      {!earned && (
        <div className="absolute bottom-2 right-2 pointer-events-none">
          <Lock size={10} className="text-dim opacity-60" />
        </div>
      )}
    </motion.div>
  )
}
