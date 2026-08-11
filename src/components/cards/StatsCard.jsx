import { motion }                                from 'framer-motion'
import { Timer, BookMarked, Flame, Trophy }      from 'lucide-react'
import GlassCard                                  from '@/components/ui/GlassCard'
import { useStudyProgress }                       from '@/context/StudyProgressContext'
import { CHAPTERS }                               from '@/data/chapters'
import { cn }                                     from '@/utils/cn'

/** Fix 6 — StatsCard uses real completion data from StudyProgressContext */

function StatCell({ icon: Icon, iconColor, value, label, delay }) {
  return (
    <motion.div
      className="flex flex-col gap-1.5 p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1], delay }}
    >
      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', iconColor)}>
        <Icon size={14} strokeWidth={2} />
      </div>
      <span className="font-mono font-bold text-[20px] text-frost leading-none">{value}</span>
      <span className="text-[10px] text-mist leading-tight">{label}</span>
    </motion.div>
  )
}

export default function StatsCard({ user }) {
  const { countDone, getActivityData } = useStudyProgress()

  /* Total lectures done across all demo chapters */
  const totalDone = Object.values(CHAPTERS).flat()
    .reduce((sum, ch) => sum + countDone(ch.lectures ?? []), 0)

  /* Today's study time estimate (40 min per lecture avg) */
  const todayData     = getActivityData(1)
  const todayLectures = todayData[0]?.lectures ?? 0
  const todayMins     = todayLectures * 40
  const timeStr       = todayMins > 0
    ? `${Math.floor(todayMins / 60)}h ${todayMins % 60}m`
    : '0m'

  const STATS = [
    { icon: Timer,      iconColor: 'bg-purple/10 text-purple',   value: timeStr,          label: "Today's Study",  delay: 0.05 },
    { icon: BookMarked, iconColor: 'bg-cyan/10 text-cyan',        value: totalDone,        label: 'Lectures Done',  delay: 0.10 },
    { icon: Flame,      iconColor: 'bg-streak/10 text-streak',    value: `${user.streak}d`, label: 'Study Streak',  delay: 0.15 },
    { icon: Trophy,     iconColor: 'bg-xp/10 text-xp',            value: `#${user.rank}`,  label: 'Global Rank',    delay: 0.20 },
  ]

  return (
    <GlassCard noPadding className="p-4">
      <div className="grid grid-cols-2 gap-2.5">
        {STATS.map(stat => <StatCell key={stat.label} {...stat} />)}
      </div>
    </GlassCard>
  )
}
