import { useState, useMemo }          from 'react'
import { motion, AnimatePresence }    from 'framer-motion'
import { CalendarDays, SearchX }      from 'lucide-react'
import PageTransition                 from '@/components/ui/PageTransition'
import SearchBar                      from '@/components/ui/SearchBar'
import FilterTabs                     from '@/components/ui/FilterTabs'
import ProgressBar                    from '@/components/ui/ProgressBar'
import SubjectCard                    from '@/components/cards/SubjectCard'
import { SUBJECTS, DAYS_TO_JEE }      from '@/data/subjects'
import { useStudyProgress }           from '@/context/StudyProgressContext'

/** Fix 2+6 — Overall progress computed live from StudyProgressContext */

const BASE_TABS = [
  { id: 'all',    label: 'All Subjects'    },
  { id: 'focus',  label: 'Needs Attention' },
  { id: 'strong', label: 'On Track'        },
]

export default function Subjects() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const { getSubjectStats, getOverallProgress } = useStudyProgress()

  const overallProgress = getOverallProgress()

  /* Apply filter based on live progress */
  const FILTER_FN = useMemo(() => ({
    all:    ()  => true,
    focus:  (s) => getSubjectStats(s.id).progress < 50,
    strong: (s) => getSubjectStats(s.id).progress >= 50,
  }), [getSubjectStats])

  const visible = useMemo(() => {
    const q  = search.trim().toLowerCase()
    const fn = FILTER_FN[filter] ?? FILTER_FN.all
    return SUBJECTS.filter(s => fn(s) && (q === '' || s.name.toLowerCase().includes(q)))
  }, [search, filter, FILTER_FN])

  const tabs = useMemo(() =>
    BASE_TABS.map(t => ({
      ...t,
      count: t.id === 'all'
        ? undefined
        : SUBJECTS.filter(FILTER_FN[t.id] ?? (() => true)).length,
    })),
  [FILTER_FN])

  const hasResults  = visible.length > 0
  const isFiltering = search !== '' || filter !== 'all'

  return (
    <PageTransition>
      <div className="px-4 pb-10">
        <div className="pt-5 mb-5">
          <h1 className="font-display font-bold text-[26px] text-frost">Subjects</h1>
          <p className="text-[13px] text-mist mt-1">
            {SUBJECTS.length} subjects &nbsp;·&nbsp; Track your JEE preparation
          </p>
        </div>

        {/* Live overall progress */}
        <motion.div
          className="glass rounded-2xl p-4 mb-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-mist uppercase tracking-widest">
              Overall Preparation
            </span>
            <span className="font-mono font-bold text-[14px] text-purple">{overallProgress}%</span>
          </div>
          <ProgressBar value={overallProgress} color="brand" size="sm" delay={0.2} showGlow className="mb-3" />
          <div className="flex items-center gap-1.5">
            <CalendarDays size={12} className="text-dim" />
            <span className="text-[11.5px] text-dim">
              <span className="text-snow font-semibold">{DAYS_TO_JEE} days</span> to JEE Advanced 2027
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, delay: 0.10 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search subjects…" className="mb-3" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.30, delay: 0.14 }}>
          <FilterTabs tabs={tabs} active={filter} onChange={setFilter} className="mb-5" />
        </motion.div>

        <AnimatePresence mode="wait">
          {hasResults ? (
            <motion.div key="results" className="space-y-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              {visible.map((subject, i) => (
                <SubjectCard key={subject.id} subject={subject} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" className="flex flex-col items-center justify-center py-20 text-center"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <SearchX size={40} className="text-dim mb-4" strokeWidth={1.4} />
              <p className="text-[15px] font-semibold text-snow mb-1">No subjects found</p>
              <p className="text-[13px] text-mist mb-5">
                {search ? `No results for "${search}"` : 'No subjects match this filter'}
              </p>
              {isFiltering && (
                <button onClick={() => { setSearch(''); setFilter('all') }}
                  className="text-[13px] font-semibold text-purple px-5 py-2.5 rounded-xl bg-purple/10 border border-purple/20 active:scale-95 transition-transform duration-150">
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
