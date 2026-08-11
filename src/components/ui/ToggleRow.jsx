import { useState } from 'react'
import Toggle       from './Toggle'
import { cn }       from '@/utils/cn'

/**
 * ToggleRow — A settings row with label, optional description, and a Toggle.
 *
 * Supports both uncontrolled (defaultChecked) and controlled (checked + onChange)
 * usage patterns. When controlled props are passed, internal state is bypassed.
 *
 * Used by composing inside a SettingsSection card, which handles
 * the divider lines between rows via `divide-y`.
 *
 * Props:
 *   label           — primary row text
 *   description     — optional secondary text below the label
 *   checked         — controlled: current value
 *   onChange        — controlled: (value: boolean) => void
 *   defaultChecked  — uncontrolled: initial state (default false)
 *   disabled        — pass through to Toggle
 *   badge           — optional small pill text beside the label ('Beta', 'New', 'Soon')
 */
export default function ToggleRow({
  label,
  description,
  checked,
  onChange,
  defaultChecked = false,
  disabled       = false,
  badge,
}) {
  /* ── Uncontrolled internal state ── */
  const [internal, setInternal] = useState(defaultChecked)

  const isControlled  = checked !== undefined
  const value         = isControlled ? checked : internal

  const handleChange  = (next) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      {/* Left: label + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-[13.5px] font-medium leading-snug',
            disabled ? 'text-mist' : 'text-frost',
          )}>
            {label}
          </span>

          {/* Optional badge (e.g. 'Beta', 'Soon') */}
          {badge && (
            <span className="text-[9px] font-bold uppercase tracking-wide
                             text-purple bg-purple/10 border border-purple/20
                             px-1.5 py-px rounded-full leading-none">
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="text-[11.5px] text-mist mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>

      {/* Right: toggle */}
      <Toggle
        checked={value}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  )
}
