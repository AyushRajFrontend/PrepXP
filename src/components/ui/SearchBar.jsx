import { Search, X } from 'lucide-react'
import { cn }        from '@/utils/cn'

/**
 * SearchBar — Reusable glass search input.
 *
 * Used on Subjects, Chapters, and future search pages.
 * Glows purple on focus. Shows a clear (×) button when text is present.
 *
 * Props:
 *   value       — controlled input value
 *   onChange    — (value: string) => void
 *   placeholder — input placeholder text
 *   className   — extra classes on the wrapper
 *   autoFocus   — focus on mount
 */
export default function SearchBar({
  value        = '',
  onChange,
  placeholder  = 'Search…',
  className,
  autoFocus    = false,
}) {
  return (
    <div className={cn('relative flex items-center', className)}>
      {/* Search icon */}
      <Search
        size={15}
        strokeWidth={2}
        className="absolute left-3.5 text-mist pointer-events-none z-10 flex-shrink-0"
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          /* Layout */
          'w-full pl-10 py-3 rounded-xl',
          /* Right padding: extra when clear btn visible */
          value ? 'pr-9' : 'pr-4',
          /* Look */
          'bg-card border border-white/[0.08]',
          'text-[13.5px] text-frost',
          'placeholder:text-dim',
          /* Focus ring */
          'outline-none',
          'focus:border-purple/40 focus:ring-1 focus:ring-purple/15',
          /* Motion */
          'transition-all duration-200',
        )}
      />

      {/* Clear button — only visible when there's text */}
      {value && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          aria-label="Clear search"
          className="absolute right-3 text-mist hover:text-frost
                     active:scale-90 transition-all duration-150"
        >
          <X size={15} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
