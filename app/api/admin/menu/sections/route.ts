import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

// GET /api/admin/menu/sections
// List all sections ordered by displayOrder, with item count.
// Query param ?includeInactive=true to include inactive sections.
// Auth: any role (VIEWER+)
export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const sections = await prisma.menuSection.findMany({
      where: {
        deletedAt: null,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: sections })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('GET /api/admin/menu/sections error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/menu/sections
// Create a new section.
// Body: { slug, name, description?, subtitle?, type?, icon?, parentId?, displayOrder? }
// Auth: EDITOR+
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const { slug, name, description, subtitle, type, icon, parentId, displayOrder } = body

    if (!slug || !name) {
      return NextResponse.json(
        { success: false, error: 'slug y name son obligatorios' },
        { status: 400 }
      )
    }

    // Auto-set displayOrder to max+1 if not provided
    let finalDisplayOrder = displayOrder
    if (finalDisplayOrder === undefined || finalDisplayOrder === null) {
      const maxOrder = await prisma.menuSection.aggregate({
        _max: { displayOrder: true },
        where: { deletedAt: null },
      })
      finalDisplayOrder = (maxOrder._max.displayOrder ?? -1) + 1
    }

    const section = await prisma.menuSection.create({
      data: {
        slug,
        name,
        description: description ?? undefined,
        subtitle: subtitle ?? undefined,
        type: type ?? undefined,
        icon: icon ?? undefined,
        parentId: parentId ?? undefined,
        displayOrder: finalDisplayOrder,
      },
    })

    revalidateTag('menu', 'default')
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: section }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/admin/menu/sections error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
