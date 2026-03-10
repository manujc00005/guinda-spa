import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ versionId: string }> }
) {
  try {
    const session = await requireAuth()

    const { versionId } = await params

    const version = await prisma.menuVersion.findUnique({
      where: { id: versionId },
      include: {
        publisher: {
          select: { name: true, email: true },
        },
      },
    })

    if (!version) {
      return NextResponse.json(
        { success: false, error: 'Versión no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: version })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Error fetching version:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
