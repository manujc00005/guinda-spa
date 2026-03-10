import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

export type MenuData = Awaited<ReturnType<typeof fetchMenuFromDB>>

async function fetchMenuFromDB() {
  const sections = await prisma.menuSection.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      parentId: null,
    },
    include: {
      items: {
        where: { isActive: true, deletedAt: null },
        include: {
          variants: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
          },
          notes: { orderBy: { displayOrder: 'asc' } },
        },
        orderBy: { displayOrder: 'asc' },
      },
      children: {
        where: { isActive: true, deletedAt: null },
        include: {
          items: {
            where: { isActive: true, deletedAt: null },
            include: {
              variants: {
                where: { isActive: true },
                orderBy: { displayOrder: 'asc' },
              },
              notes: { orderBy: { displayOrder: 'asc' } },
            },
            orderBy: { displayOrder: 'asc' },
          },
          notes: { orderBy: { displayOrder: 'asc' } },
        },
        orderBy: { displayOrder: 'asc' },
      },
      notes: { orderBy: { displayOrder: 'asc' } },
    },
    orderBy: { displayOrder: 'asc' },
  })

  return sections
}

/**
 * Cached menu data fetcher.
 * Uses Next.js unstable_cache with 'menu' tag for on-demand revalidation.
 * Data is cached for 1 hour and revalidated when admin saves changes.
 */
export const getMenuData = unstable_cache(fetchMenuFromDB, ['menu-sections'], {
  tags: ['menu'],
  revalidate: 3600,
})
