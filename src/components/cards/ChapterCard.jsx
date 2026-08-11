import { useCallback }                       from 'react'
import { motion, AnimatePresence }           from 'framer-motion'
import {
  CheckCircle2, Circle, Clock, ChevronDown,
} from 'lucide-react'
import GlassCard                             from '@/components/ui/GlassCard'
import ProgressBar                           from '@/components/ui/ProgressBar'
import { useStudyProgress }                  from '@/context/StudyProgressContext'
import { useToast }                          from '@/context/ToastContext'
import { useApp }                            from '@/context/AppContext'
import { cn }                                from '@/utils/cn'

/**
 * ChapterCard — Expandable chapter with bidirectional lecture toggling.
 *
 * Fix 3 — Lecture uncompletion:
 *   • Pending lecture  → tap → Completed  → +25 XP toast
 *   • Completed lecture → tap → Incomplete → -25 XP (no farm)
 *   • LectureRow is ALWAYS tappable regardless of state
 *   • Visual: ✓ green (done) vs ○ dim (pending)
 *   • "Tap to undo" hint on completed rows
 *
 * Fix 2 — Dynamic progress:
 *   • doneLectures and pct computed from StudyProgressContext
 *   • Status badge also derived from live completion count
 */

const STATUS_CONFIG = {
  completed:   { icon: CheckCircle2, iconClass: 'text-success', badge: 'bg-success/10 text-success border-success/20',     label: 'Done'        },
  'in-progress': { icon: Clock,      iconClass: 'text-purple',  badge: 'bg-purple/10  text-purple  border-purple/20',      label: 'In Progress' },
  'not-started': { icon: Circle,     iconClass: 'text-dim',     badge: 'bg-white/[0.04] text-dim   border-white/[0.06]', label: 'Not Started' },
}

/* ── Interactive lecture row ── */
function LectureRow({ lecture, onToggle }) {
  const { isLectureDone } = useStudyProgress()
  const done = isLectureDone(lecture.id)

  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 py-2.5 px-1 rounded-lg',
        'border-b border-white/[0.04] last:border-0',
        'cursor-pointer select-none',
        done ? 'active:bg-success/[0.04]' : 'active:bg-white/[0.025]',
      )}
      onClick={() => onToggle(lecture)}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {/* Animated status icon */}
      <div className="w-[15px] h-[15px] flex-shrink-0 relative">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="done"
              className="absolute inset-0"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 26 }}
            >
              <CheckCircle2 size={15} className="text-success" />
            </motion.div>
          ) : (
            <motion.div key="pending" className="absolute inset-0">
              <Circle size={15} className="text-dim" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lecture number + title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-[10px] text-dim flex-shrink-0">L{lecture.number}</span>
          <span className={cn(
            'text-[13px] font-medium truncate transition-colors duration-200',
            done ? 'text-mist' : 'text-frost',
          )}>
            {lecture.title}
          </span>
        </div>
        {/* Contextual hint */}
        {done && (
          <p className="text-[9.5px] text-dim mt-0.5">Tap to mark incomplete</p>
        )}
      </div>

      {/* Duration */}
      <span className="font-mono text-[10.5px] text-dim flex-shrink-0">
        {lecture.duration}m
      </span>
    </motion.div>
  )
}

/* ── Chapter Card ── */
export default function ChapterCard({ chapter, subjectColor, isExpanded, onToggle }) {
  const { number, name, totalLectures, lectures = [] } = chapter

  const { countDone, toggleLecture } = useStudyProgress()
  const { toast }                     = useToast()
  const { addXp, addCoins }          = useApp()

  /* Live progress computed from context */
  const doneLectures = countDone(lectures)
  const pct          = totalLectures > 0 ? Math.round((doneLectures / totalLectures) * 100) : 0

  /* Derive status from live progress instead of static field */
  const liveStatus =
    doneLectures === totalLectures && totalLectures > 0 ? 'completed' :
    doneLectures > 0                                    ? 'in-progress' :
                                                          'not-started'

  const cfg        = STATUS_CONFIG[liveStatus]
  const StatusIcon = cfg.icon
  const hasLectures = lectures.length > 0

  /* Bidirectional lecture toggle handler */
  const handleLectureToggle = useCallback((lecture) => {
    const { nowDone } = toggleLecture(lecture.id)

    if (nowDone) {
      addXp(25)
      addCoins(5)
      toast({ icon: '✅', title: 'Lecture Complete!', message: lecture.title, xp: 25, duration: 2500 })
    } else {
      addXp(-25)  /* XP protection: uncomplete removes earned XP */
      toast({ icon: '↩️', title: 'Marked Incomplete', message: lecture.title, duration: 2000 })
    }
  }, [toggleLecture, addXp, addCoins, toast])

  return (
    <GlassCard noPadding className="overflow-hidden">

      {/* Tappable header */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left
                   transition-colors duration-150 active:bg-white/[0.025]"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <StatusIcon size={18} className={cn(cfg.iconClass, 'flex-shrink-0 mt-px')} />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-mono text-[10px] text-dim flex-shrink-0">
              {String(number).padStart(2, '0')}
            </span>
            <span className="text-[14px] font-semibold text-frost truncate">{name}</span>
          </div>
          <ProgressBar value={pct} color={subjectColor} size="xs" animated showGlow={false} showShimmer={false} delay={0} />
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
          <span className="font-mono text-[11px] text-mist">{doneLectures}/{totalLectures}</span>
          {hasLectures && (
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.22 }}>
              <ChevronDown size={14} className="text-dim" />
            </motion.div>
          )}
        </div>
      </button>

      {/* Expandable lecture list */}
      <AnimatePresence initial={false}>
        {isExpanded && hasLectures && (
          <motion.section
            key="lectures"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-4 border-t border-white/[0.06]" />
            <div className="px-4 pb-2 pt-1">
              <div className="flex items-center justify-between py-2 mb-1">
                <span className={cn('text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border', cfg.badge)}>
                  {cfg.label}
                </span>
                <span className="text-[11px] text-mist">
                  <span className="text-frost font-semibold">{doneLectures}</span>/{totalLectures} lectures
                </span>
              </div>
              {lectures.map(lecture => (
                <LectureRow key={lecture.id} lecture={lecture} onToggle={handleLectureToggle} />
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
