import { ToastProvider } from './components/ui/AdminToast'
import '../globals.css'

export const metadata = {
  title: 'Guinda Admin',
  description: 'Panel de administración — Guinda Wellness & Spa',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-[#f8f7f4] text-[#1a1a2e] antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
