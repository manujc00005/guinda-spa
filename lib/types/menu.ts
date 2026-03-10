// ============================================================================
// MENU SYSTEM TYPES
// ============================================================================

/**
 * Localized text stored as JSON in the database.
 * ES is always required; EN/FR are optional with fallback to ES.
 */
export type LocalizedText = {
  es: string
  en?: string
  fr?: string
}

// ============================================================================
// SNAPSHOT TYPES (stored in MenuVersion.data JSON)
// ============================================================================

export interface MenuSnapshotVariant {
  id: string
  label: LocalizedText
  duration: number | null
  durationUnit: string
  price: number
  notes: LocalizedText | null
  displayOrder: number
  isActive: boolean
}

export interface MenuSnapshotNote {
  id: string
  content: LocalizedText
  displayOrder: number
  style: string
}

export interface MenuSnapshotItem {
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
  operationalServiceId: string | null
  operationalPackageId: string | null
  variants: MenuSnapshotVariant[]
  notes: MenuSnapshotNote[]
}

export interface MenuSnapshotSection {
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
  items: MenuSnapshotItem[]
  notes: MenuSnapshotNote[]
  children: MenuSnapshotSection[]
}

export interface MenuSnapshot {
  version: number
  publishedAt: string
  sections: MenuSnapshotSection[]
  metadata: {
    totalSections: number
    totalItems: number
    totalVariants: number
    generatedAt: string
  }
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface AdminSession {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  type: 'section' | 'item' | 'variant'
  id: string
  name: string
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

// ============================================================================
// DIFF TYPES
// ============================================================================

export interface DiffChange {
  field: string
  oldValue: unknown
  newValue: unknown
}

export interface DiffEntry {
  type: 'section' | 'item' | 'variant'
  id: string
  name: string
  changes: DiffChange[]
}

export interface SnapshotDiff {
  added: {
    sections: string[]
    items: string[]
    variants: string[]
  }
  removed: {
    sections: string[]
    items: string[]
    variants: string[]
  }
  modified: DiffEntry[]
}

// ============================================================================
// HELPER
// ============================================================================

/**
 * Resolve a LocalizedText to a string for a given locale.
 * Falls back to ES if the requested locale is not available.
 */
export function resolveLocalizedText(
  text: LocalizedText | null | undefined,
  locale: string
): string {
  if (!text) return ''
  return (text as Record<string, string | undefined>)[locale] || text.es || ''
}
