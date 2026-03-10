import type {
  MenuSnapshot,
  MenuSnapshotSection,
  MenuSnapshotItem,
  MenuSnapshotVariant,
  SnapshotDiff,
  DiffEntry,
  DiffChange,
  LocalizedText,
} from '@/lib/types/menu'

/**
 * Compare two MenuSnapshot objects and return a structured diff.
 * `base` is the published version, `current` is the draft.
 */
export function diffSnapshots(base: MenuSnapshot, current: MenuSnapshot): SnapshotDiff {
  const added = { sections: [] as string[], items: [] as string[], variants: [] as string[] }
  const removed = { sections: [] as string[], items: [] as string[], variants: [] as string[] }
  const modified: DiffEntry[] = []

  const baseSections = flattenSections(base.sections)
  const currentSections = flattenSections(current.sections)

  const baseSectionMap = new Map(baseSections.map((s) => [s.id, s]))
  const currentSectionMap = new Map(currentSections.map((s) => [s.id, s]))

  // Find added/removed/modified sections
  for (const [id, section] of currentSectionMap) {
    if (!baseSectionMap.has(id)) {
      added.sections.push(getLocalizedName(section.name))
    } else {
      const changes = diffSection(baseSectionMap.get(id)!, section)
      if (changes.length > 0) {
        modified.push({
          type: 'section',
          id,
          name: getLocalizedName(section.name),
          changes,
        })
      }
    }
  }

  for (const [id, section] of baseSectionMap) {
    if (!currentSectionMap.has(id)) {
      removed.sections.push(getLocalizedName(section.name))
    }
  }

  // Find added/removed/modified items
  const baseItems = flattenItems(baseSections)
  const currentItems = flattenItems(currentSections)
  const baseItemMap = new Map(baseItems.map((i) => [i.id, i]))
  const currentItemMap = new Map(currentItems.map((i) => [i.id, i]))

  for (const [id, item] of currentItemMap) {
    if (!baseItemMap.has(id)) {
      added.items.push(getLocalizedName(item.name))
    } else {
      const changes = diffItem(baseItemMap.get(id)!, item)
      if (changes.length > 0) {
        modified.push({
          type: 'item',
          id,
          name: getLocalizedName(item.name),
          changes,
        })
      }
    }
  }

  for (const [id, item] of baseItemMap) {
    if (!currentItemMap.has(id)) {
      removed.items.push(getLocalizedName(item.name))
    }
  }

  // Find added/removed/modified variants
  const baseVariants = flattenVariants(baseItems)
  const currentVariants = flattenVariants(currentItems)
  const baseVariantMap = new Map(baseVariants.map((v) => [v.id, v]))
  const currentVariantMap = new Map(currentVariants.map((v) => [v.id, v]))

  for (const [id, variant] of currentVariantMap) {
    if (!baseVariantMap.has(id)) {
      added.variants.push(getLocalizedName(variant.label))
    } else {
      const changes = diffVariant(baseVariantMap.get(id)!, variant)
      if (changes.length > 0) {
        modified.push({
          type: 'variant',
          id,
          name: getLocalizedName(variant.label),
          changes,
        })
      }
    }
  }

  for (const [id, variant] of baseVariantMap) {
    if (!currentVariantMap.has(id)) {
      removed.variants.push(getLocalizedName(variant.label))
    }
  }

  return { added, removed, modified }
}

// --- Helpers ---

function flattenSections(sections: MenuSnapshotSection[]): MenuSnapshotSection[] {
  const result: MenuSnapshotSection[] = []
  for (const s of sections) {
    result.push(s)
    if (s.children) {
      result.push(...flattenSections(s.children))
    }
  }
  return result
}

function flattenItems(sections: MenuSnapshotSection[]): MenuSnapshotItem[] {
  return sections.flatMap((s) => s.items)
}

function flattenVariants(items: MenuSnapshotItem[]): MenuSnapshotVariant[] {
  return items.flatMap((i) => i.variants)
}

function getLocalizedName(text: LocalizedText): string {
  return text.es || text.en || text.fr || '(sin nombre)'
}

function diffSection(base: MenuSnapshotSection, current: MenuSnapshotSection): DiffChange[] {
  const changes: DiffChange[] = []
  if (JSON.stringify(base.name) !== JSON.stringify(current.name)) {
    changes.push({ field: 'name', oldValue: base.name, newValue: current.name })
  }
  if (JSON.stringify(base.description) !== JSON.stringify(current.description)) {
    changes.push({ field: 'description', oldValue: base.description, newValue: current.description })
  }
  if (base.displayOrder !== current.displayOrder) {
    changes.push({ field: 'displayOrder', oldValue: base.displayOrder, newValue: current.displayOrder })
  }
  if (base.isActive !== current.isActive) {
    changes.push({ field: 'isActive', oldValue: base.isActive, newValue: current.isActive })
  }
  if (base.type !== current.type) {
    changes.push({ field: 'type', oldValue: base.type, newValue: current.type })
  }
  return changes
}

function diffItem(base: MenuSnapshotItem, current: MenuSnapshotItem): DiffChange[] {
  const changes: DiffChange[] = []
  if (JSON.stringify(base.name) !== JSON.stringify(current.name)) {
    changes.push({ field: 'name', oldValue: base.name, newValue: current.name })
  }
  if (JSON.stringify(base.description) !== JSON.stringify(current.description)) {
    changes.push({ field: 'description', oldValue: base.description, newValue: current.description })
  }
  if (base.displayOrder !== current.displayOrder) {
    changes.push({ field: 'displayOrder', oldValue: base.displayOrder, newValue: current.displayOrder })
  }
  if (base.isActive !== current.isActive) {
    changes.push({ field: 'isActive', oldValue: base.isActive, newValue: current.isActive })
  }
  if (JSON.stringify(base.tags) !== JSON.stringify(current.tags)) {
    changes.push({ field: 'tags', oldValue: base.tags, newValue: current.tags })
  }
  return changes
}

function diffVariant(base: MenuSnapshotVariant, current: MenuSnapshotVariant): DiffChange[] {
  const changes: DiffChange[] = []
  if (JSON.stringify(base.label) !== JSON.stringify(current.label)) {
    changes.push({ field: 'label', oldValue: base.label, newValue: current.label })
  }
  if (base.price !== current.price) {
    changes.push({ field: 'price', oldValue: base.price, newValue: current.price })
  }
  if (base.duration !== current.duration) {
    changes.push({ field: 'duration', oldValue: base.duration, newValue: current.duration })
  }
  if (base.isActive !== current.isActive) {
    changes.push({ field: 'isActive', oldValue: base.isActive, newValue: current.isActive })
  }
  if (JSON.stringify(base.notes) !== JSON.stringify(current.notes)) {
    changes.push({ field: 'notes', oldValue: base.notes, newValue: current.notes })
  }
  return changes
}
