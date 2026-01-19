import { SectionHeaderData } from "../types/common";
import { Pack } from "../types/packs";

export const PACKS_DATA = {
  header: {
    eyebrow: "Experiencias para regalar",
    titulo: "Packs y bonos regalo",
    descripcion: "El regalo perfecto para quien más quieres",
  } as SectionHeaderData,
  packs: [
    {
      titulo: "Pack Pareja Premium",
      descripcion:
        "Circuito spa privado + Masajes relajantes simultáneos en sala privada (30 min)",
      precio: "160€",
      detalle: "2 personas",
      ctaLabel: "Reservar pack",
      ctaHref: "#reservar",
    },
    {
      titulo: "Bono Regalo Personalizado",
      descripcion: "Elige el importe y nosotros creamos una experiencia única. Válido 12 meses.",
      precio: "desde 50€",
      ctaLabel: "Consultar",
      ctaHref: "#reservar",
    },
    {
      titulo: "Experiencia Día Completo",
      descripcion: "Circuito spa + Ritual del Mundo + Tratamiento facial + Spa manos y pies",
      precio: "240€",
      detalle: "4 horas aprox.",
      ctaLabel: "Más info",
      ctaHref: "#reservar",
    },
  ] as Pack[],
};
