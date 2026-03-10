import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: Promise<{ sectionId: string }> }

// PATCH /api/admin/menu/sections/[sectionId]/reorder
// Reorder items within a section.
// Body: { itemIds: string[] }
// Auth: EDITOR+
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()

    const { sectionId } = await params
    const body = await request.json()
    const { itemIds } = body

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'itemIds debe ser un array no vacío' },
        { status: 400 }
      )
    }

    // Verify section exists
    const section = await prisma.menuSection.findUnique({
      where: { id: sectionId },
    })

    if (!section || section.deletedAt) {
      return NextResponse.json(
        { success: false, error: 'Sección no encontrada' },
        { status: 404 }
      )
    }

    // Update displayOrder of each item based on array index
    await prisma.$transaction(
      itemIds.map((itemId: string, index: number) =>
        prisma.menuItem.update({
          where: { id: itemId },
          data: { displayOrder: index },
        })
      )
    )

    return NextResponse.json({ success: true, data: { reordered: itemIds.length } })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PATCH /api/admin/menu/sections/[sectionId]/reorder error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
