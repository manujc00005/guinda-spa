/**
 * DIFERENCIADORES — VERSIÓN EDITORIAL PREMIUM
 *
 * Evolución de la sección "Lo que nos hace diferentes".
 *
 * DIAGNÓSTICO DEL PROBLEMA ANTERIOR:
 * - Copy racional y funcional ("Sin compartir. Sin prisas.")
 * - Estructura de 4 iconos en grid = patrón de features de SaaS
 * - Título genérico ("Lo que nos hace diferentes") usado por miles de webs
 * - No evoca sensaciones, no activa los sentidos
 * - Falta imagen que refuerce la percepción de espacio premium
 *
 * ESTRATEGIA NUEVA:
 * - Layout editorial split: imagen izquierda + copy derecho
 * - Headline emocional que activa los sentidos
 * - Cada diferenciador con título sensorial + descripción que evoca
 * - Frase de cierre que prepara psicológicamente para la reserva
 * - Imagen del espacio vacío del spa (transmite "esto te espera")
 *
 * TONO: Calma, exclusividad, intimidad, lujo discreto.
 * NO usar: "experiencia única", "porque tú lo mereces", "ven y descubre".
 */

export interface DiferenciadorItem {
  icono: string;
  titulo: string;
  descripcion: string;
}

export const DIFERENCIADORES_DATA = {
  // Header editorial
  header: {
    eyebrow: "El espacio",
    titulo: "Donde el tiempo\nes solo tuyo",
  },

  // Frase introductoria sensorial (1 línea)
  intro:
    "Un circuito spa privado dentro del Hotel TRH Mijas. Sin ruido, sin prisas, sin nadie más.",

  // Los 4 diferenciadores — copy sensorial, no funcional
  items: [
    {
      icono: "shield",
      titulo: "Privacidad absoluta",
      descripcion:
        "El circuito es exclusivamente tuyo durante toda la sesión. No hay otros clientes, no hay turnos compartidos. Solo el sonido del agua y el silencio que elegiste.",
    },
    {
      icono: "champagne",
      titulo: "Cava y bombones al llegar",
      descripcion:
        "Las experiencias en pareja comienzan con una bienvenida cuidada. Cava fría, bombones artesanos y la calma de saber que no tienes que hacer nada más.",
    },
    {
      icono: "building",
      titulo: "Dentro de un hotel boutique",
      descripcion:
        "La estructura de un hotel con la intimidad de un spa privado. Aparcamiento, recepción, vestuarios equipados. Todo resuelto antes de que llegues.",
    },
    {
      icono: "sparkles",
      titulo: "Llegas y desconectas",
      descripcion:
        "Albornoz, toallas, zapatillas. No necesitas traer nada ni pensar en nada. Desde que cruzas la puerta, lo único que tienes que hacer es dejarte cuidar.",
    },
  ] as DiferenciadorItem[],

  // Frase de cierre — prepara el CTA
  cierre:
    "Cada detalle está pensado para que tu única decisión sea cuándo venir.",

  // Imagen del espacio (transmite "esto te espera")
  imagen: {
    src: "/images/spa-interior.png",
    alt: "Interior del spa privado Guinda Wellness en Hotel TRH Mijas, con jacuzzi iluminado y ambiente cálido",
  },
};
