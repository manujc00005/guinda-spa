/**
 * TESTS QA i18n — Verificación de traducciones ES / EN / FR
 *
 * Suite exhaustiva que actúa como red de seguridad para el sistema
 * de traducciones. Detecta claves faltantes, valores vacíos,
 * traducciones olvidadas e inconsistencias estructurales.
 *
 * Ejecutar: npm run test:i18n
 */

import { describe, it, expect } from "vitest";
import es from "../../messages/es.json";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import {
  getAllKeys,
  getValueByPath,
  getDeepType,
  extractICUPlaceholders,
  isTechnicalValue,
  containsBrandTerm,
  IDENTICAL_VALUE_WHITELIST,
} from "./helpers";

// ─── Setup ────────────────────────────────────────────────────
const esKeys = getAllKeys(es);
const enKeys = getAllKeys(en);
const frKeys = getAllKeys(fr);

const locales = { es, en, fr } as Record<string, unknown>;
const localeNames = ["es", "en", "fr"] as const;

// Arrays where each locale can have different lengths (SEO keywords, etc.)
const FLEXIBLE_LENGTH_ARRAYS = ["metadata.keywords"];

/** Check if a key belongs to a flexible-length array (e.g. metadata.keywords.13) */
function isFlexibleArrayKey(key: string): boolean {
  return FLEXIBLE_LENGTH_ARRAYS.some((prefix) => key.startsWith(prefix + "."));
}

// ═══════════════════════════════════════════════════════════════
// BLOQUE A: Paridad de claves entre idiomas
// ═══════════════════════════════════════════════════════════════
describe("Key parity between languages", () => {
  it("EN has all keys from ES (base language)", () => {
    const missingInEn: string[] = [];
    for (const key of esKeys) {
      if (!enKeys.has(key)) missingInEn.push(key);
    }
    expect(missingInEn, `Missing in EN:\n${missingInEn.join("\n")}`).toHaveLength(0);
  });

  it("FR has all keys from ES (base language)", () => {
    const missingInFr: string[] = [];
    for (const key of esKeys) {
      if (!frKeys.has(key)) missingInFr.push(key);
    }
    expect(missingInFr, `Missing in FR:\n${missingInFr.join("\n")}`).toHaveLength(0);
  });

  it("ES has all keys from EN (no orphan keys in EN)", () => {
    const orphanInEn: string[] = [];
    for (const key of enKeys) {
      if (isFlexibleArrayKey(key)) continue;
      if (!esKeys.has(key)) orphanInEn.push(key);
    }
    expect(orphanInEn, `Orphan keys in EN (not in ES):\n${orphanInEn.join("\n")}`).toHaveLength(0);
  });

  it("ES has all keys from FR (no orphan keys in FR)", () => {
    const orphanInFr: string[] = [];
    for (const key of frKeys) {
      if (isFlexibleArrayKey(key)) continue;
      if (!esKeys.has(key)) orphanInFr.push(key);
    }
    expect(orphanInFr, `Orphan keys in FR (not in ES):\n${orphanInFr.join("\n")}`).toHaveLength(0);
  });

  it("all three languages have the same number of non-flexible keys", () => {
    const esFixed = [...esKeys].filter((k) => !isFlexibleArrayKey(k)).length;
    const enFixed = [...enKeys].filter((k) => !isFlexibleArrayKey(k)).length;
    const frFixed = [...frKeys].filter((k) => !isFlexibleArrayKey(k)).length;
    expect(enFixed, `ES=${esFixed} vs EN=${enFixed} (excl. flexible arrays)`).toBe(esFixed);
    expect(frFixed, `ES=${esFixed} vs FR=${frFixed} (excl. flexible arrays)`).toBe(esFixed);
  });
});

