'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  label: string
  href: string
  icon: string
}

// ---------------------------------------------------------------------------
// Navigation items
// ---------------------------------------------------------------------------

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Editor de Carta', href: '/admin/menu', icon: '📝' },
  { label: 'Versiones', href: '/admin/menu/versions', icon: '📋' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed top-0 left-0 z-50 h-screen bg-[#1a1a2e] text-white flex flex-col',
          'transition-transform duration-200 ease-in-out',
          'w-64 lg:translate-x-0',
          collapsed ? '-translate-x-full' : 'translate-x-0',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <Link
            href="/admin"
            className="text-xl font-bold tracking-wide font-[family-name:var(--font-playfair)] text-[#c9a96e]"
          >
            Guinda Admin
          </Link>

          {/* Close button — mobile only */}
          <button
            type="button"
            onClick={onToggle}
            className="lg:hidden p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (window.innerWidth < 1024) onToggle()
                    }}
                    className={[
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                      'font-[family-name:var(--font-inter)] transition-colors relative',
                      active
                        ? 'bg-white/10 text-[#c9a96e]'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white',
                    ].join(' ')}
                  >
                    {/* Gold accent bar for active item */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#c9a96e] rounded-r" />
                    )}
                    <span className="text-base" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-gray-400 font-[family-name:var(--font-inter)]">
            &copy; {new Date().getFullYear()} Guinda Spa
          </p>
        </div>
      </aside>
    </>
  )
}
