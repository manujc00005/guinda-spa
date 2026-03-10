import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

// POST /api/admin/menu/notes
// Create new note.
// Body: { parentType, sectionId?, itemId?, content, style?, displayOrder? }
// Auth: EDITOR+
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const { parentType, sectionId, itemId, content, style, displayOrder } = body

    if (!parentType || !content) {
      return NextResponse.json(
        { success: false, error: 'parentType y content son obligatorios' },
        { status: 400 }
      )
    }

    if (parentType === 'SECTION' && !sectionId) {
      return NextResponse.json(
        { success: false, error: 'sectionId es obligatorio para notas de sección' },
        { status: 400 }
      )
    }

    if (parentType === 'ITEM' && !itemId) {
      return NextResponse.json(
        { success: false, error: 'itemId es obligatorio para notas de item' },
        { status: 400 }
      )
    }

    // Auto-set displayOrder to max+1 if not provided
    let finalDisplayOrder = displayOrder
    if (finalDisplayOrder === undefined || finalDisplayOrder === null) {
      const whereClause = parentType === 'SECTION'
        ? { sectionId: sectionId! }
        : { itemId: itemId! }

      const maxOrder = await prisma.menuNote.aggregate({
        _max: { displayOrder: true },
        where: whereClause,
      })
      finalDisplayOrder = (maxOrder._max.displayOrder ?? -1) + 1
    }

    const note = await prisma.menuNote.create({
      data: {
        parentType,
        sectionId: sectionId ?? undefined,
        itemId: itemId ?? undefined,
        content,
        style: style ?? undefined,
        displayOrder: finalDisplayOrder,
      },
    })

    return NextResponse.json({ success: true, data: note }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/admin/menu/notes error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
