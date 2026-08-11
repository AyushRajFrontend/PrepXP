import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { AppProvider }           from '@/context/AppContext'
import { StudyProgressProvider } from '@/context/StudyProgressContext'
import { SettingsProvider, useSettings } from '@/context/SettingsContext'
import { ToastProvider }         from '@/context/ToastContext'
import LevelWatcher              from '@/components/LevelWatcher'
import Layout                    from '@/components/layout/Layout'

import Home      from '@/pages/Home/Home'
import Subjects  from '@/pages/Subjects/Subjects'
import Chapter   from '@/pages/Chapter/Chapter'
import Analytics from '@/pages/Analytics/Analytics'
import Profile   from '@/pages/Profile/Profile'
import Settings  from '@/pages/Settings/Settings'

/**
 * ChapterRedirect — handles /chapter/:chapterId
 * Maps chapter ID prefix to its subject, then redirects to
 * /subjects/:subjectId?chapter=:chapterId so Chapter.jsx
 * can auto-expand that chapter row.
 */
function ChapterRedirect() {
  const { chapterId } = useParams()
  const subjectId =
    chapterId?.startsWith('phy_')  ? 'physics'     :
    chapterId?.startsWith('chem_') ? 'chemistry'   :
    chapterId?.startsWith('math_') ? 'mathematics' : null

  if (!subjectId) return <Navigate to="/subjects" replace />
  return <Navigate to={`/subjects/${subjectId}?chapter=${chapterId}`} replace />
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"                       element={<Home />}              />
        <Route path="/subjects"               element={<Subjects />}          />
        <Route path="/subjects/:subjectId"    element={<Chapter />}           />
        <Route path="/chapter/:chapterId"     element={<ChapterRedirect />}   />
        <Route path="/analytics"              element={<Analytics />}         />
        <Route path="/profile"                element={<Profile />}           />
        <Route path="/settings"               element={<Settings />}          />
        <Route path="*"                       element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

/**
 * MotionWrapper — reads reducedMotion from SettingsContext
 * and applies it to Framer Motion globally via MotionConfig.
 * Must be inside SettingsProvider.
 */
function MotionWrapper({ children }) {
  const { settings } = useSettings()
  return (
    <MotionConfig reducedMotion={settings.reducedMotion ? 'always' : 'never'}>
      {children}
    </MotionConfig>
  )
}

/**
 * Provider hierarchy (outer → inner):
 *   AppProvider             User state + XP
 *   StudyProgressProvider   Lecture completion state
 *   SettingsProvider        Persisted settings + DOM effects
 *   ToastProvider           Toasts
 *   MotionWrapper           Framer Motion reducedMotion config
 *   LevelWatcher            Headless level-up detector
 *   BrowserRouter → Layout → AnimatedRoutes
 */
export default function App() {
  return (
    <AppProvider>
      <StudyProgressProvider>
        <SettingsProvider>
          <ToastProvider>
            <MotionWrapper>
              <LevelWatcher />
              <BrowserRouter>
                <Layout>
                  <AnimatedRoutes />
                </Layout>
              </BrowserRouter>
            </MotionWrapper>
          </ToastProvider>
        </SettingsProvider>
      </StudyProgressProvider>
    </AppProvider>
  )
}
