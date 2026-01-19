"use client";

import { useRef } from "react";

type Props = {
  children: React.ReactNode;
};

export function HorizontalCarousel({ children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollBy("left")}
          className="btn-outline px-5 py-2 text-sm pointer-events-auto"
          aria-label="Anterior"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => scrollBy("right")}
          className="btn-primary px-5 py-2 text-sm pointer-events-auto"
          aria-label="Siguiente"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
