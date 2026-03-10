import { prisma } from '@/lib/prisma'
import type {
  MenuSnapshot,
  MenuSnapshotSection,
  MenuSnapshotItem,
  MenuSnapshotVariant,
  MenuSnapshotNote,
  LocalizedText,
} from '@/lib/types/menu'

/**
 * Serialize the current draft (relational tables) into a MenuSnapshot JSON.
 * Used by: publish, preview, diff
 */
export async function serializeDraft(): Promise<MenuSnapshot> {
  // Fetch all top-level sections (no parent) with nested data
  const sections = await prisma.menuSection.findMany({
    where: { parentId: null, deletedAt: null },
    orderBy: { displayOrder: 'asc' },
    include: {
      items: {
        where: { deletedAt: null },
        orderBy: { displayOrder: 'asc' },
        include: {
          variants: {
            orderBy: { displayOrder: 'asc' },
          },
          notes: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      },
      notes: {
        orderBy: { displayOrder: 'asc' },
      },
      children: {
        where: { deletedAt: null },
        orderBy: { displayOrder: 'asc' },
        include: {
          items: {
            where: { deletedAt: null },
            orderBy: { displayOrder: 'asc' },
            include: {
              variants: {
                orderBy: { displayOrder: 'asc' },
              },
              notes: {
                orderBy: { displayOrder: 'asc' },
              },
            },
          },
          notes: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      },
    },
  })

  let totalItems = 0
  let totalVariants = 0

  function serializeNote(note: {
    id: string
    content: unknown
    displayOrder: number
    style: string
  }): MenuSnapshotNote {
    return {
      id: note.id,
      content: note.content as LocalizedText,
      displayOrder: note.displayOrder,
      style: note.style,
    }
  }

  function serializeVariant(variant: {
    id: string
    label: unknown
    duration: number | null
    durationUnit: string
    price: { toNumber?: () => number } | number
    notes: unknown
    displayOrder: number
    isActive: boolean
  }): MenuSnapshotVariant {
    totalVariants++
    return {
      id: variant.id,
      label: variant.label as LocalizedText,
      duration: variant.duration,
      durationUnit: variant.durationUnit,
      price: typeof variant.price === 'object' && variant.price !== null && 'toNumber' in variant.price
        ? (variant.price as { toNumber: () => number }).toNumber()
        : Number(variant.price),
      notes: variant.notes as LocalizedText | null,
      displayOrder: variant.displayOrder,
      isActive: variant.isActive,
    }
  }

  function serializeItem(item: {
    id: string
    slug: string
    name: unknown
    description: unknown
    shortDescription: unknown
    displayOrder: number
    isActive: boolean
    tags: unknown
    savingsLabel: unknown
    totalDuration: string | null
    operationalServiceId: string | null
    operationalPackageId: string | null
    variants: Parameters<typeof serializeVariant>[0][]
    notes: Parameters<typeof serializeNote>[0][]
  }): MenuSnapshotItem {
    totalItems++
    return {
      id: item.id,
      slug: item.slug,
      name: item.name as LocalizedText,
      description: item.description as LocalizedText | null,
      shortDescription: item.shortDescription as LocalizedText | null,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
      tags: item.tags as string[] | null,
      savingsLabel: item.savingsLabel as LocalizedText | null,
      totalDuration: item.totalDuration,
      operationalServiceId: item.operationalServiceId,
      operationalPackageId: item.operationalPackageId,
      variants: item.variants.map(serializeVariant),
      notes: item.notes.map(serializeNote),
    }
  }

  function serializeSection(section: {
    id: string
    slug: string
    name: unknown
    description: unknown
    subtitle: unknown
    displayOrder: number
    isActive: boolean
    type: string
    icon: string | null
    parentId: string | null
    items: Parameters<typeof serializeItem>[0][]
    notes: Parameters<typeof serializeNote>[0][]
    children?: Parameters<typeof serializeSection>[0][]
  }): MenuSnapshotSection {
    return {
      id: section.id,
      slug: section.slug,
      name: section.name as LocalizedText,
      description: section.description as LocalizedText | null,
      subtitle: section.subtitle as LocalizedText | null,
      displayOrder: section.displayOrder,
      isActive: section.isActive,
      type: section.type,
      icon: section.icon,
      parentId: section.parentId,
      items: section.items.map(serializeItem),
      notes: section.notes.map(serializeNote),
      children: (section.children || []).map(serializeSection),
    }
  }

  const serializedSections = sections.map(serializeSection)

  // Count children sections too
  const childSectionCount = serializedSections.reduce(
    (acc, s) => acc + s.children.length,
    0
  )

  return {
    version: 0, // Will be set by the publish function
    publishedAt: new Date().toISOString(),
    sections: serializedSections,
    metadata: {
      totalSections: serializedSections.length + childSectionCount,
      totalItems,
      totalVariants,
      generatedAt: new Date().toISOString(),
    },
  }
}
