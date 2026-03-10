"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types serializados (sin Prisma Decimal) ──────────────────────────────────

export interface SVariant {
  id: string;
  label: string;
  duration: number | null;
  price: number;
  notes: string;
}

export interface SNote {
  id: string;
  content: string;
  style: string;
}

export interface SItem {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  variants: SVariant[];
  notes: SNote[];
}

export interface SSection {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  type: string;
  intro: string;
  items: SItem[];
  notes: SNote[];
}

export interface TabCategory {
  key: string;
  label: string;
  labelShort: string;
  icon: string;
  sections: SSection[];
}

interface ServiciosTabsProps {
  categories: TabCategory[];
  locale: string;
  addedValues: string[];
  ctaText: string;
  ctaSubtext: string;
  everyVisitLabel: string;
}

// ─── Iconos de tab ────────────────────────────────────────────────────────────

function TabIcon({ icon, className = "w-[15px] h-[15px] shrink-0" }: { icon: string; className?: string }) {
  switch (icon) {
    case "body":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden>
          <circle cx="12" cy="5.5" r="1.5" fill="currentColor" stroke="none" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v6m0 0l-3 3m3-3l3 3" />
        </svg>
      );
    case "face":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden>
          <circle cx="12" cy="12" r="9" strokeLinecap="round" />
          <path strokeLinecap="round" d="M9 10h.01M15 10h.01M9.5 14.5a3.5 3.5 0 005 0" />
        </svg>
      );
    case "spa":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      );
    case "couple":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      );
    case "beauty":
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      );
  }
}

// ─── NoteItem ─────────────────────────────────────────────────────────────────

function NoteItem({ note }: { note: SNote }) {
  if (!note.content) return null;
  if (note.style === "highlight")
    return (
      <div className="flex items-center gap-2 text-xs text-(--color-gold)">
        <svg className="w-2.5 h-2.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span>{note.content}</span>
      </div>
    );
  if (note.style === "asterisk")
    return (
      <p className="text-xs italic text-(--color-text-muted)">
        * {note.content.replace(/^\*+\s*/, "")}
      </p>
    );
  return <p className="text-xs text-(--color-text-secondary)">{note.content}</p>;
}

// ─── ItemRow ──────────────────────────────────────────────────────────────────

