export interface SectionHeaderData {
  eyebrow?: string;
  titulo: string;
  descripcion?: string;
}

export interface CTAButton {
  label: string;
  href: string;
  variant?: "primary" | "outline" | "glass";
}

export interface Beneficio {
  icono: string;
  titulo: string;
  descripcion: string;
}

export interface Imagen {
  src: string;
  alt: string;
}

export interface PreguntaFAQ {
  pregunta: string;
  respuesta: string;
}
