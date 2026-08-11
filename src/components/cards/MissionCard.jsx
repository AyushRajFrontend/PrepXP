import { motion }                           from 'framer-motion'
import { CheckCircle2, Circle, Sparkles }  from 'lucide-react'
import GlassCard                           from '@/components/ui/GlassCard'
import ProgressBar                         from '@/components/ui/ProgressBar'
import { DAILY_MISSIONS, DAILY_BONUS_XP }  from '@/data/missions'
import { cn }                              from '@/utils/cn'

/**
 * MissionCard — Today's daily missions list.
 *
 * Renders each mission with:
 *   - Status icon (completed / in-progress / locked)
 *   - Title + subject tag
 *   - Progress bar (for in-progress)
 *   - XP reward badge
 *
 * Props:
 *   missions — array from src/data/missions.js (defaults to DAILY_MISSIONS)
 */

/* Maps subjectColor → Tailwind text class */
const SUBJECT_COLOR = {
  physics:   'text-physics   bg-physics/10   border-physics/20',
  chemistry: 'text-chemistry bg-chemistry/10 border-chemistry/20',
  math:      'text-math      bg-math/10      border-math/20',
}

/* ── Single mission row ── */
function MissionRow({ mission, index }) {
  const { title, subject, subjectColor, xpReward, progress, total, completed } = mission

  const pct     = Math.round((progress / total) * 100)
  const started = progress > 0

  return (
    <motion.div
      className={cn(
        'flex flex-col gap-2 py-3',
        'border-b border-white/[0.05] last:border-0',
      )}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: 0.1 + index * 0.08 }}
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        {/* Status icon */}
        <div className="flex-shrink-0">
          {completed ? (
            <CheckCircle2 size={18} className="text-success" />
          ) : (
            <Circle      size={18} className="text-dim" />
          )}
        </div>

        {/* Title */}
        <span className={cn(
          'flex-1 text-[13.5px] font-medium leading-snug',
          completed ? 'text-mist line-through' : 'text-frost',
        )}>
          {title}
        </span>

        {/* XP reward */}
        <span className={cn(
          'flex-shrink-0 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full',
          completed
            ? 'text-success bg-success/10 border border-success/20'
            : 'text-purple  bg-purple/10  border border-purple/20',
        )}>
          +{xpReward} XP
        </span>
      </div>

      {/* Progress bar row (only if in-progress or pending) */}
      {!completed && (
        <div className="pl-[30px] flex items-center gap-3">
          {/* Subject tag */}
          <span className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0',
            SUBJECT_COLOR[subjectColor] ?? 'text-mist bg-white/5 border-white/10',
          )}>
            {subject}
          </span>

          {/* Progress bar */}
          <div className="flex-1">
            <ProgressBar
              value={pct}
              color={subjectColor}
              size="xs"
              delay={0.25 + index * 0.1}
              showGlow={false}
              showShimmer={false}
            />
          </div>

          {/* Progress count */}
          <span className="flex-shrink-0 font-mono text-[11px] text-mist">
            {progress}/{total}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default function MissionCard({ missions = DAILY_MISSIONS }) {
  const completedCount = missions.filter(m => m.completed).length
  const allDone        = completedCount === missions.length

  return (
    <GlassCard noPadding accent={allDone ? 'success' : 'brand'} className="p-4">
      {/* Card header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-purple" />
          <span className="text-[11px] font-bold text-mist uppercase tracking-widest">
            Daily Missions
          </span>
        </div>
        <span className={cn(
          'font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border',
          allDone
            ? 'text-success bg-success/10 border-success/20'
            : 'text-mist bg-white/[0.05] border-white/[0.08]',
        )}>
          {completedCount}/{missions.length} done
        </span>
      </div>

      {/* All-complete bonus banner */}
      {allDone && (
        <motion.div
          className="mb-3 mt-2 px-3 py-2 rounded-xl
                     bg-success/8 border border-success/15
                     text-[11px] text-success font-medium text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
        >
          🎉 All missions done! Bonus +{DAILY_BONUS_XP} XP claimed
        </motion.div>
      )}

      {/* Mission list */}
      <div>
        {missions.map((mission, i) => (
          <MissionRow key={mission.id} mission={mission} index={i} />
        ))}
      </div>
    </GlassCard>
  )
}
