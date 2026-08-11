import { createContext, useContext, useCallback, useMemo } from 'react'
import { useLocalStorage }  from '@/hooks/useLocalStorage'
import { storageGet, KEYS } from '@/services/storage'
import { CHAPTERS }         from '@/data/chapters'

/**
 * StudyProgressContext — Single source of truth for all study progress.
 *
 * ALL progress percentages are computed here from actual lecture
 * completion state. No static progress values are used anywhere else.
 *
 * Fixes applied:
 *   • toggleLecture(): bidirectional — complete ↔ incomplete
 *   • getSubjectStats(): live progress for any subject
 *   • getOverallProgress(): live overall completion %
 *   • getActivityData(): real chart data from completion timestamps
 *   • Seed distributes initial lectures across last 7 days for real charts
 */

/* ─── First-run seed ─── */
function getInitialProgress() {
  const stored = storageGet(KEYS.PROGRESS)
  if (stored) return stored

  const lectures = {}
  let idx = 0

  Object.values(CHAPTERS).flat().forEach(chapter => {
    chapter.lectures?.forEach(lecture => {
      if (lecture.done) {
        /* Spread seeded lectures across the last 7 days so charts have data */
        const daysAgo = idx % 7
        const d = new Date()
        d.setDate(d.getDate() - daysAgo)
        d.setHours(8 + (idx % 10), 0, 0, 0)
        lectures[lecture.id] = { done: true, doneAt: d.toISOString() }
        idx++
      }
    })
  })

  return { lectures }
}

const SEEDED_PROGRESS = getInitialProgress()
const EMPTY_PROGRESS  = { lectures: {} }

const StudyProgressContext = createContext(null)

export function StudyProgressProvider({ children }) {
  const [progress, setProgress] = useLocalStorage(KEYS.PROGRESS, SEEDED_PROGRESS)

  /* ════════════════ READ HELPERS ════════════════ */

  const isLectureDone = useCallback(
    (id) => progress.lectures?.[id]?.done === true,
    [progress],
  )

  const countDone = useCallback(
    (lectures = []) => lectures.filter(l => isLectureDone(l.id)).length,
    [isLectureDone],
  )

  /**
   * Get live stats for a subject.
   * Returns { progress, doneLectures, totalLectures, doneChapters, totalChapters }
   * All computed from real completion state — no static values.
   */
  const getSubjectStats = useCallback((subjectId) => {
    const chapters = CHAPTERS[subjectId] ?? []
    let doneLectures = 0, totalLectures = 0, doneChapters = 0

    chapters.forEach(chapter => {
      const lecs = chapter.lectures ?? []
      const chDone = lecs.filter(l => isLectureDone(l.id)).length
      doneLectures  += chDone
      totalLectures += lecs.length
      if (lecs.length > 0 && chDone === lecs.length) doneChapters++
    })

    const prog = totalLectures > 0
      ? Math.round((doneLectures / totalLectures) * 100)
      : 0

    return {
      progress:      prog,
      doneLectures,
      totalLectures,
      doneChapters,
      totalChapters: chapters.length,
    }
  }, [isLectureDone])

  /** Overall progress across ALL subjects / ALL demo chapters */
  const getOverallProgress = useCallback(() => {
    let done = 0, total = 0
    Object.values(CHAPTERS).flat().forEach(ch => {
      ;(ch.lectures ?? []).forEach(l => {
        total++
        if (isLectureDone(l.id)) done++
      })
    })
    return total > 0 ? Math.round((done / total) * 100) : 0
  }, [isLectureDone])

  /**
   * Daily activity data for chart display.
   * Counts lectures completed per calendar day for the last `days` days.
   * Uses the `doneAt` timestamp stored when each lecture was marked done.
   */
  const getActivityData = useCallback((days = 7) => {
    const result = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const count = Object.values(progress.lectures).filter(l =>
        l.done && l.doneAt?.startsWith(dateStr),
      ).length

      result.push({
        day:      date.toLocaleDateString('en', { weekday: 'short' }),
        date:     dateStr,
        lectures: count,
        xp:       count * 25,
        minutes:  count * 40,
      })
    }

    return result
  }, [progress])

  /* ════════════════ WRITE HELPERS ════════════════ */

  /**
   * toggleLecture — bidirectional lecture completion toggle.
   *
   * Incomplete → Complete:  returns { nowDone: true  }  → caller adds +25 XP
   * Complete → Incomplete:  returns { nowDone: false }  → caller adds -25 XP
   *
   * XP is never farmed: completing and uncompleting nets 0 XP total.
   */
  const toggleLecture = useCallback((lectureId) => {
    const currentlyDone = progress.lectures?.[lectureId]?.done === true

    setProgress(prev => {
      const updated = { ...prev, lectures: { ...prev.lectures } }
      if (currentlyDone) {
        /* Uncomplete: remove from completed set */
        delete updated.lectures[lectureId]
      } else {
        /* Complete: record with current timestamp */
        updated.lectures[lectureId] = {
          done:   true,
          doneAt: new Date().toISOString(),
        }
      }
      return updated
    })

    return { nowDone: !currentlyDone }
  }, [progress, setProgress])

  /** Reset ALL progress — called by Settings danger zone */
  const resetProgress = useCallback(
    () => setProgress(EMPTY_PROGRESS),
    [setProgress],
  )

  /* ════════════════ CONTEXT VALUE ════════════════ */

  const value = useMemo(() => ({
    /* Read */
    isLectureDone,
    countDone,
    getSubjectStats,
    getOverallProgress,
    getActivityData,
    /* Write */
    toggleLecture,
    resetProgress,
  }), [
    isLectureDone, countDone,
    getSubjectStats, getOverallProgress, getActivityData,
    toggleLecture, resetProgress,
  ])

  return (
    <StudyProgressContext.Provider value={value}>
      {children}
    </StudyProgressContext.Provider>
  )
}

export function useStudyProgress() {
  const ctx = useContext(StudyProgressContext)
  if (!ctx) throw new Error('[PrepXP] useStudyProgress() must be inside <StudyProgressProvider>')
  return ctx
}
