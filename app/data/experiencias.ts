/**
 * EXPERIENCIAS PREMIUM
 *
 * Las 3 experiencias destacadas que se muestran justo después del hero.
 *
 * ESTRATEGIA DE ORDEN:
 * Mobile (stack vertical):  Pareja → Spa+Masaje (estrella) → Circuito
 * Desktop (3 columnas):     Pareja | Spa+Masaje (centro, dominante) | Circuito
 *
 * La card "Spa + Masaje" es la experiencia estrella (más rentable).
 * Se posiciona en el CENTRO en desktop y SEGUNDA en mobile para
 * capturar la atención en la zona focal natural del viewport.
 *
 * MICROCOPY EMOCIONAL:
 * - Detalles fríos ("2 personas · 90 min") reemplazados por copy aspiracional
 * - Precios acompañados de contexto emocional (ej: "Experiencia completa · 105€")
 * - Imagen directions para briefing fotográfico
 */

export interface Experiencia {
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  precio: string;
  precioContexto: string;   // Contexto emocional que acompaña al precio
  detalle: string;           // Microcopy aspiracional (no frío)
  imagen: string;
  imagenAlt: string;
  imagenDirection: string;   // Briefing para la foto
  cta: { label: string; href: string };
  badge: string | null;
  isEstrella: boolean;       // ¿Es la card dominante?
}

export const EXPERIENCIAS_DATA = {
  header: {
    eyebrow: "Experiencias exclusivas",
    titulo: "Diseñadas para recordar",
    descripcion:
      "Elige tu momento de desconexión. Cada experiencia es en privacidad total, solo para ti o tu pareja.",
  },

  experiencias: [
    // ── Card 1: PAREJA (ticket alto, primera en mobile/izquierda en desktop)
    {
      id: "pareja",
      titulo: "Wellness en Pareja",
      subtitulo: "La experiencia más especial",
      descripcion:
        "Circuito spa privado para dos con masajes simultáneos en sala privada. Incluye bienvenida con cava y bombones artesanos.",
      precio: "160€",
      precioContexto: "Ritual privado para dos",
      detalle: "Ritual privado para dos · 90 minutos",
      imagen: "/images/couple-wellness.png",
      imagenAlt: "Pareja disfrutando de circuito spa privado con luz cálida y cava",
      imagenDirection: "Pareja en jacuzzi, luz cálida dorada, reflejos en agua, cava visible en primer plano, intimidad real, no stock",
      cta: { label: "Reservar en pareja", href: "#reservar" },
      badge: "Más solicitada",
      isEstrella: false,
    },

    // ── Card 2: SPA + MASAJE (★ ESTRELLA — centro en desktop, segunda en mobile)
    {
      id: "spa-masaje",
      titulo: "Spa + Masaje",
      subtitulo: "Nuestra experiencia estrella",
      descripcion:
        "Circuito spa privado de 60 minutos seguido de masaje relajante de 30 minutos. Desconexión total en un solo ritual.",
      precio: "105€",
      precioContexto: "Experiencia completa",
      detalle: "Experiencia completa · 90 minutos",
      imagen: "/images/spa-massage-combo.png",
      imagenAlt: "Masaje relajante profesional con aceite y jacuzzi al fondo",
      imagenDirection: "Manos profesionales con aceite brillante, jacuzzi desenfocado pero reconocible al fondo, sensación de experiencia completa, luz cálida lateral",
      cta: { label: "Reservar spa + masaje", href: "#reservar" },
      badge: "Experiencia estrella",
      isEstrella: true,
    },

    // ── Card 3: CIRCUITO SPA (diferenciador, última)
    {
      id: "circuito",
      titulo: "Circuito Spa Privado",
      subtitulo: "60 minutos de calma absoluta",
      descripcion:
        "Jacuzzi de hidromasaje, sauna finlandesa y baño turco. Todo el espacio exclusivamente para ti, sin compartir.",
      precio: "75€",
      precioContexto: "Sesión exclusiva",
      detalle: "Sesión exclusiva · 60 minutos",
      imagen: "/images/spa-private.png",
      imagenAlt: "Circuito spa privado con vapor, jacuzzi y ambiente cálido exclusivo",
      imagenDirection: "Espacio vacío con bruma de vapor, jacuzzi iluminado, ambiente cálido, sin personas (transmitir 'solo para ti'), luz tenue dorada",
      cta: { label: "Reservar circuito", href: "#reservar" },
      badge: null,
      isEstrella: false,
    },
  ] as Experiencia[],

  // Prueba social elegante — se muestra debajo de las cards
  socialProof: {
    rating: "4.9",
    ratingLabel: "en Google",
    stat: "+300",
    statLabel: "parejas atendidas",
    badge: "Spa 100% privado",
  },
};
