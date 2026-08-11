import { useState, useMemo, useEffect } from 'react'
import { useParams, useSearchParams, Navigate } from 'react-router-dom'
import { AnimatePresence, motion }      from 'framer-motion'
import { SearchX }                      from 'lucide-react'
import PageTransition                   from '@/components/ui/PageTransition'
import SearchBar                        from '@/components/ui/SearchBar'
import FilterTabs                       from '@/components/ui/FilterTabs'
import ChapterCard                      from '@/components/cards/ChapterCard'
import ChapterHeader                    from './ChapterHeader'
import { SUBJECTS }                     from '@/data/subjects'
import { CHAPTERS }                     from '@/data/chapters'
import { useStudyProgress }             from '@/context/StudyProgressContext'

/**
 * Chapter — Chapter list page for a subject.
 *
 * Route: /subjects/:subjectId   (Fix 5: renamed :id to :subjectId)
 * Also accepts: ?chapter=chapterId  (from /chapter/:id redirect — Fix 5)
 *   → auto-expands that chapter on load
 *
 * Fix 2: filter status derived from live StudyProgressContext,
 *        not from static data.
 */

const BASE_TABS = [
  { id: 'all',         label: 'All'          },
  { id: 'completed',   label: 'Done'         },
  { id: 'in-progress', label: 'In Progress'  },
  { id: 'not-started', label: 'Not Started'  },
]

export default function Chapter() {
  const { subjectId }         = useParams()
  const [searchParams]        = useSearchParams()
  const initialChapterId      = searchParams.get('chapter')

  const subject  = SUBJECTS.find(s => s.id === subjectId)
  const chapters = CHAPTERS[subjectId] ?? []

  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState('all')
  const [expandedId, setExpandedId] = useState(initialChapterId ?? null)

  /* Auto-expand chapter from URL query param */
  useEffect(() => {
    if (initialChapterId) setExpandedId(initialChapterId)
  }, [initialChapterId])

  const { isLectureDone, countDone } = useStudyProgress()

  if (!subject) return <Navigate to="/subjects" replace />

  /* Compute live status for each chapter */
  const chaptersWithStatus = useMemo(() =>
    chapters.map(ch => {
      const lecs    = ch.lectures ?? []
      const done    = countDone(lecs)
      const total   = lecs.length
      const status  =
        total > 0 && done === total ? 'completed'    :
        done > 0                    ? 'in-progress'  :
                                      'not-started'
      return { ...ch, liveStatus: status }
    }),
  [chapters, countDone])

  const FILTER_FN = {
    all:           () => true,
    completed:     (c) => c.liveStatus === 'completed',
    'in-progress': (c) => c.liveStatus === 'in-progress',
    'not-started': (c) => c.liveStatus === 'not-started',
  }

  const visible = useMemo(() => {
    const q  = search.trim().toLowerCase()
    const fn = FILTER_FN[filter] ?? FILTER_FN.all
    return chaptersWithStatus.filter(c =>
      fn(c) && (q === '' || c.name.toLowerCase().includes(q)),
    )
  }, [chaptersWithStatus, search, filter])

  const tabs = useMemo(() =>
    BASE_TABS.map(t => ({
      ...t,
      count: t.id === 'all'
        ? undefined
        : chaptersWithStatus.filter(FILTER_FN[t.id] ?? (() => false)).length,
    })),
  [chaptersWithStatus])

  const toggleChapter = (id) =>
    setExpandedId(prev => prev === id ? null : id)

  const hasResults  = visible.length > 0
  const isFiltering = search !== '' || filter !== 'all'

  return (
    <PageTransition>
      <div className="px-4 pb-10">
        <ChapterHeader subject={subject} chapters={chaptersWithStatus} />
        <div className="my-5 border-t border-white/[0.05]" />

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}>
          <SearchBar
            value={search}
            onChange={(v) => { setSearch(v); setExpandedId(null) }}
            placeholder={`Search ${subject.name} chapters…`}
            className="mb-3"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.20 }}>
          <FilterTabs
            tabs={tabs}
            active={filter}
            onChange={(v) => { setFilter(v); setExpandedId(null) }}
            className="mb-5"
          />
        </motion.div>

        {isFiltering && hasResults && (
          <p className="text-[12px] text-dim mb-3">
            {visible.length} chapter{visible.length !== 1 ? 's' : ''} found
          </p>
        )}

        <AnimatePresence mode="wait">
          {hasResults ? (
            <motion.div key="list" className="space-y-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}>
              {visible.map((chapter, i) => (
                <motion.div key={chapter.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: 0.22 + i * 0.05 }}>
                  <ChapterCard
                    chapter={chapter}
                    subjectColor={subject.color}
                    isExpanded={expandedId === chapter.id}
                    onToggle={() => toggleChapter(chapter.id)}
                  />
                </motion.div>
              ))}
              {!isFiltering && (
                <p className="text-center text-[11px] text-dim pt-2 pb-1">
                  Showing {chapters.length} demo chapters of {subject.totalChapters} total
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" className="flex flex-col items-center justify-center py-20 text-center"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <SearchX size={40} className="text-dim mb-4" strokeWidth={1.4} />
              <p className="text-[15px] font-semibold text-snow mb-1">No chapters found</p>
              <p className="text-[13px] text-mist mb-5">
                {search ? `No results for "${search}"` : 'No chapters match this filter'}
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