// ═══════════════════════════════════════════════════════════════
// BLOQUE B: Valores no vacíos
// ═══════════════════════════════════════════════════════════════
describe("No empty values", () => {
  // Claves que legítimamente pueden ser "" (badges vacíos, etc.)
  const ALLOWED_EMPTY = new Set([
    "experiencias.items.circuito.badge",
  ]);

  for (const locale of localeNames) {
    it(`${locale.toUpperCase()} has no empty string values`, () => {
      const keys = getAllKeys(locales[locale]);
      const emptyKeys: string[] = [];

      for (const key of keys) {
        if (ALLOWED_EMPTY.has(key)) continue;
        const value = getValueByPath(locales[locale], key);
        if (typeof value === "string" && value.trim() === "") {
          emptyKeys.push(key);
        }
      }

      expect(
        emptyKeys,
        `Empty values in ${locale.toUpperCase()}:\n${emptyKeys.join("\n")}`
      ).toHaveLength(0);
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// BLOQUE C: Detección de traducciones pendientes (español residual)
// ═══════════════════════════════════════════════════════════════
describe("No untranslated values (Spanish residual detection)", () => {
  function findIdenticalToSpanish(targetLocale: "en" | "fr"): string[] {
    const target = locales[targetLocale];
    const identical: string[] = [];

    for (const key of esKeys) {
      // Skip whitelisted keys
      if (IDENTICAL_VALUE_WHITELIST.has(key)) continue;

      const esValue = getValueByPath(es, key);
      const targetValue = getValueByPath(target, key);

      // Only compare strings
      if (typeof esValue !== "string" || typeof targetValue !== "string") continue;

      // Skip technical values (URLs, numbers, placeholders)
      if (isTechnicalValue(esValue)) continue;

      // Skip if contains brand terms
      if (containsBrandTerm(esValue)) continue;

      // Skip very short values (1-2 chars) — likely icons or symbols
      if (esValue.length <= 2) continue;

      // If values are identical, it's likely untranslated
      if (esValue === targetValue) {
        identical.push(`"${key}" = "${esValue}"`);
      }
    }

    return identical;
  }

  it("EN has no values identical to ES (possible untranslated)", () => {
    const identical = findIdenticalToSpanish("en");
    expect(
      identical,
      `Possible untranslated in EN (identical to ES):\n${identical.join("\n")}`
    ).toHaveLength(0);
  });

  it("FR has no values identical to ES (possible untranslated)", () => {
    const identical = findIdenticalToSpanish("fr");
    expect(
      identical,
      `Possible untranslated in FR (identical to ES):\n${identical.join("\n")}`
    ).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// BLOQUE D: Integridad estructural
// ═══════════════════════════════════════════════════════════════
describe("Structural integrity", () => {
  it("value types match between languages (string↔string, object↔object, array↔array)", () => {
    const mismatches: string[] = [];

    for (const key of esKeys) {
      const esValue = getValueByPath(es, key);
      const enValue = getValueByPath(en, key);
      const frValue = getValueByPath(fr, key);

      const esType = getDeepType(esValue);
      const enType = getDeepType(enValue);
      const frType = getDeepType(frValue);

      if (enValue !== undefined && esType !== enType) {
        mismatches.push(`[${key}] ES=${esType} vs EN=${enType}`);
      }
      if (frValue !== undefined && esType !== frType) {
        mismatches.push(`[${key}] ES=${esType} vs FR=${frType}`);
      }
    }

    expect(
      mismatches,
      `Type mismatches:\n${mismatches.join("\n")}`
    ).toHaveLength(0);
  });

  it("arrays have the same length across all languages", () => {
    const lengthMismatches: string[] = [];

    // Arrays that can legitimately differ in length across locales
    // (e.g. SEO keywords are market-specific)
    const FLEXIBLE_LENGTH_ARRAYS = new Set([
      "metadata.keywords",
    ]);

    // Find all array-valued paths by checking parent paths
    const checkedPaths = new Set<string>();

    for (const key of esKeys) {
      // Get parent path to check if it's an array
      const parts = key.split(".");
      for (let i = 1; i <= parts.length; i++) {
        const parentPath = parts.slice(0, i).join(".");
        if (checkedPaths.has(parentPath)) continue;
        checkedPaths.add(parentPath);

        if (FLEXIBLE_LENGTH_ARRAYS.has(parentPath)) continue;

        const esVal = getValueByPath(es, parentPath);
        if (!Array.isArray(esVal)) continue;

        const enVal = getValueByPath(en, parentPath);
        const frVal = getValueByPath(fr, parentPath);

        if (Array.isArray(enVal) && esVal.length !== enVal.length) {
          lengthMismatches.push(
            `[${parentPath}] ES=${esVal.length} items vs EN=${enVal.length} items`
          );
        }
        if (Array.isArray(frVal) && esVal.length !== frVal.length) {
          lengthMismatches.push(
            `[${parentPath}] ES=${esVal.length} items vs FR=${frVal.length} items`
          );
        }
      }
    }

    expect(
      lengthMismatches,
      `Array length mismatches:\n${lengthMismatches.join("\n")}`
    ).toHaveLength(0);
  });

  it("ICU placeholders are consistent across languages", () => {
    const missingPlaceholders: string[] = [];

    for (const key of esKeys) {
      const esValue = getValueByPath(es, key);
      if (typeof esValue !== "string") continue;

      const esPlaceholders = extractICUPlaceholders(esValue);
      if (esPlaceholders.size === 0) continue;

      for (const targetLocale of ["en", "fr"] as const) {
        const targetValue = getValueByPath(locales[targetLocale], key);
        if (typeof targetValue !== "string") continue;

        const targetPlaceholders = extractICUPlaceholders(targetValue);

        for (const placeholder of esPlaceholders) {
          if (!targetPlaceholders.has(placeholder)) {
            missingPlaceholders.push(
              `[${key}] {${placeholder}} missing in ${targetLocale.toUpperCase()} (ES: "${esValue}" → ${targetLocale.toUpperCase()}: "${targetValue}")`
            );
          }
        }
      }
    }

    expect(
      missingPlaceholders,
      `Missing ICU placeholders:\n${missingPlaceholders.join("\n")}`
    ).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// BLOQUE E: Validación de namespaces críticos
// ═══════════════════════════════════════════════════════════════
describe("Critical namespaces are complete", () => {
  function getKeysUnderNamespace(obj: unknown, namespace: string): Set<string> {
    const value = getValueByPath(obj, namespace);
    if (!value || typeof value !== "object") return new Set();
    return getAllKeys(value, namespace);
  }

  const criticalNamespaces = [
    "navigation.items",
    "cookies.banner",
    "cookies.modal",
    "cookies.modal.categories",
    "hero",
    "common.cta",
    "common.labels",
    "common.aria",
  ];

  for (const ns of criticalNamespaces) {
    it(`namespace "${ns}" exists in all 3 languages with same keys`, () => {
      const esNsKeys = getKeysUnderNamespace(es, ns);
      const enNsKeys = getKeysUnderNamespace(en, ns);
      const frNsKeys = getKeysUnderNamespace(fr, ns);

      // Check ES namespace is not empty
      expect(esNsKeys.size, `Namespace "${ns}" is empty in ES`).toBeGreaterThan(0);

      // Check EN has all keys
      const missingInEn: string[] = [];
      for (const key of esNsKeys) {
        if (!enNsKeys.has(key)) missingInEn.push(key);
      }
      expect(
        missingInEn,
        `Missing in EN under "${ns}":\n${missingInEn.join("\n")}`
      ).toHaveLength(0);

      // Check FR has all keys
      const missingInFr: string[] = [];
      for (const key of esNsKeys) {
        if (!frNsKeys.has(key)) missingInFr.push(key);
      }
      expect(
        missingInFr,
        `Missing in FR under "${ns}":\n${missingInFr.join("\n")}`
      ).toHaveLength(0);
    });
  }

  it("legal sections have the same structure across languages", () => {
    const legalPages = ["avisoLegal", "privacidad", "cookies", "cancelaciones"] as const;
    const structureMismatches: string[] = [];

    for (const page of legalPages) {
      const basePath = `legal.${page}.sections`;
      const esSections = getValueByPath(es, basePath);
      const enSections = getValueByPath(en, basePath);
      const frSections = getValueByPath(fr, basePath);

      if (!esSections || typeof esSections !== "object") continue;

      const esSectionKeys = Object.keys(esSections as Record<string, unknown>).sort();

      if (enSections && typeof enSections === "object") {
        const enSectionKeys = Object.keys(enSections as Record<string, unknown>).sort();
        if (JSON.stringify(esSectionKeys) !== JSON.stringify(enSectionKeys)) {
          structureMismatches.push(
            `legal.${page}: ES sections [${esSectionKeys}] vs EN [${enSectionKeys}]`
          );
        }
      }

      if (frSections && typeof frSections === "object") {
        const frSectionKeys = Object.keys(frSections as Record<string, unknown>).sort();
        if (JSON.stringify(esSectionKeys) !== JSON.stringify(frSectionKeys)) {
          structureMismatches.push(
            `legal.${page}: ES sections [${esSectionKeys}] vs FR [${frSectionKeys}]`
          );
        }
      }
    }

    expect(
      structureMismatches,
      `Legal section structure mismatches:\n${structureMismatches.join("\n")}`
    ).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// BLOQUE F: Resumen informativo
// ═══════════════════════════════════════════════════════════════
describe("Translation summary (informational)", () => {
  it("reports total key count per language", () => {
    console.log(`\n  Translation key counts:`);
    console.log(`    ES: ${esKeys.size} keys`);
    console.log(`    EN: ${enKeys.size} keys`);
    console.log(`    FR: ${frKeys.size} keys`);
    expect(esKeys.size).toBeGreaterThan(0);
  });
});
