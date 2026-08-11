import { clsx }    from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn — Merge Tailwind classes safely.
 *
 * Combines clsx (conditional classes) with tailwind-merge
 * (resolves conflicts like `p-4 p-2` → `p-2`).
 *
 * Usage:
 *   cn('p-4 text-sm', isActive && 'text-purple', className)
 *
 * @param  {...any} inputs — any clsx-compatible inputs
 * @returns {string}       — merged, deduplicated class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
