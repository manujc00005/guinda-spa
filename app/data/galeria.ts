import { SectionHeaderData, Imagen } from "../types/common";

export const GALERIA_DATA = {
  header: {
    eyebrow: "Nuestro espacio",
    titulo: "Ambiente de calma",
  } as SectionHeaderData,
  imagenes: [
    {
      src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=85",
      alt: "Sala de masajes",
    },
    {
      src: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&auto=format&fit=crop&q=85",
      alt: "Jacuzzi",
    },
    {
      src: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&auto=format&fit=crop&q=85",
      alt: "Zona de relajación",
    },
    {
      src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&auto=format&fit=crop&q=85",
      alt: "Sauna",
    },
    {
      src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&auto=format&fit=crop&q=85",
      alt: "Detalles spa",
    },
  ] as Imagen[],
};
