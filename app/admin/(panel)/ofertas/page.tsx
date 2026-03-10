'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { useToast } from '../../components/ui/AdminToast'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Oferta {
  id: string
  titulo: string
  descripcion: string
  precio: string
  detalle: string | null
  ctaLabel: string
  ctaHref: string
  destacado: boolean
  activo: boolean
  orden: number
}

type FormData = {
  titulo: string
  descripcion: string
  precio: string
  detalle: string
  ctaLabel: string
  ctaHref: string
  destacado: boolean
  activo: boolean
}

const EMPTY_FORM: FormData = {
  titulo: '',
  descripcion: '',
  precio: '',
  detalle: '',
  ctaLabel: 'Reservar',
  ctaHref: '#reservar',
  destacado: false,
  activo: true,
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function OfertasPage() {
  const status = useAdminAuth()
  const { addToast } = useToast()
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [loading, setLoading] = useState(true)
  const [editingOferta, setEditingOferta] = useState<Oferta | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deletingOferta, setDeletingOferta] = useState<Oferta | null>(null)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/ofertas')
      const json = await res.json()
      if (json.success) setOfertas(json.data)
      else addToast('error', 'Error al cargar las ofertas')
    } catch {
      addToast('error', 'Error al cargar las ofertas')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    if (status === 'authenticated') loadData()
  }, [status, loadData])

  const handleMoveUp = async (oferta: Oferta) => {
    const idx = ofertas.findIndex((o) => o.id === oferta.id)
    if (idx === 0) return
    const prev = ofertas[idx - 1]
    try {
      await Promise.all([
        fetch(`/api/admin/ofertas/${oferta.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orden: prev.orden }),
        }),
        fetch(`/api/admin/ofertas/${prev.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orden: oferta.orden }),
        }),
      ])
      loadData()
    } catch {
      addToast('error', 'Error al reordenar')
    }
  }

  const handleMoveDown = async (oferta: Oferta) => {
    const idx = ofertas.findIndex((o) => o.id === oferta.id)
    if (idx === ofertas.length - 1) return
    const next = ofertas[idx + 1]
    try {
      await Promise.all([
        fetch(`/api/admin/ofertas/${oferta.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orden: next.orden }),
        }),
        fetch(`/api/admin/ofertas/${next.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orden: oferta.orden }),
        }),
      ])
      loadData()
    } catch {
      addToast('error', 'Error al reordenar')
    }
  }

  const handleToggleActivo = async (oferta: Oferta) => {
    try {
      const res = await fetch(`/api/admin/ofertas/${oferta.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !oferta.activo }),
      })
      const json = await res.json()
      if (json.success) {
        addToast('success', oferta.activo ? 'Oferta ocultada' : 'Oferta publicada')
        loadData()
      } else {
        addToast('error', 'Error al actualizar')
      }
    } catch {
      addToast('error', 'Error al actualizar')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#c9a96e] border-t-transparent mx-auto mb-4" />
          <p className="text-[#1a1a2e]/60 text-sm tracking-widest uppercase">Cargando ofertas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#e5e2db] py-6 sm:py-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-1">
          <span className="h-px w-16 bg-[#c9a96e]/40" />
          <span className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase font-medium">Administracion</span>
          <span className="h-px w-16 bg-[#c9a96e]/40" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1a1a2e] tracking-wide uppercase">
          Ofertas & Packs
        </h2>
        <p className="text-xs text-[#1a1a2e]/40 mt-1">
          Gestiona las ofertas que aparecen en la web
        </p>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Offer Cards Grid */}
        {ofertas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5e2db] p-12 text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#c9a96e]/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-[#c9a96e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <h3 className="font-serif text-lg text-[#1a1a2e] mb-1">Sin ofertas todavia</h3>
            <p className="text-sm text-[#1a1a2e]/50">Crea la primera oferta con el boton de abajo.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3 mb-6">
            {ofertas.map((oferta, idx) => (
              <OfertaCard
                key={oferta.id}
                oferta={oferta}
                isFirst={idx === 0}
                isLast={idx === ofertas.length - 1}
                onEdit={() => setEditingOferta(oferta)}
                onDelete={() => setDeletingOferta(oferta)}
                onToggleActivo={() => handleToggleActivo(oferta)}
                onMoveUp={() => handleMoveUp(oferta)}
                onMoveDown={() => handleMoveDown(oferta)}
              />
            ))}
          </div>
        )}

        {/* Add New Offer Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full py-4 border-2 border-dashed border-[#c9a96e]/30 rounded-2xl text-[#c9a96e] hover:border-[#c9a96e]/60 hover:bg-[#c9a96e]/5 transition-all text-sm tracking-widest uppercase flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva oferta
        </button>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <OfertaModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSaved={() => { setShowCreateModal(false); loadData() }}
          addToast={addToast}
        />
      )}

      {editingOferta && (
        <OfertaModal
          mode="edit"
          oferta={editingOferta}
          onClose={() => setEditingOferta(null)}
          onSaved={() => { setEditingOferta(null); loadData() }}
          addToast={addToast}
        />
      )}

      {deletingOferta && (
        <ConfirmModal
          title="Eliminar oferta"
          message={`Se eliminara "${deletingOferta.titulo}" permanentemente. Esta accion no se puede deshacer.`}
          confirmLabel="Eliminar"
          onCancel={() => setDeletingOferta(null)}
          onConfirm={async () => {
            const res = await fetch(`/api/admin/ofertas/${deletingOferta.id}`, { method: 'DELETE' })
            const json = await res.json()
            if (json.success) {
              addToast('success', `"${deletingOferta.titulo}" eliminada`)
              setDeletingOferta(null)
              loadData()
            } else {
              addToast('error', 'Error al eliminar')
            }
          }}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// OfertaCard — card preview matching the public site look
// ---------------------------------------------------------------------------

function OfertaCard({
  oferta,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onToggleActivo,
  onMoveUp,
  onMoveDown,
}: {
  oferta: Oferta
  isFirst: boolean
  isLast: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleActivo: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  return (
    <div
      className={[
        'relative flex flex-col rounded-2xl border transition-all',
        oferta.destacado
          ? 'bg-white border-2 border-[#c9a96e]/40 shadow-lg'
          : 'bg-white border border-[#e5e2db] shadow-sm',
        !oferta.activo ? 'opacity-50' : '',
      ].join(' ')}
    >
      {/* Destacado badge */}
      {oferta.destacado && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-[#d4b483] to-[#c9a96e] text-xs font-semibold tracking-wide text-white shadow-sm">
            Experiencia completa
          </span>
        </div>
      )}

      {/* Card content */}
      <div className="flex-1 p-6 space-y-3">
        {/* Status badge */}
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full ${oferta.activo ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {oferta.activo ? 'Publicada' : 'Oculta'}
          </span>
          {/* Order arrows */}
          <div className="flex gap-1">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1 rounded hover:bg-[#f8f7f4] text-[#1a1a2e]/30 hover:text-[#1a1a2e]/70 disabled:opacity-20 transition-colors"
              title="Subir"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1 rounded hover:bg-[#f8f7f4] text-[#1a1a2e]/30 hover:text-[#1a1a2e]/70 disabled:opacity-20 transition-colors"
              title="Bajar"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>
        </div>

        <h3 className="text-lg font-serif font-semibold text-[#1a1a2e] leading-tight">{oferta.titulo}</h3>
        <p className="text-sm text-[#1a1a2e]/60 leading-relaxed line-clamp-3">{oferta.descripcion}</p>

        <div className="flex items-baseline gap-2 pt-1">
          <span className={`text-2xl font-serif font-semibold ${oferta.destacado ? 'text-[#c9a96e]' : 'text-[#1a1a2e]'}`}>
            {oferta.precio}
          </span>
          {oferta.detalle && (
            <span className="text-xs text-[#1a1a2e]/40">{oferta.detalle}</span>
          )}
        </div>

        <div className="pt-1">
          <div className="w-full text-center text-xs px-4 py-2 rounded-full border border-[#c9a96e]/40 text-[#c9a96e]">
            {oferta.ctaLabel}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="border-t border-[#e5e2db] px-4 py-3 flex items-center justify-between gap-2">
        <button
          onClick={onToggleActivo}
          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
            oferta.activo
              ? 'text-[#1a1a2e]/50 hover:bg-gray-50 hover:text-[#1a1a2e]'
              : 'text-green-600 hover:bg-green-50'
          }`}
        >
          {oferta.activo ? 'Ocultar' : 'Publicar'}
        </button>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-xs px-3 py-1.5 rounded-lg text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors font-medium"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="text-xs px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// OfertaModal — create or edit an offer
// ---------------------------------------------------------------------------

function OfertaModal({
  mode,
  oferta,
  onClose,
  onSaved,
  addToast,
}: {
  mode: 'create' | 'edit'
  oferta?: Oferta
  onClose: () => void
  onSaved: () => void
  addToast: (type: 'success' | 'error', msg: string) => void
}) {
  const [form, setForm] = useState<FormData>(
    oferta
      ? {
          titulo: oferta.titulo,
          descripcion: oferta.descripcion,
          precio: oferta.precio,
          detalle: oferta.detalle ?? '',
          ctaLabel: oferta.ctaLabel,
          ctaHref: oferta.ctaHref,
          destacado: oferta.destacado,
          activo: oferta.activo,
        }
      : { ...EMPTY_FORM }
  )
  const [saving, setSaving] = useState(false)

  const set = (key: keyof FormData, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSave = async () => {
    if (!form.titulo.trim() || !form.descripcion.trim() || !form.precio.trim()) {
      addToast('error', 'Titulo, descripcion y precio son obligatorios')
      return
    }
    setSaving(true)
    try {
      const url = mode === 'create' ? '/api/admin/ofertas' : `/api/admin/ofertas/${oferta!.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          detalle: form.detalle.trim() || null,
        }),
      })
      const json = await res.json()
      if (json.success) {
        addToast('success', mode === 'create' ? 'Oferta creada correctamente' : 'Cambios guardados. La web se ha actualizado.')
        onSaved()
      } else {
        addToast('error', json.error || 'Error al guardar')
      }
    } catch {
      addToast('error', 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5e2db] flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="font-serif text-lg text-[#1a1a2e]">
            {mode === 'create' ? 'Nueva oferta' : 'Editar oferta'}
          </h3>
          <button onClick={onClose} className="text-[#1a1a2e]/30 hover:text-[#1a1a2e] text-xl leading-none">&times;</button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5">

          {/* Titulo */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">
              Titulo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => set('titulo', e.target.value)}
              placeholder="Ej: Experiencia Dia Completo"
              className="w-full border border-[#e5e2db] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]"
              autoFocus
            />
          </div>

          {/* Descripcion */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">
              Descripcion <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              placeholder="Describe lo que incluye la oferta..."
              rows={3}
              className="w-full border border-[#e5e2db] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e] resize-none"
            />
          </div>

          {/* Precio + Detalle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">
                Precio <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.precio}
                onChange={(e) => set('precio', e.target.value)}
                placeholder="Ej: 240€ o desde 50€"
                className="w-full border border-[#e5e2db] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">
                Detalle <span className="text-[#1a1a2e]/30 text-xs">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.detalle}
                onChange={(e) => set('detalle', e.target.value)}
                placeholder="Ej: 4 horas aprox."
                className="w-full border border-[#e5e2db] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]"
              />
            </div>
          </div>

          {/* CTA Label + Href */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Texto del boton</label>
              <input
                type="text"
                value={form.ctaLabel}
                onChange={(e) => set('ctaLabel', e.target.value)}
                placeholder="Reservar"
                className="w-full border border-[#e5e2db] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Enlace del boton</label>
              <input
                type="text"
                value={form.ctaHref}
                onChange={(e) => set('ctaHref', e.target.value)}
                placeholder="#reservar"
                className="w-full border border-[#e5e2db] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-1">
            <Toggle
              label="Destacada"
              description="Resalta esta oferta con borde dorado y badge especial"
              checked={form.destacado}
              onChange={(v) => set('destacado', v)}
            />
            <Toggle
              label="Publicada"
              description="Visible en la web publica"
              checked={form.activo}
              onChange={(v) => set('activo', v)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e5e2db] flex justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#1a1a2e]/60 hover:text-[#1a1a2e] rounded-lg hover:bg-[#f8f7f4] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-[#c9a96e] text-white rounded-lg hover:bg-[#b8963f] transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />}
            {mode === 'create' ? 'Crear oferta' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

// ---------------------------------------------------------------------------
// Toggle — reusable toggle switch
// ---------------------------------------------------------------------------

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 px-3 rounded-lg hover:bg-[#f8f7f4] transition-colors">
      <div>
        <p className="text-sm font-medium text-[#1a1a2e]/80">{label}</p>
        <p className="text-xs text-[#1a1a2e]/40">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-[#c9a96e]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ConfirmModal
// ---------------------------------------------------------------------------

function ConfirmModal({
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string
  message: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => Promise<void>
}) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <Overlay onClose={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4">
        <div className="px-6 py-4 border-b border-[#e5e2db]">
          <h3 className="font-serif text-lg text-[#1a1a2e]">{title}</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-[#1a1a2e]/60">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-[#e5e2db] flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm text-[#1a1a2e]/60 hover:text-[#1a1a2e] rounded-lg hover:bg-[#f8f7f4] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-5 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {loading && <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

// ---------------------------------------------------------------------------
// Overlay
// ---------------------------------------------------------------------------

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {children}
    </div>
  )
}
