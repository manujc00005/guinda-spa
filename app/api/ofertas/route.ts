import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/ofertas — endpoint público, sin auth
export async function GET() {
  try {
    const ofertas = await prisma.oferta.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    })
    return NextResponse.json({ success: true, data: ofertas })
  } catch (error) {
    console.error('GET /api/ofertas:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
