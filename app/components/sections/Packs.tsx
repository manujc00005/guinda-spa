import { PACKS_DATA } from "../../data/packs";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * PACKS EXCLUSIVOS — UPSELL VISUAL
 *
 * Posicionados como regalo / ocasión especial.
 * El pack más caro (240€) va primero como ancla psicológica.
 * El pack destacado tiene borde gold y badge.
 *
 * Mobile: stack vertical
 * Desktop: grid de 3 columnas con el destacado visualmente diferenciado
 */

export function Packs() {
  return (
    <SectionShell id="packs" bg="ivory">
      <SectionHeader {...PACKS_DATA.header} />

      <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        {PACKS_DATA.packs.map((pack, index) => {
          const isDestacado = (pack as { destacado?: boolean }).destacado;

          return (
            <article
              key={index}
              className={[
                "relative flex flex-col rounded-2xl p-7 md:p-8 transition-all duration-300",
                isDestacado
                  ? "bg-white border-2 border-(--color-gold)/40 shadow-[var(--shadow-premium)] ring-1 ring-(--color-gold)/10"
                  : "bg-white border border-(--color-border) shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card-hover)]",
              ].join(" ")}
            >
              {/* Badge destacado */}
              {isDestacado && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-(--color-gold-light) to-(--color-gold) text-xs font-semibold tracking-wide text-white shadow-sm">
                    Experiencia completa
                  </span>
                </div>
              )}

              {/* Contenido */}
              <div className="flex-1 space-y-4">
                <h3 className="text-xl md:text-2xl font-playfair font-semibold text-(--color-text-primary) leading-tight">
                  {pack.titulo}
                </h3>

                <p className="text-sm text-(--color-text-secondary) leading-relaxed">
                  {pack.descripcion}
                </p>

                <div className="flex items-baseline gap-2 pt-2">
                  <span className={[
                    "text-3xl font-playfair font-semibold",
                    isDestacado ? "text-(--color-gold)" : "text-(--color-primary)",
                  ].join(" ")}>
                    {pack.precio}
                  </span>
                  {pack.detalle && (
                    <span className="text-xs text-(--color-text-muted)">
                      {pack.detalle}
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <a
                href={pack.ctaHref}
                className={[
                  "mt-6 w-full text-center text-sm px-6 py-3 rounded-full font-medium transition-all duration-250",
                  isDestacado
                    ? "btn-gold"
                    : "btn-outline",
                ].join(" ")}
              >
                {pack.ctaLabel}
              </a>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
