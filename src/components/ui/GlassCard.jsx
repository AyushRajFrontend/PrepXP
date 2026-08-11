import { cn } from '@/utils/cn'

/**
 * GlassCard — Base card primitive.
 *
 * All PrepXP cards are built on top of this component.
 * Provides glassmorphism background, shadow, and
 * optional interactive press state.
 *
 * Props:
 *   className   — Tailwind overrides (padding, sizing, etc.)
 *   onClick     — makes card tappable with press feedback
 *   accent      — colored top-border line ('purple'|'cyan'|'physics'|'chemistry'|'math'|'xp'|'streak')
 *   noPadding   — disable default p-4 padding
 *   children
 */

/* Maps accent name → CSS variable for inline style */
const ACCENT_COLORS = {
  brand:     'linear-gradient(90deg, var(--color-purple), var(--color-cyan))',
  purple:    'var(--color-purple)',
  cyan:      'var(--color-cyan)',
  physics:   'var(--color-physics)',
  chemistry: 'var(--color-chemistry)',
  math:      'var(--color-math)',
  xp:        'linear-gradient(90deg, var(--color-xp), var(--color-streak))',
  streak:    'var(--color-streak)',
  success:   'var(--color-success)',
  danger:    'var(--color-danger)',
}

export default function GlassCard({
  children,
  className,
  onClick,
  accent,
  noPadding = false,
}) {
  return (
    <div
      className={cn(
        /* Glass base */
        'relative glass-elevated rounded-2xl glow-card overflow-hidden',
        /* Interactive feedback */
        onClick && [
          'cursor-pointer select-none',
          'active:scale-[0.975] transition-transform duration-150 ease-out',
        ],
        /* Default padding unless suppressed */
        !noPadding && 'p-4',
        className,
      )}
      onClick={onClick}
    >
      {/* Optional top-edge accent line (2px) */}
      {accent && (
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
          style={{ background: ACCENT_COLORS[accent] ?? accent }}
        />
      )}

      {children}
    </div>
  )
}
