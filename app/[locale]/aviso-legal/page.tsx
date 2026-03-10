import { LEGAL_TEXTS } from "../../data/legal";
import { COMPANY_DATA } from "../../data/company";
import Link from "next/link";

export const metadata = {
  title: `${LEGAL_TEXTS.avisoLegal.title} | ${COMPANY_DATA.brandName}`,
  description: `${LEGAL_TEXTS.avisoLegal.title} de ${COMPANY_DATA.brandName}. Información legal sobre el uso del sitio web.`,
  robots: "noindex, nofollow",
};

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="container-page max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors">
            Inicio
          </Link>
          <span className="mx-2 text-(--color-text-secondary)">/</span>
          <span className="text-(--color-text-primary) font-medium">Aviso Legal</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-semibold text-(--color-text-primary) mb-4">
            {LEGAL_TEXTS.avisoLegal.title}
          </h1>
          <p className="text-sm text-(--color-text-secondary)">{LEGAL_TEXTS.avisoLegal.lastUpdated}</p>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {LEGAL_TEXTS.avisoLegal.sections.map((section, index) => (
            <section key={index} className="mb-10">
              <h2 className="text-2xl font-playfair font-semibold text-(--color-text-primary) mb-4">
                {section.title}
              </h2>
              <div
                className="text-(--color-text-secondary) leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-(--color-border)">
          <Link
            href="/"
            className="inline-flex items-center text-(--color-primary) hover:text-(--color-primary-hover) transition-colors font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
