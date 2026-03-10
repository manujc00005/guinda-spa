import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";
import {
  ServiciosTabs,
  type TabCategory,
  type SSection,
  type SItem,
  type SVariant,
  type SNote,
} from "./ServiciosTabs";

/**
 * RITUALES & EXPERIENCIAS — Server Component
 *
 * - Obtiene los datos de la carta directamente desde Prisma.
 * - Excluye secciones de tipo PACKAGES.
 * - Expande SUBSECTION en sus hijos.
 * - Organiza las secciones en 5 categorías para el tab navigation.
 * - Pasa los datos serializados (sin Prisma Decimal) al Client Component.
 */

// ─── Helpers de serialización ─────────────────────────────────────────────────

/** Extrae el texto en español de un campo JSON { es, en, fr } */
const tr = (v: unknown): string => {
  if (!v || typeof v !== "object" || Array.isArray(v)) return "";
  return (v as Record<string, string>).es ?? "";
};

// ─── Types de la query Prisma ─────────────────────────────────────────────────

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
  description: unknown | null;
  type: string;
  items: PItem[];
  notes: PNote[];
  children?: PSection[];
}

// ─── Slug → clave i18n ────────────────────────────────────────────────────────

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

/** Overrides de nombre para las secciones hijo del SUBSECTION */
const NAME_OVERRIDE: Record<string, { name?: string; subtitle?: string }> = {
  faciales: { name: "Tratamientos Faciales", subtitle: "Personalizados" },
  corporales: { name: "Tratamientos Corporales", subtitle: "Personalizados" },
};

// ─── Definición de categorías de tabs ─────────────────────────────────────────

const CATEGORY_DEFINITIONS: Array<{
  key: string;
  icon: string;
  tabKey: string; // clave i18n para label/short
  slugs: string[];
}> = [
  {
    key: "corporales",
    icon: "body",
    tabKey: "corporales",
    slugs: [
      "masajes-terapeuticos",
      "masajes-del-mundo",
      "exfoliaciones-envolturas",
      "corporales",
    ],
  },
  {
    key: "faciales",
    icon: "face",
    tabKey: "faciales",
    slugs: ["faciales"],
  },
  {
    key: "spa",
    icon: "spa",
    tabKey: "spa",
    slugs: ["circuito-spa-privado", "bonos-personalizados"],
  },
  {
    key: "pareja",
    icon: "couple",
    tabKey: "pareja",
    slugs: ["wellness-en-pareja"],
  },
  {
    key: "belleza",
    icon: "beauty",
    tabKey: "belleza",
    slugs: ["manos-y-pies", "peluqueria"],
  },
];

// ─── Serialización Prisma → plain objects ─────────────────────────────────────

function serializeNote(n: PNote): SNote {
  return {
    id: n.id,
    content: tr(n.content),
    style: n.style,
  };
}

function serializeVariant(v: PVariant): SVariant {
  return {
    id: v.id,
    label: tr(v.label),
    duration: v.duration,
    price: Number(v.price),
    notes: tr(v.notes),
  };
}

function serializeItem(item: PItem): SItem {
  return {
    id: item.id,
    name: tr(item.name),
    description: tr(item.description),
    shortDescription: tr(item.shortDescription),
    variants: item.variants.map(serializeVariant),
    notes: item.notes.map(serializeNote),
  };
}

function serializeSection(s: PSection, intro: string): SSection {
  const override = NAME_OVERRIDE[s.slug];
  return {
    id: s.id,
    slug: s.slug,
    name: override?.name ?? tr(s.name),
    subtitle: override?.subtitle ?? tr(s.subtitle),
    type: s.type,
    intro,
    items: s.items.map(serializeItem),
    notes: s.notes.map(serializeNote),
  };
}

// Forzar renderizado dinámico — siempre datos frescos, nunca cacheado
export const dynamic = "force-dynamic";

// ─── Servicios — componente principal ─────────────────────────────────────────

export async function Servicios() {
  const [t, tCommon, locale] = await Promise.all([
    getTranslations("servicios"),
    getTranslations("common"),
    getLocale(),
  ]);

  // 1. Fetch desde la DB — siempre datos frescos (force-dynamic)
  const rawSections = await prisma.menuSection.findMany({
    where: {
      parentId: null,
      isActive: true,
      deletedAt: null,
      NOT: { type: "PACKAGES" },
    },
    orderBy: { displayOrder: "asc" },
    include: {
      items: {
        where: { isActive: true, deletedAt: null },
        orderBy: { displayOrder: "asc" },
        include: {
          variants: {
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
          },
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
              variants: {
                where: { isActive: true },
                orderBy: { displayOrder: "asc" },
              },
              notes: { orderBy: { displayOrder: "asc" } },
            },
          },
          notes: { orderBy: { displayOrder: "asc" } },
        },
      },
    },
  });

  // 2. Expande SUBSECTION en sus hijos (Faciales, Corporales, Manos & Pies)
  const flatSections = (rawSections as unknown as PSection[]).flatMap((s) =>
    s.type === "SUBSECTION" ? (s.children ?? []) : [s]
  );

  if (flatSections.length === 0) return null;

  // 3. Mapeo por slug para búsqueda rápida
  const sectionBySlug = new Map(flatSections.map((s) => [s.slug, s]));

  // 4. Construcción de categorías
  const categories: TabCategory[] = CATEGORY_DEFINITIONS.map((def) => {
    const sections: SSection[] = def.slugs
      .map((slug) => {
        const raw = sectionBySlug.get(slug);
        if (!raw) return null;
        const i18nKey = SLUG_KEY[slug] ?? "";
        const intro = i18nKey ? t(`secciones.${i18nKey}.intro`) : "";
        return serializeSection(raw, intro);
      })
      .filter((s): s is SSection => s !== null);

    return {
      key: def.key,
      label: t(`tabs.${def.tabKey}.label`),
      labelShort: t(`tabs.${def.tabKey}.short`),
      icon: def.icon,
      sections,
    };
  }).filter((cat) => cat.sections.length > 0);

  if (categories.length === 0) return null;

  // 5. Added values
  const addedValues = (["0", "1", "2", "3"] as const).map((i) =>
    t(`addedValue.${i}`)
  );

  return (
    <SectionShell id="servicios" bg="white">
      <SectionHeader
        eyebrow={t("header.eyebrow")}
        titulo={t("header.title")}
        descripcion={t("header.description")}
      />

      <ServiciosTabs
        categories={categories}
        locale={locale}
        addedValues={addedValues}
        ctaText={t("cta.text")}
        ctaSubtext={t("cta.subtext")}
        everyVisitLabel={tCommon("labels.everyVisit")}
      />
    </SectionShell>
  );
}
