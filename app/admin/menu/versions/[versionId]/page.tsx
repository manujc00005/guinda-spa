'use client'

import { useRouter, useParams } from 'next/navigation'
import { useAdminAuth } from '../../../hooks/useAdminAuth'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import AdminShell from '../../../components/AdminShell'
import AdminCard from '../../../components/ui/AdminCard'
import AdminButton from '../../../components/ui/AdminButton'
import AdminBadge from '../../../components/ui/AdminBadge'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import type { SnapshotDiff, DiffEntry, DiffChange } from '@/lib/types/menu'

// ============================================================================
// Types
// ============================================================================

interface VersionPublisher {
  id: string
  name: string
  email: string
}

interface VersionDetail {
  id: string
  version: number
  status: 'PUBLISHED' | 'ARCHIVED'
  data: unknown
  changelog: string | null
  publishedAt: string
  createdAt: string
  publisher: VersionPublisher
}

// ============================================================================
// Helpers
// ============================================================================

function statusBadgeVariant(status: string): 'published' | 'archived' | 'draft' {
  switch (status) {
    case 'PUBLISHED':
      return 'published'
    case 'ARCHIVED':
      return 'archived'
    default:
      return 'draft'
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'PUBLISHED':
      return 'Publicada'
    case 'ARCHIVED':
      return 'Archivada'
    default:
      return status
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDiffValue(value: unknown, field: string): string {
  if (value === null || value === undefined) return '(vacio)'

  // LocalizedText objects
  if (typeof value === 'object' && value !== null && 'es' in (value as Record<string, unknown>)) {
    return (value as Record<string, string>).es || '(vacio)'
  }

  // Boolean fields
  if (typeof value === 'boolean') {
    return value ? 'Si' : 'No'
  }

  // Price fields — format as EUR
  if (field.toLowerCase().includes('price') && typeof value === 'number') {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
  }

  // Numbers
  if (typeof value === 'number') {
    return String(value)
  }

  // Strings
  if (typeof value === 'string') {
    return value
  }

  // Fallback
  return JSON.stringify(value)
}

function isDiffEmpty(diff: SnapshotDiff): boolean {
  return (
    diff.added.sections.length === 0 &&
    diff.added.items.length === 0 &&
    diff.added.variants.length === 0 &&
    diff.removed.sections.length === 0 &&
    diff.removed.items.length === 0 &&
    diff.removed.variants.length === 0 &&
    diff.modified.length === 0
  )
}

function diffTypeLabel(type: 'section' | 'item' | 'variant'): string {
  switch (type) {
    case 'section':
      return 'Seccion'
    case 'item':
      return 'Servicio'
    case 'variant':
      return 'Variante'
  }
}

// ============================================================================
// Component
// ============================================================================

export default function VersionDetailPage() {
  const authStatus = useAdminAuth()
  const router = useRouter()
  const params = useParams()
  const versionId = params.versionId as string

  const [version, setVersion] = useState<VersionDetail | null>(null)
  const [diff, setDiff] = useState<SnapshotDiff | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRollbackDialog, setShowRollbackDialog] = useState(false)
  const [rollingBack, setRollingBack] = useState(false)

  // Fetch version detail and diff in parallel
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [versionRes, diffRes] = await Promise.all([
        fetch(`/api/admin/menu/versions/${versionId}`),
        fetch(`/api/admin/menu/versions/${versionId}/diff`),
      ])

      const versionJson = await versionRes.json()
      const diffJson = await diffRes.json()

      if (!versionJson.success) {
        setError(versionJson.error || 'Error al cargar la version')
        return
      }

      setVersion(versionJson.data)

      if (diffJson.success) {
        setDiff(diffJson.data)
      }
    } catch {
      setError('Error de conexion al cargar los datos')
    } finally {
      setLoading(false)
    }
  }, [versionId])

  useEffect(() => {
    if (authStatus === 'authenticated' && versionId) {
      loadData()
    }
  }, [authStatus, versionId, loadData])

  // Rollback handler
  const handleRollback = async () => {
    setRollingBack(true)
    try {
      const res = await fetch(`/api/admin/menu/versions/${versionId}/rollback`, {
        method: 'POST',
      })
      const json = await res.json()
      if (json.success) {
        setShowRollbackDialog(false)
        router.push('/admin/menu/versions')
      } else {
        setError(json.error || 'Error al hacer rollback')
      }
    } catch {
      setError('Error de conexion al hacer rollback')
    } finally {
      setRollingBack(false)
    }
  }

  // Loading state
  if (loading || authStatus === 'loading') {
    return (
      <AdminShell title="Version...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a96e] border-t-transparent" />
        </div>
      </AdminShell>
    )
  }

  // Error state
  if (error || !version) {
    return (
      <AdminShell title="Error">
        <div className="space-y-4">
          <Link
            href="/admin/menu/versions"
            className="inline-flex items-center gap-1.5 text-sm text-[#c9a96e] hover:text-[#b8944f] font-[family-name:var(--font-inter)] transition-colors"
          >
            <span aria-hidden="true">&larr;</span> Volver al historial
          </Link>
          <AdminCard>
            <div className="text-center py-8">
              <p className="text-red-600 font-[family-name:var(--font-inter)]">
                {error || 'No se encontro la version'}
              </p>
              <AdminButton
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => loadData()}
              >
                Reintentar
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title={`Version ${version.version}`}>
      <div className="space-y-6">
        {/* Back link */}
        <Link
          href="/admin/menu/versions"
          className="inline-flex items-center gap-1.5 text-sm text-[#c9a96e] hover:text-[#b8944f] font-[family-name:var(--font-inter)] transition-colors"
        >
          <span aria-hidden="true">&larr;</span> Volver al historial
        </Link>

        {/* Version info card */}
        <AdminCard
          title={`Version ${version.version}`}
          action={
            version.status === 'ARCHIVED' ? (
              <AdminButton
                variant="danger"
                size="sm"
                onClick={() => setShowRollbackDialog(true)}
              >
                Rollback a esta version
              </AdminButton>
            ) : undefined
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <p className="text-xs text-gray-400 font-[family-name:var(--font-inter)] uppercase tracking-wide mb-1">
                  Estado
                </p>
                <AdminBadge
                  variant={statusBadgeVariant(version.status)}
                  label={statusLabel(version.status)}
                />
              </div>

              {/* Published date */}
              <div>
                <p className="text-xs text-gray-400 font-[family-name:var(--font-inter)] uppercase tracking-wide mb-1">
                  Fecha de publicacion
                </p>
                <p className="text-sm text-[#1a1a2e] font-[family-name:var(--font-inter)]">
                  {formatDate(version.publishedAt)}
                </p>
              </div>

              {/* Publisher */}
              <div>
                <p className="text-xs text-gray-400 font-[family-name:var(--font-inter)] uppercase tracking-wide mb-1">
                  Publicado por
                </p>
                <p className="text-sm text-[#1a1a2e] font-[family-name:var(--font-inter)]">
                  {version.publisher.name}
                </p>
              </div>

              {/* Version number */}
              <div>
                <p className="text-xs text-gray-400 font-[family-name:var(--font-inter)] uppercase tracking-wide mb-1">
                  Numero de version
                </p>
                <p className="text-sm text-[#1a1a2e] font-[family-name:var(--font-inter)] font-semibold">
                  v{version.version}
                </p>
              </div>
            </div>

            {/* Changelog */}
            {version.changelog && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-[family-name:var(--font-inter)] uppercase tracking-wide mb-1">
                  Descripcion del cambio
                </p>
                <p className="text-sm text-[#1a1a2e] font-[family-name:var(--font-inter)] bg-gray-50 rounded-md px-3 py-2">
                  {version.changelog}
                </p>
              </div>
            )}
          </div>
        </AdminCard>

        {/* Diff section */}
        <div>
          <h2 className="text-lg font-semibold text-[#1a1a2e] font-[family-name:var(--font-playfair)] mb-4">
            Cambios respecto al borrador actual
          </h2>

          {!diff ? (
            <AdminCard>
              <p className="text-sm text-gray-500 font-[family-name:var(--font-inter)] text-center py-4">
                No se pudo cargar el diff
              </p>
            </AdminCard>
          ) : isDiffEmpty(diff) ? (
            <AdminCard>
              <div className="text-center py-8">
                <p className="text-gray-400 font-[family-name:var(--font-inter)]">
                  Sin cambios
                </p>
                <p className="text-xs text-gray-300 mt-1 font-[family-name:var(--font-inter)]">
                  Esta version es identica al borrador actual
                </p>
              </div>
            </AdminCard>
          ) : (
            <div className="space-y-4">
              {/* Added items */}
              <DiffGroup
                label="Elementos a&ntilde;adidos en el borrador"
                type="added"
                sections={diff.added.sections}
                items={diff.added.items}
                variants={diff.added.variants}
              />

              {/* Removed items */}
              <DiffGroup
                label="Elementos eliminados del borrador"
                type="removed"
                sections={diff.removed.sections}
                items={diff.removed.items}
                variants={diff.removed.variants}
              />

              {/* Modified items */}
              {diff.modified.length > 0 && (
                <AdminCard title="Elementos modificados">
                  <div className="space-y-3">
                    {diff.modified.map((entry) => (
                      <ModifiedEntry key={entry.id} entry={entry} />
                    ))}
                  </div>
                </AdminCard>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rollback confirmation dialog */}
      <ConfirmDialog
        isOpen={showRollbackDialog}
        onConfirm={handleRollback}
        onCancel={() => setShowRollbackDialog(false)}
        title="Rollback a esta version"
        message={`Esto reemplazara el borrador actual con los datos de la version ${version.version}. Los cambios no publicados del borrador se perderan. Esta accion no se puede deshacer.`}
        confirmLabel="Confirmar rollback"
        cancelLabel="Cancelar"
        variant="danger"
        loading={rollingBack}
      />
    </AdminShell>
  )
}

// ============================================================================
// Diff Group (Added / Removed)
// ============================================================================

function DiffGroup({
  label,
  type,
  sections,
  items,
  variants,
}: {
  label: string
  type: 'added' | 'removed'
  sections: string[]
  items: string[]
  variants: string[]
}) {
  const total = sections.length + items.length + variants.length
  if (total === 0) return null

  const borderColor = type === 'added' ? 'border-l-emerald-500' : 'border-l-red-500'
  const bgColor = type === 'added' ? 'bg-emerald-50/50' : 'bg-red-50/50'
  const dotColor = type === 'added' ? 'bg-emerald-500' : 'bg-red-500'
  const tagBg = type === 'added' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'

  return (
    <AdminCard title={label}>
      <div className="space-y-2">
        {sections.map((name) => (
          <div
            key={`section-${name}`}
            className={`flex items-center gap-3 px-3 py-2 rounded-md border-l-4 ${borderColor} ${bgColor}`}
          >
            <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
            <span className="text-sm font-[family-name:var(--font-inter)] text-[#1a1a2e]">
              {name}
            </span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${tagBg}`}>
              Seccion
            </span>
          </div>
        ))}
        {items.map((name) => (
          <div
            key={`item-${name}`}
            className={`flex items-center gap-3 px-3 py-2 rounded-md border-l-4 ${borderColor} ${bgColor}`}
          >
            <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
            <span className="text-sm font-[family-name:var(--font-inter)] text-[#1a1a2e]">
              {name}
            </span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${tagBg}`}>
              Servicio
            </span>
          </div>
        ))}
        {variants.map((name) => (
          <div
            key={`variant-${name}`}
            className={`flex items-center gap-3 px-3 py-2 rounded-md border-l-4 ${borderColor} ${bgColor}`}
          >
            <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
            <span className="text-sm font-[family-name:var(--font-inter)] text-[#1a1a2e]">
              {name}
            </span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${tagBg}`}>
              Variante
            </span>
          </div>
        ))}
      </div>
    </AdminCard>
  )
}

// ============================================================================
// Modified Entry
// ============================================================================

function ModifiedEntry({ entry }: { entry: DiffEntry }) {
  return (
    <div className="border-l-4 border-l-amber-400 bg-amber-50/50 rounded-md px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        <span className="text-sm font-medium font-[family-name:var(--font-inter)] text-[#1a1a2e]">
          {entry.name}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
          {diffTypeLabel(entry.type)}
        </span>
      </div>
      <div className="ml-4 space-y-1.5">
        {entry.changes.map((change, idx) => (
          <ChangeRow key={`${entry.id}-${change.field}-${idx}`} change={change} />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Change Row (field-level old -> new)
// ============================================================================

function ChangeRow({ change }: { change: DiffChange }) {
  const oldDisplay = formatDiffValue(change.oldValue, change.field)
  const newDisplay = formatDiffValue(change.newValue, change.field)

  return (
    <div className="flex items-start gap-2 text-xs font-[family-name:var(--font-inter)]">
      <span className="text-gray-500 font-medium min-w-[100px] shrink-0">
        {change.field}
      </span>
      <span className="text-red-600 line-through">{oldDisplay}</span>
      <span className="text-gray-400" aria-hidden="true">&rarr;</span>
      <span className="text-emerald-700 font-medium">{newDisplay}</span>
    </div>
  )
}
