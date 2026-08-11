import { motion } from 'framer-motion'
import { cn }     from '@/utils/cn'

/**
 * ProgressBar — Animated fill bar.
 *
 * Uses Framer Motion whileInView so it fills the moment
 * it enters the viewport — works great on scroll-heavy pages.
 *
 * Props:
 *   value       — 0 to 100 (percentage)
 *   color       — 'brand' | 'physics' | 'chemistry' | 'math' | 'xp' | 'streak' | 'success' | 'danger'
 *   size        — 'xs' | 'sm' | 'md' | 'lg'
 *   animated    — animate fill on mount (default true)
 *   showGlow    — glow effect on fill tip (default true)
 *   showShimmer — moving sheen over the fill (default true)
 *   delay       — animation delay in seconds (default 0.2)
 *   className   — extra classes on the track wrapper
 */

/* ── Gradient / solid fill per color ── */
const GRADIENT = {
  brand:     'linear-gradient(90deg, var(--color-purple), var(--color-cyan))',
  physics:   'var(--color-physics)',
  chemistry: 'var(--color-chemistry)',
  math:      'var(--color-math)',
  xp:        'linear-gradient(90deg, var(--color-xp), var(--color-streak))',
  streak:    'var(--color-streak)',
  success:   'var(--color-success)',
  danger:    'var(--color-danger)',
}

/* ── Glow color at fill tip ── */
const GLOW = {
  brand:     'rgba(124, 58, 237, 0.55)',
  physics:   'rgba(56,  189, 248, 0.50)',
  chemistry: 'rgba(52,  211, 153, 0.50)',
  math:      'rgba(167, 139, 250, 0.50)',
  xp:        'rgba(245, 158,  11, 0.50)',
  streak:    'rgba(249, 115,  22, 0.50)',
  success:   'rgba(16,  185, 129, 0.50)',
  danger:    'rgba(239,  68,  68, 0.50)',
}

/* ── Track height ── */
const HEIGHT = {
  xs: 'h-[2px]',
  sm: 'h-1',       /* 4 px */
  md: 'h-[6px]',
  lg: 'h-2',       /* 8 px */
}

export default function ProgressBar({
  value       = 0,
  color       = 'brand',
  size        = 'sm',
  animated    = true,
  showGlow    = true,
  showShimmer = true,
  delay       = 0.2,
  className,
}) {
  /* Clamp 0-100 */
  const pct = Math.min(Math.max(value, 0), 100)

  const fillStyle = {
    background: GRADIENT[color] ?? GRADIENT.brand,
    ...(showGlow && {
      boxShadow: `0 0 12px ${GLOW[color] ?? GLOW.brand}`,
    }),
  }

  return (
    /* Track */
    <div
      className={cn(
        'w-full rounded-full overflow-hidden',
        'bg-white/[0.05]',
        HEIGHT[size] ?? HEIGHT.sm,
        className,
      )}
    >
      {/* Fill */}
      <motion.div
        className="relative h-full rounded-full"
        style={fillStyle}
        initial={animated ? { width: '0%' } : { width: `${pct}%` }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{
          duration: 1.1,
          ease:     [0.4, 0, 0.2, 1],
          delay,
        }}
      >
        {/* Moving shimmer sheen */}
        {showShimmer && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.20) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation:      'shimmer 2.2s linear infinite',
            }}
          />
        )}
      </motion.div>
    </div>
  )
}
