"use client";

import { useTranslations } from "next-intl";
import { EXPERIENCIAS_DATA } from "../../data/experiencias";
import type { Experiencia } from "../../data/experiencias";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * EXPERIENCIAS PREMIUM — i18n
 *
 * Textos vienen de traducciones, datos estructurales (precios, imágenes, hrefs)
 * vienen del data file.
 */

/* ─── Card individual ─── */
function ExperienciaCard({ exp, t }: { exp: Experiencia; t: (key: string) => string }) {
  const isEstrella = exp.isEstrella;

  return (
    <article
      className={[
        "group flex flex-col overflow-hidden rounded-2xl",
        "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isEstrella
          ? [
              "bg-(--color-ivory-warm)",
              "border border-(--color-gold)/20",
              "shadow-[var(--shadow-premium)]",
              "md:scale-[1.03] md:z-10",
              "hover:shadow-[var(--shadow-elevated)] hover:-translate-y-2",
            ].join(" ")
          : [
              "bg-white",
              "border border-(--color-border-light)",
              "shadow-[var(--shadow-soft)]",
              "hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1",
            ].join(" "),
      ].join(" ")}
    >
      {/* ── Imagen ── */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={exp.imagen}
          alt={t("imageAlt")}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div
          className={[
            "absolute inset-0",
            isEstrella
              ? "bg-gradient-to-t from-black/30 via-black/5 to-transparent"
              : "bg-gradient-to-t from-black/20 via-transparent to-transparent",
          ].join(" ")}
        />
        {exp.badge && (
          <div
            className={[
              "absolute top-4 left-4 px-3.5 py-1.5 rounded-full backdrop-blur-sm",
              isEstrella
                ? "bg-gradient-to-r from-(--color-gold) to-(--color-gold-light) text-white shadow-sm"
                : "bg-white/90 text-(--color-primary)",
            ].join(" ")}
          >
            <span className="text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1.5">
              {isEstrella && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
              {t("badge")}
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className={[
        "flex flex-col flex-1",
        isEstrella ? "p-6 md:p-8" : "p-6 md:p-7",
      ].join(" ")}>
        <span className="text-[11px] tracking-[0.18em] uppercase font-medium mb-2 text-(--color-gold)">
          {t("subtitle")}
        </span>
        <h3 className={[
          "font-playfair font-semibold text-(--color-text-primary) mb-3",
          isEstrella ? "text-2xl md:text-[1.75rem]" : "text-xl md:text-2xl",
        ].join(" ")}>
          {t("title")}
        </h3>
        <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-5 flex-1">
          {t("description")}
        </p>
        <div className="mb-5">
          <div className="flex items-baseline gap-2">
            <span className="text-xs tracking-wide uppercase text-(--color-text-muted) font-medium">
              {t("priceContext")}
            </span>
            <span className="text-[10px] text-(--color-text-muted)">·</span>
            <span className={[
              "font-playfair font-semibold",
              isEstrella ? "text-2xl text-(--color-primary)" : "text-xl text-(--color-primary)",
            ].join(" ")}>
              {exp.precio}
            </span>
          </div>
          <p className="text-xs text-(--color-text-muted) mt-1">
            {t("detail")}
          </p>
        </div>
        <a
          href={exp.cta.href}
          className={[
            "w-full text-center rounded-full font-medium transition-all duration-300",
            isEstrella
              ? "btn-primary text-base px-6 py-3.5"
              : "btn-outline text-sm px-6 py-3 hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-primary)/[0.03]",
          ].join(" ")}
        >
          {t("cta")}
        </a>
      </div>
    </article>
  );
}

/* ─── Prueba social elegante ─── */
function SocialProofBar() {
  const { socialProof } = EXPERIENCIAS_DATA;
  const t = useTranslations("experiencias.socialProof");

  return (
    <div className="mt-12 md:mt-16">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px w-12 bg-(--color-gold)/30" />
        <span className="text-(--color-gold)/60 text-xs">✦</span>
        <div className="h-px w-12 bg-(--color-gold)/30" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-semibold text-(--color-text-primary)">
            {socialProof.rating}
          </span>
          <span className="text-xs text-(--color-text-muted)">
            {t("ratingLabel")}
          </span>
        </div>
        <div className="hidden sm:block w-px h-4 bg-(--color-border)" />
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-(--color-text-primary)">
            {socialProof.stat}
          </span>
          <span className="text-xs text-(--color-text-muted)">
            {t("statLabel")}
          </span>
        </div>
        <div className="hidden sm:block w-px h-4 bg-(--color-border)" />
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-(--color-primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span className="text-xs font-medium text-(--color-text-secondary)">
            {t("badge")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Sección principal ─── */

const EXP_KEYS = ["pareja", "spaMasaje", "circuito"] as const;

export function ExperienciasPremium() {
  const t = useTranslations("experiencias");

  return (
    <SectionShell id="experiencias" bg="white">
      <SectionHeader
        eyebrow={t("header.eyebrow")}
        titulo={t("header.title")}
        descripcion={t("header.description")}
        className="mb-12"
      />

      <div className="grid gap-6 md:gap-6 md:grid-cols-3 md:items-start">
        {EXPERIENCIAS_DATA.experiencias.map((exp, idx) => (
          <ExperienciaCard
            key={exp.id}
            exp={exp}
            t={(key: string) => t(`items.${EXP_KEYS[idx]}.${key}`)}
          />
        ))}
      </div>

      <SocialProofBar />
    </SectionShell>
  );
}
