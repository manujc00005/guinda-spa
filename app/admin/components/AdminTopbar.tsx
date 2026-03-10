'use client'

import { useRouter } from 'next/navigation'

interface AdminTopbarProps {
  title: string
  onMenuToggle: () => void
}

export default function AdminTopbar({ title, onMenuToggle }: AdminTopbarProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-lg font-semibold text-[#1a1a2e] font-[family-name:var(--font-playfair)] truncate">
          {title}
        </h1>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className={[
          'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg',
          'font-[family-name:var(--font-inter)] font-medium',
          'text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors',
        ].join(' ')}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="hidden sm:inline">Cerrar sesión</span>
      </button>
    </header>
  )
}
