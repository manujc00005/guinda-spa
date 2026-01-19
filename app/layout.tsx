import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";
import { CookieBanner } from "./components/cookies/CookieBanner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Guinda Wellnes & Spa | Circuito Spa Privado + Masajes en Madrid",
    template: "%s | Guinda Wellnes & Spa",
  },
  description:
    "Spa premium en Madrid con circuito privado (jacuzzi, sauna, baño turco) y masajes terapéuticos. Packs pareja desde 160€. Reserva tu experiencia de bienestar.",
  keywords: [
    "spa Madrid",
    "circuito spa privado",
    "masajes Madrid",
    "spa pareja Madrid",
    "masaje relajante",
    "jacuzzi privado",
    "sauna Madrid",
    "tratamientos faciales",
    "spa lujo Madrid",
    "bonos regalo spa",
    "masaje descontracturante",
    "ritual spa",
  ],
  authors: [{ name: "Guinda Wellnes & Spa" }],
  creator: "Guinda Wellnes & Spa",
  publisher: "Guinda Wellnes & Spa",
  metadataBase: new URL("https://spaserenity.com"), // Cambiar por tu dominio real
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Guinda Wellnes & Spa | Circuito Spa Privado + Masajes en Madrid",
    description:
      "Desconecta del estrés con nuestro circuito spa 100% privado y masajes personalizados. Packs pareja desde 160€. Tu refugio de calma en el corazón de Madrid.",
    url: "https://spaserenity.com",
    siteName: "Guinda Wellnes & Spa",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg", // Crear esta imagen 1200x630px
        width: 1200,
        height: 630,
        alt: "Guinda Wellnes & Spa - Circuito privado y masajes premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guinda Wellnes & Spa | Circuito Spa Privado + Masajes",
    description: "Tu refugio de calma y bienestar en Madrid. Circuito privado + masajes desde 105€.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "tu-codigo-google-search-console", // Añadir cuando tengas Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <StructuredData />
      </head>
      <body className="antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