function ItemRow({ item, isCouple }: { item: SItem; isCouple: boolean }) {
  const desc = item.shortDescription || item.description;
  const isMulti = item.variants.length > 1;
  const solo = item.variants[0];

  /** Muestra "45€" para precios enteros y "45,02€" si hay céntimos */
  const priceStr = (price: number): string => {
    if (!price || price <= 0) return "";
    return price % 1 === 0
      ? `${price}€`
      : `${price.toFixed(2).replace(".", ",")}€`;
  };

  return (
    <div className="py-4 border-b border-(--color-border-light) last:border-b-0">
      {/* Nombre + precio inline (variante única) */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-[15px] font-semibold font-playfair leading-snug tracking-wide text-(--color-text-primary)">
            {item.name}
          </h4>
          {desc && (
            <p className="text-xs mt-0.5 leading-relaxed text-(--color-text-muted)">{desc}</p>
          )}
        </div>

        {/* Variante única: dur — precio */}
        {!isMulti && solo && (
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5 tabular-nums">
            {solo.duration ? (
              <span className="text-xs text-(--color-text-muted)">{solo.duration} min</span>
            ) : null}
            {solo.duration ? (
              <span className="text-xs text-(--color-border)" aria-hidden>—</span>
            ) : null}
            <span className="text-base font-semibold font-playfair text-(--color-primary)">
              {priceStr(solo.price)}
            </span>
          </div>
        )}
      </div>

      {/* Multi-variante: cada línea como "Label · X min — Y€" */}
      {isMulti && (
        <div className="mt-2.5 space-y-1.5 pl-1">
          {item.variants.map((v) => (
            <div
              key={v.id}
              className={[
                "flex items-center justify-between gap-3 text-sm",
                isCouple ? "" : "",
              ].join("")}
            >
              <span className="text-(--color-text-secondary)">
                {v.label}
                {v.notes ? (
                  <span className="text-xs text-(--color-text-muted) ml-1.5">· {v.notes}</span>
                ) : null}
              </span>
              <div className="flex items-center gap-1.5 shrink-0 tabular-nums">
                {v.duration ? (
                  <>
                    <span className="text-xs text-(--color-text-muted)">{v.duration} min</span>
                    <span className="text-xs text-(--color-border)" aria-hidden>—</span>
                  </>
                ) : null}
                <span className="font-semibold font-playfair text-(--color-primary)">
                  {priceStr(v.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notas de ítem */}
      {item.notes.length > 0 && (
        <div className="mt-1.5 space-y-0.5">
          {item.notes.map((n) => (
            <NoteItem key={n.id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CircuitoSection ──────────────────────────────────────────────────────────

function CircuitoSection({ section }: { section: SSection }) {
  const item = section.items[0];
  const variant = item?.variants[0];

  return (
    <div className="rounded-2xl border border-(--color-border-light) bg-(--color-ivory)/50 p-6 md:p-8">
      {section.intro && (
        <p className="text-sm leading-relaxed text-(--color-text-secondary) mb-6">{section.intro}</p>
      )}
      {item && variant && (
        <div className="flex items-end justify-between gap-4">
          <div>
            {variant.duration && (
              <p className="text-xs text-(--color-text-muted) mb-0.5">
                Sesión de {variant.duration} min · Privado
              </p>
            )}
            <p className="text-xs text-(--color-text-muted)">Para 1 o 2 personas</p>
          </div>
          <p className="text-4xl font-playfair font-semibold text-(--color-gold)">
            {variant.price > 0
              ? variant.price % 1 === 0
                ? `${variant.price}€`
                : `${variant.price.toFixed(2).replace(".", ",")}€`
              : ""}
          </p>
        </div>
      )}
      {section.notes.length > 0 && (
        <div className="mt-5 pt-4 border-t border-(--color-border-light) space-y-1.5">
          {section.notes.map((n) => (
            <NoteItem key={n.id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BonusSection ─────────────────────────────────────────────────────────────

function BonusSection({ section }: { section: SSection }) {
  return (
    <div>
      {section.intro && (
        <p className="text-sm italic leading-relaxed text-(--color-text-secondary) mb-6">{section.intro}</p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {section.items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl border border-(--color-border-light) bg-(--color-ivory)/40 flex flex-col gap-1"
          >
            <p className="text-[15px] font-semibold font-playfair text-(--color-text-primary)">
              {item.name}
            </p>
            {item.description && (
              <p className="text-sm leading-relaxed text-(--color-text-secondary)">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── StandardSection ──────────────────────────────────────────────────────────

function StandardSection({ section }: { section: SSection }) {
  const isCouple = section.type === "COUPLES";

  return (
    <div>
      {isCouple && (
        <div className="flex items-center gap-2 mb-5 text-xs text-(--color-text-muted)">
          <svg className="w-3.5 h-3.5 text-(--color-gold)/70 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span>Todos los precios son por pareja</span>
        </div>
      )}

      <div>
        {section.items.map((item) => (
          <ItemRow key={item.id} item={item} isCouple={isCouple} />
        ))}
      </div>

      {section.notes.length > 0 && (
        <div className="mt-5 pt-4 border-t border-(--color-border-light) space-y-1.5">
          {section.notes.map((n) => (
            <NoteItem key={n.id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SectionBlock ─────────────────────────────────────────────────────────────

function SectionBlock({
  section,
  showName,
}: {
  section: SSection;
  showName: boolean;
}) {
  return (
    <div>
      {/* Cabecera de sección (solo cuando hay varias en el tab) */}
      {showName && (
        <div className="mb-5">
          <h3 className="font-playfair text-lg font-semibold text-(--color-text-primary) leading-tight">
            {section.name}
          </h3>
          {section.subtitle && (
            <p className="text-[11px] tracking-[0.2em] uppercase text-(--color-gold) font-medium mt-1">
              {section.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Texto intro (no para SINGLE_SERVICE: lo mostramos dentro) */}
      {section.intro && section.type !== "SINGLE_SERVICE" && section.type !== "INFO" && (
        <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-5">{section.intro}</p>
      )}

      {/* Contenido según tipo */}
      {section.type === "SINGLE_SERVICE" && <CircuitoSection section={section} />}
      {section.type === "INFO" && <BonusSection section={section} />}
      {(section.type === "STANDARD" || section.type === "COUPLES") && (
        <StandardSection section={section} />
      )}
    </div>
  );
}

// ─── Separador ornamental ─────────────────────────────────────────────────────

function OrnamentDivider() {
  return (
    <div className="flex items-center gap-3 py-10" aria-hidden>
      <div className="h-px flex-1 bg-(--color-border-light)" />
      <div className="flex gap-1 items-center">
        <span className="w-1 h-1 rounded-full bg-(--color-gold)/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-gold)/50" />
        <span className="w-1 h-1 rounded-full bg-(--color-gold)/30" />
      </div>
      <div className="h-px flex-1 bg-(--color-border-light)" />
    </div>
  );
}

// ─── ServiciosTabs — Componente principal ─────────────────────────────────────

export function ServiciosTabs({
  categories: initialCategories,
  locale,
  addedValues,
  ctaText,
  ctaSubtext,
  everyVisitLabel,
}: ServiciosTabsProps) {
  // ── Live data — se actualiza sin reload cuando el usuario vuelve a esta pestaña
  const [liveCategories, setLiveCategories] = useState<TabCategory[]>(initialCategories);
  const [activeKey, setActiveKey] = useState(initialCategories[0]?.key ?? "");

  const refreshPrices = useCallback(async () => {
    try {
      const res = await fetch(`/api/servicios?locale=${locale}`, {
        cache: "no-store",
        headers: { "x-from-client": "1" },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { categories?: TabCategory[] };
      if (data.categories?.length) setLiveCategories(data.categories);
    } catch {
      // silently ignore — mantenemos los datos anteriores
    }
  }, [locale]);

  useEffect(() => {
    // Sin polling — los precios de un spa cambian muy poco.
    // • Nueva carga de página → SSR (force-dynamic) siempre fresco.
    // • Usuario vuelve a la pestaña → visibilitychange refresca al instante.
    // Coste DB en producción: 0 requests automáticos.
    const handleVisibility = () => {
      if (!document.hidden) refreshPrices();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [refreshPrices]);

  const active = liveCategories.find((c) => c.key === activeKey);

  return (
    <>
      {/* Keyframe global para la animación del contenido */}
      <style>{`
        @keyframes guinda-fade-slide {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .guinda-tab-enter {
          animation: guinda-fade-slide 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        /* Esconde la scrollbar en la nav de tabs */
        .guinda-tab-nav::-webkit-scrollbar { display: none; }
        .guinda-tab-nav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-4xl mx-auto mt-12 md:mt-16">
        {/* ── Tab Navigation ── */}
        <nav
          role="tablist"
          aria-label="Categorías de tratamientos"
          className="guinda-tab-nav flex overflow-x-auto border-b border-(--color-border-light)"
        >
          {liveCategories.map((cat) => {
            const isActive = cat.key === activeKey;
            return (
              <button
                key={cat.key}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tab-panel-${cat.key}`}
                id={`tab-btn-${cat.key}`}
                onClick={() => setActiveKey(cat.key)}
                className={[
                  "flex items-center gap-2 px-4 sm:px-5 py-3.5",
                  "text-sm font-medium whitespace-nowrap",
                  "border-b-2 -mb-px shrink-0",
                  "transition-colors duration-200 focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-(--color-gold)/40",
                  isActive
                    ? "border-b-(--color-gold) text-(--color-gold)"
                    : "border-b-transparent text-(--color-text-muted) hover:text-(--color-text-secondary)",
                ].join(" ")}
              >
                <TabIcon icon={cat.icon} />
                {/* Etiqueta completa en ≥sm, corta en mobile */}
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.labelShort}</span>
              </button>
            );
          })}
        </nav>

        {/* ── Contenido del tab activo ── */}
        {active && (
          <div
            key={activeKey}
            id={`tab-panel-${active.key}`}
            role="tabpanel"
            aria-labelledby={`tab-btn-${active.key}`}
            className="guinda-tab-enter pt-8 md:pt-10"
          >
            {active.sections.map((section, i) => {
              const showName = active.sections.length > 1;
              return (
                <div key={section.id}>
                  {i > 0 && <OrnamentDivider />}
                  <SectionBlock section={section} showName={showName} />
                </div>
              );
            })}
          </div>
        )}

        {/* ── Valor añadido ── */}
        <div className="mt-14 md:mt-16 p-6 md:p-8 rounded-2xl bg-(--color-ivory)/60 border border-(--color-border-light)">
          <p className="text-[11px] tracking-[0.15em] uppercase text-(--color-text-muted) font-medium mb-4 text-center">
            {everyVisitLabel}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addedValues.map((val, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-sm text-(--color-text-secondary)"
              >
                <div className="w-1 h-1 rounded-full bg-(--color-gold) shrink-0 mt-2" />
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center mt-14">
          <a href="#reservar" className="btn-primary text-sm px-10 py-4">
            {ctaText}
          </a>
          <p className="text-sm text-(--color-text-muted) mt-4 font-light italic">
            {ctaSubtext}
          </p>
        </div>
      </div>
    </>
  );
}
