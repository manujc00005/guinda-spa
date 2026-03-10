import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// PUT /api/admin/ofertas/[id] — actualizar oferta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await request.json()
    const { titulo, descripcion, precio, detalle, ctaLabel, ctaHref, destacado, activo, orden } = body

    const oferta = await prisma.oferta.update({
      where: { id },
      data: {
        ...(titulo !== undefined && { titulo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(precio !== undefined && { precio }),
        ...(detalle !== undefined && { detalle }),
        ...(ctaLabel !== undefined && { ctaLabel }),
        ...(ctaHref !== undefined && { ctaHref }),
        ...(destacado !== undefined && { destacado }),
        ...(activo !== undefined && { activo }),
        ...(orden !== undefined && { orden }),
      },
    })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: oferta })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PUT /api/admin/ofertas/[id]:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

// DELETE /api/admin/ofertas/[id] — eliminar oferta
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    await prisma.oferta.delete({ where: { id } })

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('DELETE /api/admin/ofertas/[id]:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
