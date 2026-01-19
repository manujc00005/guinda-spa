// data/about.ts
export const ABOUT = {
  kicker: "Sobre nosotros",
  title: "Bienestar premium, sin prisa y con intención.",
  subtitle:
    "Creamos experiencias que combinan circuito spa privado y masaje terapéutico para que salgas mejor de lo que entraste: más ligero, más tranquilo y con la energía en su sitio.",
  paragraphs: [
    "En Guinda Wellness & Spa creemos que el lujo real es el tiempo: atención cuidada, espacios silenciosos y tratamientos bien ejecutados.",
    "Trabajamos con una filosofía clara: menos estímulo, más resultado. Rituales diseñados para reducir tensión, mejorar la circulación y ayudarte a desconectar de verdad.",
    "Si vienes por primera vez, te orientamos según tu objetivo (relajar, descargar, recuperar) para que elijas el servicio ideal sin dudas.",
  ],
  primaryCta: { label: "Reservar Spa + Masaje", href: "#reservar" },
  secondaryCta: { label: "Ver FAQs", href: "#faq" },

  card: {
    kicker: "Nuestra forma de trabajar",
    title: "Calma, técnica y detalle.",
    badge: "Atención personalizada",
  },

  highlights: [
    {
      title: "Circuito privado",
      description: "Sesiones en privacidad para que el descanso sea real, sin interrupciones.",
    },
    {
      title: "Masaje con propósito",
      description: "Técnica adaptada a tu objetivo: relax, descarga o recuperación.",
    },
    {
      title: "Rituales premium",
      description: "Experiencias completas para resetear cuerpo y mente con coherencia.",
    },
    {
      title: "Criterio profesional",
      description: "Te guiamos en la elección para que inviertas bien tu tiempo y dinero.",
    },
  ],

  signature: {
    title: "Nuestro estándar:",
    text: "ambiente impecable, manos expertas y resultados que se notan desde la primera visita.",
  },

  trust: [
    { value: "60’", label: "Circuito privado" },
    { value: "4.9★", label: "Opiniones" },
    { value: "Top", label: "Packs regalo" },
  ],
} as const;
