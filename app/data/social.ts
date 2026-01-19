import { SocialMediaData } from "../types/social";
import { COMPANY_DATA } from "./company";
import {
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
  TwitterIcon,
  YouTubeIcon,
} from "../components/icons/SocialIcons";

/**
 * REDES SOCIALES
 *
 * ⚠️ IMPORTANTE: Añade o elimina redes según tengas.
 * Si no tienes una red social, comenta o elimina la línea.
 *
 * Ahora usa iconos SVG profesionales en lugar de emojis.
 */

export const SOCIAL_MEDIA: SocialMediaData = {
  instagram: {
    name: "Instagram",
    url: "https://instagram.com/guindawellness", // ⚠️ CAMBIAR POR TU USUARIO
    icon: InstagramIcon,
    ariaLabel: "Síguenos en Instagram",
  },

  tiktok: {
    name: "TikTok",
    url: "https://tiktok.com/@guindawellness", // ⚠️ CAMBIAR POR TU USUARIO
    icon: TikTokIcon,
    ariaLabel: "Síguenos en TikTok",
  },

  // Descomenta si tienes Facebook
  // facebook: {
  //   name: "Facebook",
  //   url: "https://facebook.com/guindawellness",
  //   icon: FacebookIcon,
  //   ariaLabel: "Síguenos en Facebook",
  // },

  // Descomenta si tienes LinkedIn (para B2B)
  // linkedin: {
  //   name: "LinkedIn",
  //   url: "https://linkedin.com/company/guindawellness",
  //   icon: LinkedInIcon,
  //   ariaLabel: "Síguenos en LinkedIn",
  // },

  // Descomenta si tienes Twitter/X
  // twitter: {
  //   name: "Twitter",
  //   url: "https://twitter.com/guindawellness",
  //   icon: TwitterIcon,
  //   ariaLabel: "Síguenos en Twitter",
  // },

  // Descomenta si tienes YouTube
  // youtube: {
  //   name: "YouTube",
  //   url: "https://youtube.com/@guindawellness",
  //   icon: YouTubeIcon,
  //   ariaLabel: "Síguenos en YouTube",
  // },

  whatsapp: {
    name: "WhatsApp",
    url: `https://wa.me/${COMPANY_DATA.contact.whatsapp}`,
    icon: WhatsAppIcon,
    ariaLabel: "Contáctanos por WhatsApp",
  },
};

/**
 * WhatsApp con mensaje pre-rellenado para consultas
 */
export const WHATSAPP_CONSULTA = {
  url: `https://wa.me/${COMPANY_DATA.contact.whatsapp}?text=${encodeURIComponent(
    "Hola, me gustaría consultar sobre los servicios del spa. ¿Podrían darme más información?"
  )}`,
  label: "Escribir por WhatsApp",
  ariaLabel: "Enviar consulta por WhatsApp",
};

/**
 * LINKS LEGALES (para footer)
 */
export const LEGAL_LINKS = [
  { label: "Aviso Legal", href: "/aviso-legal" },
  { label: "Política de Privacidad", href: "/privacidad" },
  { label: "Política de Cookies", href: "/cookies" },
  { label: "Cancelaciones y Devoluciones", href: "/cancelaciones" },
];
