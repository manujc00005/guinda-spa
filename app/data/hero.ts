import { CTAButton, Imagen } from "../types/common";

export const HERO_DATA = {
  eyebrow: "Spa Privado en Hotel TRH Mijas",
  titulo: "Tu circuito spa privado\nen la Costa del Sol",
  descripcion:
    "Jacuzzi, sauna y baño turco solo para ti. Masajes terapéuticos, rituales premium y experiencias en pareja con cava & chocolate.",
  imagen: {
    src: "/images/hero/hero.png",
    alt: "Circuito spa privado con jacuzzi en Hotel TRH Mijas",
  } as Imagen,
  ctas: [
    {
      label: "Reservar Spa + Masaje",
      href: "#reservar",
      variant: "primary",
    },
    {
      label: "Experiencia en Pareja",
      href: "#experiencias",
      variant: "glass",
    },
  ] as CTAButton[],
  trust: [
    { label: "Hotel TRH Mijas", icon: "hotel" },
    { label: "4.9★ en Google", icon: "star" },
    { label: "Spa 100% privado", icon: "lock" },
  ],
};
