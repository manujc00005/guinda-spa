// ========================================
// Layout responsive con CSS puro (Tailwind)
// Mobile: bottom nav | Desktop: sidebar
// ========================================

'use client'

import { Sidebar } from './Sidebar'
import { MobileBottomNav } from './MobileBottomNav'

interface AdminLayoutShellProps {
  children: React.ReactNode
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  return (
    <>
      {/* Sidebar: solo visible en desktop (≥768px), siempre montado */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main: padding-bottom para bottom nav en mobile, padding-left para sidebar en desktop */}
      <main className="pb-20 md:pb-0 md:pl-64 min-h-screen">
        {children}
      </main>

      {/* MobileBottomNav: solo visible en mobile (<768px), siempre montado */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </>
  )
}
