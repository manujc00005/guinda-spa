'use client'

import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function BonosPage() {
  const status = useAdminAuth()

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#c9a96e] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#e5e2db] py-6 sm:py-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-1">
          <span className="h-px w-16 bg-[#c9a96e]/40" />
          <span className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase font-medium">Administracion</span>
          <span className="h-px w-16 bg-[#c9a96e]/40" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1a1a2e] tracking-wide uppercase">
          Bonos
        </h2>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e2db] p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#c9a96e]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#c9a96e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
              <path d="M2 8h20v4H2z" />
              <path d="M12 2v6" /><path d="M12 12v8" />
            </svg>
          </div>
          <h3 className="font-serif text-xl text-[#1a1a2e] mb-2">Proximamente</h3>
          <p className="text-sm text-[#1a1a2e]/50 max-w-md mx-auto">
            Aqui podras gestionar los bonos personalizados y tarjetas regalo del spa.
            Esta seccion estara disponible pronto.
          </p>
        </div>
      </div>
    </div>
  )
}
