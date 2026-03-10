'use client'

import AdminModal from './AdminModal'
import AdminButton from './AdminButton'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ConfirmVariant = 'danger' | 'warning' | 'info'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

// ---------------------------------------------------------------------------
// Variant → icon + button mapping
// ---------------------------------------------------------------------------

const icons: Record<ConfirmVariant, { emoji: string; bg: string }> = {
  danger: { emoji: '⚠', bg: 'bg-red-100 text-red-600' },
  warning: { emoji: '⚡', bg: 'bg-yellow-100 text-yellow-600' },
  info: { emoji: 'ℹ', bg: 'bg-blue-100 text-blue-600' },
}

const confirmButtonVariant: Record<ConfirmVariant, 'danger' | 'primary'> = {
  danger: 'danger',
  warning: 'primary',
  info: 'primary',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const icon = icons[variant]

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onCancel}
      maxWidth="max-w-md"
      footer={
        <>
          <AdminButton variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={confirmButtonVariant[variant]}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </AdminButton>
        </>
      }
    >
      <div className="flex gap-4 items-start">
        <div
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${icon.bg}`}
          aria-hidden="true"
        >
          {icon.emoji}
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#1a1a2e] font-[family-name:var(--font-playfair)]">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 font-[family-name:var(--font-inter)]">
            {message}
          </p>
        </div>
      </div>
    </AdminModal>
  )
}
