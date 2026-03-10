'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdminAuth } from '../hooks/useAdminAuth'
import AdminShell from '../components/AdminShell'
import AdminCard from '../components/ui/AdminCard'
import AdminButton from '../components/ui/AdminButton'
import AdminBadge from '../components/ui/AdminBadge'
import AdminModal from '../components/ui/AdminModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import LocalizedInput from '../components/menu/LocalizedInput'
import LocalizedTextarea from '../components/menu/LocalizedTextarea'
import PriceInput from '../components/menu/PriceInput'
import DurationInput from '../components/menu/DurationInput'
import { useToast } from '../components/ui/AdminToast'
import type { LocalizedText } from '@/lib/types/menu'

interface Section {
  id: string
  slug: string
  name: LocalizedText
  description: LocalizedText | null
  subtitle: LocalizedText | null
  displayOrder: number
  isActive: boolean
  type: string
  icon: string | null
  parentId: string | null
  _count?: { items: number }
  items?: Item[]
  notes?: Note[]
  children?: Section[]
}

interface Item {
  id: string
  slug: string
  name: LocalizedText
  description: LocalizedText | null
  shortDescription: LocalizedText | null
  displayOrder: number
  isActive: boolean
  tags: string[] | null
  savingsLabel: LocalizedText | null
  totalDuration: string | null
  variants?: Variant[]
  notes?: Note[]
}

interface Variant {
  id: string
  label: LocalizedText
  duration: number | null
  durationUnit: string
  price: number
  notes: LocalizedText | null
  displayOrder: number
  isActive: boolean
}

interface Note {
  id: string
  content: LocalizedText
  displayOrder: number
  style: string
  parentType: string
}

type SelectedNode =
  | { type: 'section'; data: Section }
  | { type: 'item'; data: Item; sectionId: string }
  | null

