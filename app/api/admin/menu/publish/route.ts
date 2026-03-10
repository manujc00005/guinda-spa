import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'
import { validateDraft } from '@/lib/menu/validate'
import { serializeDraft } from '@/lib/menu/serialize'

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json().catch(() => ({}))

    // 1. Validate draft
    const validation = await validateDraft()
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: 'El borrador no es válido para publicar', data: validation.errors },
        { status: 400 }
      )
    }

    // 2. Serialize draft to snapshot
    const snapshot = await serializeDraft()

    // 3. Get next version number
    const lastVersion = await prisma.menuVersion.findFirst({
      orderBy: { version: 'desc' },
    })
    const nextVersion = (lastVersion?.version || 0) + 1

    // 4. Set version metadata on snapshot
    snapshot.version = nextVersion
    snapshot.publishedAt = new Date().toISOString()

    // 5. Archive previous published versions
    await prisma.menuVersion.updateMany({
      where: { status: 'PUBLISHED' },
      data: { status: 'ARCHIVED' },
    })

    // 6. Create new MenuVersion
    const newVersion = await prisma.menuVersion.create({
      data: {
        version: nextVersion,
        status: 'PUBLISHED',
        data: JSON.parse(JSON.stringify(snapshot)),
        changelog: body.changelog,
        publishedAt: new Date(),
        publishedBy: null,
      },
    })

    // 7. Upsert MenuSettings singleton
    await prisma.menuSettings.upsert({
      where: { id: 'singleton' },
      update: { currentPublishedVersionId: newVersion.id },
      create: { id: 'singleton', currentPublishedVersionId: newVersion.id },
    })

    // 8. Revalidate public menu cache
    try {
      revalidateTag('menu', 'default')
      revalidatePath('/', 'layout')
    } catch {
      // Ignore revalidation errors
    }

    // 9. Return success
    return NextResponse.json({
      success: true,
      data: { version: nextVersion, id: newVersion.id },
    })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Error publishing menu:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
