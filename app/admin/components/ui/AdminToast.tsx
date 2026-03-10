'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
}

// ---------------------------------------------------------------------------
// Styles per type
// ---------------------------------------------------------------------------

const typeStyles: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: { bg: 'bg-emerald-50', icon: '✓', border: 'border-emerald-400' },
  error: { bg: 'bg-red-50', icon: '✕', border: 'border-red-400' },
  warning: { bg: 'bg-yellow-50', icon: '!', border: 'border-yellow-400' },
  info: { bg: 'bg-blue-50', icon: 'i', border: 'border-blue-400' },
}

const typeTextColor: Record<ToastType, string> = {
  success: 'text-emerald-800',
  error: 'text-red-800',
  warning: 'text-yellow-800',
  info: 'text-blue-800',
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null)

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>')
  }
  return ctx
}

// ---------------------------------------------------------------------------
// Single toast item
// ---------------------------------------------------------------------------

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast
  onRemove: (id: string) => void
}) {
  const style = typeStyles[toast.type]
  const textColor = typeTextColor[toast.type]
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(toast.id), 4000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [toast.id, onRemove])

  return (
    <div
      role="alert"
      className={[
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md',
        'font-[family-name:var(--font-inter)] text-sm',
        'animate-[slideIn_200ms_ease-out]',
        style.bg,
        style.border,
        textColor,
      ].join(' ')}
    >
      <span
        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-white/60"
        aria-hidden="true"
      >
        {style.icon}
      </span>

      <span className="flex-1">{toast.message}</span>

      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors"
        aria-label="Cerrar"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

let toastCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${++toastCounter}-${Date.now()}`
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Toast container — fixed in the top-right corner */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-auto"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext>
  )
}
