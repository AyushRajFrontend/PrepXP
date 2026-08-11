import { NavLink, useLocation } from 'react-router-dom'
import { motion, LayoutGroup } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  CircleUserRound,
  Settings2,
} from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * BottomNav — App bottom navigation.
 *
 * 5 tabs: Home · Study · Analytics · Profile · Settings
 * All tabs are now active (Analytics unlocked in Step 8).
 *
 * Active tab:
 *   - Shared layout indicator pill (layoutId="nav-pill") morphs
 *     between tabs via Framer Motion spring animation
 *   - Icon bobs up 1px
 *   - Label gets gradient text
 *
 * Safe area: padding-bottom = env(safe-area-inset-bottom)
 * so the nav bar clears the iPhone home indicator.
 */

const NAV_ITEMS = [
  { to: '/',          label: 'Home',     icon: LayoutDashboard, exact: true },
  { to: '/subjects',  label: 'Study',    icon: BookOpen              },
  { to: '/analytics', label: 'Stats',    icon: TrendingUp            },
  { to: '/profile',   label: 'Profile',  icon: CircleUserRound       },
  { to: '/settings',  label: 'Settings', icon: Settings2             },
]

function NavItem({ item }) {
  const location = useLocation()

  const isActive = item.exact
    ? location.pathname === item.to
    : location.pathname === item.to ||
      location.pathname.startsWith(item.to + '/')

  return (
    <NavLink
      to={item.to}
      className={cn(
        'relative flex flex-col items-center gap-0.5 px-3 py-2',
        'rounded-xl transition-colors duration-200 select-none',
        'outline-none focus-visible:ring-2 focus-visible:ring-purple/50',
        isActive ? 'text-frost' : 'text-mist hover:text-snow active:scale-95',
      )}
    >
      {/* Shared layout active pill — morphs between tabs */}
      {isActive && (
        <motion.span
          layoutId="nav-pill"
          aria-hidden="true"
          className="absolute -top-0.5 w-5 h-0.5 rounded-full gradient-brand"
          style={{ boxShadow: '0 0 8px rgba(124,58,237,0.7)' }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}

      {/* Icon — bobs up when active */}
      <motion.div
        animate={{ y: isActive ? -1 : 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <item.icon
          size={21}
          strokeWidth={isActive ? 2.2 : 1.7}
          className={cn(isActive && 'text-purple')}
        />
      </motion.div>

      {/* Label — gradient when active */}
      <span className={cn(
        'text-[10px] font-medium tracking-wide',
        isActive ? 'text-gradient-brand' : '',
      )}>
        {item.label}
      </span>
    </NavLink>
  )
}

export default function BottomNav() {
  return (
    <nav className="glass-strong pb-safe">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        <LayoutGroup id="bottom-nav">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.to} item={item} />
          ))}
        </LayoutGroup>
      </div>
    </nav>
  )
}
