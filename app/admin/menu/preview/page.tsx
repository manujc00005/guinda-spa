'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import Link from 'next/link'
import AdminShell from '../../components/AdminShell'
import AdminBadge from '../../components/ui/AdminBadge'
import type {
  MenuSnapshot,
  MenuSnapshotSection,
  MenuSnapshotItem,
  MenuSnapshotVariant,
  MenuSnapshotNote,
} from '@/lib/types/menu'
import { resolveLocalizedText } from '@/lib/types/menu'

// ---------------------------------------------------------------------------
// Locale config
// ---------------------------------------------------------------------------

type Locale = 'es' | 'en' | 'fr'

const LOCALE_LABELS: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  fr: 'FR',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price)

const formatDuration = (duration: number | null, unit: string): string => {
  if (!duration) return ''
  if (unit === 'h' || unit === 'hours') return `${duration} h`
  return `${duration} min`
}

// ---------------------------------------------------------------------------
// Note renderer
// ---------------------------------------------------------------------------

function NoteBlock({ note, locale }: { note: MenuSnapshotNote; locale: Locale }) {
  const content = resolveLocalizedText(note.content, locale)
  if (!content) return null

  const baseClasses =
    'text-sm font-[family-name:var(--font-inter)] rounded-md px-3 py-2 my-2'

  if (note.style === 'highlight') {
    return (
      <div className={`${baseClasses} bg-[#c9a96e]/10 border border-[#c9a96e]/30 text-[#8a7344]`}>
        {content}
      </div>
    )
  }

  if (note.style === 'asterisk') {
    return (
      <p className={`${baseClasses} text-gray-500 italic`}>
        <span className="text-[#c9a96e] mr-1">*</span>
        {content}
      </p>
    )
  }

  // Default: info
  return (
    <div className={`${baseClasses} bg-slate-50 border border-slate-200 text-slate-600`}>
      <span className="mr-1.5 text-slate-400">i</span>
      {content}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Variant row
// ---------------------------------------------------------------------------

function VariantPreview({
  variant,
  locale,
}: {
  variant: MenuSnapshotVariant
  locale: Locale
}) {
  const label = resolveLocalizedText(variant.label, locale)
  const durationStr = formatDuration(variant.duration, variant.durationUnit)
  const notesStr = resolveLocalizedText(variant.notes, locale)

  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-2 ${
        !variant.isActive ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-[family-name:var(--font-inter)] text-[#1a1a2e]">
          {label}
        </span>
        {!variant.isActive && (
          <AdminBadge variant="archived" label="Inactiva" />
        )}
        {durationStr && (
          <span className="text-xs text-gray-400 font-[family-name:var(--font-inter)] whitespace-nowrap">
            {durationStr}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {notesStr && (
          <span className="text-xs text-gray-400 italic font-[family-name:var(--font-inter)]">
            {notesStr}
          </span>
        )}
        <span className="text-sm font-semibold text-[#c9a96e] font-[family-name:var(--font-inter)] tabular-nums">
          {formatPrice(variant.price)}
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Item card
// ---------------------------------------------------------------------------

function ItemPreview({
  item,
  locale,
}: {
  item: MenuSnapshotItem
  locale: Locale
}) {
  const name = resolveLocalizedText(item.name, locale)
  const description = resolveLocalizedText(item.description, locale)
  const sortedVariants = [...item.variants].sort(
    (a, b) => a.displayOrder - b.displayOrder
  )
  const sortedNotes = [...item.notes].sort(
    (a, b) => a.displayOrder - b.displayOrder
  )

  return (
    <div
      className={`py-5 ${!item.isActive ? 'opacity-40' : ''}`}
    >
      {/* Item header */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-center gap-2">
          <h4 className="text-base font-semibold text-[#1a1a2e] font-[family-name:var(--font-playfair)]">
            {name}
          </h4>
          {!item.isActive && (
            <AdminBadge variant="archived" label="Inactivo" />
          )}
        </div>
        {/* Show single price inline if only one variant */}
        {sortedVariants.length === 1 && sortedVariants[0].isActive && (
          <span className="text-base font-semibold text-[#c9a96e] font-[family-name:var(--font-inter)] tabular-nums shrink-0">
            {formatPrice(sortedVariants[0].price)}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 font-[family-name:var(--font-inter)] leading-relaxed mb-2">
          {description}
        </p>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 text-xs rounded-full bg-[#c9a96e]/10 text-[#8a7344] font-[family-name:var(--font-inter)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Savings label */}
      {item.savingsLabel && resolveLocalizedText(item.savingsLabel, locale) && (
        <p className="text-xs font-medium text-emerald-600 font-[family-name:var(--font-inter)] mb-2">
          {resolveLocalizedText(item.savingsLabel, locale)}
        </p>
      )}

      {/* Total duration */}
      {item.totalDuration && (
        <p className="text-xs text-gray-400 font-[family-name:var(--font-inter)] mb-2">
          Duracion total: {item.totalDuration}
        </p>
      )}

      {/* Variants (show full table when more than 1) */}
      {sortedVariants.length > 1 && (
        <div className="mt-2 pl-3 border-l-2 border-[#c9a96e]/20 space-y-0">
          {sortedVariants.map((v) => (
            <VariantPreview key={v.id} variant={v} locale={locale} />
          ))}
        </div>
      )}

      {/* Single variant with duration shown inline */}
      {sortedVariants.length === 1 && (
        <div className="mt-1">
          {sortedVariants[0].duration && (
            <span className="text-xs text-gray-400 font-[family-name:var(--font-inter)]">
              {formatDuration(sortedVariants[0].duration, sortedVariants[0].durationUnit)}
            </span>
          )}
          {resolveLocalizedText(sortedVariants[0].notes, locale) && (
            <span className="text-xs text-gray-400 italic font-[family-name:var(--font-inter)] ml-2">
              {resolveLocalizedText(sortedVariants[0].notes, locale)}
            </span>
          )}
        </div>
      )}

      {/* Item notes */}
      {sortedNotes.length > 0 && (
        <div className="mt-2">
          {sortedNotes.map((note) => (
            <NoteBlock key={note.id} note={note} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section block
// ---------------------------------------------------------------------------

function SectionPreview({
  section,
  locale,
  depth = 0,
}: {
  section: MenuSnapshotSection
  locale: Locale
  depth?: number
}) {
  const name = resolveLocalizedText(section.name, locale)
  const subtitle = resolveLocalizedText(section.subtitle, locale)
  const description = resolveLocalizedText(section.description, locale)
  const sortedItems = [...section.items].sort(
    (a, b) => a.displayOrder - b.displayOrder
  )
  const sortedNotes = [...section.notes].sort(
    (a, b) => a.displayOrder - b.displayOrder
  )
  const sortedChildren = [...section.children].sort(
    (a, b) => a.displayOrder - b.displayOrder
  )

  const isTopLevel = depth === 0

  return (
    <div
      className={`${!section.isActive ? 'opacity-40' : ''} ${
        isTopLevel ? 'mb-10' : 'mb-6'
      }`}
    >
      {/* Section heading */}
      <div
        className={`${
          isTopLevel
            ? 'text-center mb-6 pb-4 border-b border-[#c9a96e]/30'
            : 'mb-4 pb-2 border-b border-gray-200'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {isTopLevel ? (
            <h2 className="text-2xl font-bold text-[#1a1a2e] font-[family-name:var(--font-playfair)] tracking-wide uppercase">
              {name}
            </h2>
          ) : (
            <h3 className="text-lg font-semibold text-[#1a1a2e] font-[family-name:var(--font-playfair)]">
              {name}
            </h3>
          )}
          {!section.isActive && (
            <AdminBadge variant="archived" label="Inactiva" />
          )}
        </div>
        {subtitle && (
          <p
            className={`${
              isTopLevel ? 'text-sm' : 'text-xs'
            } text-[#c9a96e] font-[family-name:var(--font-inter)] italic mt-1`}
          >
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-sm text-gray-500 font-[family-name:var(--font-inter)] mt-2 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Section notes */}
      {sortedNotes.length > 0 && (
        <div className="mb-4">
          {sortedNotes.map((note) => (
            <NoteBlock key={note.id} note={note} locale={locale} />
          ))}
        </div>
      )}

      {/* Items */}
      {sortedItems.length > 0 && (
        <div className="divide-y divide-gray-100">
          {sortedItems.map((item) => (
            <ItemPreview key={item.id} item={item} locale={locale} />
          ))}
        </div>
      )}

      {/* Children (subsections) */}
      {sortedChildren.length > 0 && (
        <div className={isTopLevel ? 'mt-4 space-y-4' : 'mt-3 ml-4 space-y-3'}>
          {sortedChildren.map((child) => (
            <SectionPreview
              key={child.id}
              section={child}
              locale={locale}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function MenuPreviewPage() {
  const status = useAdminAuth()

  const [snapshot, setSnapshot] = useState<MenuSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locale, setLocale] = useState<Locale>('es')

  // Fetch draft preview
  useEffect(() => {
    if (status !== 'authenticated') return

    const fetchPreview = async () => {
      try {
        const res = await fetch('/api/admin/menu/preview')
        const json = await res.json()
        if (json.success) {
          setSnapshot(json.data)
        } else {
          setError(json.error || 'Error al cargar la previsualizacion')
        }
      } catch {
        setError('Error de conexion al cargar la previsualizacion')
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [status])

  // Loading state
  if (loading || status === 'loading') {
    return (
      <AdminShell title="Previsualizacion">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a96e] border-t-transparent" />
        </div>
      </AdminShell>
    )
  }

  // Error state
  if (error) {
    return (
      <AdminShell title="Previsualizacion">
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="text-lg mb-4">{error}</p>
          <Link
            href="/admin/menu"
            className="text-[#c9a96e] hover:text-[#b8944f] underline text-sm font-[family-name:var(--font-inter)]"
          >
            Volver al editor
          </Link>
        </div>
      </AdminShell>
    )
  }

  const sortedSections = snapshot
    ? [...snapshot.sections].sort((a, b) => a.displayOrder - b.displayOrder)
    : []

  return (
    <AdminShell title="Previsualizacion">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/menu"
          className="inline-flex items-center gap-2 text-sm text-[#c9a96e] hover:text-[#b8944f] font-[family-name:var(--font-inter)] transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver al editor
        </Link>

        {/* Locale tabs */}
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          {(Object.keys(LOCALE_LABELS) as Locale[]).map((loc) => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              className={`px-4 py-1.5 text-xs font-semibold font-[family-name:var(--font-inter)] transition-colors ${
                locale === loc
                  ? 'bg-[#c9a96e] text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      </div>

      {/* Preview card */}
      <div className="max-w-3xl mx-auto">
        {/* Menu header */}
        <div className="bg-[#1a1a2e] rounded-t-2xl px-8 py-10 text-center">
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-playfair)] tracking-wider uppercase">
            Carta de Servicios
          </h1>
          <div className="mt-3 w-16 h-px bg-[#c9a96e] mx-auto" />
          {snapshot && (
            <p className="text-xs text-gray-400 font-[family-name:var(--font-inter)] mt-4">
              Borrador &middot; v{snapshot.version} &middot;{' '}
              {snapshot.metadata.totalItems} servicios &middot;{' '}
              {snapshot.metadata.totalSections} secciones
            </p>
          )}
        </div>

        {/* Menu body */}
        <div className="bg-white rounded-b-2xl shadow-lg border border-gray-100 px-8 py-10">
          {sortedSections.length === 0 ? (
            <p className="text-center text-gray-400 text-sm font-[family-name:var(--font-inter)] py-12">
              No hay secciones en el borrador.
            </p>
          ) : (
            sortedSections.map((section) => (
              <SectionPreview
                key={section.id}
                section={section}
                locale={locale}
              />
            ))
          )}
        </div>
      </div>

      {/* Metadata footer */}
      {snapshot && (
        <div className="max-w-3xl mx-auto mt-4 text-center">
          <p className="text-xs text-gray-400 font-[family-name:var(--font-inter)]">
            Generado: {new Date(snapshot.metadata.generatedAt).toLocaleString('es-ES')} &middot;{' '}
            {snapshot.metadata.totalSections} secciones &middot;{' '}
            {snapshot.metadata.totalItems} servicios &middot;{' '}
            {snapshot.metadata.totalVariants} variantes
          </p>
        </div>
      )}
    </AdminShell>
  )
}
