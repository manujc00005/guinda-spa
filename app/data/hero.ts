import { SectionHeaderData, CTAButton, Imagen } from "../types/common";

export const HERO_DATA = {
  eyebrow: "Wellness Premium",
  titulo: "Tu refugio de calma\ny bienestar",
  descripcion:
    "Desconecta del estrés diario con nuestro circuito spa privado y masajes terapéuticos",
  imagen: {
    src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&auto=format&fit=crop&q=85",
    alt: "Spa wellness",
  } as Imagen,
  ctas: [
    {
      label: "Reservar Spa + Masaje",
      href: "#spa-masaje",
      variant: "primary",
    },
    {
      label: "Ver packs",
      href: "#packs",
      variant: "glass",
    },
  ] as CTAButton[],
};
