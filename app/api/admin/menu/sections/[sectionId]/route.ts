import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: Promise<{ sectionId: string }> }

// GET /api/admin/menu/sections/[sectionId]
// Get single section with items (and their variants), notes.
// Auth: any role (VIEWER+)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()

    const { sectionId } = await params

    const section = await prisma.menuSection.findUnique({
      where: { id: sectionId },
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
        },
      },
    })

    if (!section || section.deletedAt) {
      return NextResponse.json(
        { success: false, error: 'Sección no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: section })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('GET /api/admin/menu/sections/[sectionId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/menu/sections/[sectionId]
// Update section fields.
// Auth: EDITOR+
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()

    const { sectionId } = await params
    const body = await request.json()

    const existing = await prisma.menuSection.findUnique({
      where: { id: sectionId },
    })

    if (!existing || existing.deletedAt) {
      return NextResponse.json(
        { success: false, error: 'Sección no encontrada' },
        { status: 404 }
      )
    }

    const { slug, name, description, subtitle, type, icon, parentId, displayOrder, isActive } = body

    const section = await prisma.menuSection.update({
      where: { id: sectionId },
      data: {
        ...(slug !== undefined && { slug }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(subtitle !== undefined && { subtitle }),
        ...(type !== undefined && { type }),
        ...(icon !== undefined && { icon }),
        ...(parentId !== undefined && { parentId }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    revalidateTag('menu', 'default')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: section })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PUT /api/admin/menu/sections/[sectionId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/menu/sections/[sectionId]
// Soft delete (set deletedAt).
// Auth: ADMIN
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()

    const { sectionId } = await params

    const existing = await prisma.menuSection.findUnique({
      where: { id: sectionId },
    })

    if (!existing || existing.deletedAt) {
      return NextResponse.json(
        { success: false, error: 'Sección no encontrada' },
        { status: 404 }
      )
    }

    const section = await prisma.menuSection.update({
      where: { id: sectionId },
      data: { deletedAt: new Date() },
    })

    revalidateTag('menu', 'default')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: section })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('DELETE /api/admin/menu/sections/[sectionId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
