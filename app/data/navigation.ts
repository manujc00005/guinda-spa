/**
 * NAVEGACIÓN PRINCIPAL — PREMIUM
 *
 * Simplificada para reducir decisión paralizante.
 * Desktop: máx 5 items (Experiencias, Servicios, Packs, Opiniones, Reservar)
 * Mobile: todos los items + CTA prominente
 */

import { NavigationData } from "../types/navigation";

export const NAVIGATION: NavigationData = {
  items: [
    { href: "#experiencias", label: "Experiencias" },
    { href: "#servicios", label: "Servicios" },
    { href: "#packs", label: "Packs" },
    { href: "#opiniones", label: "Opiniones" },
    { href: "#faq", label: "FAQs" },
    { href: "#reservar", label: "Reservar" },
  ],
  cta: {
    href: "#reservar",
    label: "Reservar ahora",
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
