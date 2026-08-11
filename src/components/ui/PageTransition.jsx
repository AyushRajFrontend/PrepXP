import { motion } from 'framer-motion'

/* ── Animation variants ── */
const variants = {
  initial:  { opacity: 0, y: 14 },
  animate:  { opacity: 1, y: 0  },
  exit:     { opacity: 0, y: -8 },
}

const transition = {
  duration: 0.22,
  ease:     [0.4, 0, 0.2, 1],  /* Standard Material easing */
}

/**
 * PageTransition
 *
 * Wrap every page's root element in this component.
 * AnimatePresence in App.jsx drives the enter/exit cycle
 * whenever the route changes.
 *
 * Usage:
 *   export default function Home() {
 *     return (
 *       <PageTransition>
 *         <div className="p-5">...</div>
 *       </PageTransition>
 *     )
 *   }
 *
 * @param {ReactNode} children  — page content
 * @param {string}    className — optional extra classes on the wrapper
 */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      className={`min-h-full ${className}`}
    >
      {children}
    </motion.div>
  )
}
