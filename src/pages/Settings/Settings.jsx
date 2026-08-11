import { useState }             from 'react'
import { motion }               from 'framer-motion'
import {
  Palette, Bell, Volume2, BookOpen, AlertTriangle, Info, Check,
} from 'lucide-react'
import PageTransition            from '@/components/ui/PageTransition'
import ToggleRow                 from '@/components/ui/ToggleRow'
import SettingsSection           from './SettingsSection'
import { useSettings }           from '@/context/SettingsContext'
import { useApp }                from '@/context/AppContext'
import { useStudyProgress }      from '@/context/StudyProgressContext'
import { useToast }              from '@/context/ToastContext'
import { cn }                    from '@/utils/cn'

/**
 * Settings — Fix 4: All settings persist via SettingsContext → localStorage.
 *
 * • Theme chips call updateSetting('theme', id) → SettingsContext applies
 *   data-theme attribute on <html> → CSS variables change → colors update live
 * • All toggles are CONTROLLED via settings state (no local useState)
 * • Reduced motion setting also disables Framer Motion via MotionConfig in App.jsx
 * • Reset buttons call real AppContext + StudyProgressContext actions
 */

const THEMES = [
  { id: 'deep-space', label: 'Deep Space', bg: 'linear-gradient(160deg, #060914 0%, #0D1526 60%, #152038 100%)' },
  { id: 'ocean',      label: 'Ocean Night', bg: 'linear-gradient(160deg, #030D1A 0%, #062030 60%, #0A2E45 100%)' },
  { id: 'nebula',     label: 'Nebula',      bg: 'linear-gradient(160deg, #0A0520 0%, #160830 60%, #220B48 100%)' },
]

function ThemeChip({ theme, active, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={cn('relative flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border',
        'transition-all duration-200 active:scale-95',
        active ? 'border-purple bg-purple/[0.07]' : 'border-white/[0.07] bg-white/[0.02]')}>
      <div className="w-full h-9 rounded-lg" style={{ background: theme.bg }} />
      <span className={cn('text-[11px] font-semibold', active ? 'text-purple' : 'text-mist')}>
        {theme.label}
      </span>
      {active && (
        <motion.span className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full gradient-brand flex items-center justify-center"
          initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}>
          <Check size={10} className="text-white" strokeWidth={3} />
        </motion.span>
      )}
    </button>
  )
}

function DangerButton({ label, description, onConfirm }) {
  const [armed, setArmed] = useState(false)
  const handleClick = () => {
    if (!armed) { setArmed(true); setTimeout(() => setArmed(false), 3000); return }
    onConfirm?.(); setArmed(false)
  }
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium text-frost">{label}</p>
        <p className="text-[11.5px] text-mist mt-0.5 leading-snug">{description}</p>
      </div>
      <motion.button type="button" onClick={handleClick}
        className={cn('flex-shrink-0 text-[12px] font-bold px-3.5 py-1.5 rounded-xl border',
          'transition-colors duration-200 active:scale-95',
          armed ? 'bg-danger/[0.12] border-danger/25 text-danger' : 'bg-white/[0.05] border-white/[0.09] text-mist')}
        animate={armed ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.22 }}>
        {armed ? 'Confirm?' : 'Reset'}
      </motion.button>
    </div>
  )
}

function AboutRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-[13px] text-mist">{label}</span>
      <span className="font-mono text-[12.5px] text-frost">{value}</span>
    </div>
  )
}

