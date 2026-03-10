import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

// POST /api/admin/menu/variants
// Create new variant.
// Body: { itemId, label, duration?, durationUnit?, price, notes?, displayOrder? }
// Auth: EDITOR+
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const { itemId, label, duration, durationUnit, price, notes, displayOrder } = body

    if (!itemId || !label || price === undefined || price === null) {
      return NextResponse.json(
        { success: false, error: 'itemId, label y price son obligatorios' },
        { status: 400 }
      )
    }

    // Verify item exists
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
    })

    if (!item || item.deletedAt) {
      return NextResponse.json(
        { success: false, error: 'Item no encontrado' },
        { status: 404 }
      )
    }

    // Auto-set displayOrder to max+1 if not provided
    let finalDisplayOrder = displayOrder
    if (finalDisplayOrder === undefined || finalDisplayOrder === null) {
      const maxOrder = await prisma.menuItemVariant.aggregate({
        _max: { displayOrder: true },
        where: { itemId },
      })
      finalDisplayOrder = (maxOrder._max.displayOrder ?? -1) + 1
    }

    const variant = await prisma.menuItemVariant.create({
      data: {
        itemId,
        label,
        duration: duration ?? undefined,
        durationUnit: durationUnit ?? undefined,
        price,
        notes: notes ?? undefined,
        displayOrder: finalDisplayOrder,
      },
    })

    revalidateTag('menu', 'default')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: variant }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/admin/menu/variants error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
