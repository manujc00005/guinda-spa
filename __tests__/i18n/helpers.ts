/**
 * HELPERS — i18n Test Utilities
 *
 * Funciones reutilizables para tests de traducciones.
 * Extraen claves, acceden por path, detectan placeholders ICU.
 */

// ─── Recursive key extraction ─────────────────────────────────
/**
 * Recorre un objeto JSON recursivamente y devuelve todas las claves
 * en dot-notation. Los arrays generan índices numéricos (e.g. "items.0").
 */
export function getAllKeys(obj: unknown, prefix = ""): Set<string> {
  const keys = new Set<string>();

  if (obj === null || obj === undefined) return keys;

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const fullKey = prefix ? `${prefix}.${index}` : `${index}`;
      if (typeof item === "object" && item !== null) {
        for (const k of getAllKeys(item, fullKey)) keys.add(k);
      } else {
        keys.add(fullKey);
      }
    });
    return keys;
  }

  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        for (const k of getAllKeys(value, fullKey)) keys.add(k);
      } else {
        keys.add(fullKey);
      }
    }
  }

  return keys;
}

// ─── Value access by dot-path ─────────────────────────────────
/**
 * Accede a un valor dentro de un objeto usando dot-notation.
 * Retorna `undefined` si la ruta no existe.
 */
export function getValueByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    if (Array.isArray(acc)) {
      const index = parseInt(key, 10);
      return isNaN(index) ? undefined : acc[index];
    }
    if (typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// ─── Type detection ───────────────────────────────────────────
/**
 * Devuelve el tipo profundo de un valor:
 * "string", "number", "boolean", "null", "array", "object"
 */
export function getDeepType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

// ─── ICU Placeholder extraction ───────────────────────────────
/**
 * Extrae los placeholders ICU de un string.
 * "{name} tiene {count} items" → Set(["name", "count"])
 */
export function extractICUPlaceholders(str: string): Set<string> {
  const placeholders = new Set<string>();
  const regex = /\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(str)) !== null) {
    placeholders.add(match[1]);
  }
  return placeholders;
}

// ─── Brand terms that legitimately match across languages ─────
/**
 * Términos de marca, nombres propios, precios y valores técnicos
 * que son idénticos en todos los idiomas y NO deben marcarse
 * como "traducciones pendientes".
 */
export const BRAND_TERMS = new Set([
  // Brand & business names
  "Guinda",
  "Guinda Wellness",
  "Guinda Wellness & Spa",
  "TRH",
  "Hotel TRH Mijas",
  // Platforms & services
  "WhatsApp",
  "Google",
  "Google Analytics",
  "Google Ads",
  "Google Tag Manager",
  "Facebook",
  "Facebook Pixel",
  "Instagram",
  "TikTok",
  "LinkedIn",
  "Twitter",
  "YouTube",
  // Geographic names
  "Costa del Sol",
  "Mijas",
  // Service/technique names (international)
  "Kobido",
  "Lomi Lomi",
  "Pacific Spirit",
  "Aloha",
  "Signature",
  // Legal/regulatory acronyms
  "RGPD",
  "LOPDGDD",
  "LSSI-CE",
  // Technical marketing terms (same across languages)
  "Remarketing",
  "FAQs",
  "FAQ",
]);

/**
 * Patrones de claves que deben ignorarse al comparar valores
 * entre idiomas (contienen datos técnicos, no texto traducible).
 */
export const IGNORED_KEY_PATTERNS = [
  /^metadata\.titleTemplate$/,
  /^metadata\.keywords\./,
  /\.imageAlt$/,  // no ignorar — estas SÍ deben traducirse
  /\.badge$/,     // algunos badges son "" (vacío legítimo)
];

/**
 * Claves específicas cuyo valor legítimamente coincide entre idiomas.
 * Se excluyen de la detección de "español residual".
 */
export const IDENTICAL_VALUE_WHITELIST = new Set([
  "metadata.titleTemplate",
  "common.labels.signature",
  "experiencias.items.circuito.badge", // valor vacío ""
  // International terms identical across ES/EN/FR
  "galeria.imageAlts.jacuzzi",    // "Jacuzzi" — universal term
  "galeria.imageAlts.sauna",      // "Sauna" — universal term
  "about.trust.packs.value",      // "Top" — international loanword
]);

/**
 * Comprueba si un valor contiene solo datos técnicos (URLs, precios,
 * números, placeholders ICU puros, emojis, etc.) que no necesitan traducción.
 */
export function isTechnicalValue(value: string): boolean {
  // Solo placeholder(s) ICU — e.g. "{action} {category}" or "{count}"
  if (/^[\s{}\w]+$/.test(value) && /\{[^}]+\}/.test(value) && value.replace(/\{[^}]+\}/g, "").trim() === "") return true;
  // Solo números y símbolos de moneda/porcentaje/tiempo
  if (/^[\d€$£%.,\s+\-*/'′★☆]+$/.test(value)) return true;
  // URL
  if (/^https?:\/\//.test(value)) return true;
  // Solo emoji
  if (/^[\p{Emoji}\s]+$/u.test(value) && value.trim().length <= 4) return true;
  // Valor vacío
  if (value.trim() === "") return true;
  // Formato template (%s)
  if (value === "%s | Guinda Wellness & Spa") return true;

  return false;
}

/**
 * Comprueba si un valor contiene un término de marca que explica
 * por qué es idéntico entre idiomas.
 */
export function containsBrandTerm(value: string): boolean {
  for (const term of BRAND_TERMS) {
    if (value.includes(term)) return true;
  }
  return false;
}
