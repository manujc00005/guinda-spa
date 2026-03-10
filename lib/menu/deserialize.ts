import { prisma } from '@/lib/prisma'
import type { MenuSnapshot, MenuSnapshotSection } from '@/lib/types/menu'

/**
 * Deserialize a MenuSnapshot JSON back into the relational tables.
 * This REPLACES all current draft data (destructive operation).
 * Used by: rollback
 */
export async function deserializeVersion(snapshot: MenuSnapshot): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // 1. Delete all existing menu data (cascade will handle children)
    await tx.menuNote.deleteMany()
    await tx.menuItemVariant.deleteMany()
    await tx.menuItem.deleteMany()
    await tx.menuSection.deleteMany()

    // 2. Recreate sections, items, variants, and notes from snapshot
    for (const section of snapshot.sections) {
      await createSection(tx, section, null)
    }
  })
}

async function createSection(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  section: MenuSnapshotSection,
  parentId: string | null
): Promise<void> {
  // Create the section
  await tx.menuSection.create({
    data: {
      id: section.id,
      slug: section.slug,
      name: section.name,
      description: section.description ?? undefined,
      subtitle: section.subtitle ?? undefined,
      displayOrder: section.displayOrder,
      isActive: section.isActive,
      type: section.type as 'STANDARD' | 'PACKAGES' | 'COUPLES' | 'SINGLE_SERVICE' | 'INFO' | 'SUBSECTION',
      icon: section.icon,
      parentId: parentId,
    },
  })

  // Create section notes
  for (const note of section.notes) {
    await tx.menuNote.create({
      data: {
        id: note.id,
        parentType: 'SECTION',
        sectionId: section.id,
        content: note.content,
        displayOrder: note.displayOrder,
        style: note.style,
      },
    })
  }

  // Create items
  for (const item of section.items) {
    await tx.menuItem.create({
      data: {
        id: item.id,
        sectionId: section.id,
        slug: item.slug,
        name: item.name,
        description: item.description ?? undefined,
        shortDescription: item.shortDescription ?? undefined,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        tags: item.tags ?? undefined,
        savingsLabel: item.savingsLabel ?? undefined,
        totalDuration: item.totalDuration,
        operationalServiceId: item.operationalServiceId,
        operationalPackageId: item.operationalPackageId,
      },
    })

    // Create item variants
    for (const variant of item.variants) {
      await tx.menuItemVariant.create({
        data: {
          id: variant.id,
          itemId: item.id,
          label: variant.label,
          duration: variant.duration,
          durationUnit: variant.durationUnit as 'MINUTES' | 'HOURS' | 'SESSIONS',
          price: variant.price,
          notes: variant.notes ?? undefined,
          displayOrder: variant.displayOrder,
          isActive: variant.isActive,
        },
      })
    }

    // Create item notes
    for (const note of item.notes) {
      await tx.menuNote.create({
        data: {
          id: note.id,
          parentType: 'ITEM',
          itemId: item.id,
          content: note.content,
          displayOrder: note.displayOrder,
          style: note.style,
        },
      })
    }
  }

  // Recursively create child sections
  for (const child of section.children) {
    await createSection(tx, child, section.id)
  }
}