export default function MenuEditorPage() {
  const status = useAdminAuth()
  const { addToast } = useToast()

  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<SelectedNode>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [publishing, setPublishing] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [changelog, setChangelog] = useState('')
  const [saving, setSaving] = useState(false)

  const loadSections = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/menu/sections?includeInactive=true')
      const json = await res.json()
      if (json.success) {
        setSections(json.data || [])
      }
    } catch (err) {
      addToast('error', 'Error al cargar las secciones')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    if (status === 'authenticated') {
      loadSections()
    }
  }, [status, loadSections])

  const loadSectionDetail = async (sectionId: string) => {
    const res = await fetch(`/api/admin/menu/sections/${sectionId}`)
    const json = await res.json()
    if (json.success) {
      return json.data as Section
    }
    return null
  }

  const loadItemDetail = async (itemId: string) => {
    const res = await fetch(`/api/admin/menu/items/${itemId}`)
    const json = await res.json()
    if (json.success) {
      return json.data as Item
    }
    return null
  }

  const handleSelectSection = async (section: Section) => {
    const detail = await loadSectionDetail(section.id)
    if (detail) {
      setSelected({ type: 'section', data: detail })
    }
  }

  const handleSelectItem = async (item: Item, sectionId: string) => {
    const detail = await loadItemDetail(item.id)
    if (detail) {
      setSelected({ type: 'item', data: detail, sectionId })
    }
  }

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSaveSection = async (sectionId: string, updates: Partial<Section>) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/menu/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const json = await res.json()
      if (json.success) {
        addToast('success', 'Sección guardada')
        await loadSections()
        const detail = await loadSectionDetail(sectionId)
        if (detail) setSelected({ type: 'section', data: detail })
      } else {
        addToast('error', json.error || 'Error al guardar')
      }
    } catch {
      addToast('error', 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveItem = async (itemId: string, updates: Partial<Item>) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/menu/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const json = await res.json()
      if (json.success) {
        addToast('success', 'Servicio guardado')
        await loadSections()
        if (selected?.type === 'item') {
          const detail = await loadItemDetail(itemId)
          if (detail) setSelected({ type: 'item', data: detail, sectionId: selected.sectionId })
        }
      } else {
        addToast('error', json.error || 'Error al guardar')
      }
    } catch {
      addToast('error', 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveVariant = async (variantId: string, updates: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/menu/variants/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const json = await res.json()
      if (json.success) {
        addToast('success', 'Variante guardada')
        if (selected?.type === 'item') {
          const detail = await loadItemDetail(selected.data.id)
          if (detail) setSelected({ type: 'item', data: detail, sectionId: selected.sectionId })
        }
      } else {
        addToast('error', json.error || 'Error al guardar')
      }
    } catch {
      addToast('error', 'Error al guardar variante')
    }
  }

  const handleCreateVariant = async (itemId: string) => {
    try {
      const res = await fetch('/api/admin/menu/variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          label: { es: 'Nueva variante' },
          price: 0,
        }),
      })
      const json = await res.json()
      if (json.success) {
        addToast('success', 'Variante creada')
        if (selected?.type === 'item') {
          const detail = await loadItemDetail(selected.data.id)
          if (detail) setSelected({ type: 'item', data: detail, sectionId: selected.sectionId })
        }
      }
    } catch {
      addToast('error', 'Error al crear variante')
    }
  }

  const handleDeleteVariant = async (variantId: string) => {
    try {
      const res = await fetch(`/api/admin/menu/variants/${variantId}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        addToast('success', 'Variante eliminada')
        if (selected?.type === 'item') {
          const detail = await loadItemDetail(selected.data.id)
          if (detail) setSelected({ type: 'item', data: detail, sectionId: selected.sectionId })
        }
      }
    } catch {
      addToast('error', 'Error al eliminar')
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const res = await fetch('/api/admin/menu/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changelog: changelog || undefined }),
      })
      const json = await res.json()
      if (json.success) {
        addToast('success', `Versión ${json.data.version} publicada correctamente`)
        setShowPublishDialog(false)
        setChangelog('')
      } else {
        addToast('error', json.error || 'Error al publicar')
      }
    } catch {
      addToast('error', 'Error al publicar')
    } finally {
      setPublishing(false)
    }
  }

  const handleMoveSection = async (sectionId: string, direction: 'up' | 'down') => {
    const topLevel = sections.filter((s) => !s.parentId)
    const idx = topLevel.findIndex((s) => s.id === sectionId)
    if (idx < 0) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === topLevel.length - 1) return

    const newOrder = [...topLevel]
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]]

    try {
      await fetch('/api/admin/menu/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionIds: newOrder.map((s) => s.id) }),
      })
      await loadSections()
    } catch {
      addToast('error', 'Error al reordenar')
    }
  }

  if (loading) {
    return (
      <AdminShell title="Editor de Carta">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a96e] border-t-transparent" />
        </div>
      </AdminShell>
    )
  }

  const topLevelSections = sections.filter((s) => !s.parentId).sort((a, b) => a.displayOrder - b.displayOrder)
  const childSections = sections.filter((s) => s.parentId)

  return (
    <AdminShell title="Editor de Carta">
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Left Panel: Section Tree */}
        <div className="w-80 flex-shrink-0 overflow-y-auto bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold">Secciones</h2>
          </div>
          <div className="space-y-1">
            {topLevelSections.map((section, idx) => (
              <div key={section.id}>
                {/* Section node */}
                <div className="group">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      selected?.type === 'section' && selected.data.id === section.id
                        ? 'bg-[#c9a96e]/10 border border-[#c9a96e]/30'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Expand/collapse */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xs"
                    >
                      {expandedSections.has(section.id) ? '▼' : '▶'}
                    </button>
                    {/* Name */}
                    <button
                      onClick={() => handleSelectSection(section)}
                      className="flex-1 text-left text-sm font-medium truncate"
                    >
                      {(section.name as LocalizedText).es}
                    </button>
                    {!section.isActive && (
                      <span className="w-2 h-2 rounded-full bg-gray-300" title="Inactiva" />
                    )}
                    {/* Reorder */}
                    <div className="hidden group-hover:flex gap-0.5">
                      <button
                        onClick={() => handleMoveSection(section.id, 'up')}
                        disabled={idx === 0}
                        className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMoveSection(section.id, 'down')}
                        disabled={idx === topLevelSections.length - 1}
                        className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  {/* Expanded: show children sections or items */}
                  {expandedSections.has(section.id) && (
                    <div className="ml-5 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
                      {/* Child sections (for SUBSECTION type) */}
                      {childSections
                        .filter((c) => c.parentId === section.id)
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map((child) => (
                          <div key={child.id}>
                            <button
                              onClick={() => handleSelectSection(child)}
                              className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                                selected?.type === 'section' && selected.data.id === child.id
                                  ? 'bg-[#c9a96e]/10 text-[#c9a96e]'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              📁 {(child.name as LocalizedText).es}
                            </button>
                          </div>
                        ))}
                      {/* Items placeholder */}
                      {section.items?.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelectItem(item, section.id)}
                          className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                            selected?.type === 'item' && selected.data.id === item.id
                              ? 'bg-[#c9a96e]/10 text-[#c9a96e]'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {(item.name as LocalizedText).es}
                        </button>
                      )) || (
                        <p className="text-xs text-gray-400 px-2 py-1">
                          {section._count?.items || 0} servicios
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Detail Editor */}
        <div className="flex-1 overflow-y-auto">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-lg mb-2">Selecciona una sección o servicio</p>
              <p className="text-sm">Haz clic en el árbol de la izquierda para editar</p>
            </div>
          ) : selected.type === 'section' ? (
            <SectionEditor
              section={selected.data}
              onSave={(updates) => handleSaveSection(selected.data.id, updates)}
              saving={saving}
            />
          ) : (
            <ItemEditor
              item={selected.data}
              onSave={(updates) => handleSaveItem(selected.data.id, updates)}
              onSaveVariant={handleSaveVariant}
              onCreateVariant={() => handleCreateVariant(selected.data.id)}
              onDeleteVariant={handleDeleteVariant}
              saving={saving}
            />
          )}
        </div>
      </div>

      {/* Bottom Publish Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-6 py-3 flex items-center justify-between z-50">
        <div className="text-sm text-gray-500">
          {sections.length} secciones en el borrador
        </div>
        <div className="flex gap-3">
          <a href="/admin/menu/preview" target="_blank" rel="noopener noreferrer">
            <AdminButton variant="secondary" size="sm">Previsualizar</AdminButton>
          </a>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => setShowPublishDialog(true)}
          >
            Publicar cambios
          </AdminButton>
        </div>
      </div>

      {/* Publish Confirmation */}
      <AdminModal
        isOpen={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        title="Publicar carta"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Esto actualizará la carta pública visible para los clientes.
          </p>
          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción del cambio (opcional)
            </label>
            <textarea
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              placeholder="Ej: Actualización de precios de masajes"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setShowPublishDialog(false)}>
              Cancelar
            </AdminButton>
            <AdminButton variant="primary" onClick={handlePublish} loading={publishing}>
              Confirmar publicación
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </AdminShell>
  )
}

// ============================================================================
// Section Editor
// ============================================================================

function SectionEditor({
  section,
  onSave,
  saving,
}: {
  section: Section
  onSave: (updates: Partial<Section>) => void
  saving: boolean
}) {
  const [name, setName] = useState<LocalizedText>(section.name as LocalizedText)
  const [description, setDescription] = useState<LocalizedText>(
    (section.description as LocalizedText) || { es: '' }
  )
  const [subtitle, setSubtitle] = useState<LocalizedText>(
    (section.subtitle as LocalizedText) || { es: '' }
  )
  const [isActive, setIsActive] = useState(section.isActive)

  useEffect(() => {
    setName(section.name as LocalizedText)
    setDescription((section.description as LocalizedText) || { es: '' })
    setSubtitle((section.subtitle as LocalizedText) || { es: '' })
    setIsActive(section.isActive)
  }, [section])

  return (
    <AdminCard title={`Sección: ${(section.name as LocalizedText).es}`}>
      <div className="space-y-5">
        <LocalizedInput
          label="Nombre"
          value={name}
          onChange={setName}
          required
        />
        <LocalizedInput
          label="Subtítulo"
          value={subtitle}
          onChange={setSubtitle}
          placeholder="Ej: Holísticos, Personalizados..."
        />
        <LocalizedTextarea
          label="Descripción"
          value={description}
          onChange={setDescription}
        />
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Tipo:</label>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{section.type}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c9a96e]" />
          </label>
          <span className="text-sm">{isActive ? 'Activa' : 'Inactiva'}</span>
        </div>

        {/* Notes */}
        {section.notes && section.notes.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Notas de la sección</h3>
            <div className="space-y-2">
              {section.notes.map((note) => (
                <div key={note.id} className="flex items-start gap-2 text-sm bg-gray-50 p-2 rounded">
                  <span className="text-gray-400 text-xs mt-0.5">{note.style === 'asterisk' ? '*' : 'ℹ'}</span>
                  <span>{(note.content as LocalizedText).es}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <AdminButton
            variant="primary"
            onClick={() => onSave({ name, description, subtitle, isActive })}
            loading={saving}
          >
            Guardar sección
          </AdminButton>
        </div>
      </div>
    </AdminCard>
  )
}

// ============================================================================
// Item Editor
// ============================================================================

function ItemEditor({
  item,
  onSave,
  onSaveVariant,
  onCreateVariant,
  onDeleteVariant,
  saving,
}: {
  item: Item
  onSave: (updates: Partial<Item>) => void
  onSaveVariant: (variantId: string, updates: Record<string, unknown>) => void
  onCreateVariant: () => void
  onDeleteVariant: (variantId: string) => void
  saving: boolean
}) {
  const [name, setName] = useState<LocalizedText>(item.name as LocalizedText)
  const [description, setDescription] = useState<LocalizedText>(
    (item.description as LocalizedText) || { es: '' }
  )
  const [shortDescription, setShortDescription] = useState<LocalizedText>(
    (item.shortDescription as LocalizedText) || { es: '' }
  )
  const [isActive, setIsActive] = useState(item.isActive)
  const [deleteVariantId, setDeleteVariantId] = useState<string | null>(null)

  useEffect(() => {
    setName(item.name as LocalizedText)
    setDescription((item.description as LocalizedText) || { es: '' })
    setShortDescription((item.shortDescription as LocalizedText) || { es: '' })
    setIsActive(item.isActive)
  }, [item])

  return (
    <div className="space-y-6">
      <AdminCard title={`Servicio: ${(item.name as LocalizedText).es}`}>
        <div className="space-y-5">
          <LocalizedInput label="Nombre" value={name} onChange={setName} required />
          <LocalizedInput
            label="Descripción corta"
            value={shortDescription}
            onChange={setShortDescription}
            placeholder="Se muestra en línea junto al nombre"
          />
          <LocalizedTextarea label="Descripción" value={description} onChange={setDescription} />
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c9a96e]" />
            </label>
            <span className="text-sm">{isActive ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <AdminButton
              variant="primary"
              onClick={() => onSave({ name, description, shortDescription, isActive })}
              loading={saving}
            >
              Guardar servicio
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* Variants */}
      <AdminCard
        title="Variantes de precio"
        action={
          <AdminButton variant="secondary" size="sm" onClick={onCreateVariant}>
            + Añadir variante
          </AdminButton>
        }
      >
        {(!item.variants || item.variants.length === 0) ? (
          <p className="text-sm text-gray-400">Sin variantes. Añade una para definir precios.</p>
        ) : (
          <div className="space-y-3">
            {item.variants.map((variant) => (
              <VariantRow
                key={variant.id}
                variant={variant}
                onSave={(updates) => onSaveVariant(variant.id, updates)}
                onDelete={() => setDeleteVariantId(variant.id)}
              />
            ))}
          </div>
        )}
      </AdminCard>

      {/* Notes */}
      {item.notes && item.notes.length > 0 && (
        <AdminCard title="Notas del servicio">
          <div className="space-y-2">
            {item.notes.map((note) => (
              <div key={note.id} className="flex items-start gap-2 text-sm bg-gray-50 p-2 rounded">
                <span className="text-gray-400 text-xs mt-0.5">
                  {note.style === 'asterisk' ? '*' : note.style === 'highlight' ? '★' : 'ℹ'}
                </span>
                <span>{(note.content as LocalizedText).es}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      <ConfirmDialog
        isOpen={!!deleteVariantId}
        onCancel={() => setDeleteVariantId(null)}
        onConfirm={() => {
          if (deleteVariantId) onDeleteVariant(deleteVariantId)
          setDeleteVariantId(null)
        }}
        title="Eliminar variante"
        message="¿Seguro que quieres eliminar esta variante? Esta acción no se puede deshacer."
        variant="danger"
        confirmLabel="Eliminar"
      />
    </div>
  )
}

// ============================================================================
// Variant Row (inline editor)
// ============================================================================

function VariantRow({
  variant,
  onSave,
  onDelete,
}: {
  variant: Variant
  onSave: (updates: Record<string, unknown>) => void
  onDelete: () => void
}) {
  const [label, setLabel] = useState<LocalizedText>(variant.label as LocalizedText)
  const [price, setPrice] = useState(Number(variant.price))
  const [duration, setDuration] = useState(variant.duration || 0)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setLabel(variant.label as LocalizedText)
    setPrice(Number(variant.price))
    setDuration(variant.duration || 0)
  }, [variant])

  if (!editing) {
    return (
      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg group">
        <div className="flex-1">
          <span className="text-sm font-medium">{(variant.label as LocalizedText).es}</span>
          {variant.duration && (
            <span className="text-xs text-gray-400 ml-2">{variant.duration} min</span>
          )}
        </div>
        <span className="text-sm font-semibold text-[#c9a96e]">{Number(variant.price)}€</span>
        {!variant.isActive && <AdminBadge variant="draft" label="Inactiva" />}
        <div className="hidden group-hover:flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
      <LocalizedInput
        label="Etiqueta"
        value={label}
        onChange={setLabel}
        required
      />
      <div className="flex gap-4">
        <div className="flex-1">
          <PriceInput value={price} onChange={setPrice} />
        </div>
        <div className="flex-1">
          <DurationInput value={duration} onChange={setDuration} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <AdminButton variant="secondary" size="sm" onClick={() => setEditing(false)}>
          Cancelar
        </AdminButton>
        <AdminButton
          variant="primary"
          size="sm"
          onClick={() => {
            onSave({ label, price, duration: duration || null })
            setEditing(false)
          }}
        >
          Guardar
        </AdminButton>
      </div>
    </div>
  )
}
