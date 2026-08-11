import { Link }         from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn }           from '@/utils/cn'

/**
 * SectionHeader — Shared section heading row.
 *
 * Used on Home, Profile, Subjects and any future page
 * that needs a consistent "Title  ·  See all →" header.
 *
 * Props:
 *   title      — section heading text
 *   linkTo     — if provided, renders a "See all" link on the right
 *   linkLabel  — custom link text (default: 'See all')
 *   className  — extra classes on the wrapper row
 */
export default function SectionHeader({
  title,
  linkTo,
  linkLabel  = 'See all',
  className,
}) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      <h2 className="font-display font-bold text-[17px] text-frost leading-tight">
        {title}
      </h2>

      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-0.5
                     text-[13px] font-semibold text-purple
                     active:opacity-60 transition-opacity duration-150"
        >
          {linkLabel}
          <ChevronRight size={14} strokeWidth={2.5} />
        </Link>
      )}
    </div>
  )
}
