import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

// POST /api/admin/menu/items
// Create new item.
// Body: { sectionId, slug, name, description?, shortDescription?, tags?, savingsLabel?, totalDuration? }
// Auth: EDITOR+
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const { sectionId, slug, name, description, shortDescription, tags, savingsLabel, totalDuration } = body

    if (!sectionId || !slug || !name) {
      return NextResponse.json(
        { success: false, error: 'sectionId, slug y name son obligatorios' },
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

    // Auto-set displayOrder to max+1 within section
    const maxOrder = await prisma.menuItem.aggregate({
      _max: { displayOrder: true },
      where: { sectionId, deletedAt: null },
    })
    const displayOrder = (maxOrder._max.displayOrder ?? -1) + 1

    const item = await prisma.menuItem.create({
      data: {
        sectionId,
        slug,
        name,
        description: description ?? undefined,
        shortDescription: shortDescription ?? undefined,
        tags: tags ?? undefined,
        savingsLabel: savingsLabel ?? undefined,
        totalDuration: totalDuration ?? undefined,
        displayOrder,
      },
    })

    revalidateTag('menu', 'default')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: item }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/admin/menu/items error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
