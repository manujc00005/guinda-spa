/**
 * GET /api/servicios?locale=es|en|fr
 *
 * Endpoint público que devuelve las categorías de servicios con precios actualizados.
 * Usado por el Client Component ServiciosTabs para actualizaciones en tiempo real
 * cuando el usuario vuelve a la pestaña de la web tras cambiar un precio en el admin.
 *
 * - force-dynamic: nunca cacheado, siempre datos frescos de la DB
 * - No requiere autenticación (datos públicos)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  TabCategory,
  SSection,
  SItem,
  SVariant,
  SNote,
} from "@/app/components/sections/ServiciosTabs";

export const dynamic = "force-dynamic";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extrae el texto en el locale solicitado (fallback a 'es') */
const tr = (v: unknown, locale: string): string => {
  if (!v || typeof v !== "object" || Array.isArray(v)) return "";
  const obj = v as Record<string, string>;
  return obj[locale] ?? obj.es ?? "";
};

// ─── Types internos ───────────────────────────────────────────────────────────

interface PVariant {
  id: string;
  label: unknown;
  duration: number | null;
  price: unknown;
  notes: unknown | null;
}
interface PNote {
  id: string;
  content: unknown;
  style: string;
}
interface PItem {
  id: string;
  name: unknown;
  description: unknown | null;
  shortDescription: unknown | null;
  variants: PVariant[];
  notes: PNote[];
}
interface PSection {
  id: string;
  slug: string;
  name: unknown;
  subtitle: unknown | null;
  type: string;
  items: PItem[];
  notes: PNote[];
  children?: PSection[];
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const SLUG_KEY: Record<string, string> = {
  "circuito-spa-privado": "circuitoSpa",
  "masajes-terapeuticos": "masajesTerapeuticos",
  "masajes-del-mundo": "masajesMundo",
  "exfoliaciones-envolturas": "exfoliaciones",
  faciales: "faciales",
  corporales: "corporales",
  "manos-y-pies": "manosPies",
  peluqueria: "peluqueria",
  "wellness-en-pareja": "wellnessPareja",
  "bonos-personalizados": "bonos",
};

const NAME_OVERRIDES: Record<string, Record<string, { name?: string; subtitle?: string }>> = {
  es: {
    faciales: { name: "Tratamientos Faciales", subtitle: "Personalizados" },
    corporales: { name: "Tratamientos Corporales", subtitle: "Personalizados" },
  },
  en: {
    faciales: { name: "Facial Treatments", subtitle: "Personalised" },
    corporales: { name: "Body Treatments", subtitle: "Personalised" },
  },
  fr: {
    faciales: { name: "Soins Visage", subtitle: "Personnalisés" },
    corporales: { name: "Soins Corps", subtitle: "Personnalisés" },
  },
};

const CATEGORY_DEFINITIONS = [
  { key: "corporales", icon: "body",   tabKey: "corporales", slugs: ["masajes-terapeuticos", "masajes-del-mundo", "exfoliaciones-envolturas", "corporales"] },
  { key: "faciales",   icon: "face",   tabKey: "faciales",   slugs: ["faciales"] },
  { key: "spa",        icon: "spa",    tabKey: "spa",        slugs: ["circuito-spa-privado", "bonos-personalizados"] },
  { key: "pareja",     icon: "couple", tabKey: "pareja",     slugs: ["wellness-en-pareja"] },
  { key: "belleza",    icon: "beauty", tabKey: "belleza",    slugs: ["manos-y-pies", "peluqueria"] },
] as const;

// ─── Serialización ────────────────────────────────────────────────────────────

function serNote(n: PNote, locale: string): SNote {
  return { id: n.id, content: tr(n.content, locale), style: n.style };
}
function serVariant(v: PVariant, locale: string): SVariant {
  return {
    id: v.id,
    label: tr(v.label, locale),
    duration: v.duration,
    price: Number(v.price),
    notes: tr(v.notes, locale),
  };
}
function serItem(item: PItem, locale: string): SItem {
  return {
    id: item.id,
    name: tr(item.name, locale),
    description: tr(item.description, locale),
    shortDescription: tr(item.shortDescription, locale),
    variants: item.variants.map((v) => serVariant(v, locale)),
    notes: item.notes.map((n) => serNote(n, locale)),
  };
}
function serSection(s: PSection, intro: string, locale: string): SSection {
  const overrides = NAME_OVERRIDES[locale] ?? NAME_OVERRIDES.es;
  const override = overrides[s.slug];
  return {
    id: s.id,
    slug: s.slug,
    name: override?.name ?? tr(s.name, locale),
    subtitle: override?.subtitle ?? tr(s.subtitle, locale),
    type: s.type,
    intro,
    items: s.items.map((i) => serItem(i, locale)),
    notes: s.notes.map((n) => serNote(n, locale)),
  };
}

// ─── Cargador de mensajes i18n ─────────────────────────────────────────────────

async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  switch (locale) {
    case "en": return (await import("@/messages/en.json")).default as unknown as Record<string, unknown>;
    case "fr": return (await import("@/messages/fr.json")).default as unknown as Record<string, unknown>;
    default:   return (await import("@/messages/es.json")).default as unknown as Record<string, unknown>;
  }
}

