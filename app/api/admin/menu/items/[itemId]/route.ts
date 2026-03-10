import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: Promise<{ itemId: string }> }

// GET /api/admin/menu/items/[itemId]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()
    const { itemId } = await params

    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: {
        variants: { orderBy: { displayOrder: 'asc' } },
        notes: { orderBy: { displayOrder: 'asc' } },
      },
    })

    if (!item || item.deletedAt) {
      return NextResponse.json({ success: false, error: 'Item no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('GET /api/admin/menu/items/[itemId] error:', error)
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT /api/admin/menu/items/[itemId]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()
    const { itemId } = await params
    const body = await request.json()

    const existing = await prisma.menuItem.findUnique({ where: { id: itemId } })
    if (!existing || existing.deletedAt) {
      return NextResponse.json({ success: false, error: 'Item no encontrado' }, { status: 404 })
    }

    const {
      slug, name, description, shortDescription, displayOrder,
      isActive, tags, savingsLabel, totalDuration, sectionId,
      operationalServiceId, operationalPackageId,
    } = body

    const item = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        ...(slug !== undefined && { slug }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive }),
        ...(tags !== undefined && { tags }),
        ...(savingsLabel !== undefined && { savingsLabel }),
        ...(totalDuration !== undefined && { totalDuration }),
        ...(sectionId !== undefined && { sectionId }),
        ...(operationalServiceId !== undefined && { operationalServiceId }),
        ...(operationalPackageId !== undefined && { operationalPackageId }),
      },
    })

    revalidateTag('menu', 'default')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PUT /api/admin/menu/items/[itemId] error:', error)
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE /api/admin/menu/items/[itemId]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()
    const { itemId } = await params

    const existing = await prisma.menuItem.findUnique({ where: { id: itemId } })
    if (!existing || existing.deletedAt) {
      return NextResponse.json({ success: false, error: 'Item no encontrado' }, { status: 404 })
    }

    const item = await prisma.menuItem.update({
      where: { id: itemId },
      data: { deletedAt: new Date() },
    })

    revalidateTag('menu', 'default')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('DELETE /api/admin/menu/items/[itemId] error:', error)
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}
