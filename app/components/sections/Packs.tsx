import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * PACKS EXCLUSIVOS — datos desde la base de datos
 *
 * Server Component: fetch directo a Prisma, sin JS en el cliente.
 * El header del section sigue usando i18n.
 * Los datos de cada oferta (titulo, descripcion, precio…) vienen de DB.
 */

export async function Packs() {
  const [t, tCommon, ofertas] = await Promise.all([
    getTranslations("packs"),
    getTranslations("common"),
    prisma.oferta.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    }),
  ]);

  if (ofertas.length === 0) return null;

  return (
    <SectionShell id="packs" bg="ivory">
      <SectionHeader
        eyebrow={t("header.eyebrow")}
        titulo={t("header.title")}
        descripcion={t("header.description")}
      />

      <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        {ofertas.map((oferta) => {
          const isDestacado = oferta.destacado;

          return (
            <article
              key={oferta.id}
              className={[
                "relative flex flex-col rounded-2xl p-7 md:p-8 transition-all duration-300",
                isDestacado
                  ? "bg-white border-2 border-(--color-gold)/40 shadow-[var(--shadow-premium)] ring-1 ring-(--color-gold)/10"
                  : "bg-white border border-(--color-border) shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card-hover)]",
              ].join(" ")}
            >
              {isDestacado && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-(--color-gold-light) to-(--color-gold) text-xs font-semibold tracking-wide text-white shadow-sm">
                    {tCommon("labels.completeExperience")}
                  </span>
                </div>
              )}

              <div className="flex-1 space-y-4">
                <h3 className="text-xl md:text-2xl font-playfair font-semibold text-(--color-text-primary) leading-tight">
                  {oferta.titulo}
                </h3>
                <p className="text-sm text-(--color-text-secondary) leading-relaxed">
                  {oferta.descripcion}
                </p>
                <div className="flex items-baseline gap-2 pt-2">
                  <span
                    className={[
                      "text-3xl font-playfair font-semibold",
                      isDestacado
                        ? "text-(--color-gold)"
                        : "text-(--color-primary)",
                    ].join(" ")}
                  >
                    {oferta.precio}
                  </span>
                  {oferta.detalle && (
                    <span className="text-xs text-(--color-text-muted)">
                      {oferta.detalle}
                    </span>
                  )}
                </div>
              </div>

              <a
                href={oferta.ctaHref}
                className={[
                  "mt-6 w-full text-center text-sm px-6 py-3 rounded-full font-medium transition-all duration-250",
                  isDestacado ? "btn-gold" : "btn-outline",
                ].join(" ")}
              >
                {oferta.ctaLabel}
              </a>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
