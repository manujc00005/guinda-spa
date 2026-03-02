import { SectionHeaderData } from "../types/common";
import { Pack } from "../types/packs";

/**
 * PACKS EXCLUSIVOS
 *
 * Posicionados como upsell y regalo.
 * Orden: ticket alto primero (ancla psicológica), luego opciones.
 */

export const PACKS_DATA = {
  header: {
    eyebrow: "Regala bienestar",
    titulo: "Packs & bonos regalo",
    descripcion:
      "El regalo que se recuerda. Experiencias completas, presentación premium y validez de 12 meses.",
  } as SectionHeaderData,
  packs: [
    {
      titulo: "Experiencia Día Completo",
      descripcion:
        "Circuito spa privado + Ritual del Mundo + Tratamiento facial + Spa manos y pies. La experiencia más completa de Guinda.",
      precio: "240€",
      detalle: "4 horas aprox.",
      ctaLabel: "Reservar experiencia",
      ctaHref: "#reservar",
      destacado: true,
    },
    {
      titulo: "Pack Pareja Premium",
      descripcion:
        "Circuito spa privado para dos + Masajes relajantes simultáneos en sala privada. Incluye cava y bombones de bienvenida.",
      precio: "160€",
      detalle: "2 personas · 90 min",
      ctaLabel: "Reservar en pareja",
      ctaHref: "#reservar",
      destacado: false,
    },
    {
      titulo: "Bono Regalo Personalizado",
      descripcion:
        "Elige el importe y nosotros creamos una experiencia única. Presentación cuidada, válido 12 meses. El detalle perfecto.",
      precio: "desde 50€",
      detalle: "Personalizable",
      ctaLabel: "Consultar",
      ctaHref: "#reservar",
      destacado: false,
    },
  ] as (Pack & { destacado?: boolean })[],
};
