import { motion }             from 'framer-motion'
import {
  BookOpen, BookMarked, CalendarDays, Sparkles,
} from 'lucide-react'
import PageTransition         from '@/components/ui/PageTransition'
import SectionHeader          from '@/components/ui/SectionHeader'
import GlassCard              from '@/components/ui/GlassCard'
import AchievementCard        from '@/components/cards/AchievementCard'
import SubjectProgressCard    from '@/components/cards/SubjectProgressCard'
import ProfileHeader          from './ProfileHeader'
import { useApp }             from '@/context/AppContext'
import { useStudyProgress }   from '@/context/StudyProgressContext'
import { ACHIEVEMENTS, EARNED_COUNT } from '@/data/achievements'
import { SUBJECTS }           from '@/data/subjects'
import { CHAPTERS }           from '@/data/chapters'
import { cn }                 from '@/utils/cn'

/** Fix 6 — Profile stats computed from real data */

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-50px' },
  transition:  { duration: 0.4, ease: [0.4, 0, 0.2, 1], delay },
})

function StatCell({ icon: Icon, iconColor, value, label }) {
  return (
    <div className="flex flex-col gap-2.5 p-3.5 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', iconColor)}>
        <Icon size={15} strokeWidth={2} />
      </div>
      <span className="font-mono font-bold text-[22px] text-frost leading-none">{value}</span>
      <span className="text-[10.5px] text-mist leading-tight">{label}</span>
    </div>
  )
}

function StudyWeek({ streak = 0 }) {
  const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const active = Math.min(streak, 7)
  return (
    <GlassCard noPadding className="p-4">
      <div className="flex gap-2">
        {DAYS.map((day, i) => {
          const isActive = i < active
          return (
            <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
              <motion.div
                className={cn('w-full rounded-xl border flex items-center justify-center', isActive
                  ? 'bg-success/[0.12] border-success/25'
                  : 'bg-white/[0.025] border-white/[0.05]')}
                style={{ aspectRatio: '1' }}
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 + i * 0.065 }}
              >
                {isActive && <div className="w-2 h-2 rounded-full bg-success" />}
              </motion.div>
              <span className="text-[9px] text-dim">{day}</span>
            </div>
          )
        })}
      </div>
      <p className="text-center text-[11px] text-mist mt-3">
        <span className="text-frost font-semibold">{active}</span>/7 days studied this week
        {active === 7 && <span className="text-success font-semibold"> · Perfect week! 🎉</span>}
      </p>
    </GlassCard>
  )
}

export default function Profile() {
  const { user }        = useApp()
  const { countDone }   = useStudyProgress()

  /* Real total lectures done */
  const totalDone = Object.values(CHAPTERS).flat()
    .reduce((sum, ch) => sum + countDone(ch.lectures ?? []), 0)

  /* Real chapters done (100% complete) */
  const chaptersDone = Object.values(CHAPTERS).flat()
    .filter(ch => {
      const lecs = ch.lectures ?? []
      return lecs.length > 0 && countDone(lecs) === lecs.length
    }).length

  const CAREER_STATS = [
    { icon: BookOpen,     iconColor: 'bg-cyan/10 text-cyan',       value: totalDone,              label: 'Total Lectures' },
    { icon: BookMarked,   iconColor: 'bg-physics/10 text-physics', value: chaptersDone,           label: 'Chapters Done'  },
    { icon: CalendarDays, iconColor: 'bg-purple/10 text-purple',   value: `${user.daysActive}d`,  label: 'Days Active'    },
    { icon: Sparkles,     iconColor: 'bg-xp/10 text-xp',           value: user.xp.toLocaleString(), label: 'Total XP'     },
  ]

  return (
    <PageTransition>
      <div className="pb-10">
        <ProfileHeader user={user} />
        <div className="mx-4 border-t border-white/[0.05] mb-6" />

        <div className="px-4 space-y-7">
          <motion.section {...fadeUp(0.05)}>
            <SectionHeader title="Career Stats" />
            <div className="grid grid-cols-2 gap-3">
              {CAREER_STATS.map(stat => <StatCell key={stat.label} {...stat} />)}
            </div>
          </motion.section>

          <motion.section {...fadeUp(0.05)}>
            <SectionHeader title="Achievements" linkLabel={`${EARNED_COUNT}/${ACHIEVEMENTS.length} earned`} />
            <div className="grid grid-cols-4 gap-2.5">
              {ACHIEVEMENTS.map((a, i) => <AchievementCard key={a.id} achievement={a} index={i} />)}
            </div>
          </motion.section>

          <motion.section {...fadeUp(0.05)}>
            <SectionHeader title="This Week" />
            <StudyWeek streak={user.streak} />
          </motion.section>

          <motion.section {...fadeUp(0.05)}>
            <SectionHeader title="Subject Progress" linkTo="/subjects" />
            <div className="space-y-3">
              {SUBJECTS.map(s => <SubjectProgressCard key={s.id} subject={s} />)}
            </div>
          </motion.section>
        </div>
      </div>
    </PageTransition>
  )
}
