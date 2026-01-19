import { SectionHeaderData } from "../types/common";
import { ServicioDestacado } from "../types/servicios";

export const SERVICIOS_DATA = {
  header: {
    eyebrow: "Nuestros servicios",
    titulo: "Tratamientos destacados",
    descripcion: "Selección de nuestros servicios más solicitados",
  } as SectionHeaderData,
  serviciosDestacados: [
    {
      titulo: "Masaje Relajante",
      descripcion: "Técnica suave que reduce tensión muscular y mejora la circulación",
      precio: "desde 45€",
    },
    {
      titulo: "Circuito Spa",
      descripcion: "60 minutos en circuito privado: jacuzzi, sauna y baño turco",
      precio: "75€",
    },
    {
      titulo: "Masaje Descontracturante",
      descripcion: "Presión profunda para aliviar contracturas y tensión acumulada",
      precio: "desde 50€",
    },
    {
      titulo: "Kobido Facial",
      descripcion: "Masaje facial japonés rejuvenecedor con técnicas ancestrales",
      precio: "85€",
    },
    {
      titulo: "Ritual Pacific Spirit",
      descripcion: "Exfoliación + Envoltura marina + Masaje relajante completo",
      precio: "125€",
    },
    {
      titulo: "Tratamiento Facial Premium",
      descripcion: "Rejuvenecimiento avanzado con vitaminas y nutrición profunda",
      precio: "desde 70€",
    },
  ] as ServicioDestacado[],
};
