import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";
import { TestimonialCard } from "../ui/TestimonialCard";
import { HorizontalCarousel } from "../ui/HorizontalCarousel";

import { GOOGLE_REVIEWS } from "../../data/googleReviews";
import type { Testimonio } from "../../types/testimonios";
import { GoogleRatingBadge } from "../ui/GoogleRatingBadge";

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
        <SectionHeader
          titulo={GOOGLE_REVIEWS.header.title}
          descripcion={GOOGLE_REVIEWS.header.subtitle}
        />
        
      <div className="mt-6 mb-10 flex justify-center">
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
                className="min-w-[280px] sm:min-w-[340px] md:min-w-[380px] snap-start"
              >
                <TestimonialCard testimonio={t} />
              </div>
            ))}
          </HorizontalCarousel>
        ) : (
          <div className="rounded-3xl border border-stone-100 bg-white p-8 text-center text-sm text-stone-600">
            Aún no hay reseñas cargadas.
          </div>
        )}
      </div>
    </SectionShell>
  );
}
