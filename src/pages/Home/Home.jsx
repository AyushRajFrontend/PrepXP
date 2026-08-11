import { motion }              from 'framer-motion'
import { Link }                from 'react-router-dom'
import { ChevronRight }        from 'lucide-react'
import PageTransition          from '@/components/ui/PageTransition'
import HomeHeader              from './HomeHeader'
import XPCard                  from '@/components/cards/XPCard'
import StreakCard               from '@/components/cards/StreakCard'
import TodayGoalCard           from '@/components/cards/TodayGoalCard'
import SubjectProgressCard     from '@/components/cards/SubjectProgressCard'
import MissionCard             from '@/components/cards/MissionCard'
import StatsCard               from '@/components/cards/StatsCard'
import { useApp }              from '@/context/AppContext'
import { useStudyProgress }    from '@/context/StudyProgressContext'
import { SUBJECTS }            from '@/data/subjects'
import { DAILY_MISSIONS }      from '@/data/missions'

const FADE_UP = {
  initial:     { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-50px' },
}
const fadeUp = (delay = 0) => ({
  ...FADE_UP,
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1], delay },
})

function SectionHeader({ title, linkTo }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-display font-bold text-[17px] text-frost">{title}</h2>
      {linkTo && (
        <Link to={linkTo} className="flex items-center gap-0.5 text-[13px] text-purple font-semibold active:opacity-70 transition-opacity">
          See all <ChevronRight size={14} strokeWidth={2.5} />
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  const { user }        = useApp()
  const { getActivityData } = useStudyProgress()

  /* Real today's lecture count for TodayGoalCard — Fix 6 */
  const todayData     = getActivityData(1)
  const doneLecturesToday = todayData[0]?.lectures ?? 0
  const dailyGoal = 8  /* configurable in future */

  return (
    <PageTransition>
      <div className="px-4 pb-8 space-y-5">
        <HomeHeader user={user} />

        <motion.div {...fadeUp(0.05)}>
          <XPCard user={user} />
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div {...fadeUp(0.10)} className="flex">
            <StreakCard streak={user.streak} />
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="flex">
            <TodayGoalCard done={doneLecturesToday} total={dailyGoal} />
          </motion.div>
        </div>

        <motion.section {...fadeUp(0.20)}>
          <SectionHeader title="Subjects" linkTo="/subjects" />
          <div className="space-y-3">
            {SUBJECTS.map(subject => (
              <SubjectProgressCard key={subject.id} subject={subject} />
            ))}
          </div>
        </motion.section>

        <motion.section {...fadeUp(0.05)}>
          <SectionHeader title="Daily Missions" />
          <MissionCard missions={DAILY_MISSIONS} />
        </motion.section>

        <motion.section {...fadeUp(0.05)}>
          <SectionHeader title="Quick Stats" />
          <StatsCard user={user} />
        </motion.section>
      </div>
    </PageTransition>
  )
}
