import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '20', 10)))
    const skip = (page - 1) * pageSize

    const [versions, total] = await Promise.all([
      prisma.menuVersion.findMany({
        select: {
          id: true,
          version: true,
          status: true,
          changelog: true,
          publishedAt: true,
          publishedBy: true,
          publisher: {
            select: { name: true },
          },
          createdAt: true,
        },
        orderBy: { version: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.menuVersion.count(),
    ])

    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json({
      success: true,
      data: versions,
      pagination: { page, pageSize, total, totalPages },
    })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Error listing versions:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
