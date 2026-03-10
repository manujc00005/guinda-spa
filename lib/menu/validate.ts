import { prisma } from '@/lib/prisma'
import type { LocalizedText, ValidationResult, ValidationError } from '@/lib/types/menu'

/**
 * Validate the current draft for publish readiness.
 * Returns errors (blocking) and warnings (non-blocking).
 */
export async function validateDraft(): Promise<ValidationResult> {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Fetch all active sections with their items and variants
  const sections = await prisma.menuSection.findMany({
    where: { deletedAt: null },
    include: {
      items: {
        where: { deletedAt: null },
        include: {
          variants: true,
        },
      },
    },
  })

  const activeSections = sections.filter((s) => s.isActive)

  // Rule: At least one active section must exist
  if (activeSections.length === 0) {
    errors.push({
      type: 'section',
      id: '',
      name: 'General',
      field: 'sections',
      message: 'Debe existir al menos una sección activa',
    })
  }

  for (const section of sections) {
    const sectionName = getEsName(section.name)

    // Rule: Every section must have name.es
    if (!sectionName) {
      errors.push({
        type: 'section',
        id: section.id,
        name: section.slug,
        field: 'name.es',
        message: 'La sección debe tener un nombre en español',
      })
    }

    if (!section.isActive) continue // Skip inactive sections for further validation

    const activeItems = section.items.filter((i) => i.isActive)

    // Rule: STANDARD/PACKAGES/COUPLES sections should have at least one active item
    if (
      ['STANDARD', 'PACKAGES', 'COUPLES', 'SINGLE_SERVICE'].includes(section.type) &&
      activeItems.length === 0
    ) {
      warnings.push({
        type: 'section',
        id: section.id,
        name: sectionName || section.slug,
        field: 'items',
        message: 'La sección activa no tiene servicios activos',
      })
    }

    for (const item of section.items) {
      const itemName = getEsName(item.name)

      // Rule: Every item must have name.es
      if (!itemName) {
        errors.push({
          type: 'item',
          id: item.id,
          name: item.slug,
          field: 'name.es',
          message: 'El servicio debe tener un nombre en español',
        })
      }

      if (!item.isActive) continue

      const activeVariants = item.variants.filter((v) => v.isActive)

      // Rule: Active items should have at least one variant (for pricing)
      if (activeVariants.length === 0 && section.type !== 'INFO') {
        warnings.push({
          type: 'item',
          id: item.id,
          name: itemName || item.slug,
          field: 'variants',
          message: 'El servicio activo no tiene variantes de precio',
        })
      }

      for (const variant of item.variants) {
        const variantLabel = getEsName(variant.label)

        // Rule: Every variant must have label.es
        if (!variantLabel) {
          errors.push({
            type: 'variant',
            id: variant.id,
            name: `${itemName} > variante`,
            field: 'label.es',
            message: 'La variante debe tener una etiqueta en español',
          })
        }

        // Rule: Every active variant must have price > 0
        if (variant.isActive && Number(variant.price) <= 0) {
          errors.push({
            type: 'variant',
            id: variant.id,
            name: `${itemName} > ${variantLabel || 'variante'}`,
            field: 'price',
            message: 'El precio debe ser mayor que 0',
          })
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

function getEsName(json: unknown): string {
  if (!json || typeof json !== 'object') return ''
  return (json as LocalizedText).es || ''
}
