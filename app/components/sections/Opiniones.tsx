import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";
import { TestimonialCard } from "../ui/TestimonialCard";
import { HorizontalCarousel } from "../ui/HorizontalCarousel";

import { GOOGLE_REVIEWS } from "../../data/googleReviews";
import type { Testimonio } from "../../types/testimonios";
import { GoogleRatingBadge } from "../ui/GoogleRatingBadge";

/**
 * OPINIONES PREMIUM
 *
 * Evolución: header más premium, badge Google más prominente,
 * carousel mantenido pero con mejor spacing.
 */

export function Opiniones() {
  const safeReviews: Testimonio[] = GOOGLE_REVIEWS.reviews.map((r) => ({
    autor: r.author ?? "Cliente",
    estrellas: r.rating ?? 5,
    texto: r.text ?? "",
    fecha: r.date,
    origen: r.source,
  }));

  return (
    <SectionShell id="opiniones" bg="white">
      <div className="max-w-6xl mx-auto">
        {/* Header con ornamento */}
        <div className="text-center mb-4">
          <div className="divider-ornament mb-6">
            <span className="text-(--color-gold) text-lg">✦</span>
          </div>
          <SectionHeader
            eyebrow="Lo que dicen nuestros clientes"
            titulo={GOOGLE_REVIEWS.header.title}
            descripcion={GOOGLE_REVIEWS.header.subtitle}
          />
        </div>

        {/* Google Rating Badge prominente */}
        <div className="mb-12 flex justify-center">
          <GoogleRatingBadge
            value={GOOGLE_REVIEWS.rating.value}
            count={GOOGLE_REVIEWS.rating.count}
            url={GOOGLE_REVIEWS.rating.url}
          />
        </div>

        {safeReviews.length > 0 ? (
          <HorizontalCarousel>
            {safeReviews.map((t, i) => (
              <div
                key={`${t.autor}-${i}`}
                className="min-w-[300px] sm:min-w-[350px] md:min-w-[380px] snap-start"
              >
                <TestimonialCard testimonio={t} />
              </div>
            ))}
          </HorizontalCarousel>
        ) : (
          <div className="rounded-2xl border border-(--color-border-light) bg-(--color-ivory) p-10 text-center text-sm text-(--color-text-secondary)">
            Aún no hay reseñas cargadas.
          </div>
        )}
      </div>
    </SectionShell>
  );
}
