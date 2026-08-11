import { useNavigate }      from 'react-router-dom'
import { motion }           from 'framer-motion'
import { ArrowLeft, Zap, FlaskConical, BarChart3 } from 'lucide-react'
import ProgressBar          from '@/components/ui/ProgressBar'
import { useStudyProgress } from '@/context/StudyProgressContext'
import { cn }               from '@/utils/cn'

/** Fix 2: ChapterHeader derives progress from StudyProgressContext */

const ICONS = { physics: Zap, chemistry: FlaskConical, mathematics: BarChart3 }
const ICON_STYLE = {
  physics:   'text-physics   bg-physics/10   border-physics/20',
  chemistry: 'text-chemistry bg-chemistry/10 border-chemistry/20',
  math:      'text-math      bg-math/10      border-math/20',
}
const PCT_COLOR = {
  physics: 'text-physics', chemistry: 'text-chemistry', math: 'text-math',
}

function StatChip({ value, label, color }) {
  return (
    <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11.5px] font-medium', color)}>
      <span className="font-mono font-bold text-[13px]">{value}</span>
      <span className="opacity-75">{label}</span>
    </div>
  )
}

export default function ChapterHeader({ subject, chapters = [] }) {
  const navigate = useNavigate()
  const { getSubjectStats } = useStudyProgress()

  if (!subject) return null

  const { name, tagline, color, totalChapters } = subject
  const Icon      = ICONS[subject.id] ?? BarChart3
  const iconStyle = ICON_STYLE[color] ?? ICON_STYLE.physics
  const pctColor  = PCT_COLOR[color]  ?? 'text-purple'

  /* Live stats */
  const { progress, doneLectures, totalLectures, doneChapters } = getSubjectStats(subject.id)

  /* Status counts from the demo chapters passed in */
  const done       = chapters.filter(c => c.liveStatus === 'completed').length
  const inProgress = chapters.filter(c => c.liveStatus === 'in-progress').length
  const notStarted = chapters.filter(c => c.liveStatus === 'not-started').length

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <button
        onClick={() => navigate('/subjects')}
        className="flex items-center gap-2 text-[13px] text-mist font-medium pt-5 mb-4 active:opacity-60 transition-opacity"
      >
        <ArrowLeft size={15} strokeWidth={2} /> Subjects
      </button>

      <div className="flex items-start gap-3 mb-4">
        <div className={cn('w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5', iconStyle)}>
          <Icon size={20} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-[22px] text-frost leading-tight">{name}</h1>
          <p className="text-[12px] text-mist mt-0.5">{tagline}</p>
        </div>
        <span className={cn('font-mono font-bold text-[22px] leading-none flex-shrink-0 pt-0.5', pctColor)}>
          {progress}%
        </span>
      </div>

      <ProgressBar value={progress} color={color} size="sm" delay={0.2} showGlow className="mb-4" />

      <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        <StatChip
          value={`${doneLectures}/${totalLectures}`}
          label="lectures"
          color="bg-white/[0.04] border-white/[0.07] text-mist"
        />
        {done > 0 && (
          <StatChip value={done} label="done" color="bg-success/8 border-success/15 text-success" />
        )}
        {inProgress > 0 && (
          <StatChip value={inProgress} label="in progress" color="bg-purple/8 border-purple/15 text-purple" />
        )}
        {notStarted > 0 && (
          <StatChip value={notStarted} label="not started" color="bg-white/[0.03] border-white/[0.06] text-dim" />
        )}
      </div>
    </motion.div>
  )
}