/** Resuelve una ruta de clave en el objeto de mensajes, ej: "servicios.tabs.corporales.label" */
function msg(messages: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let obj: unknown = messages;
  for (const part of parts) {
    if (!obj || typeof obj !== "object") return "";
    obj = (obj as Record<string, unknown>)[part];
  }
  return String(obj ?? "");
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const locale = (["es", "en", "fr"].includes(
      request.nextUrl.searchParams.get("locale") ?? ""
    )
      ? request.nextUrl.searchParams.get("locale")!
      : "es");

    // 1. Mensajes i18n
    const messages = await loadMessages(locale);

    // 2. Fetch desde la DB
    const rawSections = await prisma.menuSection.findMany({
      where: { parentId: null, isActive: true, deletedAt: null, NOT: { type: "PACKAGES" } },
      orderBy: { displayOrder: "asc" },
      include: {
        items: {
          where: { isActive: true, deletedAt: null },
          orderBy: { displayOrder: "asc" },
          include: {
            variants: { where: { isActive: true }, orderBy: { displayOrder: "asc" } },
            notes: { orderBy: { displayOrder: "asc" } },
          },
        },
        notes: { orderBy: { displayOrder: "asc" } },
        children: {
          where: { isActive: true, deletedAt: null },
          orderBy: { displayOrder: "asc" },
          include: {
            items: {
              where: { isActive: true, deletedAt: null },
              orderBy: { displayOrder: "asc" },
              include: {
                variants: { where: { isActive: true }, orderBy: { displayOrder: "asc" } },
                notes: { orderBy: { displayOrder: "asc" } },
              },
            },
            notes: { orderBy: { displayOrder: "asc" } },
          },
        },
      },
    });

    // 3. Expande SUBSECTION
    const flat = (rawSections as unknown as PSection[]).flatMap((s) =>
      s.type === "SUBSECTION" ? (s.children ?? []) : [s]
    );

    const bySlug = new Map(flat.map((s) => [s.slug, s]));

    // 4. Construye categorías
    const categories: TabCategory[] = CATEGORY_DEFINITIONS.map((def) => {
      const sections: SSection[] = def.slugs
        .map((slug) => {
          const raw = bySlug.get(slug);
          if (!raw) return null;
          const i18nKey = SLUG_KEY[slug] ?? "";
          const intro = i18nKey
            ? msg(messages, `servicios.secciones.${i18nKey}.intro`)
            : "";
          return serSection(raw, intro, locale);
        })
        .filter((s): s is SSection => s !== null);

      return {
        key: def.key,
        label: msg(messages, `servicios.tabs.${def.tabKey}.label`),
        labelShort: msg(messages, `servicios.tabs.${def.tabKey}.short`),
        icon: def.icon,
        sections,
      };
    }).filter((cat) => cat.sections.length > 0);

    return NextResponse.json(
      { categories },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET /api/servicios error:", error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
