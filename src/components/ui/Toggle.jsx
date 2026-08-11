import { motion } from 'framer-motion'
import { cn }     from '@/utils/cn'

/**
 * Toggle — Animated switch primitive.
 *
 * The knob slides left/right using Framer Motion spring physics
 * so it feels physically satisfying — not a CSS transition.
 *
 * ON  → gradient-brand background, knob at right
 * OFF → dim background, knob at left
 *
 * Designed to be composed inside ToggleRow, but can be
 * used standalone anywhere a switch is needed.
 *
 * Props:
 *   checked   — current state (boolean)
 *   onChange  — (value: boolean) => void
 *   disabled  — disables interaction and dims the switch
 *   size      — 'sm' | 'md' (default 'md')
 */

/* ── Size config ── */
const SIZES = {
  sm: {
    track:    'w-9 h-[22px]',
    knob:     'w-[16px] h-[16px] top-[3px] left-[3px]',
    travel:   16,              /* px the knob travels */
  },
  md: {
    track:    'w-11 h-6',     /* 44 × 24 px */
    knob:     'w-[18px] h-[18px] top-[3px] left-[3px]',
    travel:   20,
  },
}

export default function Toggle({
  checked  = false,
  onChange,
  disabled = false,
  size     = 'md',
}) {
  const sz = SIZES[size] ?? SIZES.md

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={cn(
        /* Track */
        'relative rounded-full flex-shrink-0',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50',
        sz.track,
        /* Colors */
        checked
          ? 'gradient-brand'
          : 'bg-white/[0.10] border border-white/[0.12]',
        /* Disabled */
        disabled && 'opacity-40 cursor-not-allowed',
        !disabled && 'cursor-pointer',
      )}
    >
      {/* Sliding knob */}
      <motion.span
        className={cn(
          'absolute rounded-full bg-white',
          'shadow-[0_1px_4px_rgba(0,0,0,0.40)]',
          sz.knob,
        )}
        animate={{ x: checked ? sz.travel : 0 }}
        transition={{
          type:      'spring',
          stiffness: 520,
          damping:   34,
          mass:      0.8,
        }}
      />
    </button>
  )
}
