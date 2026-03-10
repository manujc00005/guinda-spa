import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600

export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.menuSettings.findUnique({
      where: { id: 'singleton' },
    })

    if (!settings?.currentPublishedVersionId) {
      return NextResponse.json(
        { success: false, error: 'No hay carta publicada' },
        { status: 404 }
      )
    }

    const version = await prisma.menuVersion.findUnique({
      where: { id: settings.currentPublishedVersionId },
      select: { data: true },
    })

    if (!version) {
      return NextResponse.json(
        { success: false, error: 'No hay carta publicada' },
        { status: 404 }
      )
    }

    return NextResponse.json(version.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching public menu:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
