import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: Promise<{ variantId: string }> }

// PUT /api/admin/menu/variants/[variantId]
// Update variant fields.
// Auth: EDITOR+
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()

    const { variantId } = await params
    const body = await request.json()

    const existing = await prisma.menuItemVariant.findUnique({
      where: { id: variantId },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Variante no encontrada' },
        { status: 404 }
      )
    }

    const { label, duration, durationUnit, price, notes, displayOrder, isActive } = body

    const variant = await prisma.menuItemVariant.update({
      where: { id: variantId },
      data: {
        ...(label !== undefined && { label }),
        ...(duration !== undefined && { duration }),
        ...(durationUnit !== undefined && { durationUnit }),
        ...(price !== undefined && { price }),
        ...(notes !== undefined && { notes }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    revalidateTag('menu', 'default')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: variant })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PUT /api/admin/menu/variants/[variantId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/menu/variants/[variantId]
// Hard delete.
// Auth: EDITOR+
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth()

    const { variantId } = await params

    const existing = await prisma.menuItemVariant.findUnique({
      where: { id: variantId },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Variante no encontrada' },
        { status: 404 }
      )
    }

    await prisma.menuItemVariant.delete({
      where: { id: variantId },
    })

    revalidateTag('menu', 'default')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: { deleted: true } })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('DELETE /api/admin/menu/variants/[variantId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
