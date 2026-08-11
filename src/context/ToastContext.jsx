import { createContext, useContext, useState, useCallback } from 'react'
import { ToastContainer } from '@/components/ui/Toast'

/**
 * ToastContext — App-wide notification system.
 *
 * Usage anywhere in the component tree:
 *
 *   const { toast } = useToast()
 *
 *   toast({ title: 'Lecture Done!', icon: '✅', xp: 25 })
 *   toast({ title: 'Level Up!', icon: '⚡', message: "You're Level 13", duration: 4000 })
 *
 * Toast options:
 *   title    {string}  — bold headline (required)
 *   message  {string}  — secondary line (optional)
 *   icon     {string}  — emoji (optional)
 *   xp       {number}  — XP badge, shown as "+N XP" (optional)
 *   duration {number}  — auto-dismiss ms (default 2800)
 */

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  /* Add a new toast with auto-dismiss */
  const toast = useCallback(({
    title,
    message,
    icon,
    xp       = 0,
    duration = 2800,
  }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`

    setToasts(prev => [
      ...prev,
      { id, title, message, icon, xp },
    ])

    /* Schedule auto-removal */
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  /* Manual dismiss (tap ×) */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Render the toast list outside the main content flow */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

/**
 * useToast — Access the toast function.
 * Must be inside <ToastProvider>.
 */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('[PrepXP] useToast() must be used inside <ToastProvider>')
  }
  return ctx
}
