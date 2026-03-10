import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// GET /api/admin/ofertas — lista todas las ofertas ordenadas
export async function GET() {
  try {
    await requireAuth()
    const ofertas = await prisma.oferta.findMany({
      orderBy: { orden: 'asc' },
    })
    return NextResponse.json({ success: true, data: ofertas })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('GET /api/admin/ofertas:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// POST /api/admin/ofertas — crear oferta
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { titulo, descripcion, precio, detalle, ctaLabel, ctaHref, destacado, activo, orden } = body

    if (!titulo || !descripcion || !precio) {
      return NextResponse.json(
        { success: false, error: 'titulo, descripcion y precio son obligatorios' },
        { status: 400 }
      )
    }

    // Si orden no viene, poner al final
    let finalOrden = orden
    if (finalOrden === undefined || finalOrden === null) {
      const max = await prisma.oferta.aggregate({ _max: { orden: true } })
      finalOrden = (max._max.orden ?? -1) + 1
    }

    const oferta = await prisma.oferta.create({
      data: {
        titulo,
        descripcion,
        precio,
        detalle: detalle ?? null,
        ctaLabel: ctaLabel ?? 'Reservar',
        ctaHref: ctaHref ?? '#reservar',
        destacado: destacado ?? false,
        activo: activo ?? true,
        orden: finalOrden,
      },
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: oferta }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/admin/ofertas:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
