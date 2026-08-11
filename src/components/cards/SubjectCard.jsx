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

const ICONS = { physics: Zap, chemistry: FlaskConical, mathematics: BarChart3 }

const TOKENS = {
  physics:   { icon: 'text-physics',   iconBg: 'bg-physics/10 border-physics/20',     text: 'text-physics',   btn: { background: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.22)', color: '#38BDF8' } },
  chemistry: { icon: 'text-chemistry', iconBg: 'bg-chemistry/10 border-chemistry/20', text: 'text-chemistry', btn: { background: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.22)', color: '#34D399' } },
  math:      { icon: 'text-math',      iconBg: 'bg-math/10 border-math/20',           text: 'text-math',      btn: { background: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.22)', color: '#A78BFA' } },
}

function StatBox({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1 flex-1">
      <span className="font-mono font-bold text-[17px] text-frost leading-none">{value}</span>
      <span className="text-[10.5px] text-mist text-center leading-tight">{label}</span>
    </div>
  )
}

export default function SubjectCard({ subject, index = 0 }) {
  const navigate = useNavigate()
  const { getSubjectStats } = useStudyProgress()

  const { id, name, tagline, color, accentVar } = subject
  const { progress, doneLectures, totalLectures, doneChapters, totalChapters } = getSubjectStats(id)
  const remaining = totalLectures - doneLectures

  const Icon   = ICONS[id]   ?? BarChart3
  const tokens = TOKENS[color] ?? TOKENS.physics

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1], delay: index * 0.09 }}
    >
      <GlassCard noPadding accent={color}>
        <div aria-hidden="true" className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none"
             style={{ background: accentVar, opacity: 0.07 }} />

        <div className="p-5 relative">
          {/* Row 1 */}
          <div className="flex items-start gap-3.5 mb-4">
            <div className={cn('w-[52px] h-[52px] rounded-2xl border flex items-center justify-center flex-shrink-0', tokens.iconBg)}>
              <Icon size={24} className={tokens.icon} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="font-display font-bold text-[19px] text-frost leading-tight">{name}</h3>
              <p className="text-[12px] text-mist mt-0.5 leading-snug line-clamp-2">{tagline}</p>
            </div>
            <span className={cn('font-mono font-bold text-[26px] leading-none flex-shrink-0 pt-0.5', tokens.text)}>
              {progress}%
            </span>
          </div>

          <ProgressBar value={progress} color={color} size="sm" delay={0.3 + index * 0.09} showGlow showShimmer className="mb-5" />

          {/* Stats row */}
          <div className="flex items-center bg-white/[0.025] border border-white/[0.05] rounded-xl mb-4">
            <StatBox value={`${doneChapters}/${totalChapters}`} label="Chapters" />
            <div className="w-px self-stretch bg-white/[0.07] my-1" />
            <StatBox value={doneLectures} label="Lectures Done" />
            <div className="w-px self-stretch bg-white/[0.07] my-1" />
            <StatBox value={remaining} label="Remaining" />
          </div>

          <button
            onClick={() => navigate(`/subjects/${id}`)}
            className="w-full py-3 rounded-xl text-[13.5px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform duration-150"
            style={{ background: tokens.btn.background, border: `1px solid ${tokens.btn.border}`, color: tokens.btn.color }}
          >
            View {totalChapters} Chapters
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  )
}
