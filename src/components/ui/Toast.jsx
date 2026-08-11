import { AnimatePresence, motion } from 'framer-motion'
import { X }                       from 'lucide-react'
import { cn }                      from '@/utils/cn'

/**
 * Toast.jsx — Animated notification toasts.
 *
 * Two exports:
 *   ToastItem      — single toast card (used inside the container)
 *   ToastContainer — fixed-position list that holds all active toasts
 *
 * Visual design:
 *   glass-elevated card · emoji icon · title + optional message
 *   · optional "+N XP" gradient badge · dismiss button
 *
 * Animation:
 *   Enter  — spring up from below + scale in
 *   Exit   — fade + slide up
 *   Layout — AnimatePresence mode="popLayout" smoothly
 *            repositions remaining toasts when one is dismissed
 */


/* ── Individual toast card ── */
function ToastItem({ toast, onRemove }) {
  return (
    <motion.div
      layout
      className={cn(
        'flex items-center gap-3 px-4 py-3',
        'glass-elevated rounded-2xl',
        'shadow-xl shadow-black/40',
        /* Allow pointer events so the dismiss button works */
        'pointer-events-auto',
      )}
      /* Entrance — spring pop from below */
      initial={{ opacity: 0, y: 28, scale: 0.86 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: -14, scale: 0.9  }}
      transition={{
        type:      'spring',
        stiffness: 420,
        damping:   32,
      }}
    >
      {/* Emoji / icon */}
      {toast.icon && (
        <span
          className="text-[22px] leading-none flex-shrink-0"
          role="img"
          aria-hidden="true"
        >
          {toast.icon}
        </span>
      )}

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-bold text-frost leading-snug">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-[11.5px] text-mist mt-0.5 leading-snug truncate">
            {toast.message}
          </p>
        )}
      </div>

      {/* XP badge */}
      {toast.xp > 0 && (
        <span className="font-mono font-bold text-[14px] text-gradient-brand flex-shrink-0">
          +{toast.xp} XP
        </span>
      )}

      {/* Dismiss */}
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        className="flex-shrink-0 text-dim ml-0.5
                   active:scale-90 transition-transform duration-100"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </motion.div>
  )
}


/**
 * ToastContainer — Fixed overlay that holds all active toasts.
 *
 * Positioned at the top-center, constrained to the app's max-width.
 * `pointer-events-none` on the wrapper means clicks pass through to
 * the page underneath; individual toasts opt back in with
 * `pointer-events-auto`.
 *
 * Props:
 *   toasts   — [{ id, icon, title, message, xp }]
 *   onRemove — (id: string) => void
 */
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="
        fixed top-5
        left-1/2 -translate-x-1/2
        w-[calc(100%-32px)] max-w-[390px]
        z-[200]
        flex flex-col gap-2
        pointer-events-none
      "
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}
