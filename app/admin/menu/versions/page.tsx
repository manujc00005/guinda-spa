'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import Link from 'next/link'
import AdminShell from '../../components/AdminShell'
import AdminCard from '../../components/ui/AdminCard'
import AdminButton from '../../components/ui/AdminButton'
import AdminBadge from '../../components/ui/AdminBadge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useToast } from '../../components/ui/AdminToast'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Publisher {
  id: string
  name: string
  email: string
}

interface MenuVersion {
  id: string
  version: number
  status: 'PUBLISHED' | 'ARCHIVED'
  changelog: string | null
  publishedAt: string | null
  createdAt: string
  publisher: Publisher | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function truncate(text: string | null, maxLen = 80): string {
  if (!text) return '--'
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '...'
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function VersionHistoryPage() {
  const status = useAdminAuth()
  const router = useRouter()
  const { addToast } = useToast()

  const [versions, setVersions] = useState<MenuVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Rollback state
  const [rollbackTarget, setRollbackTarget] = useState<MenuVersion | null>(null)
  const [rollbackLoading, setRollbackLoading] = useState(false)

  // -------------------------------------------------------------------------
  // Auth guard
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Fetch versions
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (status === 'authenticated') {
      loadVersions()
    }
  }, [status])

  async function loadVersions() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/menu/versions')
      const json = await res.json()
      if (json.success) {
        setVersions(json.data || [])
      } else {
        setError(json.error || 'Error al cargar las versiones')
      }
    } catch {
      setError('Error de conexion al cargar las versiones')
    } finally {
      setLoading(false)
    }
  }

  // -------------------------------------------------------------------------
  // Rollback handler
  // -------------------------------------------------------------------------

  async function handleRollback() {
    if (!rollbackTarget) return
    setRollbackLoading(true)
    try {
      const res = await fetch(
        `/api/admin/menu/versions/${rollbackTarget.id}/rollback`,
        { method: 'POST' },
      )
      const json = await res.json()
      if (json.success) {
        addToast(
          'success',
          `Rollback a v${rollbackTarget.version} realizado correctamente`,
        )
        setRollbackTarget(null)
        router.push('/admin/menu')
      } else {
        addToast('error', json.error || 'Error al realizar el rollback')
      }
    } catch {
      addToast('error', 'Error de conexion al realizar el rollback')
    } finally {
      setRollbackLoading(false)
    }
  }

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------

  if (status === 'loading' || loading) {
    return (
      <AdminShell title="Historial de Versiones">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a96e] border-t-transparent" />
        </div>
      </AdminShell>
    )
  }

  // -------------------------------------------------------------------------
  // Error state
  // -------------------------------------------------------------------------

  if (error) {
    return (
      <AdminShell title="Historial de Versiones">
        <div className="text-center py-12">
          <p className="text-red-500 font-[family-name:var(--font-inter)]">
            {error}
          </p>
          <AdminButton
            variant="secondary"
            className="mt-4"
            onClick={loadVersions}
          >
            Reintentar
          </AdminButton>
        </div>
      </AdminShell>
    )
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <AdminShell title="Historial de Versiones">
      <div className="space-y-6">
        {/* Header with back link */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#1a1a2e] font-[family-name:var(--font-playfair)]">
            Historial de Versiones
          </h1>
          <Link href="/admin/menu">
            <AdminButton variant="secondary" size="sm">
              Volver al editor
            </AdminButton>
          </Link>
        </div>

        {/* Empty state */}
        {versions.length === 0 ? (
          <AdminCard>
            <div className="text-center py-12">
              <div className="text-4xl mb-4 text-gray-300">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-[family-name:var(--font-inter)]">
                No hay versiones publicadas todavia.
              </p>
              <p className="text-sm text-gray-400 mt-1 font-[family-name:var(--font-inter)]">
                Las versiones apareceran aqui cuando publiques cambios en la
                carta.
              </p>
            </div>
          </AdminCard>
        ) : (
          <>
            {/* Desktop table view */}
            <AdminCard className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-[family-name:var(--font-inter)]">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400">
                      <th className="pb-3 pr-4 font-medium">Version</th>
                      <th className="pb-3 pr-4 font-medium">Estado</th>
                      <th className="pb-3 pr-4 font-medium">
                        Fecha de publicacion
                      </th>
                      <th className="pb-3 pr-4 font-medium">Publicado por</th>
                      <th className="pb-3 pr-4 font-medium">Cambios</th>
                      <th className="pb-3 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {versions.map((v) => (
                      <tr
                        key={v.id}
                        className="group hover:bg-gray-50/60 transition-colors"
                      >
                        {/* Version number */}
                        <td className="py-3 pr-4">
                          <span className="font-semibold text-[#1a1a2e]">
                            v{v.version}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="py-3 pr-4">
                          <AdminBadge
                            variant={
                              v.status === 'PUBLISHED'
                                ? 'published'
                                : 'archived'
                            }
                            label={
                              v.status === 'PUBLISHED'
                                ? 'Publicada'
                                : 'Archivada'
                            }
                          />
                        </td>

                        {/* Published date */}
                        <td className="py-3 pr-4 text-sm text-gray-600">
                          {formatDate(v.publishedAt)}
                        </td>

                        {/* Publisher name */}
                        <td className="py-3 pr-4 text-sm text-gray-600">
                          {v.publisher?.name || '--'}
                        </td>

                        {/* Changelog */}
                        <td
                          className="py-3 pr-4 text-sm text-gray-500 max-w-[200px]"
                          title={v.changelog || undefined}
                        >
                          {truncate(v.changelog)}
                        </td>

                        {/* Actions */}
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/menu/versions/${v.id}`}
                            >
                              <AdminButton variant="ghost" size="sm">
                                Ver diff
                              </AdminButton>
                            </Link>
                            {v.status === 'ARCHIVED' && (
                              <AdminButton
                                variant="secondary"
                                size="sm"
                                onClick={() => setRollbackTarget(v)}
                              >
                                Rollback
                              </AdminButton>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AdminCard>

            {/* Mobile card view */}
            <div className="md:hidden space-y-3">
              {versions.map((v) => (
                <AdminCard key={v.id}>
                  <div className="space-y-3">
                    {/* Top row: version + badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1a1a2e] font-[family-name:var(--font-playfair)] text-lg">
                        v{v.version}
                      </span>
                      <AdminBadge
                        variant={
                          v.status === 'PUBLISHED' ? 'published' : 'archived'
                        }
                        label={
                          v.status === 'PUBLISHED' ? 'Publicada' : 'Archivada'
                        }
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-1 text-sm font-[family-name:var(--font-inter)]">
                      <p className="text-gray-500">
                        <span className="text-gray-400">Fecha:</span>{' '}
                        {formatDate(v.publishedAt)}
                      </p>
                      <p className="text-gray-500">
                        <span className="text-gray-400">Por:</span>{' '}
                        {v.publisher?.name || '--'}
                      </p>
                      {v.changelog && (
                        <p
                          className="text-gray-500 italic"
                          title={v.changelog}
                        >
                          &ldquo;{truncate(v.changelog, 60)}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <Link href={`/admin/menu/versions/${v.id}`}>
                        <AdminButton variant="ghost" size="sm">
                          Ver diff
                        </AdminButton>
                      </Link>
                      {v.status === 'ARCHIVED' && (
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          onClick={() => setRollbackTarget(v)}
                        >
                          Rollback
                        </AdminButton>
                      )}
                    </div>
                  </div>
                </AdminCard>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Rollback confirmation dialog */}
      <ConfirmDialog
        isOpen={!!rollbackTarget}
        onConfirm={handleRollback}
        onCancel={() => setRollbackTarget(null)}
        title="Confirmar rollback"
        message={
          rollbackTarget
            ? `Vas a restaurar la version v${rollbackTarget.version}. Esto reemplazara el borrador actual con el contenido de esta version. ¿Deseas continuar?`
            : ''
        }
        confirmLabel="Restaurar version"
        cancelLabel="Cancelar"
        variant="warning"
        loading={rollbackLoading}
      />
    </AdminShell>
  )
}
