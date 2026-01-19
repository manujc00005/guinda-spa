import { ComponentType } from "react";

export interface SocialLink {
  name: string;
  url: string;
  icon: ComponentType<{ className?: string }>; // Componente SVG de icono
  ariaLabel: string;
}

export interface SocialMediaData {
  instagram?: SocialLink;
  tiktok?: SocialLink;
  facebook?: SocialLink;
  linkedin?: SocialLink;
  twitter?: SocialLink;
  youtube?: SocialLink;
  whatsapp?: SocialLink;
}
