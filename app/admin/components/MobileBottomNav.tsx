// ========================================
// Bottom tab bar para navegación mobile
// 3 tabs: Carta, Ofertas, Bonos
// ========================================

'use client'

import { usePathname, useRouter } from 'next/navigation'

interface TabItem {
  label: string
  href: string
  // Inline SVG paths for each icon
  iconPath: string
}

const tabs: TabItem[] = [
  {
    label: 'Carta',
    href: '/admin/carta',
    iconPath: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20',
  },
  {
    label: 'Ofertas',
    href: '/admin/ofertas',
    iconPath: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
  },
  {
    label: 'Bonos',
    href: '/admin/bonos',
    iconPath: 'M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6M2 8h20v4H2zM12 2v6M12 12v8',
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a2e] border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={`
                flex flex-col items-center justify-center gap-1 flex-1 h-full
                min-w-[64px] min-h-[44px]
                transition-colors
                ${active ? 'text-[#c9a96e]' : 'text-white/40 active:text-white/60'}
              `}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.iconPath} />
              </svg>
              <span className={`text-[10px] font-medium ${active ? 'text-[#c9a96e]' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
