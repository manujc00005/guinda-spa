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
    default: "Guinda Wellness & Spa | Spa Privado en Hotel TRH Mijas",
    template: "%s | Guinda Wellness & Spa",
  },
  description:
    "Spa privado en Hotel TRH Mijas. Circuito exclusivo con jacuzzi, sauna y baño turco. Masajes terapéuticos y experiencias en pareja con cava & chocolate. Desde 75€.",
  keywords: [
    "spa privado Mijas",
    "spa Hotel TRH Mijas",
    "circuito spa privado",
    "masajes Mijas",
    "spa pareja Costa del Sol",
    "masaje relajante Mijas",
    "jacuzzi privado",
    "sauna Mijas",
    "tratamientos faciales",
    "spa lujo Costa del Sol",
    "bonos regalo spa",
    "experiencia wellness pareja",
    "spa boutique Mijas",
  ],
  authors: [{ name: "Guinda Wellness & Spa" }],
  creator: "Guinda Wellness & Spa",
  publisher: "Guinda Wellness & Spa",
  metadataBase: new URL("https://guindawellness.es"), // ⚠️ Cambiar por dominio real
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Guinda Wellness & Spa | Spa Privado en Hotel TRH Mijas",
    description:
      "Tu circuito spa privado en la Costa del Sol. Jacuzzi, sauna y baño turco solo para ti. Experiencias en pareja con cava & chocolate desde 160€.",
    url: "https://guindawellness.es",
    siteName: "Guinda Wellness & Spa",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg", // ⚠️ Crear imagen 1200x630px
        width: 1200,
        height: 630,
        alt: "Guinda Wellness & Spa - Spa privado en Hotel TRH Mijas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guinda Wellness & Spa | Spa Privado en Hotel TRH Mijas",
    description: "Tu circuito spa privado en la Costa del Sol. Experiencias en pareja con cava & chocolate.",
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
