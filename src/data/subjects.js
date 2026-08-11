/**
 * subjects.js — Subject metadata.
 *
 * Progress values (progress, doneLectures, doneChapters) are NO LONGER
 * stored here. They are computed dynamically from StudyProgressContext
 * using actual lecture completion state stored in localStorage.
 *
 * Static fields kept here:
 *   totalChapters / totalLectures — full JEE syllabus reference (for display)
 */

export const SUBJECTS = [
  {
    id:            'physics',
    name:          'Physics',
    tagline:       'Mechanics, Optics & Electrostatics',
    color:         'physics',
    accentVar:     'var(--color-physics)',
    totalChapters: 71,
    totalLectures: 695,
  },
  {
    id:            'chemistry',
    name:          'Chemistry',
    tagline:       'Organic, Inorganic & Physical',
    color:         'chemistry',
    accentVar:     'var(--color-chemistry)',
    totalChapters: 72,
    totalLectures: 614,
  },
  {
    id:            'mathematics',
    name:          'Mathematics',
    tagline:       'Calculus, Algebra & Co-ordinate Geometry',
    color:         'math',
    accentVar:     'var(--color-math)',
    totalChapters: 71,
    totalLectures: 750,
  },
]

/** Days until JEE Advanced 2027 */
export const DAYS_TO_JEE = 287
