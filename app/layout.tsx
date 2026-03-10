/**
 * ROOT LAYOUT — Minimal wrapper
 *
 * The actual HTML layout with <html lang>, fonts, metadata, and providers
 * lives in app/[locale]/layout.tsx. This root layout just passes children through.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
