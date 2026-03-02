"use client";

import { useState } from "react";
import { SERVICIOS_DATA } from "../../data/servicios";
import type { CategoriaServicio, ServicioItem } from "../../data/servicios";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * RITUALES & EXPERIENCIAS — LUXURY LAYOUT
 *
 * - Tabs por categoría con iconos
 * - Tarjetas premium con micro-elementos incluidos
 * - Signature treatment con acento gold
 * - Valor añadido como trust strip
 * - CTA emocional con subtexto
 */

function CategoriaIcon({ icono }: { icono: string }) {
  const cls = "w-5 h-5";
  switch (icono) {
    case "hands":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h.264a2.25 2.25 0 002.25-2.25V10.5" />
        </svg>
      );
    case "face":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
      );
    case "ritual":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      );
    default:
      return null;
  }
}

function IncludeIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-(--color-gold) flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function SignatureBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-[0.15em] uppercase font-medium bg-gradient-to-r from-(--color-gold-light)/20 to-(--color-gold)/20 text-(--color-gold) border border-(--color-gold)/30">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      Signature
    </span>
  );
}

function ServicioCard({ servicio }: { servicio: ServicioItem }) {
  const isSignature = servicio.esSignature;

  return (
    <div
      className={[
        "group relative p-6 md:p-8 rounded-2xl border transition-all duration-400",
        isSignature
          ? "bg-gradient-to-br from-white via-white to-(--color-gold)/5 border-(--color-gold)/30 shadow-[0_4px_24px_rgba(200,162,126,0.12)] hover:shadow-[0_8px_40px_rgba(200,162,126,0.2)]"
          : "bg-white border-(--color-border-light) hover:border-(--color-primary)/20 hover:shadow-sm",
      ].join(" ")}
    >
      {/* Header: título + duración + precio */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-1">
            {isSignature && <SignatureBadge />}
            <h4 className="text-lg md:text-xl font-playfair font-semibold text-(--color-text-primary)">
              {servicio.titulo}
            </h4>
          </div>
          {servicio.subtitulo && (
            <p className="text-xs tracking-[0.12em] uppercase text-(--color-text-muted) font-medium mt-1">
              {servicio.subtitulo}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-xs text-(--color-text-muted) font-medium whitespace-nowrap">
            {servicio.duracion}
          </span>
          <span className={[
            "text-lg md:text-xl font-playfair font-semibold whitespace-nowrap",
            isSignature ? "text-(--color-gold)" : "text-(--color-primary)",
          ].join(" ")}>
            {servicio.precio}
          </span>
        </div>
      </div>

      {/* Descripción sensorial */}
      <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-5">
        {servicio.descripcion}
      </p>

      {/* Micro-elementos incluidos */}
      {servicio.incluye && servicio.incluye.length > 0 && (
        <div className={[
          "pt-4 border-t",
          isSignature ? "border-(--color-gold)/15" : "border-(--color-border-light)",
        ].join(" ")}>
          <p className="text-[11px] tracking-[0.15em] uppercase text-(--color-text-muted) font-medium mb-3">
            Tu ritual incluye
          </p>
          <ul className={[
            "gap-2 text-sm text-(--color-text-secondary)",
            isSignature ? "grid grid-cols-1 sm:grid-cols-2" : "flex flex-col",
          ].join(" ")}>
            {servicio.incluye.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <IncludeIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px w-8 bg-(--color-gold)/30" />
      <div className="w-1.5 h-1.5 rounded-full bg-(--color-gold)/40" />
      <div className="h-px w-8 bg-(--color-gold)/30" />
    </div>
  );
}

export function Servicios() {
  const [activeTab, setActiveTab] = useState(0);
  const categorias = SERVICIOS_DATA.categorias;
  const active: CategoriaServicio = categorias[activeTab];

  return (
    <SectionShell id="servicios" bg="white">
      <SectionHeader {...SERVICIOS_DATA.header} />

      {/* Tabs de categorías */}
      <div className="flex justify-center mb-12 md:mb-16">
        <div className="inline-flex gap-2 p-1.5 rounded-full bg-(--color-ivory) border border-(--color-border-light)">
          {categorias.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(i)}
              className={[
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                i === activeTab
                  ? "bg-white text-(--color-text-primary) shadow-sm"
                  : "text-(--color-text-secondary) hover:text-(--color-text-primary)",
              ].join(" ")}
            >
              <CategoriaIcon icono={cat.icono} />
              <span className="hidden sm:inline">{cat.titulo}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de la categoría activa */}
      <div className="max-w-3xl mx-auto">
        {/* Descripción de categoría */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-(--color-text-secondary) text-base leading-relaxed max-w-2xl mx-auto">
            {active.descripcion}
          </p>
        </div>

        <OrnamentDivider />

        {/* Lista de rituales */}
        <div className="space-y-5 mt-8">
          {active.servicios.map((servicio, idx) => (
            <ServicioCard key={`${active.id}-${idx}`} servicio={servicio} />
          ))}
        </div>

        {/* Valor añadido — trust strip */}
        <div className="mt-12 p-6 rounded-2xl bg-(--color-ivory)/60 border border-(--color-border-light)">
          <p className="text-[11px] tracking-[0.15em] uppercase text-(--color-text-muted) font-medium mb-4 text-center">
            En cada visita
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICIOS_DATA.valorAnadido.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-(--color-text-secondary)">
                <div className="w-1 h-1 rounded-full bg-(--color-gold) flex-shrink-0 mt-2" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA emocional */}
        <div className="text-center mt-14">
          <a
            href={SERVICIOS_DATA.cta.href}
            className="btn-primary text-sm px-10 py-4"
          >
            {SERVICIOS_DATA.cta.texto}
          </a>
          <p className="text-sm text-(--color-text-muted) mt-4 font-light italic">
            {SERVICIOS_DATA.cta.subtexto}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
