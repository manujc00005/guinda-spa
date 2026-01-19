/**
 * NAVEGACIÓN PRINCIPAL
 *
 * Items del menú con scroll suave a secciones
 * Incluye FAQs para conversión y consulta rápida
 */

import { NavigationData } from "../types/navigation";

export const NAVIGATION: NavigationData = {
  items: [
    { href: "#nosotros", label: "Nosotros"},
    { href: "#servicios", label: "Servicios" },
    { href: "#packs", label: "Packs" },
    { href: "#galeria", label: "Galería" },
    { href: "#opiniones", label: "Opiniones" },
    { href: "#faq", label: "FAQs" },
    { href: "#reservar", label: "Reservar" },
  ],
  cta: {
    href: "#reservar",
    label: "Reservar Spa + Masaje",
  },
};

/**
 * CTA Secundario: Consulta
 * Se usa en header desktop y mobile para acceso rápido a consultas
 */
export const CONSULTA_CTA = {
  label: "Consulta",
  href: "#faq",
};
