import type { MenuSnapshot } from '@/lib/types/menu'

/**
 * Fetch the published menu from the public API.
 * Uses Next.js cache with tag-based revalidation.
 */
export async function getPublicMenu(): Promise<MenuSnapshot | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/menu/public`, {
      next: { tags: ['menu-public'], revalidate: 3600 },
    })

    if (!res.ok) return null

    const json = await res.json()
    if (!json.success || !json.data) return null

    return json.data as MenuSnapshot
  } catch {
    console.error('Error fetching public menu')
    return null
  }
}
