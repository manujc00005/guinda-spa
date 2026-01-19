import { COMPANY_DATA } from "../data/company";

/**
 * STRUCTURED DATA (SEO)
 *
 * ✅ Ahora usa COMPANY_DATA centralizado
 * Los datos se actualizan automáticamente cuando editas company.ts
 */

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Local Business
      {
        "@type": "BeautySalon",
        "@id": "https://spaserenity.com/#business", // ⚠️ Cambiar por tu dominio
        name: COMPANY_DATA.brandName,
        description: COMPANY_DATA.description,
        url: "https://spaserenity.com", // ⚠️ Cambiar por tu dominio
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
          latitude: "40.4168", // Cambiar por coordenadas reales
          longitude: "-3.7038",
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
        image: "https://spaserenity.com/images/og-image.jpg",
        sameAs: [
          // Añadir tus redes sociales
          // "https://www.facebook.com/spaserenity",
          // "https://www.instagram.com/spaserenity",
        ],
      },
      // Service - Spa + Masaje (Producto Estrella)
      {
        "@type": "Service",
        "@id": "https://spaserenity.com/#spa-masaje",
        serviceType: "Circuito Spa + Masaje",
        provider: {
          "@id": "https://spaserenity.com/#business",
        },
        description:
          "Circuito spa privado de 60 minutos (jacuzzi, sauna, baño turco) + masaje relajante de 30 minutos",
        offers: {
          "@type": "Offer",
          price: "105",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: "https://spaserenity.com/#spa-masaje",
        },
      },
      // Service - Circuito Spa
      {
        "@type": "Service",
        "@id": "https://spaserenity.com/#circuito-spa",
        serviceType: "Circuito Spa Privado",
        provider: {
          "@id": "https://spaserenity.com/#business",
        },
        description: "60 minutos en circuito privado: jacuzzi, sauna finlandesa y baño turco",
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
        "@id": "https://spaserenity.com/#pack-pareja",
        serviceType: "Pack Pareja Premium",
        provider: {
          "@id": "https://spaserenity.com/#business",
        },
        description: "Circuito spa privado + masajes relajantes simultáneos en sala privada para 2 personas",
        offers: {
          "@type": "Offer",
          price: "160",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
      // Aggregate Rating (cuando tengas reseñas reales)
      {
        "@type": "AggregateRating",
        "@id": "https://spaserenity.com/#rating",
        ratingValue: "5",
        reviewCount: "3",
        bestRating: "5",
        worstRating: "1",
        itemReviewed: {
          "@id": "https://spaserenity.com/#business",
        },
      },
      // Website
      {
        "@type": "WebSite",
        "@id": "https://spaserenity.com/#website",
        url: "https://spaserenity.com",
        name: "Guinda Wellnes & Spa",
        description: "Circuito spa privado y masajes premium en Madrid",
        publisher: {
          "@id": "https://spaserenity.com/#business",
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
