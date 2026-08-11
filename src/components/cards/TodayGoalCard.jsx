import { motion }   from 'framer-motion'
import { Target }   from 'lucide-react'
import GlassCard    from '@/components/ui/GlassCard'

/**
 * TodayGoalCard — Today's lecture target tracker.
 *
 * Renders a conic-gradient progress ring showing
 * how many lectures have been completed today vs target.
 *
 * Props:
 *   done  — lectures completed today
 *   total — today's target (default 8)
 */
export default function TodayGoalCard({ done = 0, total = 8 }) {
  const pct     = Math.min((done / total) * 100, 100)
  const allDone = done >= total

  /* conic-gradient: fill up to pct%, rest is subtle white */
  const ringStyle = {
    background: `conic-gradient(
      var(--color-purple) ${pct}%,
      rgba(255, 255, 255, 0.05) 0%
    )`,
    /* Add faint glow when complete */
    ...(allDone && {
      filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.5))',
    }),
  }

  return (
    <GlassCard
      accent="purple"
      noPadding
      className="p-4 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-mist uppercase tracking-widest">
          Goal
        </span>
        <Target size={13} className="text-purple" />
      </div>

      {/* Ring */}
      <motion.div
        className="mx-auto mb-3 rounded-full flex items-center justify-center"
        style={{ width: 72, height: 72, ...ringStyle }}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
      >
        {/* Inner dark circle */}
        <div className="rounded-full bg-elevated
                        flex flex-col items-center justify-center"
             style={{ width: 56, height: 56 }}>
          <span className="font-mono font-bold text-[15px] text-frost leading-none">
            {done}/{total}
          </span>
          <span className="text-[9px] text-mist mt-0.5">done</span>
        </div>
      </motion.div>

      {/* Status text */}
      <p className="text-center text-[11px] mt-auto">
        {allDone ? (
          <span className="text-success font-semibold">Goal achieved! 🎉</span>
        ) : (
          <span className="text-mist">
            {total - done} lecture{total - done !== 1 ? 's' : ''} left
          </span>
        )}
      </p>
    </GlassCard>
  )
}
