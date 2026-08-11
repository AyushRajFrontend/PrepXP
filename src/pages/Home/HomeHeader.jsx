import { useMemo }  from 'react'
import { motion }   from 'framer-motion'
import { Bell }     from 'lucide-react'

/**
 * HomeHeader — Top greeting area on the Home dashboard.
 *
 * Shows a time-aware greeting (morning / afternoon / evening),
 * the user's first name, current date, and a notification bell.
 *
 * Props:
 *   user — { name, daysActive } from AppContext
 */

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getEmoji(h = new Date().getHours()) {
  if (h < 12) return '☀️'
  if (h < 17) return '👋'
  return '🌙'
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day:     'numeric',
    month:   'short',
    year:    'numeric',
  })
}

export default function HomeHeader({ user }) {
  const greeting = useMemo(getGreeting, [])
  const emoji    = useMemo(getEmoji,    [])
  const dateStr  = useMemo(getFormattedDate, [])
  const firstName = (user?.name ?? 'Learner').split(' ')[0]

  return (
    <motion.div
      className="flex items-start justify-between pt-5"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Left: greeting + name + date */}
      <div>
        <p className="text-[13px] text-mist font-medium">
          {greeting} {emoji}
        </p>

        <h1 className="font-display font-bold text-[26px] text-frost
                       leading-tight tracking-tight mt-0.5">
          {firstName}
        </h1>

        <p className="text-[11px] text-dim mt-1">
          {dateStr}
          {user?.daysActive > 0 && (
            <> &nbsp;·&nbsp; Day <span className="text-mist">{user.daysActive}</span> of your JEE journey</>
          )}
        </p>
      </div>

      {/* Right: notification bell */}
      <button
        aria-label="Notifications"
        className="relative w-10 h-10 glass rounded-xl
                   flex items-center justify-center
                   text-mist border border-white/[0.08]
                   active:scale-90 transition-transform duration-150 mt-1"
      >
        <Bell size={17} strokeWidth={1.8} />

        {/* Unread dot */}
        <span
          aria-hidden="true"
          className="absolute top-2 right-2 w-[7px] h-[7px]
                     bg-streak rounded-full
                     ring-[1.5px] ring-canvas"
        />
      </button>
    </motion.div>
  )
}
