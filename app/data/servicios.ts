import { SectionHeaderData } from "../types/common";
import { ServicioDestacado } from "../types/servicios";

/**
 * RITUALES & EXPERIENCIAS — POSICIONAMIENTO LUXURY
 *
 * Estrategia: cada tratamiento es un ritual sensorial, no un servicio técnico.
 * Incluye micro-elementos premium (bienvenida, aromaterapia, infusión...).
 * Signature treatment como anclaje de precio alto.
 */

export interface ServicioItem {
  titulo: string;
  subtitulo?: string;
  descripcion: string;
  duracion: string;
  precio: string;
  incluye?: string[];
  esSignature?: boolean;
}

export interface CategoriaServicio {
  id: string;
  titulo: string;
  descripcion: string;
  desde: string;
  icono: string;
  servicios: ServicioItem[];
}

export const SERVICIOS_DATA = {
  header: {
    eyebrow: "La experiencia",
    titulo: "Rituales & experiencias",
    descripcion:
      "Cada ritual ha sido creado para despertar los sentidos, liberar la tensión y devolverte a un estado de calma profunda. No elegimos técnicas: diseñamos momentos.",
  } as SectionHeaderData,

  // Legacy: compatibilidad con PriceCard
  serviciosDestacados: [
    {
      titulo: "Ritual Serenidad",
      descripcion: "Un viaje de calma que disuelve la tensión con movimientos envolventes y aromaterapia personalizada",
      precio: "desde 55€",
    },
    {
      titulo: "Circuito Termal Privado",
      descripcion: "60 minutos en tu propio santuario de agua: jacuzzi, sauna finlandesa y hammam",
      precio: "85€",
    },
    {
      titulo: "Ritual Alivio Profundo",
      descripcion: "Técnica precisa y firme que libera las capas más profundas de tensión acumulada",
      precio: "desde 60€",
    },
    {
      titulo: "Ritual Kobido — Lifting Japonés",
      descripcion: "Ancestral técnica japonesa que esculpe, redefine y devuelve luminosidad al rostro",
      precio: "95€",
    },
    {
      titulo: "Ritual Pacific Spirit",
      descripcion: "Mar & calma: exfoliación con sales oceánicas, envoltura marina y masaje restaurador",
      precio: "140€",
    },
    {
      titulo: "Ritual Luminosidad",
      descripcion: "Rejuvenecimiento facial con activos de alta concentración, vitaminas y nutrición profunda",
      precio: "desde 80€",
    },
  ] as ServicioDestacado[],

  categorias: [
    {
      id: "corporales",
      titulo: "Rituales corporales",
      descripcion:
        "Manos expertas, aceites esenciales seleccionados y un espacio diseñado para desconectar. Cada ritual comienza con una consulta sensorial para adaptar la experiencia a lo que tu cuerpo necesita hoy.",
      desde: "desde 55€",
      icono: "hands",
      servicios: [
        {
          titulo: "Ritual Serenidad",
          subtitulo: "Calma envolvente",
          descripcion:
            "Un viaje de calma profunda que disuelve la tensión con movimientos lentos, envolventes y rítmicos. La presión se adapta a tu cuerpo, acompañada de aromaterapia personalizada que profundiza cada respiración.",
          duracion: "30 · 60 min",
          precio: "desde 55€",
          incluye: [
            "Consulta sensorial de bienvenida",
            "Aromaterapia personalizada",
            "Infusión wellness de cierre",
          ],
        },
        {
          titulo: "Ritual Alivio Profundo",
          subtitulo: "Liberación muscular",
          descripcion:
            "Técnica precisa y firme que trabaja las capas más profundas de tensión. Ideal para quienes cargan el peso del día a día en hombros, espalda o cervicales. Libera, restaura y devuelve la movilidad.",
          duracion: "30 · 60 min",
          precio: "desde 60€",
          incluye: [
            "Diagnóstico postural previo",
            "Aceites terapéuticos de calor",
            "Compresa caliente localizada",
          ],
        },
        {
          titulo: "Ritual Piedras Volcánicas",
          subtitulo: "Calor ancestral",
          descripcion:
            "Piedras de basalto seleccionadas que transmiten un calor profundo y constante, disolviendo nudos y tensiones mientras equilibran la energía del cuerpo. Una experiencia que conecta con la tierra.",
          duracion: "60 min",
          precio: "75€",
          incluye: [
            "Selección artesanal de piedras",
            "Aceite esencial de lavanda volcánica",
            "Ritual de cierre con piedra fría",
          ],
        },
        {
          titulo: "Ritual Aloha",
          subtitulo: "Tradición hawaiana",
          descripcion:
            "Inspirado en la tradición Lomi Lomi de Hawái: movimientos largos, fluidos y profundos que imitan el vaivén del océano. Una danza sobre el cuerpo que libera emociones y restaura el equilibrio interior.",
          duracion: "60 min",
          precio: "80€",
          incluye: [
            "Aceite de kukui hawaiano",
            "Aromaterapia tropical",
            "Música de ambiente oceánico",
          ],
        },
      ],
    },
    {
      id: "rostro",
      titulo: "Rituales de rostro",
      descripcion:
        "Protocolos faciales que van más allá de la cosmética. Cada ritual combina técnica manual experta con activos de alta concentración para revelar la mejor versión de tu piel.",
      desde: "desde 80€",
      icono: "face",
      servicios: [
        {
          titulo: "Ritual Luminosidad",
          subtitulo: "Despertar facial",
          descripcion:
            "Un protocolo de rejuvenecimiento avanzado que nutre, hidrata y redefine. Vitaminas puras y activos concentrados trabajan en sinergia para devolver firmeza, tono y una luminosidad que se nota desde dentro.",
          duracion: "60 min",
          precio: "desde 80€",
          incluye: [
            "Doble limpieza con aceite botánico",
            "Mascarilla de activos puros",
            "Masaje facial de drenaje",
          ],
        },
        {
          titulo: "Ritual Kobido",
          subtitulo: "Lifting japonés ancestral",
          descripcion:
            "Una técnica milenaria transmitida de maestro a alumno durante generaciones. Más de 47 movimientos precisos que esculpen, redefinen el óvalo y devuelven al rostro su expresión más natural y luminosa.",
          duracion: "50 min",
          precio: "95€",
          incluye: [
            "Limpieza ritual con agua de arroz",
            "47 técnicas manuales de lifting",
            "Sérum de acabado de té verde japonés",
          ],
        },
        {
          titulo: "Ritual Resplandor",
          subtitulo: "Luminosidad intensiva",
          descripcion:
            "El tratamiento más completo para pieles que necesitan un antes y un después. Vitaminas de alta concentración, colágeno activo y un protocolo de nutrición profunda que transforma la textura y el tono.",
          duracion: "60 min",
          precio: "105€",
          incluye: [
            "Peeling enzimático suave",
            "Ampollas concentradas personalizadas",
            "Mascarilla de colágeno bio-activo",
          ],
        },
      ],
    },
    {
      id: "experiencias",
      titulo: "Experiencias signature",
      descripcion:
        "Rituales completos que combinan múltiples técnicas en una experiencia inmersiva. Diseñados para quienes buscan algo más que un tratamiento: un momento que transforma.",
      desde: "desde 140€",
      icono: "ritual",
      servicios: [
        {
          titulo: "Pacific Spirit",
          subtitulo: "Mar & calma",
          descripcion:
            "Un viaje sensorial inspirado en la fuerza y la calma del océano. Comienza con una exfoliación con sales marinas y algas, continúa con una envoltura remineralizante y culmina con un masaje restaurador de larga duración.",
          duracion: "90 min",
          precio: "140€",
          incluye: [
            "Exfoliación con sales del Pacífico",
            "Envoltura de algas remineralizantes",
            "Masaje restaurador completo",
            "Infusión de algas y menta",
          ],
        },
        {
          titulo: "La Experiencia Guinda",
          subtitulo: "Nuestro ritual signature",
          descripcion:
            "Lo más exclusivo de Guinda en una sola experiencia. Un recorrido de casi tres horas que integra circuito termal privado, ritual corporal completo, tratamiento facial personalizado y cuidado de manos y pies. Incluye bienvenida con cava y bombones artesanales.",
          duracion: "2 h 45 min",
          precio: "295€",
          esSignature: true,
          incluye: [
            "Bienvenida con cava y bombones artesanales",
            "Circuito termal privado",
            "Ritual corporal completo a elegir",
            "Tratamiento facial personalizado",
            "Cuidado spa de manos y pies",
            "Bata, zapatillas y amenities premium",
            "Infusión y fruta fresca de cierre",
          ],
        },
      ],
    },
  ] as CategoriaServicio[],

  /** Microcopy de valor añadido — se muestra bajo el listado */
  valorAnadido: [
    "Todos los rituales incluyen bienvenida con infusión artesanal",
    "Productos naturales de alta cosmética seleccionados por nuestro equipo",
    "Cabina privada con ambiente personalizado: luz, temperatura y aroma",
    "Sin prisas. Cada sesión incluye tiempo de transición antes y después",
  ],

  /** CTA emocional */
  cta: {
    texto: "Reserva tu ritual",
    subtexto: "Tu momento empieza con una decisión",
    href: "#reservar",
  },
};
