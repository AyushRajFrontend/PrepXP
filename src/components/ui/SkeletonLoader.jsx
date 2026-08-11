import { cn } from '@/utils/cn'

/**
 * SkeletonLoader
 *
 * A single shimmer block. Compose multiples to mirror
 * the real UI layout while content loads.
 *
 * Props:
 *   className  — Tailwind width / height / border-radius classes
 *   rounded    — shorthand for border-radius (default: 'xl')
 *   count      — render N stacked skeletons with a gap (default: 1)
 *   gap        — Tailwind gap class when count > 1 (default: 'gap-3')
 *
 * Usage:
 *   <SkeletonLoader className="h-6 w-48" />
 *   <SkeletonLoader className="h-40 w-full" rounded="2xl" />
 *   <SkeletonLoader className="h-14 w-full" count={3} />
 */
export default function SkeletonLoader({
  className = '',
  rounded   = 'xl',
  count     = 1,
  gap       = 'gap-3',
}) {
  const base = cn('skeleton', `rounded-${rounded}`, className)

  if (count === 1) {
    return <div className={base} />
  }

  return (
    <div className={cn('flex flex-col', gap)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={base} />
      ))}
    </div>
  )
}
