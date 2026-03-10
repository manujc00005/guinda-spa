"use client";

import { useTranslations } from "next-intl";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";
import { TestimonialCard } from "../ui/TestimonialCard";
import { HorizontalCarousel } from "../ui/HorizontalCarousel";

import { GOOGLE_REVIEWS } from "../../data/googleReviews";
import type { Testimonio } from "../../types/testimonios";
import { GoogleRatingBadge } from "../ui/GoogleRatingBadge";

/**
 * OPINIONES PREMIUM — i18n
 *
 * Header y textos vienen de traducciones, reviews de Google data.
 */

export function Opiniones() {
  const t = useTranslations("opiniones");

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
            eyebrow={t("eyebrow")}
            titulo={t("header.title")}
            descripcion={t("header.subtitle")}
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
            {safeReviews.map((review, i) => (
              <div
                key={`${review.autor}-${i}`}
                className="min-w-[300px] sm:min-w-[350px] md:min-w-[380px] snap-start"
              >
                <TestimonialCard testimonio={review} />
              </div>
            ))}
          </HorizontalCarousel>
        ) : (
          <div className="rounded-2xl border border-(--color-border-light) bg-(--color-ivory) p-10 text-center text-sm text-(--color-text-secondary)">
            {t("emptyState")}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
