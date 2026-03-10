"use client";

import { useTranslations } from "next-intl";
import { DIFERENCIADORES_DATA } from "../../data/diferenciadores";

/**
 * DIFERENCIADORES — LAYOUT EDITORIAL SPLIT — i18n
 *
 * Textos vienen de traducciones, datos estructurales (imágenes, iconos)
 * vienen del data file.
 */

/* ─── Iconos SVG premium (stroke fino, elegante) ─── */
function DifIcon({ icon }: { icon: string }) {
  const cls = "w-5 h-5";
  switch (icon) {
    case "shield":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      );
    case "champagne":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      );
    case "building":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" />
        </svg>
      );
    case "sparkles":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      );
    default:
      return null;
  }
}

const DIF_KEYS = ["privacidad", "bienvenida", "hotel", "desconexion"] as const;

export function Diferenciadores() {
  const t = useTranslations("diferenciadores");
  const { items, imagen } = DIFERENCIADORES_DATA;

  return (
    <section className="py-20 md:py-28 bg-(--color-ivory) overflow-hidden">
      <div className="container-page">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">

          {/* ─── COLUMNA IZQUIERDA: Imagen del espacio ─── */}
          <div className="order-2 md:order-1 md:col-span-5 md:sticky md:top-28">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] md:aspect-[4/5]">
              <img
                src={imagen.src}
                alt={t("imageAlt")}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-(--color-gold)" />
                  <span className="text-[11px] tracking-[0.12em] uppercase font-medium text-(--color-text-primary)">
                    {t("badge")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── COLUMNA DERECHA: Copy editorial ─── */}
          <div className="order-1 md:order-2 md:col-span-7">
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-(--color-primary) mb-4 font-medium">
              {t("header.eyebrow")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-semibold text-(--color-text-primary) leading-[1.15] mb-6 whitespace-pre-line">
              {t("header.title")}
            </h2>
            <p className="text-base md:text-lg text-(--color-text-secondary) leading-relaxed mb-10 max-w-lg">
              {t("intro")}
            </p>

            {/* Ornamento dorado */}
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px w-10 bg-(--color-gold)/40" />
              <span className="text-(--color-gold)/50 text-xs">✦</span>
              <div className="h-px w-10 bg-(--color-gold)/40" />
            </div>

            {/* Lista de diferenciadores */}
            <div className="space-y-8 md:space-y-10">
              {items.map((item, idx) => (
                <div key={item.icono} className="flex gap-4 md:gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center text-(--color-primary) shadow-sm border border-(--color-border-light) mt-0.5">
                    <DifIcon icon={item.icono} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-(--color-text-primary) mb-1.5 leading-snug">
                      {t(`items.${DIF_KEYS[idx]}.title`)}
                    </h3>
                    <p className="text-sm md:text-[0.9375rem] text-(--color-text-secondary) leading-relaxed">
                      {t(`items.${DIF_KEYS[idx]}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Frase de cierre */}
            <div className="mt-12 pt-8 border-t border-(--color-border-light)">
              <p className="text-base md:text-lg font-playfair italic text-(--color-text-secondary) leading-relaxed max-w-md">
                &ldquo;{t("cierre")}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
