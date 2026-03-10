import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/menu/reorder
// Reorder top-level sections.
// Body: { sectionIds: string[] }
// Auth: EDITOR+
export async function PATCH(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const { sectionIds } = body

    if (!Array.isArray(sectionIds) || sectionIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'sectionIds debe ser un array no vacío' },
        { status: 400 }
      )
    }

    // Update displayOrder of each section based on array index
    await prisma.$transaction(
      sectionIds.map((sectionId: string, index: number) =>
        prisma.menuSection.update({
          where: { id: sectionId },
          data: { displayOrder: index },
        })
      )
    )

    return NextResponse.json({ success: true, data: { reordered: sectionIds.length } })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PATCH /api/admin/menu/reorder error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
