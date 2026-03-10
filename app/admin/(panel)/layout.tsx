import { AdminLayoutShell } from '../components/AdminLayoutShell'

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>
}
