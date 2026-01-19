import { Testimonio } from "../../types/testimonios";
import { Card } from "./Card";

interface TestimonialCardProps {
  testimonio: Testimonio;
}

export function TestimonialCard({ testimonio }: TestimonialCardProps) {
  const { texto, autor, estrellas, fecha, origen } = testimonio;

  return (
    <Card className="h-full p-8 flex flex-col justify-between gap-6">
      {/* Rating */}
      <div
        className="flex justify-center gap-1 text-lg"
        aria-label={`Valoración de ${estrellas} sobre 5`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < estrellas ? "text-amber-400" : "text-stone-300"}
            aria-hidden
          >
            ★
          </span>
        ))}
      </div>

      {/* Texto */}
      <blockquote className="text-sm md:text-base text-(--color-text-secondary) italic leading-relaxed text-center">
        “{texto}”
      </blockquote>

      {/* Autor */}
      <div className="text-center">
        <p className="text-sm font-semibold text-(--color-text-primary)">
          — {autor}
        </p>

        {(fecha || origen) && (
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-400">
            {fecha && <span>{fecha}</span>}
            {fecha && origen && <span className="mx-1">·</span>}
            {origen === "google" && <span>Google</span>}
          </p>
        )}
      </div>
    </Card>
  );
}
