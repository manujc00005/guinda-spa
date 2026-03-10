import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'
import { deserializeVersion } from '@/lib/menu/deserialize'
import type { MenuSnapshot } from '@/lib/types/menu'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ versionId: string }> }
) {
  try {
    await requireAuth()

    const { versionId } = await params

    const version = await prisma.menuVersion.findUnique({
      where: { id: versionId },
    })

    if (!version) {
      return NextResponse.json(
        { success: false, error: 'Versión no encontrada' },
        { status: 404 }
      )
    }

    await deserializeVersion(version.data as unknown as MenuSnapshot)

    return NextResponse.json({
      success: true,
      data: { message: 'Borrador restaurado a versión v' + version.version },
    })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Error rolling back version:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
