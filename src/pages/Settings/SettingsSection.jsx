import { motion }  from 'framer-motion'
import GlassCard   from '@/components/ui/GlassCard'
import { cn }      from '@/utils/cn'

/**
 * SettingsSection — Section wrapper for the Settings page.
 *
 * Renders a small icon + label header above a GlassCard that
 * uses `divide-y` so child rows get automatic dividers —
 * no border-bottom needed on individual rows.
 *
 * Entrance is handled per-section with `whileInView` so each
 * section slides in as the user scrolls down the settings page.
 *
 * Props:
 *   icon       — Lucide icon component
 *   title      — section heading text
 *   iconColor  — Tailwind classes for the icon wrapper bg + text color
 *   children   — ToggleRow, DangerButton, custom rows, etc.
 *   delay      — optional entrance animation delay (seconds)
 */
export default function SettingsSection({
  icon: Icon,
  title,
  iconColor = 'bg-white/[0.06] text-mist',
  children,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1], delay }}
    >
      {/* ── Section label row ── */}
      <div className="flex items-center gap-2 px-1 mb-2.5">
        <div className={cn(
          'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0',
          iconColor,
        )}>
          <Icon size={13} strokeWidth={2} />
        </div>
        <span className="text-[11px] font-bold text-mist uppercase tracking-[0.08em]">
          {title}
        </span>
      </div>

      {/* ── Content card ── */}
      {/*
        `divide-y divide-white/[0.05]` adds a 1 px top border
        between every direct child — cleaner than managing
        border-bottom on each row individually.
      */}
      <GlassCard noPadding>
        <div className="px-4 divide-y divide-white/[0.05]">
          {children}
        </div>
      </GlassCard>
    </motion.div>
  )
}
