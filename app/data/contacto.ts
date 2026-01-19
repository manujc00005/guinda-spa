/**
 * DATOS DE CONTACTO
 *
 * ⚠️ DEPRECADO: Este archivo se mantiene por compatibilidad temporal.
 * Todos los datos ahora están centralizados en data/company.ts
 *
 * Por favor, importa COMPANY_DATA en lugar de CONTACTO_DATA.
 */

import { COMPANY_DATA } from "./company";

export const CONTACTO_DATA = {
  nombre: COMPANY_DATA.brandName,
  tagline: COMPANY_DATA.description,
  telefono: COMPANY_DATA.contact.phone,
  email: COMPANY_DATA.contact.email,
  direccion: {
    calle: COMPANY_DATA.address.street,
    ciudad: `${COMPANY_DATA.address.postalCode} ${COMPANY_DATA.address.city}`,
  },
  horarios: [
    { dias: "Lunes - Viernes", horas: COMPANY_DATA.businessHours.weekdays.split(": ")[1] },
    { dias: "Sábados", horas: COMPANY_DATA.businessHours.saturday.split(": ")[1] },
    { dias: "Domingos", horas: COMPANY_DATA.businessHours.sunday.split(": ")[1] },
  ],
  copyright: `${new Date().getFullYear()} ${COMPANY_DATA.legalName}. Todos los derechos reservados.`,
};
