import { motion, LayoutGroup } from 'framer-motion'
import { cn }                  from '@/utils/cn'

/**
 * FilterTabs — Horizontal scrollable pill-tab filter.
 *
 * The active tab background uses Framer Motion's layoutId="filter-bg"
 * so it smoothly morphs (slides + scales) between tabs instead of
 * jumping — a single line of logic, premium feel.
 *
 * On mobile the tab row scrolls horizontally without a visible scrollbar.
 *
 * Props:
 *   tabs      — [{ id: string, label: string, count?: number }]
 *   active    — id of the currently active tab
 *   onChange  — (id: string) => void
 *   className — extra classes on the outer wrapper
 *
 * Usage:
 *   const TABS = [
 *     { id: 'all',   label: 'All' },
 *     { id: 'weak',  label: 'Needs Attention', count: 2 },
 *   ]
 *   <FilterTabs tabs={TABS} active={tab} onChange={setTab} />
 */
export default function FilterTabs({ tabs = [], active, onChange, className }) {
  return (
    /* LayoutGroup scopes the layoutId so multiple FilterTabs
       on the same page don't conflict with each other.      */
    <LayoutGroup id={`filter-tabs-${active}`}>
      <div
        role="tablist"
        className={cn('flex gap-2 overflow-x-auto pb-0.5', className)}
        /* Hide scrollbar cross-browser */
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map(tab => {
          const isActive = tab.id === active

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange?.(tab.id)}
              className={cn(
                /* Base */
                'relative flex-shrink-0 flex items-center gap-1.5',
                'px-4 py-2 rounded-full',
                'text-[12.5px] font-semibold',
                'transition-colors duration-200',
                'active:scale-95',
                /* Inactive look */
                !isActive && 'text-mist bg-white/[0.04] border border-white/[0.07]',
                /* Active: white text (gradient bg provides color) */
                isActive && 'text-white',
              )}
            >
              {/* Gradient pill background — morphs between buttons */}
              {isActive && (
                <motion.span
                  layoutId="filter-bg"
                  aria-hidden="true"
                  className="absolute inset-0 gradient-brand rounded-full"
                  style={{ zIndex: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}

              {/* Label */}
              <span className="relative" style={{ zIndex: 1 }}>
                {tab.label}
              </span>

              {/* Optional count badge */}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'relative text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/[0.07] text-dim',
                  )}
                  style={{ zIndex: 1 }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
