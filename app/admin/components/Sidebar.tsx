'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

// ---------------------------------------------------------------------------
// SVG Icons (inline to avoid lucide-react dependency)
// ---------------------------------------------------------------------------

function IconCarta({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6" /><path d="M8 11h8" />
    </svg>
  )
}

function IconOfertas({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function IconBonos({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
      <path d="M2 8h20v4H2z" style={{ fill: 'none' }} />
      <path d="M12 2v6" /><path d="M12 12v8" />
      <path d="M12 2a3 3 0 0 0-3 3c0 1.66 3 3 3 3s3-1.34 3-3a3 3 0 0 0-3-3z" />
    </svg>
  )
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Navigation config
// ---------------------------------------------------------------------------

interface NavItem {
  label: string
  icon: React.FC<{ className?: string }>
  href: string
}

const navigation: NavItem[] = [
  { label: 'Carta de Servicios', icon: IconCarta, href: '/admin/carta' },
  { label: 'Ofertas', icon: IconOfertas, href: '/admin/ofertas' },
  { label: 'Bonos', icon: IconBonos, href: '/admin/bonos' },
]

// ---------------------------------------------------------------------------
// Sidebar Component
// ---------------------------------------------------------------------------

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === href
    return pathname?.startsWith(href)
  }

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }, [router])

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1a1a2e] border-r border-white/5 flex flex-col z-30">
      {/* Header — Guinda branding */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#c9a96e] to-[#b8963f] rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold text-lg">G</span>
          </div>
          <div>
            <h1 className="text-white font-serif font-bold text-sm tracking-wide">GUINDA</h1>
            <p className="text-white/30 text-xs tracking-widest uppercase">Wellness & Spa</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] text-white/25 tracking-[0.2em] uppercase font-medium">Menu</p>
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <li key={item.label}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${active
                      ? 'bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-[#c9a96e]' : ''}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer — User section */}
      <div className="px-3 py-4 border-t border-white/5 space-y-3">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-white/60 text-xs font-medium">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">Admin</p>
            <p className="text-white/30 text-xs truncate">Administrador</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/30 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-white/5"
            title="Cerrar sesion"
          >
            <IconLogout className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
