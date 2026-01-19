import { SectionHeaderData, Beneficio } from "../types/common";

export const SPA_MASAJE_DATA = {
  header: {
    eyebrow: "Experiencia Estrella",
    titulo: "Spa + Masaje",
    descripcion:
      "La combinación perfecta: circuito spa privado de 60 minutos + masaje relajante de 30 minutos",
  } as SectionHeaderData,
  beneficios: [
    {
      icono: "🧘",
      titulo: "Relax total",
      descripcion: "Desconexión profunda en circuito privado",
    },
    {
      icono: "💆",
      titulo: "Masaje personalizado",
      descripcion: "Adaptado a tus necesidades",
    },
    {
      icono: "✨",
      titulo: "Total privacidad",
      descripcion: "Solo para ti o tu pareja",
    },
  ] as Beneficio[],
  precio: {
    cantidad: "105€",
    detalle: "90 minutos totales · 1 persona",
    incluye: "Incluye: Jacuzzi + Sauna + Baño turco + Masaje 30min",
  },
  cta: {
    label: "Reservar ahora",
    href: "#reservar",
    variant: "primary" as const,
  },
};