export default function Settings() {
  const { settings, updateSetting } = useSettings()
  const { reset }                   = useApp()
  const { resetProgress }           = useStudyProgress()
  const { toast }                   = useToast()

  const toggle = (key) => (v) => updateSetting(key, v)

  const handleResetAll = () => {
    reset(); resetProgress()
    toast({ icon: '🔄', title: 'Progress Reset', message: 'Starting fresh!', duration: 3000 })
  }
  const handleClearHistory = () => {
    resetProgress()
    toast({ icon: '🧹', title: 'History Cleared', message: 'Study data wiped.', duration: 3000 })
  }

  return (
    <PageTransition>
      <div className="px-4 pb-10 space-y-5">
        <motion.div className="pt-5" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}>
          <h1 className="font-display font-bold text-[26px] text-frost">Settings</h1>
          <p className="text-[13px] text-mist mt-0.5">Customize your PrepXP experience</p>
        </motion.div>

        {/* Appearance */}
        <SettingsSection icon={Palette} title="Appearance" iconColor="bg-purple/10 text-purple" delay={0.05}>
          <div className="py-3.5">
            <p className="text-[12px] font-semibold text-mist mb-3">App Theme</p>
            <div className="flex gap-2.5">
              {THEMES.map(theme => (
                <ThemeChip key={theme.id} theme={theme}
                  active={settings.theme === theme.id}
                  onClick={() => updateSetting('theme', theme.id)} />
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection icon={Bell} title="Notifications" iconColor="bg-streak/10 text-streak" delay={0.08}>
          <ToggleRow label="Daily Reminder"      description="Ping at 8 PM if today's goal isn't met"    checked={settings.notifications}  onChange={toggle('notifications')} />
          <ToggleRow label="Streak Alert"         description="Warn an hour before your streak breaks"    checked={settings.streakAlert}     onChange={toggle('streakAlert')} />
          <ToggleRow label="Level Up Celebration" description="Confetti and sound effect on level up"     checked={settings.levelUpAlert}    onChange={toggle('levelUpAlert')} />
          <ToggleRow label="Mission Complete"     description="Alert when a daily mission is finished"    checked={settings.missionAlert}    onChange={toggle('missionAlert')} />
        </SettingsSection>

        {/* Sound & Motion */}
        <SettingsSection icon={Volume2} title="Sound & Motion" iconColor="bg-cyan/10 text-cyan" delay={0.11}>
          <ToggleRow label="UI Sound Effects"   description="Subtle chimes on interactions"              checked={settings.soundEffects}    onChange={toggle('soundEffects')} />
          <ToggleRow label="Page Animations"    description="Smooth transitions between screens"         checked={settings.pageAnimations}  onChange={toggle('pageAnimations')} />
          <ToggleRow label="Haptic Feedback"    description="Vibration on key interactions (mobile)"     checked={settings.hapticFeedback}  onChange={toggle('hapticFeedback')} />
          <ToggleRow label="Reduced Motion"     description="Disables all animations for accessibility"  checked={settings.reducedMotion}   onChange={toggle('reducedMotion')} />
        </SettingsSection>

        {/* Study Preferences */}
        <SettingsSection icon={BookOpen} title="Study Preferences" iconColor="bg-physics/10 text-physics" delay={0.14}>
          <ToggleRow label="Focus Mode"             description="Hide non-essential UI while studying"          checked={settings.focusMode}       onChange={toggle('focusMode')} />
          <ToggleRow label="Show Lecture Duration"  description="Display estimated time on lecture cards"       checked={settings.showDuration}    onChange={toggle('showDuration')} />
          <ToggleRow label="Auto-save Notes"        description="Save lecture notes without manual action"      checked={settings.autoSaveNotes}   onChange={toggle('autoSaveNotes')} />
          <ToggleRow label="Cloud Sync" description="Sync progress across devices" badge="Soon" disabled />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection icon={AlertTriangle} title="Danger Zone" iconColor="bg-danger/10 text-danger" delay={0.17}>
          <DangerButton
            label="Reset All Progress"
            description="Clears XP, level, streak, and all lecture completion — cannot be undone"
            onConfirm={handleResetAll}
          />
          <DangerButton
            label="Clear Study History"
            description="Removes all lecture completion records and activity logs"
            onConfirm={handleClearHistory}
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection icon={Info} title="About PrepXP" iconColor="bg-white/[0.06] text-mist" delay={0.20}>
          <AboutRow label="Version"  value="1.0.0-beta"          />
          <AboutRow label="Build"    value="2026.08.11"           />
          <AboutRow label="Phase"    value="Phase 3 — Fixed"      />
          <AboutRow label="Stack"    value="React 19 · Vite 6"   />
          <AboutRow label="Styles"   value="Tailwind CSS v4"      />
          <AboutRow label="Deploy"   value="Vercel"               />
        </SettingsSection>
      </div>
    </PageTransition>
  )
}
