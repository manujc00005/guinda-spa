import { type ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AdminCardProps {
  /** Card heading */
  title?: string
  /** Smaller text below the heading */
  subtitle?: string
  /** Slot rendered on the right of the header row (e.g. a button) */
  action?: ReactNode
  /** Card body */
  children: ReactNode
  /** Extra Tailwind classes on the outer wrapper */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminCard({
  title,
  subtitle,
  action,
  children,
  className = '',
}: AdminCardProps) {
  const hasHeader = title || subtitle || action

  return (
    <div
      className={[
        'bg-white rounded-lg shadow-sm border border-gray-100',
        className,
      ].join(' ')}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
          <div className="min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-[#1a1a2e] font-[family-name:var(--font-playfair)]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-gray-500 font-[family-name:var(--font-inter)]">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>
    </div>
  )
}
