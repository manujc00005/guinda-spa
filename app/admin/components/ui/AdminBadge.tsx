// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BadgeVariant = 'published' | 'draft' | 'archived' | 'error' | 'info'

interface AdminBadgeProps {
  variant: BadgeVariant
  /** Text label shown inside the badge */
  label: string
  /** Extra Tailwind classes */
  className?: string
}

// ---------------------------------------------------------------------------
// Variant colours
// ---------------------------------------------------------------------------

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  published: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  draft: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500',
  },
  archived: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminBadge({
  variant,
  label,
  className = '',
}: AdminBadgeProps) {
  const style = variantStyles[variant]

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        'font-[family-name:var(--font-inter)]',
        style.bg,
        style.text,
        className,
      ].join(' ')}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}
