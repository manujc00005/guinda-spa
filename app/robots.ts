import type { MetadataRoute } from "next";

/**
 * ROBOTS.TXT
 *
 * Configuración SEO para crawlers.
 * Permite indexación completa y referencia al sitemap.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: "https://guindawellness.es/sitemap.xml",
  };
}
