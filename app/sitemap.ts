import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "../i18n/config";

/**
 * SITEMAP INTERNACIONAL
 *
 * Genera entradas para cada ruta × cada idioma, con hreflang alternates.
 * Google usa esto para indexar correctamente cada versión lingüística.
 */

const BASE_URL = "https://guindawellness.es";

// Rutas del sitio con sus equivalentes localizados
const routes: Record<string, Record<string, string>> = {
  "/": { es: "/", en: "/", fr: "/" },
  "/aviso-legal": {
    es: "/aviso-legal",
    en: "/legal-notice",
    fr: "/mentions-legales",
  },
  "/privacidad": {
    es: "/privacidad",
    en: "/privacy-policy",
    fr: "/politique-de-confidentialite",
  },
  "/cookies": { es: "/cookies", en: "/cookies", fr: "/cookies" },
  "/cancelaciones": {
    es: "/cancelaciones",
    en: "/cancellation-policy",
    fr: "/politique-dannulation",
  },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const [, localizedPaths] of Object.entries(routes)) {
    for (const locale of locales) {
      const path = localizedPaths[locale];
      const url = `${BASE_URL}/${locale}${path === "/" ? "" : path}`;

      // Build alternates for hreflang
      const languages: Record<string, string> = {};
      for (const altLocale of locales) {
        const altPath = localizedPaths[altLocale];
        languages[altLocale] = `${BASE_URL}/${altLocale}${altPath === "/" ? "" : altPath}`;
      }

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1.0 : 0.5,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
