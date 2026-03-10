'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { useToast } from '../../components/ui/AdminToast'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LText { es: string; en?: string; fr?: string }

interface Variant {
  id: string
  label: LText
  duration: number | null
  durationUnit: string
  price: number
  notes: LText | null
  displayOrder: number
  isActive: boolean
}

interface Note {
  id: string
  content: LText
  displayOrder: number
  style: string
}

interface Item {
  id: string
  slug: string
  name: LText
  description: LText | null
  shortDescription: LText | null
  savingsLabel: LText | null
  totalDuration: string | null
  displayOrder: number
  isActive: boolean
  variants: Variant[]
  notes: Note[]
}

interface Section {
  id: string
  slug: string
  name: LText
  subtitle: LText | null
  description: LText | null
  displayOrder: number
  isActive: boolean
  type: string
  items: Item[]
  children: Section[]
  notes: Note[]
}

interface ChangeDescription {
  label: string
  detail: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const t = (v: LText | null | undefined) => v?.es || ''
const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CartaAdmin() {
  const status = useAdminAuth()
  const { addToast } = useToast()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [editingItem, setEditingItem] = useState<{ item: Item; sectionId: string } | null>(null)
  const [creatingInSection, setCreatingInSection] = useState<string | null>(null)
  const [deletingItem, setDeletingItem] = useState<{ id: string; name: string; sectionId: string } | null>(null)
  const [deletingSection, setDeletingSection] = useState<{ id: string; name: string } | null>(null)
  const [creatingSectionModal, setCreatingSectionModal] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/menu/sections?includeInactive=true')
      const json = await res.json()
      if (!json.success) return

      const allSections = json.data as Section[]
      const topLevel = allSections.filter((s: Section) => !('parentId' in s && (s as Record<string, unknown>).parentId))

      const detailed = await Promise.all(
        topLevel.map(async (s: Section) => {
          const detail = await fetch(`/api/admin/menu/sections/${s.id}`)
          const dj = await detail.json()
          return dj.success ? dj.data : s
        })
      )

      const withChildren = await Promise.all(
        detailed.map(async (s: Section) => {
          if (s.children && s.children.length > 0) {
            const childDetails = await Promise.all(
              s.children.map(async (c: Section) => {
                const cr = await fetch(`/api/admin/menu/sections/${c.id}`)
                const cj = await cr.json()
                return cj.success ? cj.data : c
              })
            )
            return { ...s, children: childDetails }
          }
          return s
        })
      )

      setSections(withChildren.sort((a: Section, b: Section) => a.displayOrder - b.displayOrder))
    } catch {
      addToast('error', 'Error al cargar la carta')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    if (status === 'authenticated') loadData()
  }, [status, loadData])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#c9a96e] border-t-transparent mx-auto mb-4" />
          <p className="text-[#1a1a2e]/60 text-sm tracking-widest uppercase">Cargando carta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Page Title — like the printed menu header */}
      <div className="bg-white border-b border-[#e5e2db] py-6 sm:py-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-1">
          <span className="h-px w-16 bg-[#c9a96e]/40" />
          <span className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase font-medium">Administracion</span>
          <span className="h-px w-16 bg-[#c9a96e]/40" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1a1a2e] tracking-wide uppercase">
          Carta de Servicios
        </h2>
        <p className="text-xs text-[#1a1a2e]/40 mt-1">
          Haz click en un servicio para editarlo
        </p>
      </div>

      {/* Menu Card — 3-column masonry layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-[#e5e2db] overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10 columns-1 md:columns-2 lg:columns-3 gap-8">
            {sections.map((section) => (
              <MenuSection
                key={section.id}
                section={section}
                onEditItem={(item, secId) => setEditingItem({ item, sectionId: secId })}
                onDeleteItem={(id, name, secId) => setDeletingItem({ id, name, sectionId: secId })}
                onAddItem={(secId) => setCreatingInSection(secId)}
                onDeleteSection={(id, name) => setDeletingSection({ id, name })}
              />
            ))}
          </div>

          {/* Add Section Button */}
          <div className="px-6 sm:px-8 lg:px-10 pb-8">
            <button
              onClick={() => setCreatingSectionModal(true)}
              className="w-full py-3 border-2 border-dashed border-[#c9a96e]/30 rounded-lg text-[#c9a96e] hover:border-[#c9a96e]/60 hover:bg-[#c9a96e]/5 transition-all text-xs tracking-widest uppercase"
            >
              + Anadir nueva seccion
            </button>
          </div>
        </div>
      </div>

      {/* All Modals */}
      {editingItem && (
        <ItemFormModal
          mode="edit"
          item={editingItem.item}
          sectionId={editingItem.sectionId}
          onClose={() => setEditingItem(null)}
          onSaved={() => { setEditingItem(null); loadData() }}
          addToast={addToast}
        />
      )}

      {creatingInSection && (
        <ItemFormModal
          mode="create"
          sectionId={creatingInSection}
          onClose={() => setCreatingInSection(null)}
          onSaved={() => { setCreatingInSection(null); loadData() }}
          addToast={addToast}
        />
      )}

      {deletingItem && (
        <ConfirmModal
          title="Eliminar servicio"
          message={`Se eliminara "${deletingItem.name}" de la carta. Esta accion no se puede deshacer.`}
          confirmLabel="Eliminar"
          variant="danger"
          onCancel={() => setDeletingItem(null)}
          onConfirm={async () => {
            const res = await fetch(`/api/admin/menu/items/${deletingItem.id}`, { method: 'DELETE' })
            const json = await res.json()
            if (json.success) {
              addToast('success', `"${deletingItem.name}" eliminado`)
              setDeletingItem(null)
              loadData()
            } else {
              addToast('error', 'Error al eliminar')
            }
          }}
        />
      )}

      {deletingSection && (
        <ConfirmModal
          title="Eliminar seccion"
          message={`Se eliminara la seccion "${deletingSection.name}" y todos sus servicios. Esta accion no se puede deshacer.`}
          confirmLabel="Eliminar seccion"
          variant="danger"
          onCancel={() => setDeletingSection(null)}
          onConfirm={async () => {
            const res = await fetch(`/api/admin/menu/sections/${deletingSection.id}`, { method: 'DELETE' })
            const json = await res.json()
            if (json.success) {
              addToast('success', 'Seccion eliminada')
              setDeletingSection(null)
              loadData()
            } else {
              addToast('error', 'Error al eliminar seccion')
            }
          }}
        />
      )}

      {creatingSectionModal && (
        <SectionFormModal
          onClose={() => setCreatingSectionModal(false)}
          onSaved={() => { setCreatingSectionModal(false); loadData() }}
          addToast={addToast}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MenuSection — renders a section like the printed spa menu
// ---------------------------------------------------------------------------

function MenuSection({
  section,
  onEditItem,
  onDeleteItem,
  onAddItem,
  onDeleteSection,
}: {
  section: Section
  onEditItem: (item: Item, sectionId: string) => void
  onDeleteItem: (id: string, name: string, sectionId: string) => void
  onAddItem: (sectionId: string) => void
  onDeleteSection: (id: string, name: string) => void
}) {
  const name = t(section.name as LText)
  const subtitle = t(section.subtitle as LText)
  const description = t(section.description as LText)
  const allItems = section.items || []
  const hasChildren = section.children && section.children.length > 0

  return (
    <div className="break-inside-avoid mb-8 group/section">
      {/* Section Header — matching printed menu style */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base sm:text-lg text-[#1a1a2e] tracking-wide uppercase font-bold leading-tight">
            {name}
          </h3>
          {subtitle && (
            <span className="text-[10px] text-[#1a1a2e]/50 tracking-[0.15em] uppercase">{subtitle}</span>
          )}
        </div>
        <button
          onClick={() => onDeleteSection(section.id, name)}
          className="text-[10px] text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors opacity-0 group-hover/section:opacity-100 flex-shrink-0"
          title="Eliminar seccion"
        >
          Eliminar
        </button>
      </div>

      {/* Section description (e.g. Jacuzzi · Sauna...) */}
      {description && (
        <p className="text-[10px] text-[#1a1a2e]/40 uppercase tracking-wide mb-1 leading-tight">{description}</p>
      )}

      {/* Divider line */}
      <div className="h-px bg-[#1a1a2e]/15 mb-3" />

      {/* Items */}
      {allItems.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          sectionType={section.type}
          onEdit={() => onEditItem(item, section.id)}
          onDelete={() => onDeleteItem(item.id, t(item.name as LText), section.id)}
        />
      ))}

      {/* Children (subsections) */}
      {hasChildren && section.children.map((child) => (
        <div key={child.id} className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px flex-1 bg-[#1a1a2e]/10" />
            <span className="text-[10px] text-[#1a1a2e]/60 tracking-[0.2em] uppercase font-semibold">
              {t(child.name as LText)}
            </span>
            <span className="h-px flex-1 bg-[#1a1a2e]/10" />
          </div>
          {child.items?.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              sectionType={child.type}
              onEdit={() => onEditItem(item, child.id)}
              onDelete={() => onDeleteItem(item.id, t(item.name as LText), child.id)}
            />
          ))}
          {/* Add item to child section */}
          <button
            onClick={() => onAddItem(child.id)}
            className="mt-1 text-[10px] text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors tracking-wide"
          >
            + Anadir
          </button>
        </div>
      ))}

      {/* Section Notes */}
      {section.notes?.length > 0 && (
        <div className="mt-2">
          {section.notes.map((note) => (
            <p key={note.id} className="text-[10px] text-[#1a1a2e]/40 italic leading-relaxed">
              {note.style === 'asterisk' ? '* ' : ''}{t(note.content as LText)}
            </p>
          ))}
        </div>
      )}

      {/* Add Item to this section (only if no children — sections with children add per-child) */}
      {!hasChildren && (
        <button
          onClick={() => onAddItem(section.id)}
          className="mt-2 text-[10px] text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors tracking-wide"
        >
          + Anadir servicio
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MenuItem — single item row styled like the printed menu
// ---------------------------------------------------------------------------

function MenuItem({
  item,
  sectionType,
  onEdit,
  onDelete,
}: {
  item: Item
  sectionType: string
  onEdit: () => void
  onDelete: () => void
}) {
  const name = t(item.name as LText)
  const desc = t(item.shortDescription as LText) || t(item.description as LText)
  const savings = t(item.savingsLabel as LText)
  const variants = item.variants || []
  const isCouples = sectionType === 'COUPLES'
  const isPackage = sectionType === 'PACKAGES'
  const isInfo = sectionType === 'INFO'

  return (
    <div className="group/item mb-2 cursor-pointer hover:bg-[#c9a96e]/5 -mx-2 px-2 py-1 rounded transition-colors" onClick={onEdit}>
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          {/* Item name and description on same line where possible */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-semibold text-[#1a1a2e] text-xs uppercase tracking-wide">
              {name}
            </span>
            {desc && (
              <span className="text-[10px] text-[#1a1a2e]/40 uppercase tracking-wide">{desc}</span>
            )}
            {!item.isActive && (
              <span className="text-[9px] bg-gray-100 text-gray-400 px-1 py-px rounded">OCULTO</span>
            )}
          </div>

          {/* Savings label for packs */}
          {savings && (
            <p className="text-[10px] text-[#c9a96e] uppercase tracking-wide mt-0.5">{savings}</p>
          )}

          {/* Variants (price lines) */}
          {variants.length > 0 && (
            <div className="mt-0.5">
              {variants.map((v) => {
                const vLabel = t(v.label as LText)
                const vNotes = t(v.notes as LText)
                return (
                  <div key={v.id} className="flex items-baseline gap-1 leading-snug">
                    {/* Variant label */}
                    <span className="text-[11px] text-[#1a1a2e]/60 whitespace-nowrap">
                      {vLabel}
                    </span>
                    {/* Dotted connector */}
                    <span className="flex-1 border-b border-dotted border-[#1a1a2e]/15 min-w-[20px] translate-y-[-2px]" />
                    {/* Duration */}
                    {v.duration && (
                      <span className="text-[10px] text-[#1a1a2e]/40 whitespace-nowrap">{v.duration} min</span>
                    )}
                    {/* Price */}
                    <span className="text-[11px] font-semibold text-[#1a1a2e] tabular-nums whitespace-nowrap">
                      {Number(v.price)}{'\u20AC'}
                    </span>
                    {/* Couple badge */}
                    {vNotes && (
                      <span className="text-[9px] text-[#1a1a2e]/40 italic whitespace-nowrap">{vNotes}</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Info-type items just show description */}
          {isInfo && variants.length === 0 && desc && (
            <p className="text-[10px] text-[#1a1a2e]/50 mt-0.5">{desc}</p>
          )}

          {/* Item notes */}
          {item.notes?.length > 0 && (
            <div className="mt-0.5">
              {item.notes.map((note) => (
                <p key={note.id} className="text-[10px] text-[#c9a96e]/70 italic leading-tight">
                  {t(note.content as LText)}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons — show on hover */}
        <div className="flex gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onEdit}
            className="text-[10px] text-[#c9a96e] hover:text-[#b8963f] px-1.5 py-0.5 rounded hover:bg-[#c9a96e]/10 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="text-[10px] text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ItemFormModal - Edit or Create an item
// ---------------------------------------------------------------------------

function ItemFormModal({
  mode,
  item,
  sectionId,
  onClose,
  onSaved,
  addToast,
}: {
  mode: 'edit' | 'create'
  item?: Item
  sectionId: string
  onClose: () => void
  onSaved: () => void
  addToast: (type: 'success' | 'error', msg: string) => void
}) {
  const [name, setName] = useState(item ? t(item.name as LText) : '')
  const [description, setDescription] = useState(item ? t(item.shortDescription as LText) || t(item.description as LText) : '')
  const [isActive, setIsActive] = useState(item?.isActive ?? true)
  const [variants, setVariants] = useState<Array<{
    id?: string
    label: string
    duration: string
    price: string
    isNew?: boolean
    deleted?: boolean
  }>>(
    item?.variants?.map((v) => ({
      id: v.id,
      label: t(v.label as LText),
      duration: v.duration?.toString() || '',
      price: Number(v.price).toString(),
    })) || []
  )

  const [saving, setSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [changes, setChanges] = useState<ChangeDescription[]>([])

  const computeChanges = (): ChangeDescription[] => {
    const result: ChangeDescription[] = []

    if (mode === 'create') {
      result.push({ label: 'Nuevo servicio', detail: name })
      const activeVariants = variants.filter((v) => !v.deleted)
      activeVariants.forEach((v) => {
        result.push({ label: 'Variante', detail: `${v.label} - ${v.duration ? v.duration + ' min - ' : ''}${v.price}\u20AC` })
      })
      return result
    }

    if (name !== t(item!.name as LText)) {
      result.push({ label: 'Nombre', detail: `"${t(item!.name as LText)}" -> "${name}"` })
    }
    const origDesc = t(item!.shortDescription as LText) || t(item!.description as LText)
    if (description !== origDesc) {
      result.push({ label: 'Descripcion', detail: description ? `"${description}"` : '(vacio)' })
    }
    if (isActive !== item!.isActive) {
      result.push({ label: 'Visibilidad', detail: isActive ? 'Visible en la web' : 'Oculto de la web' })
    }

    variants.forEach((v) => {
      if (v.isNew && !v.deleted) {
        result.push({ label: 'Nueva variante', detail: `${v.label} - ${v.price}\u20AC` })
      } else if (v.deleted && v.id) {
        const orig = item!.variants.find((ov) => ov.id === v.id)
        if (orig) result.push({ label: 'Eliminar variante', detail: t(orig.label as LText) })
      } else if (v.id) {
        const orig = item!.variants.find((ov) => ov.id === v.id)
        if (orig) {
          if (v.label !== t(orig.label as LText)) {
            result.push({ label: 'Variante', detail: `"${t(orig.label as LText)}" -> "${v.label}"` })
          }
          if (v.price !== Number(orig.price).toString()) {
            result.push({ label: 'Precio', detail: `${t(orig.label as LText)}: ${Number(orig.price)}\u20AC -> ${v.price}\u20AC` })
          }
          if (v.duration !== (orig.duration?.toString() || '')) {
            result.push({ label: 'Duracion', detail: `${t(orig.label as LText)}: ${orig.duration || '-'} -> ${v.duration || '-'} min` })
          }
        }
      }
    })

    return result
  }

  const handleSave = () => {
    if (!name.trim()) {
      addToast('error', 'El nombre es obligatorio')
      return
    }
    const detected = computeChanges()
    if (detected.length === 0 && mode === 'edit') {
      addToast('error', 'No hay cambios que guardar')
      return
    }
    setChanges(detected)
    setShowConfirm(true)
  }

  const executeChanges = async () => {
    setSaving(true)
    try {
      if (mode === 'create') {
        const slug = slugify(name)
        const res = await fetch('/api/admin/menu/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sectionId,
            slug,
            name: { es: name },
            shortDescription: description ? { es: description } : undefined,
          }),
        })
        const json = await res.json()
        if (!json.success) { addToast('error', json.error || 'Error al crear'); return }

        const newItemId = json.data.id
        for (const v of variants.filter((v) => !v.deleted)) {
          await fetch('/api/admin/menu/variants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              itemId: newItemId,
              label: { es: v.label },
              duration: v.duration ? parseInt(v.duration) : null,
              price: parseFloat(v.price) || 0,
            }),
          })
        }
        addToast('success', `"${name}" creado correctamente`)
      } else {
        await fetch(`/api/admin/menu/items/${item!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: { es: name },
            shortDescription: { es: description },
            isActive,
          }),
        })

        for (const v of variants) {
          if (v.deleted && v.id) {
            await fetch(`/api/admin/menu/variants/${v.id}`, { method: 'DELETE' })
          } else if (v.isNew && !v.deleted) {
            await fetch('/api/admin/menu/variants', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                itemId: item!.id,
                label: { es: v.label },
                duration: v.duration ? parseInt(v.duration) : null,
                price: parseFloat(v.price) || 0,
              }),
            })
          } else if (v.id && !v.deleted) {
            const orig = item!.variants.find((ov) => ov.id === v.id)
            if (orig) {
              const hasChanges =
                v.label !== t(orig.label as LText) ||
                v.price !== Number(orig.price).toString() ||
                v.duration !== (orig.duration?.toString() || '')
              if (hasChanges) {
                await fetch(`/api/admin/menu/variants/${v.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    label: { es: v.label },
                    duration: v.duration ? parseInt(v.duration) : null,
                    price: parseFloat(v.price) || 0,
                  }),
                })
              }
            }
          }
        }
        addToast('success', 'Cambios guardados. La web se ha actualizado.')
      }

      onSaved()
    } catch {
      addToast('error', 'Error al guardar los cambios')
    } finally {
      setSaving(false)
      setShowConfirm(false)
    }
  }

  const addVariant = () => {
    setVariants([...variants, { label: '', duration: '', price: '', isNew: true }])
  }

  const updateVariant = (idx: number, field: string, value: string) => {
    setVariants(variants.map((v, i) => i === idx ? { ...v, [field]: value } : v))
  }

  const removeVariant = (idx: number) => {
    const v = variants[idx]
    if (v.isNew) {
      setVariants(variants.filter((_, i) => i !== idx))
    } else {
      setVariants(variants.map((vv, i) => i === idx ? { ...vv, deleted: true } : vv))
    }
  }

  const activeVariants = variants.filter((v) => !v.deleted)

  return (
    <>
      <Overlay onClose={onClose}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-[#e5e2db] flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#1a1a2e]">
              {mode === 'create' ? 'Nuevo servicio' : 'Editar servicio'}
            </h3>
            <button onClick={onClose} className="text-[#1a1a2e]/30 hover:text-[#1a1a2e] text-xl leading-none">&times;</button>
          </div>

          {/* Form */}
          <div className="px-6 py-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Nombre del servicio</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Masaje Relajante"
                className="w-full border border-[#e5e2db] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Descripcion corta</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Cuello, espalda o piernas y pies"
                className="w-full border border-[#e5e2db] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]"
              />
            </div>

            {mode === 'edit' && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? 'bg-[#c9a96e]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-[#1a1a2e]/70">
                  {isActive ? 'Visible en la web' : 'Oculto de la web'}
                </span>
              </div>
            )}

            {/* Variants */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-2">Precios y duracion</label>

              {activeVariants.length === 0 ? (
                <p className="text-sm text-[#1a1a2e]/30 mb-2">Sin variantes de precio</p>
              ) : (
                <div className="space-y-2">
                  {variants.map((v, idx) => {
                    if (v.deleted) return null
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={v.label}
                          onChange={(e) => updateVariant(idx, 'label', e.target.value)}
                          placeholder="Etiqueta"
                          className="flex-1 border border-[#e5e2db] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40"
                        />
                        <div className="relative w-20">
                          <input
                            type="number"
                            value={v.duration}
                            onChange={(e) => updateVariant(idx, 'duration', e.target.value)}
                            placeholder="Min"
                            className="w-full border border-[#e5e2db] rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#1a1a2e]/30 pointer-events-none">min</span>
                        </div>
                        <div className="relative w-24">
                          <input
                            type="number"
                            step="0.01"
                            value={v.price}
                            onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                            placeholder="Precio"
                            className="w-full border border-[#e5e2db] rounded-lg px-3 py-2 text-sm text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#1a1a2e]/30 pointer-events-none">{'\u20AC'}</span>
                        </div>
                        <button
                          onClick={() => removeVariant(idx)}
                          className="text-red-400 hover:text-red-600 p-1"
                          title="Eliminar variante"
                        >
                          &times;
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              <button
                onClick={addVariant}
                className="mt-2 text-sm text-[#c9a96e] hover:text-[#b8963f] transition-colors"
              >
                + Anadir variante de precio
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-[#e5e2db] flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#1a1a2e]/60 hover:text-[#1a1a2e] rounded-lg hover:bg-[#f8f7f4] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-sm bg-[#c9a96e] text-white rounded-lg hover:bg-[#b8963f] transition-colors font-medium"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </Overlay>

      {/* Confirm Changes Modal */}
      {showConfirm && (
        <Overlay onClose={() => setShowConfirm(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-[#e5e2db]">
              <h3 className="font-serif text-lg text-[#1a1a2e]">Confirmar cambios</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-[#1a1a2e]/60 mb-4">
                Se van a aplicar los siguientes cambios:
              </p>
              <div className="space-y-2 mb-4">
                {changes.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[#c9a96e] mt-0.5 flex-shrink-0">-</span>
                    <div>
                      <span className="font-medium text-[#1a1a2e]">{c.label}:</span>{' '}
                      <span className="text-[#1a1a2e]/60">{c.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#c9a96e]/5 border border-[#c9a96e]/20 rounded-lg px-4 py-3">
                <p className="text-xs text-[#c9a96e]">
                  Los cambios se reflejaran inmediatamente en la web publica.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#e5e2db] flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={saving}
                className="px-4 py-2 text-sm text-[#1a1a2e]/60 hover:text-[#1a1a2e] rounded-lg hover:bg-[#f8f7f4] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeChanges}
                disabled={saving}
                className="px-5 py-2 text-sm bg-[#c9a96e] text-white rounded-lg hover:bg-[#b8963f] transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />}
                Confirmar y publicar
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// SectionFormModal - Create a new section
// ---------------------------------------------------------------------------

function SectionFormModal({
  onClose,
  onSaved,
  addToast,
}: {
  onClose: () => void
  onSaved: () => void
  addToast: (type: 'success' | 'error', msg: string) => void
}) {
  const [name, setName] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      addToast('error', 'El nombre de la seccion es obligatorio')
      return
    }
    setSaving(true)
    try {
      const slug = slugify(name)
      const res = await fetch('/api/admin/menu/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name: { es: name },
          subtitle: subtitle ? { es: subtitle } : undefined,
        }),
      })
      const json = await res.json()
      if (json.success) {
        addToast('success', `Seccion "${name}" creada`)
        onSaved()
      } else {
        addToast('error', json.error || 'Error al crear la seccion')
      }
    } catch {
      addToast('error', 'Error al crear la seccion')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-[#e5e2db] flex items-center justify-between">
          <h3 className="font-serif text-lg text-[#1a1a2e]">Nueva seccion</h3>
          <button onClick={onClose} className="text-[#1a1a2e]/30 hover:text-[#1a1a2e] text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Nombre de la seccion</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Masajes Terapeuticos"
              className="w-full border border-[#e5e2db] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">
              Subtitulo <span className="text-[#1a1a2e]/30">(opcional)</span>
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ej: Holisticos"
              className="w-full border border-[#e5e2db] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#e5e2db] flex justify-end gap-3">
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
            Crear seccion
          </button>
        </div>
      </div>
    </Overlay>
  )
}

// ---------------------------------------------------------------------------
// ConfirmModal - Generic confirmation dialog
// ---------------------------------------------------------------------------

function ConfirmModal({
  title,
  message,
  confirmLabel,
  variant,
  onCancel,
  onConfirm,
}: {
  title: string
  message: string
  confirmLabel: string
  variant: 'danger' | 'warning'
  onCancel: () => void
  onConfirm: () => void
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
            className={`px-5 py-2 text-sm text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2 transition-colors ${
              variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
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
// Overlay - Modal backdrop
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
