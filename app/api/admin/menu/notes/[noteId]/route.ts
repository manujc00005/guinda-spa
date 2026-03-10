import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: Promise<{ noteId: string }> }

// PUT /api/admin/menu/notes/[noteId]
// Update note fields.
// Auth: EDITOR+
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()

    const { noteId } = await params
    const body = await request.json()

    const existing = await prisma.menuNote.findUnique({
      where: { id: noteId },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Nota no encontrada' },
        { status: 404 }
      )
    }

    const { content, style, displayOrder, parentType, sectionId, itemId } = body

    const note = await prisma.menuNote.update({
      where: { id: noteId },
      data: {
        ...(content !== undefined && { content }),
        ...(style !== undefined && { style }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(parentType !== undefined && { parentType }),
        ...(sectionId !== undefined && { sectionId }),
        ...(itemId !== undefined && { itemId }),
      },
    })

    return NextResponse.json({ success: true, data: note })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PUT /api/admin/menu/notes/[noteId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/menu/notes/[noteId]
// Hard delete.
// Auth: EDITOR+
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()

    const { noteId } = await params

    const existing = await prisma.menuNote.findUnique({
      where: { id: noteId },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Nota no encontrada' },
        { status: 404 }
      )
    }

    await prisma.menuNote.delete({
      where: { id: noteId },
    })

    return NextResponse.json({ success: true, data: { deleted: true } })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('DELETE /api/admin/menu/notes/[noteId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
