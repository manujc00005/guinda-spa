import { SectionHeaderData } from "../types/common";
import { Testimonio } from "../types/testimonios";

export const TESTIMONIOS_DATA = {
  header: {
    eyebrow: "Testimonios",
    titulo: "Qué dicen nuestros clientes",
  } as SectionHeaderData,
  testimonios: [
    {
      texto: "Una experiencia increíble. El masaje fue perfecto y el circuito spa impecable. Volveré sin duda.",
      autor: "María G.",
      estrellas: 5,
    },
    {
      texto:
        "El mejor spa de la ciudad. Ambiente impecable, profesionales excepcionales. Totalmente recomendable.",
      autor: "Carlos R.",
      estrellas: 5,
    },
    {
      texto: "Profesionalidad y calma en cada detalle. Regalamos el pack pareja y fue un acierto total.",
      autor: "Laura M.",
      estrellas: 5,
    },
  ] as Testimonio[],
};
