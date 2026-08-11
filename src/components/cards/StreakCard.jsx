import { motion }  from 'framer-motion'
import { Flame }   from 'lucide-react'
import GlassCard   from '@/components/ui/GlassCard'
import { cn }      from '@/utils/cn'

/**
 * StreakCard — Current study streak display.
 *
 * Shows the streak count with a fire icon, and a row of
 * 7 dots representing Mon → Sun of the current week.
 * Dots pop in with a staggered spring animation.
 *
 * Props:
 *   streak — number of consecutive study days
 */

const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/* Dot entrance animation */
const dotVariants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale:   1,
    opacity: 1,
    transition: {
      delay:      0.55 + i * 0.075,
      duration:   0.35,
      ease:       [0.34, 1.56, 0.64, 1], /* back.out — spring feel */
    },
  }),
}

export default function StreakCard({ streak = 0 }) {
  /* Cap display at 7 days */
  const filledCount = Math.min(streak, 7)

  return (
    <GlassCard
      accent="streak"
      noPadding
      className="p-4 flex flex-col h-full"
      style={{ background: 'linear-gradient(160deg, rgba(13,18,33,0.9) 0%, rgba(249,115,22,0.05) 100%)' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-mist uppercase tracking-widest">
          Streak
        </span>
        <span className="flex items-center gap-1 text-[10px] font-bold
                          text-streak bg-streak/10 border border-streak/20
                          px-2 py-0.5 rounded-full">
          <Flame size={9} className="fill-streak text-streak" />
          On Fire
        </span>
      </div>

      {/* Big number */}
      <div className="flex items-end gap-1 mb-0.5">
        <span className="font-display font-bold text-[46px] text-streak
                         leading-none tracking-tight">
          {streak}
        </span>
      </div>
      <p className="text-[11px] text-mist mb-4">days in a row</p>

      {/* Week dots */}
      <div className="flex items-center justify-between mt-auto">
        {WEEK_LABELS.map((label, i) => {
          const filled = i < filledCount
          return (
            <motion.div
              key={i}
              custom={i}
              variants={dotVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-1"
            >
              {/* Dot */}
              <div
                className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold',
                  filled
                    ? 'bg-streak/15 border border-streak/30 text-streak'
                    : 'bg-white/[0.04] border border-white/[0.06] text-dim',
                )}
              >
                {filled ? '✓' : label}
              </div>
              {/* Day label */}
              <span className="text-[8px] text-dim">{label}</span>
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
