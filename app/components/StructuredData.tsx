import { COMPANY_DATA } from "../data/company";
import { getTranslations } from "next-intl/server";

/**
 * STRUCTURED DATA (SEO) — i18n
 *
 * Genera datos estructurados JSON-LD con descripciones localizadas.
 * Los datos estructurales (precios, horarios) vienen de COMPANY_DATA.
 * Las descripciones se traducen según el locale activo.
 */

export default async function StructuredData() {
  const t = await getTranslations("structuredData");

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Local Business
      {
        "@type": "BeautySalon",
        "@id": "https://guindawellness.es/#business",
        name: COMPANY_DATA.brandName,
        description: t("businessDescription"),
        url: "https://guindawellness.es",
        telephone: COMPANY_DATA.contact.phone.replace(/\s/g, ""),
        email: COMPANY_DATA.contact.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: COMPANY_DATA.address.street,
          addressLocality: COMPANY_DATA.address.city,
          postalCode: COMPANY_DATA.address.postalCode,
          addressCountry: "ES",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "36.5955",  // Mijas, Costa del Sol
          longitude: "-4.6344",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "10:00",
            closes: "20:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "10:00",
            closes: "19:00",
          },
        ],
        priceRange: "€€€",
        image: "https://guindawellness.es/images/og-image.jpg",
        sameAs: [
          "https://instagram.com/guindawellness",
          "https://tiktok.com/@guindawellness",
        ],
      },
      // Service - Spa + Masaje (Producto Estrella)
      {
        "@type": "Service",
        "@id": "https://guindawellness.es/#spa-masaje",
        serviceType: "Private Spa Circuit + Massage",
        provider: {
          "@id": "https://guindawellness.es/#business",
        },
        description: t("businessDescription"),
        offers: {
          "@type": "Offer",
          price: "105",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: "https://guindawellness.es/#spa-masaje",
        },
      },
      // Service - Circuito Spa
      {
        "@type": "Service",
        "@id": "https://guindawellness.es/#circuito-spa",
        serviceType: "Private Spa Circuit",
        provider: {
          "@id": "https://guindawellness.es/#business",
        },
        offers: {
          "@type": "Offer",
          price: "75",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
      // Service - Pack Pareja
      {
        "@type": "Service",
        "@id": "https://guindawellness.es/#pack-pareja",
        serviceType: "Premium Couples Package",
        provider: {
          "@id": "https://guindawellness.es/#business",
        },
        offers: {
          "@type": "Offer",
          price: "160",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
      // Aggregate Rating
      {
        "@type": "AggregateRating",
        "@id": "https://guindawellness.es/#rating",
        ratingValue: "4.9",
        reviewCount: "268",
        bestRating: "5",
        worstRating: "1",
        itemReviewed: {
          "@id": "https://guindawellness.es/#business",
        },
      },
      // Website
      {
        "@type": "WebSite",
        "@id": "https://guindawellness.es/#website",
        url: "https://guindawellness.es",
        name: "Guinda Wellness & Spa",
        publisher: {
          "@id": "https://guindawellness.es/#business",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
