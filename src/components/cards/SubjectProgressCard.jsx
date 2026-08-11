import { useNavigate }     from 'react-router-dom'
import { motion }          from 'framer-motion'
import {
  Zap, FlaskConical, BarChart3, ChevronRight,
} from 'lucide-react'
import GlassCard           from '@/components/ui/GlassCard'
import ProgressBar         from '@/components/ui/ProgressBar'
import { useStudyProgress } from '@/context/StudyProgressContext'
import { cn }              from '@/utils/cn'

/** Fix 2 — All progress values computed live from StudyProgressContext */

const SUBJECT_ICONS = { physics: Zap, chemistry: FlaskConical, mathematics: BarChart3 }
const COLOR_CLASS   = { physics: 'text-physics', chemistry: 'text-chemistry', math: 'text-math' }
const ICON_BG       = {
  physics:   'bg-physics/10   border-physics/20',
  chemistry: 'bg-chemistry/10 border-chemistry/20',
  math:      'bg-math/10      border-math/20',
}

export default function SubjectProgressCard({ subject }) {
  const navigate = useNavigate()
  const { getSubjectStats } = useStudyProgress()

  const { id, name, color, accentVar } = subject
  const { progress, doneLectures, totalLectures, doneChapters, totalChapters } =
    getSubjectStats(id)

  const Icon = SUBJECT_ICONS[id] ?? BarChart3

  return (
    <motion.div whileTap={{ scale: 0.975 }} transition={{ duration: 0.12 }}>
      <GlassCard noPadding onClick={() => navigate(`/subjects/${id}`)} className="p-4 overflow-visible">
        <div aria-hidden="true" className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
             style={{ background: accentVar }} />

        <div className="pl-2">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn('w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0', ICON_BG[color])}>
              <Icon size={17} className={COLOR_CLASS[color]} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-display font-bold text-[15px] text-frost">{name}</span>
            </div>
            <span className={cn('font-mono font-bold text-[15px]', COLOR_CLASS[color])}>{progress}%</span>
            <ChevronRight size={15} className="text-dim flex-shrink-0 -ml-1" />
          </div>

          <ProgressBar value={progress} color={color} size="xs" delay={0.3} showGlow showShimmer={false} className="mb-2.5" />

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-mist">
              <span className="text-snow font-medium">{doneChapters}</span>/{totalChapters} chapters
            </span>
            <span className="w-px h-3 bg-white/[0.08]" />
            <span className="text-[11px] text-mist">
              <span className="text-snow font-medium">{doneLectures}</span>/{totalLectures} lectures
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
