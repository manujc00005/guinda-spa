'use client'

import { useState, type ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

interface AdminShellProps {
  title: string
  children: ReactNode
}

export default function AdminShell({ title, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  return (
    <div className="min-h-screen bg-gray-50/80">
      <AdminSidebar collapsed={!sidebarOpen} onToggle={toggleSidebar} />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <AdminTopbar title={title} onMenuToggle={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
