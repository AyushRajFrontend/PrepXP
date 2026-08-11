import { useState, useMemo }      from 'react'
import { motion }                 from 'framer-motion'
import PageTransition             from '@/components/ui/PageTransition'
import GlassCard                  from '@/components/ui/GlassCard'
import FilterTabs                 from '@/components/ui/FilterTabs'
import SectionHeader              from '@/components/ui/SectionHeader'
import ActivityChart              from '@/components/charts/ActivityChart'
import XPChart                    from '@/components/charts/XPChart'
import SubjectDonut               from '@/components/charts/SubjectDonut'
import { useApp }                 from '@/context/AppContext'
import { useStudyProgress }       from '@/context/StudyProgressContext'
import { MONTHLY_DATA, ALL_TIME_DATA } from '@/data/analytics'

/**
 * Analytics — Fix 6: Real data from StudyProgressContext.
 *
 * 7-day view:  getActivityData(7)   — real timestamps from completions
 * 30-day view: getActivityData(30)  — real timestamps (sparse for new users)
 * All Time:    ALL_TIME_DATA        — static fallback (no multi-month history yet)
 *
 * SubjectDonut:    live progress from context (Fix 2)
 * XP / Rank:       live from AppContext user
 * Total lectures:  computed from countDone
 */

const PERIOD_TABS = [
  { id: '7d',  label: '7 Days'   },
  { id: '30d', label: '30 Days'  },
  { id: 'all', label: 'All Time' },
]

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-40px' },
  transition:  { duration: 0.38, ease: [0.4, 0, 0.2, 1], delay },
})

function MiniStat({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-mist">{label}</span>
      <span className="font-mono font-bold text-[16px] text-frost leading-none">{value}</span>
      {sub && <span className="text-[10px] text-dim leading-none">{sub}</span>}
    </div>
  )
}

export default function Analytics() {
  const { user }    = useApp()
  const { getActivityData, getOverallProgress } = useStudyProgress()

  const [period, setPeriod] = useState('7d')

  /* Pick data source */
  const chartData = useMemo(() => {
    if (period === '7d')  return getActivityData(7)
    if (period === '30d') return getActivityData(30)
    return ALL_TIME_DATA          /* static fallback for all-time */
  }, [period, getActivityData])

  /* xKey depends on the period's data format */
  const xKey = period === 'all' ? 'month' : 'day'

  /* Summary stats from current period data */
  const stats = useMemo(() => {
    const total    = chartData.reduce((s, d) => s + (d.lectures ?? 0), 0)
    const totalXP  = chartData.reduce((s, d) => s + (d.xp ?? 0), 0)
    const totalMin = chartData.reduce((s, d) => s + (d.minutes ?? 0), 0)
    const best     = chartData.reduce((a, b) => (b.lectures ?? 0) > (a.lectures ?? 0) ? b : a, chartData[0] ?? {})
    const active   = chartData.filter(d => (d.lectures ?? 0) > 0).length
    const avg      = chartData.length ? (total / chartData.length).toFixed(1) : '0'
    const h        = Math.floor(totalMin / 60), m = totalMin % 60
    const timeStr  = h > 0 ? `${h}h ${m}m` : `${m}m`
    return { total, totalXP, timeStr, best, active, avg }
  }, [chartData])

  const overallProgress = getOverallProgress()
  const periodWord      = period === '7d' ? 'week' : period === '30d' ? 'month' : 'time'

  return (
    <PageTransition>
      <div className="px-4 pb-10 space-y-5">
        <motion.div className="pt-5" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}>
          <h1 className="font-display font-bold text-[26px] text-frost">Analytics</h1>
          <p className="text-[13px] text-mist mt-0.5">Track your study performance</p>
        </motion.div>

        <FilterTabs tabs={PERIOD_TABS} active={period} onChange={setPeriod} />

        {/* Study Activity */}
        <motion.section {...fadeUp(0.05)}>
          <SectionHeader title="Study Activity" />
          <GlassCard noPadding className="p-4 pb-2">
            <div className="grid grid-cols-4 gap-2 mb-4">
              <MiniStat label="Lectures"     value={stats.total}                sub={`this ${periodWord}`} />
              <MiniStat label="Avg / session" value={stats.avg}                />
              <MiniStat label="Best session"  value={stats.best?.[xKey] ?? '—'} sub={`${stats.best?.lectures ?? 0} lec`} />
              <MiniStat label="Active"        value={`${stats.active}/${chartData.length}`} sub="sessions" />
            </div>
            <ActivityChart data={chartData} xKey={xKey} />
          </GlassCard>
        </motion.section>

        {/* Breakdown row */}
        <motion.section {...fadeUp(0.07)}>
          <div className="grid grid-cols-2 gap-3">
            <GlassCard noPadding className="p-4">
              <p className="text-[10.5px] font-bold text-mist uppercase tracking-[0.08em] mb-3">By Subject</p>
              <SubjectDonut />
            </GlassCard>

            <GlassCard noPadding className="p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10.5px] font-bold text-mist uppercase tracking-[0.08em] mb-3">
                  XP This {periodWord.charAt(0).toUpperCase() + periodWord.slice(1)}
                </p>
                <span className="font-mono font-bold text-[26px] text-gradient-brand block leading-none">
                  {stats.totalXP.toLocaleString()}
                </span>
                <span className="text-[11px] text-mist mt-1 block">XP earned</span>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.05]">
                <p className="text-[10.5px] font-bold text-mist uppercase tracking-[0.08em] mb-2">Study Time</p>
                <span className="font-mono font-bold text-[20px] text-frost leading-none">{stats.timeStr}</span>
                <span className="text-[11px] text-mist block mt-0.5">total study time</span>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.05]">
                <p className="text-[10.5px] font-bold text-mist uppercase tracking-[0.08em] mb-1">Overall</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono font-bold text-[22px] text-purple leading-none">{overallProgress}%</span>
                  <span className="text-[11px] text-mist">completion</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        {/* XP Chart */}
        <motion.section {...fadeUp(0.09)}>
          <SectionHeader title="XP Earned" />
          <GlassCard noPadding className="p-4 pb-2">
            <p className="text-[11px] text-mist mb-3">
              <span className="inline-block w-2 h-2 rounded-sm mr-1.5"
                    style={{ background: '#C084FC', verticalAlign: 'middle' }} />
              Highlighted bar = most recent session
            </p>
            <XPChart data={chartData} xKey={xKey} />
          </GlassCard>
        </motion.section>
      </div>
    </PageTransition>
  )
}
